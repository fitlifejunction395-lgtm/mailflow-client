import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';

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

                {/* Body */}
                <div
                    className="prose prose-sm max-w-none text-text-primary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: email.body || email.textBody || '<p class="text-text-muted italic">No content</p>' }}
                />
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
