import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import EmailList from '../components/EmailList';
import EmailViewer from '../components/EmailViewer';
import ComposeModal from '../components/ComposeModal';
import { useEmail } from '../context/EmailContext';

const MailPage = () => {
    const { folder } = useParams();
    const {
        selectedEmail,
        setSelectedEmail,
        fetchEmails,
        fetchCounts,
        composeOpen,
        toast,
    } = useEmail();

    // Fetch emails when folder changes
    useEffect(() => {
        const activeFolder = folder || 'inbox';
        fetchEmails(activeFolder);
        fetchCounts();
    }, [folder]);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Top Bar */}
            <TopBar />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Email List */}
                <EmailList />

                {/* Email Viewer */}
                {selectedEmail ? (
                    <EmailViewer />
                ) : (
                    <div className="hidden lg:flex flex-1 items-center justify-center">
                        <div className="text-center animate-fade-in">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-lighter mb-4">
                                <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-text-muted text-lg">Select an email to read</p>
                            <p className="text-text-muted text-sm mt-1 opacity-60">Click on any email from the list</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Compose Modal */}
            {composeOpen && <ComposeModal />}

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default MailPage;
