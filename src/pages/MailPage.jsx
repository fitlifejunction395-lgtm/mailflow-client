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
        <div className="h-screen flex flex-col overflow-hidden bg-surface-light">
            {/* Top Bar */}
            <TopBar />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 flex overflow-hidden relative">

                    {/* LIST VIEW: Visible when no email is selected */}
                    {!selectedEmail && (
                        <EmailList />
                    )}

                    {/* DETAIL VIEW: Visible when email IS selected */}
                    {selectedEmail && (
                        <EmailViewer />
                    )}

                    {/* 
                     Note: In a true split-view on large screens, we would render both:
                     <div className={`... ${selectedEmail ? 'hidden lg:flex' : 'flex'}`}> <EmailList /> </div>
                     {selectedEmail && <EmailViewer />}
                     for now, standard Gmail behavior (List OR Detail) allows best "fit to screen".
                    */}

                </main>
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
