import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
    const [query, setQuery] = useState('');
    const { searchEmails, fetchEmails, currentFolder, setComposeOpen, setComposeData } = useEmail();
    const { user, logout, connectGmail, disconnectGmail } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            searchEmails(query.trim());
        } else {
            fetchEmails(currentFolder);
        }
    };

    const handleClearSearch = () => {
        setQuery('');
        fetchEmails(currentFolder);
    };

    return (
        <header className="h-16 shrink-0 border-b border-border bg-surface/80 backdrop-blur-lg flex items-center px-4 gap-4 z-30">
            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 rounded-lg hover:bg-surface-hover text-text-secondary"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <span className="text-lg font-bold text-text-primary hidden sm:inline bg-gradient-to-r from-primary-light to-accent-blue bg-clip-text text-transparent">
                    MailFlow
                </span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
                <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search emails..."
                        className="w-full pl-11 pr-10 py-2.5 bg-surface-light border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </form>

            {/* Mobile compose */}
            <button
                className="md:hidden p-2 rounded-lg bg-primary text-white"
                onClick={() => { setComposeData(null); setComposeOpen(true); }}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Profile (desktop) */}
            <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white font-semibold text-xs cursor-pointer" title={user?.email}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="absolute inset-0 bg-black/50" />
                    <aside className="absolute left-0 top-0 h-full w-64 bg-surface border-r border-border animate-slide-right p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold text-text-primary">MailFlow</span>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-surface-hover text-text-muted">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {['inbox', 'starred', 'sent', 'drafts', 'trash'].map((f) => (
                            <button
                                key={f}
                                onClick={() => { navigate(`/mail/${f}`); setSidebarOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${currentFolder === f ? 'bg-primary/15 text-primary-light' : 'text-text-secondary hover:bg-surface-hover'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                        <div className="border-t border-border pt-3">
                            {user?.isGmailConnected ? (
                                <div className="space-y-2 mb-3">
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
                                    className="w-full mb-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-surface-light hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border transition-all"
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
                        <hr className="border-border" />
                        <button
                            onClick={logout}
                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-surface-hover transition-colors"
                        >
                            Logout
                        </button>
                    </aside>
                </div>
            )}
        </header>
    );
};

export default TopBar;
