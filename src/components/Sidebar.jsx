import { useNavigate, useParams } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';

const folders = [
    { id: 'inbox', label: 'Inbox', icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
    { id: 'starred', label: 'Starred', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { id: 'sent', label: 'Sent', icon: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' },
    { id: 'drafts', label: 'Drafts', icon: 'M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z' },
    { id: 'trash', label: 'Trash', icon: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const { folder: activeFolder } = useParams();
    const current = activeFolder || 'inbox';
    const { counts, setSelectedEmail, setComposeOpen, setComposeData } = useEmail();
    const { user, logout, connectGmail, disconnectGmail } = useAuth();

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
        <aside className="w-64 shrink-0 border-r border-border flex flex-col h-full bg-surface/50 hidden md:flex">
            {/* Compose Button */}
            <div className="p-4">
                <button
                    onClick={handleCompose}
                    className="btn btn-primary w-full py-3 rounded-2xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Compose
                </button>
            </div>

            {/* Folders */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {folders.map((f) => {
                    const isActive = current === f.id;
                    const count = getCount(f.id);
                    return (
                        <button
                            key={f.id}
                            onClick={() => handleFolderClick(f.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-primary/15 text-primary-light'
                                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                                }`}
                        >
                            <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-light' : 'text-text-muted group-hover:text-text-secondary'}`} viewBox="0 0 24 24" fill="currentColor">
                                <path d={f.icon} />
                            </svg>
                            <span className="flex-1 text-left">{f.label}</span>
                            {count > 0 && (
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-primary/20 text-primary-light' : 'bg-surface-lighter text-text-muted'
                                    }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Gmail Connection */}
            <div className="px-3 py-2 border-t border-border">
                {user?.isGmailConnected ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-green-400">Gmail Connected</p>
                                <p className="text-xs text-text-muted truncate">{user.googleEmail}</p>
                            </div>
                        </div>
                        <button
                            onClick={disconnectGmail}
                            className="w-full text-xs text-text-muted hover:text-danger px-3 py-1 transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={connectGmail}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-surface-light hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border transition-all"
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                            <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                        </svg>
                        Connect Gmail
                    </button>
                )}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-danger transition-colors"
                        title="Logout"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
