import { useEmail } from '../context/EmailContext';
import EmailItem from './EmailItem';

const EmailList = () => {
    const { emails, loading, currentFolder, pagination, fetchEmails, searchQuery } = useEmail();

    const folderLabels = {
        inbox: 'Inbox',
        sent: 'Sent',
        drafts: 'Drafts',
        trash: 'Trash',
        starred: 'Starred',
    };

    return (
        <div className="w-full md:w-full lg:w-full shrink-0 flex flex-col h-full overflow-hidden bg-surface rounded-tl-2xl border border-border mr-4 shadow-sm mb-4">
            {/* Toolbar */}
            <div className="px-4 py-2 border-b border-border flex items-center justify-between shrink-0 bg-white rounded-tl-2xl">
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded hover:bg-surface-hover text-text-secondary" title="Select">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button className="p-2 rounded hover:bg-surface-hover text-text-secondary" title="Refresh" onClick={() => fetchEmails(currentFolder)}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button className="p-2 rounded hover:bg-surface-hover text-text-secondary" title="More">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>{pagination.page}-{Math.min(pagination.page * 20, pagination.total)} of {pagination.total}</span>
                    <div className="flex items-center">
                        <button
                            onClick={() => fetchEmails(currentFolder, pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-2 rounded-full hover:bg-surface-hover disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => fetchEmails(currentFolder, pagination.page + 1)}
                            disabled={!pagination.hasMore}
                            className="p-2 rounded-full hover:bg-surface-hover disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto bg-white">
                {loading ? (
                    <div className="p-0">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div key={i} className="flex items-center px-4 py-2 border-b border-border">
                                <div className="skeleton h-4 w-4 mr-4" />
                                <div className="skeleton h-4 w-48 mr-4" />
                                <div className="skeleton h-4 flex-1" />
                            </div>
                        ))}
                    </div>
                ) : emails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <p className="text-text-primary font-medium text-base mb-1">Your {currentFolder} is empty</p>
                        <p className="text-text-secondary text-sm">Emails will appear here.</p>
                    </div>
                ) : (
                    <div>
                        {emails.map((email) => (
                            <EmailItem key={email._id} email={email} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailList;
