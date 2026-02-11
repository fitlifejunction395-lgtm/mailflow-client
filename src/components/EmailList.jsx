import { useEmail } from '../context/EmailContext';
import EmailItem from './EmailItem';

const EmailList = () => {
    const { emails, loading, currentFolder, pagination, fetchEmails, searchQuery } = useEmail();

    return (
        <div className="w-full flex flex-col h-full overflow-hidden bg-white rounded-2xl border-none shadow-sm mr-4 mb-4">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between shrink-0 bg-white rounded-t-2xl sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 -ml-2 rounded-sm hover:bg-surface-hover cursor-pointer group relative" title="Select All">
                        <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                        </svg>
                        <svg className="w-3 h-3 text-text-secondary absolute right-0.5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
                    </div>
                    <button className="p-2 rounded-full hover:bg-surface-hover text-text-secondary transition-colors" title="Refresh" onClick={() => fetchEmails(currentFolder)}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-surface-hover text-text-secondary transition-colors" title="More">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-secondary font-medium">
                    <span>{pagination.total > 0 ? `${pagination.page}-${Math.min(pagination.page * 20, pagination.total)}` : '0-0'} of {pagination.total}</span>
                    <div className="flex items-center">
                        <button
                            onClick={() => fetchEmails(currentFolder, pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-2 rounded-full hover:bg-surface-hover disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => fetchEmails(currentFolder, pagination.page + 1)}
                            disabled={!pagination.hasMore}
                            className="p-2 rounded-full hover:bg-surface-hover disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Email List Scrollable Data */}
            <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                {loading ? (
                    <div className="p-0">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div key={i} className="flex items-center px-4 py-3 border-b border-border/50">
                                <div className="skeleton h-4 w-4 mr-4" />
                                <div className="skeleton h-4 w-48 mr-4" />
                                <div className="skeleton h-4 flex-1" />
                            </div>
                        ))}
                    </div>
                ) : emails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                        <div className="w-24 h-24 bg-surface-lighter rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
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
