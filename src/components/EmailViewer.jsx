import { useState, useEffect } from 'react';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EmailViewer = () => {
    const {
        selectedEmail: email,
        setSelectedEmail,
        toggleRead,
        toggleStar,
        moveToTrash,
        permanentDelete,
        openReply,
        openReplyAll,
        openForward,
        currentFolder,
    } = useEmail();
    const { user } = useAuth();

    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [smartReplies, setSmartReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);

    // Reset AI state when email changes
    useEffect(() => {
        setSummary(null);
        setSmartReplies([]);
        setLoadingReplies(false);
    }, [email?._id]);

    const handleSummarize = async () => {
        if (summary) return; // Already summarized
        setLoadingSummary(true);
        try {
            const { data } = await api.post('/ai/summarize', {
                content: email.body || email.textBody
            });
            if (data.success) {
                setSummary(data.data);
            }
        } catch (error) {
            console.error('Failed to summarize:', error);
        } finally {
            setLoadingSummary(false);
        }
    };

    const handleGenerateReplies = async () => {
        if (smartReplies.length > 0) return;
        setLoadingReplies(true);
        try {
            const { data } = await api.post('/ai/reply', {
                content: email.body || email.textBody
            });
            if (data.success) {
                setSmartReplies(data.data);
            }
        } catch (error) {
            console.error('Failed to generate replies:', error);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleUseSmartReply = (reply) => {
        openReply(email, reply);
    };

    if (!email) return null;

    const formatFullDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString([], {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in bg-white rounded-2xl border border-transparent shadow-sm mr-4 mb-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 shrink-0 bg-white rounded-t-2xl">
                <button
                    onClick={() => setSelectedEmail(null)}
                    className="p-2 rounded-full hover:bg-surface-hover text-text-secondary transition-colors"
                    title="Back to list"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <div className="w-[1px] h-6 bg-border mx-2" />

                <button
                    onClick={() => toggleRead(email._id, !email.isRead)}
                    className="p-2 rounded-full hover:bg-surface-hover text-text-secondary transition-colors"
                    title={email.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {email.isRead ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19V8l7.89 4.26a2 2 0 002.22 0L21 8v11M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        )}
                    </svg>
                </button>

                <button
                    onClick={() => toggleStar(email._id)}
                    className={`p-2 rounded-full hover:bg-surface-hover transition-colors ${email.isStarred ? 'text-accent-yellow' : 'text-text-secondary'}`}
                    title={email.isStarred ? 'Unstar' : 'Star'}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={email.isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </button>

                {/* AI Summarize Button */}
                <button
                    onClick={handleSummarize}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-primary text-sm font-medium transition-colors ml-2"
                    title="Summarize with AI"
                >
                    {loadingSummary ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )}
                    <span>Summarize</span>
                </button>

                <div className="flex-1" />

                {/* Date */}
                <span className="text-xs text-text-muted mr-4 hidden sm:inline">
                    {formatFullDate(email.sentAt || email.createdAt)}
                </span>

                {currentFolder === 'trash' ? (
                    <button
                        onClick={() => permanentDelete(email._id)}
                        className="p-2 rounded-full hover:bg-surface-hover text-text-secondary hover:text-danger transition-colors"
                        title="Delete permanently"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={() => moveToTrash(email._id)}
                        className="p-2 rounded-full hover:bg-surface-hover text-text-secondary hover:text-danger transition-colors"
                        title="Move to trash"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* Subject */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <h1 className="text-[22px] leading-tight font-normal text-text-primary">{email.subject}</h1>
                    <div className="shrink-0 flex gap-2">
                        <div className="bg-surface-lighter text-xs px-2 py-1 rounded text-text-secondary">Inbox</div>
                    </div>
                </div>

                {/* Sender Info */}
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium text-lg shrink-0 select-none">
                        {(email.fromName || email.from).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                            <span className="font-bold text-text-primary text-sm">
                                {email.fromName || email.from}
                            </span>
                            <span className="text-xs text-text-muted">&lt;{email.from}&gt;</span>
                        </div>
                        <div className="text-xs text-text-secondary mt-0.5">
                            to {user?.email && user.email === email.to?.[0] ? 'me' : email.to?.join(', ') || 'me'}
                        </div>
                    </div>
                </div>

                {/* AI Summary Card */}
                {summary && (
                    <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100 animate-slide-down">
                        <div className="flex items-center gap-2 mb-2 text-primary font-medium text-sm">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            AI Summary
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {summary}
                        </p>
                    </div>
                )}

                {/* Body */}
                <div
                    className="prose prose-sm max-w-none text-text-primary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: email.body || email.textBody || '<p class="text-text-muted italic">No content</p>' }}
                />

                {/* Smart Replies */}
                <div className="mt-8">
                    {!loadingReplies && smartReplies.length === 0 && (
                        <button
                            onClick={handleGenerateReplies}
                            className="text-xs font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Generate AI Replies
                        </button>
                    )}

                    {loadingReplies && (
                        <div className="flex gap-2">
                            <div className="h-8 w-24 bg-gray-100 rounded-full animate-pulse" />
                            <div className="h-8 w-32 bg-gray-100 rounded-full animate-pulse" />
                            <div className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                    )}

                    {smartReplies.length > 0 && (
                        <div className="flex flex-wrap gap-2 animate-fade-in">
                            {smartReplies.map((reply, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleUseSmartReply(reply)}
                                    className="px-4 py-1.5 rounded-full border border-border bg-white hover:bg-surface-hover hover:border-primary/30 text-sm text-text-secondary hover:text-primary transition-all shadow-sm"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-border/50 flex gap-2">
                <button
                    onClick={() => openReply(email)}
                    className="btn btn-ghost border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover px-6"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    Reply
                </button>
                <button
                    onClick={() => openForward(email)}
                    className="btn btn-ghost border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover px-6"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
                    Forward
                </button>
            </div>
        </div>
    );
};

export default EmailViewer;
