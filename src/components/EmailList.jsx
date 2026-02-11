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
        <div className="w-full md:w-96 lg:w-[420px] shrink-0 border-r border-border flex flex-col h-full overflow-hidden bg-surface/30">
            {/* Folder Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
                <h2 className="text-lg font-semibold text-text-primary">
                    {searchQuery ? `Search: "${searchQuery}"` : folderLabels[currentFolder] || 'Inbox'}
                </h2>
                <span className="text-xs text-text-muted">
                    {pagination.total} email{pagination.total !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="p-4 rounded-xl space-y-2">
                                <div className="skeleton h-4 w-1/3" />
                                <div className="skeleton h-3 w-2/3" />
                                <div className="skeleton h-3 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : emails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-surface-lighter flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-text-muted text-sm">No emails here yet</p>
                    </div>
                ) : (
                    <div>
                        {emails.map((email) => (
                            <EmailItem key={email._id} email={email} />
                        ))}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                                <button
                                    onClick={() => fetchEmails(currentFolder, pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="btn btn-ghost text-xs px-3 py-1.5 disabled:opacity-30"
                                >
                                    ← Prev
                                </button>
                                <span className="text-xs text-text-muted">
                                    {pagination.page} / {pagination.pages}
                                </span>
                                <button
                                    onClick={() => fetchEmails(currentFolder, pagination.page + 1)}
                                    disabled={!pagination.hasMore}
                                    className="btn btn-ghost text-xs px-3 py-1.5 disabled:opacity-30"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailList;
