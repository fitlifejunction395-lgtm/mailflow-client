import { useNavigate, useParams } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';

const folders = [
    { id: 'inbox', label: 'Inbox', icon: 'M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z' },
    { id: 'starred', label: 'Starred', icon: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' },
    { id: 'sent', label: 'Sent', icon: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' },
    { id: 'drafts', label: 'Drafts', icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
    { id: 'trash', label: 'Trash', icon: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const { folder: activeFolder } = useParams();
    const current = activeFolder || 'inbox';
    const { counts, setSelectedEmail, setComposeOpen, setComposeData } = useEmail();
    const { user, connectGmail, disconnectGmail, logout } = useAuth();

    const handleCompose = () => {
        setComposeData(null);
        setComposeOpen(true);
    };

    const handleFolderClick = (folderId) => {
        setSelectedEmail(null);
        navigate(`/mail/${folderId}`);
    };

    const getCount = (folderId) => {
        if (folderId === 'inbox') return counts.unread;
        return counts[folderId] || 0;
    };

    return (
        <aside className="shrink-0 flex flex-col h-full bg-surface-light hidden md:flex pr-2 w-[256px] lg:w-[280px]">
            {/* Compose Button */}
            <div className="pl-4 pr-4 pt-4 pb-0">
                <button
                    onClick={handleCompose}
                    className="flex items-center gap-3 px-6 h-14 bg-primary-light hover:shadow-md transition-shadow rounded-2xl text-on-primary-container min-w-[140px]"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                    </svg>
                    <span className="text-sm font-medium">Compose</span>
                </button>
            </div>

            {/* Folders */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto pl-0 mt-4">
                {folders.map((f) => {
                    const isActive = current === f.id;
                    const count = getCount(f.id);
                    return (
                        <div key={f.id} className="pr-4">
                            <button
                                onClick={() => handleFolderClick(f.id)}
                                className={`w-full flex items-center gap-4 px-6 h-8 rounded-r-full text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary-light/50 text-blue-800 font-bold'
                                        : 'text-text-primary hover:bg-surface-hover'
                                    }`}
                            >
                                <svg
                                    className={`w-5 h-5 shrink-0 ${isActive ? 'fill-current' : 'fill-none stroke-current stroke-2'}`}
                                    viewBox="0 0 24 24"
                                    fill={isActive ? "currentColor" : "none"}
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                                </svg>
                                <span className="flex-1 text-left">{f.label}</span>
                                {count > 0 && (
                                    <span className={`text-xs font-bold ${isActive ? 'text-blue-800' : 'text-text-secondary'
                                        }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        </div>
                    );
                })}
            </nav>

            {/* Gmail Connection Indicator */}
            <div className="mt-auto px-4 pb-6">
                {user?.isGmailConnected ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-border shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-text-primary">Gmail Connected</p>
                            <p className="text-[10px] text-text-muted truncate">{user.googleEmail}</p>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={connectGmail}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border bg-white hover:bg-surface-hover transition-colors text-xs font-medium text-text-primary shadow-sm"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 24c3.27 0 5.96-1.35 7.94-3.55l-3.9-3.05c-1.1.75-2.5 1.2-4.04 1.2-3.1 0-5.73-2.1-6.66-4.9H1.2v3.1C3.15 20.65 7.25 24 12 24z" />
                            <path fill="#FBBC05" d="M5.34 13.7c-.25-.75-.4-1.55-.4-2.4 0-.85.15-1.65.4-2.4V5.8H1.2C.45 7.3 0 9.05 0 11.3c0 2.25.45 4 1.2 5.5l4.14-3.1z" />
                            <path fill="#4A90D9" d="M12 4.8c1.7 0 3.2.6 4.4 1.75l3.3-3.3C17.95 1.25 15.25 0 12 0 7.25 0 3.15 3.35 1.2 5.8l4.14 3.1c.93-2.8 3.56-4.9 6.66-4.9z" />
                            <path fill="#34A853" d="M24 12c0-.85-.1-1.65-.25-2.4H12v4.55h6.75c-.3 1.55-1.15 2.9-2.45 3.8l3.9 3.05C22.5 18.85 24 15.75 24 12z" />
                        </svg>
                        Connect Gmail
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
