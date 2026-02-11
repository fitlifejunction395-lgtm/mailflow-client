import { useEmail } from '../context/EmailContext';

const EmailItem = ({ email }) => {
    const { selectedEmail, getEmail, toggleStar } = useEmail();

    const isSelected = selectedEmail?._id === email._id || selectedEmail?.gmailId === email.gmailId;
    const isUnread = !email.isRead;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (daysDiff < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }

        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getSnippet = (body) => {
        if (!body) return '';
        const text = body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        return text.length > 80 ? text.slice(0, 80) + '...' : text;
    };

    const handleClick = () => {
        getEmail(email._id || email.gmailId);
    };

    const handleStarClick = (e) => {
        e.stopPropagation();
        toggleStar(email._id || email.gmailId);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer border-b border-border/50 transition-all duration-150 group ${isSelected
                ? 'bg-primary/10 border-l-2 border-l-primary'
                : isUnread
                    ? 'bg-surface-light/50 hover:bg-surface-hover'
                    : 'hover:bg-surface-hover/50'
                }`}
        >
            {/* Star */}
            <button
                onClick={handleStarClick}
                className={`mt-1 shrink-0 transition-colors ${email.isStarred ? 'text-accent-yellow' : 'text-text-muted hover:text-accent-yellow'
                    }`}
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill={email.isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={`text-sm truncate ${isUnread ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                        {email.fromName || email.from}
                    </span>
                    <span className="text-xs text-text-muted shrink-0">
                        {formatDate(email.sentAt || email.createdAt)}
                    </span>
                </div>
                <p className={`text-sm truncate ${isUnread ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
                    {email.subject}
                </p>
                <p className="text-xs text-text-muted truncate mt-0.5">
                    {getSnippet(email.body || email.textBody)}
                </p>
            </div>

            {/* Unread dot */}
            {isUnread && (
                <div className="w-2 h-2 rounded-full bg-accent-blue mt-2 shrink-0" />
            )}
        </div>
    );
};

export default EmailItem;
