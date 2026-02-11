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
            className={`group flex items-center gap-3 px-4 py-2 cursor-pointer border-b border-border/50 hover:shadow-sm hover:z-10 relative transition-colors ${isSelected ? 'bg-primary-light/30' :
                    isUnread ? 'bg-white font-bold' : 'bg-surface-lighter/30'
                } hover:bg-surface-hover`}
        >
            {/* Checkbox (Mock) */}
            <div className="text-text-muted group-hover:text-text-secondary" onClick={(e) => e.stopPropagation()}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                </svg>
            </div>

            {/* Star */}
            <button
                onClick={handleStarClick}
                className={`transition-colors ${email.isStarred ? 'text-accent-yellow' : 'text-text-muted hover:text-text-secondary'}`}
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={email.isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            </button>

            {/* Sender */}
            <div className={`w-40 md:w-48 truncate shrink-0 ${isUnread ? 'text-text-primary font-bold' : 'text-text-primary'}`}>
                {email.fromName || email.from}
            </div>

            {/* Subject - Snippet */}
            <div className="flex-1 min-w-0 flex items-center gap-1 text-sm text-text-secondary truncate">
                <span className={`truncate text-text-primary ${isUnread ? 'font-bold' : ''}`}>
                    {email.subject || '(no subject)'}
                </span>
                <span className="text-text-muted shrink-0">-</span>
                <span className="text-text-muted truncate">
                    {getSnippet(email.body || email.textBody)}
                </span>
            </div>

            {/* Date */}
            <div className={`text-xs ml-2 shrink-0 w-16 text-right ${isUnread ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
                {formatDate(email.sentAt || email.createdAt)}
            </div>
        </div>
    );
};

export default EmailItem;
