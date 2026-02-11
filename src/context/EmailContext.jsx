import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const EmailContext = createContext(null);

export const useEmail = () => {
    const context = useContext(EmailContext);
    if (!context) throw new Error('useEmail must be used within EmailProvider');
    return context;
};

export const EmailProvider = ({ children }) => {
    const { user } = useAuth();
    const isGmail = user?.isGmailConnected;

    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [currentFolder, setCurrentFolder] = useState('inbox');
    const [counts, setCounts] = useState({ inbox: 0, unread: 0, sent: 0, drafts: 0, trash: 0, starred: 0 });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, hasMore: false });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [composeOpen, setComposeOpen] = useState(false);
    const [composeData, setComposeData] = useState(null); // for reply/forward prefill
    const [toast, setToast] = useState(null);
    const [gmailPageToken, setGmailPageToken] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Fetch emails — uses Gmail API if connected, otherwise local DB
    const fetchEmails = useCallback(async (folder = 'inbox', page = 1) => {
        setLoading(true);
        setSearchQuery('');
        try {
            if (isGmail) {
                // Gmail API fetch
                const params = { folder, maxResults: 20 };
                if (page > 1 && gmailPageToken) {
                    params.pageToken = gmailPageToken;
                }
                const { data } = await api.get('/gmail/messages', { params });
                setEmails(data.data.emails);
                setGmailPageToken(data.data.nextPageToken);
                setPagination({
                    page,
                    pages: data.data.nextPageToken ? page + 1 : page,
                    total: data.data.emails.length,
                    hasMore: !!data.data.nextPageToken,
                });
            } else {
                // Local DB fetch
                const { data } = await api.get(`/emails/folder/${folder}`, {
                    params: { page, limit: 20 },
                });
                setEmails(data.data.emails);
                setPagination(data.data.pagination);
            }
            setCurrentFolder(folder);
        } catch (err) {
            console.error('Failed to fetch emails:', err);
            showToast('Failed to load emails', 'error');
        } finally {
            setLoading(false);
        }
    }, [isGmail, gmailPageToken, showToast]);

    // Fetch folder counts
    const fetchCounts = useCallback(async () => {
        try {
            if (!isGmail) {
                const { data } = await api.get('/emails/counts');
                setCounts(data.data);
            }
            // Gmail doesn't have a quick count endpoint, so we skip for now
        } catch (err) {
            console.error('Failed to fetch counts:', err);
        }
    }, [isGmail]);

    // Get single email — Gmail emails are already fully fetched
    const getEmail = useCallback(async (id) => {
        try {
            if (isGmail) {
                // For Gmail, the email is already in the list with full details
                const email = emails.find(e => e.gmailId === id);
                if (email) {
                    setSelectedEmail(email);
                    return email;
                }
            }
            const { data } = await api.get(`/emails/${id}`);
            setSelectedEmail(data.data.email);
            // Update read status in the list
            setEmails(prev => prev.map(e => e._id === id ? { ...e, isRead: true } : e));
            return data.data.email;
        } catch (err) {
            showToast('Failed to load email', 'error');
        }
    }, [isGmail, emails, showToast]);

    // Send email — uses Gmail API if connected
    const sendEmail = useCallback(async (emailData) => {
        try {
            if (isGmail) {
                await api.post('/gmail/send', emailData);
            } else {
                await api.post('/emails/send', emailData);
            }
            showToast('Email sent!');
            fetchCounts();
            if (currentFolder === 'sent') fetchEmails('sent');
            return true;
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to send email', 'error');
            return false;
        }
    }, [isGmail, currentFolder, fetchCounts, fetchEmails, showToast]);

    // Save draft
    const saveDraft = useCallback(async (draftData) => {
        try {
            await api.post('/emails/draft', draftData);
            showToast('Draft saved');
            fetchCounts();
            if (currentFolder === 'drafts') fetchEmails('drafts');
            return true;
        } catch (err) {
            showToast('Failed to save draft', 'error');
            return false;
        }
    }, [currentFolder, fetchCounts, fetchEmails, showToast]);

    // Toggle read
    const toggleRead = useCallback(async (id, isRead) => {
        try {
            if (!isGmail) {
                await api.put(`/emails/${id}/read`, { isRead });
            }
            setEmails(prev => prev.map(e => (e._id === id || e.gmailId === id) ? { ...e, isRead } : e));
            if (selectedEmail && (selectedEmail._id === id || selectedEmail.gmailId === id)) {
                setSelectedEmail(prev => ({ ...prev, isRead }));
            }
            fetchCounts();
        } catch (err) {
            showToast('Failed to update', 'error');
        }
    }, [isGmail, selectedEmail, fetchCounts, showToast]);

    // Toggle star
    const toggleStar = useCallback(async (id) => {
        try {
            if (!isGmail) {
                const { data } = await api.put(`/emails/${id}/star`);
                const newStarred = data.data.email.isStarred;
                setEmails(prev => prev.map(e => e._id === id ? { ...e, isStarred: newStarred } : e));
                if (selectedEmail?._id === id) {
                    setSelectedEmail(prev => ({ ...prev, isStarred: newStarred }));
                }
            } else {
                // For Gmail, optimistic toggle
                const email = emails.find(e => e.gmailId === id);
                const newStarred = !email?.isStarred;
                setEmails(prev => prev.map(e => e.gmailId === id ? { ...e, isStarred: newStarred } : e));
                if (selectedEmail?.gmailId === id) {
                    setSelectedEmail(prev => ({ ...prev, isStarred: newStarred }));
                }
            }
            fetchCounts();
        } catch (err) {
            showToast('Failed to update', 'error');
        }
    }, [isGmail, emails, selectedEmail, fetchCounts, showToast]);

    // Move to trash
    const moveToTrash = useCallback(async (id) => {
        try {
            if (!isGmail) {
                await api.put(`/emails/${id}/trash`);
            }
            setEmails(prev => prev.filter(e => e._id !== id && e.gmailId !== id));
            if (selectedEmail && (selectedEmail._id === id || selectedEmail.gmailId === id)) {
                setSelectedEmail(null);
            }
            showToast('Moved to trash');
            fetchCounts();
        } catch (err) {
            showToast('Failed to delete', 'error');
        }
    }, [isGmail, selectedEmail, fetchCounts, showToast]);

    // Permanent delete
    const permanentDelete = useCallback(async (id) => {
        try {
            if (!isGmail) {
                await api.delete(`/emails/${id}`);
            }
            setEmails(prev => prev.filter(e => e._id !== id && e.gmailId !== id));
            if (selectedEmail && (selectedEmail._id === id || selectedEmail.gmailId === id)) {
                setSelectedEmail(null);
            }
            showToast('Permanently deleted');
            fetchCounts();
        } catch (err) {
            showToast('Failed to delete', 'error');
        }
    }, [isGmail, selectedEmail, fetchCounts, showToast]);

    // Reply
    const replyToEmail = useCallback(async (id, body, replyAll = false) => {
        try {
            if (isGmail) {
                // For Gmail, use Gmail send with inReplyTo/threadId
                const email = selectedEmail;
                await api.post('/gmail/send', {
                    to: [email.from],
                    subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
                    body,
                    inReplyTo: email.messageIdHeader,
                    threadId: email.threadId,
                });
            } else {
                await api.post(`/emails/${id}/reply`, { body, replyAll });
            }
            showToast('Reply sent!');
            fetchCounts();
            return true;
        } catch (err) {
            showToast('Failed to send reply', 'error');
            return false;
        }
    }, [isGmail, selectedEmail, fetchCounts, showToast]);

    // Forward
    const forwardEmail = useCallback(async (id, to, body) => {
        try {
            if (isGmail) {
                await api.post('/gmail/send', { to, subject: `Fwd: ${selectedEmail?.subject}`, body });
            } else {
                await api.post(`/emails/${id}/forward`, { to, body });
            }
            showToast('Email forwarded!');
            fetchCounts();
            return true;
        } catch (err) {
            showToast('Failed to forward', 'error');
            return false;
        }
    }, [isGmail, selectedEmail, fetchCounts, showToast]);

    // Search — uses Gmail query if connected
    const searchEmails = useCallback(async (q, filter = '', page = 1) => {
        setLoading(true);
        try {
            if (isGmail) {
                const { data } = await api.get('/gmail/messages', {
                    params: { q, maxResults: 20 },
                });
                setEmails(data.data.emails);
                setGmailPageToken(data.data.nextPageToken);
                setPagination({
                    page: 1,
                    pages: data.data.nextPageToken ? 2 : 1,
                    total: data.data.emails.length,
                    hasMore: !!data.data.nextPageToken,
                });
            } else {
                const { data } = await api.get('/emails/search', {
                    params: { q, filter, page, limit: 20 },
                });
                setEmails(data.data.emails);
                setPagination(data.data.pagination);
            }
            setSearchQuery(q);
            setSearchFilter(filter);
        } catch (err) {
            showToast('Search failed', 'error');
        } finally {
            setLoading(false);
        }
    }, [isGmail, showToast]);

    // Open compose for reply/forward
    const openReply = useCallback((email) => {
        setComposeData({
            mode: 'reply',
            to: [email.from],
            subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
            inReplyTo: email._id || email.gmailId,
            threadId: email.threadId,
            originalBody: email.body,
            originalFrom: email.fromName || email.from,
            originalDate: email.sentAt,
        });
        setComposeOpen(true);
    }, []);

    const openReplyAll = useCallback((email) => {
        setComposeData({
            mode: 'replyAll',
            emailId: email._id || email.gmailId,
            to: [email.from],
            subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
            inReplyTo: email._id || email.gmailId,
            threadId: email.threadId,
            originalBody: email.body,
            originalFrom: email.fromName || email.from,
            originalDate: email.sentAt,
        });
        setComposeOpen(true);
    }, []);

    const openForward = useCallback((email) => {
        setComposeData({
            mode: 'forward',
            emailId: email._id || email.gmailId,
            to: [],
            subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
            body: email.body,
            originalFrom: email.fromName || email.from,
            originalDate: email.sentAt,
            originalTo: email.to,
        });
        setComposeOpen(true);
    }, []);

    return (
        <EmailContext.Provider
            value={{
                emails, selectedEmail, currentFolder, counts, pagination, loading,
                searchQuery, searchFilter, composeOpen, composeData, toast,
                setSelectedEmail, setCurrentFolder, setComposeOpen, setComposeData,
                fetchEmails, fetchCounts, getEmail, sendEmail, saveDraft,
                toggleRead, toggleStar, moveToTrash, permanentDelete,
                replyToEmail, forwardEmail, searchEmails,
                openReply, openReplyAll, openForward, showToast,
            }}
        >
            {children}
        </EmailContext.Provider>
    );
};
