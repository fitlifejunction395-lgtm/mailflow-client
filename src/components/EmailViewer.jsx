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
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden animate-slide-right bg-surface/20">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-border shrink-0">
                <button
                    onClick={() => setSelectedEmail(null)}
                    className="p-2 rounded-lg hover:bg-surface-hover text-text-secondary transition-colors"
                    title="Back"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <div className="flex-1" />

                <button
                    onClick={() => toggleRead(email._id, !email.isRead)}
                    className="p-2 rounded-lg hover:bg-surface-hover text-text-secondary transition-colors"
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
                    className={`p-2 rounded-lg hover:bg-surface-hover transition-colors ${email.isStarred ? 'text-accent-yellow' : 'text-text-secondary'}`}
                    title={email.isStarred ? 'Unstar' : 'Star'}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={email.isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </button>

                {currentFolder === 'trash' ? (
                    <button
                        onClick={() => permanentDelete(email._id)}
                        className="p-2 rounded-lg hover:bg-danger/10 text-danger transition-colors"
                        title="Delete permanently"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={() => moveToTrash(email._id)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-danger transition-colors"
                        title="Move to trash"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Subject */}
                <h1 className="text-2xl font-bold text-text-primary mb-6">{email.subject}</h1>

                {/* Sender Info */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {(email.fromName || email.from).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-text-primary">
                                {email.fromName || email.from}
                            </span>
                            <span className="text-sm text-text-muted">&lt;{email.from}&gt;</span>
                        </div>
                        <div className="text-sm text-text-muted mt-0.5">
                            to {email.to?.join(', ')}
                            {email.cc?.length > 0 && <span>, cc: {email.cc.join(', ')}</span>}
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                            {formatFullDate(email.sentAt || email.createdAt)}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div
                    className="prose prose-invert max-w-none text-text-primary leading-relaxed text-sm"
                    dangerouslySetInnerHTML={{ __html: email.body || email.textBody || '<p class="text-text-muted italic">No content</p>' }}
                />
            </div>

            {/* Reply Actions */}
            <div className="border-t border-border px-6 py-4 flex items-center gap-3 shrink-0">
                <button
                    onClick={() => openReply(email)}
                    className="btn btn-ghost text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Reply
                </button>
                <button
                    onClick={() => openReplyAll(email)}
                    className="btn btn-ghost text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6M7 10h10a8 8 0 018 8v2" />
                    </svg>
                    Reply All
                </button>
                <button
                    onClick={() => openForward(email)}
                    className="btn btn-ghost text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                    Forward
                </button>
            </div>
        </div>
    );
};

export default EmailViewer;
