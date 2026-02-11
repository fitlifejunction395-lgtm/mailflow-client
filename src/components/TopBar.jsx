import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
    const [query, setQuery] = useState('');
    const { searchEmails, fetchEmails, currentFolder, setComposeOpen, setComposeData } = useEmail();
    const { user, connectGmail, disconnectGmail, logout } = useAuth();
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
        <header className="h-16 shrink-0 bg-surface-light flex items-center px-4 gap-4 z-30">
            {/* Mobile menu button */}
            <button
                className="md:hidden p-3 rounded-full hover:bg-surface-hover text-text-secondary"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0 w-60 pl-2">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span className="text-[22px] font-normal text-text-primary hidden sm:inline leading-none relative top-[-1px]">
                    MailFlow
                </span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-[720px]">
                <div className="relative group">
                    <div className={`absolute inset-0 bg-surface-lighter rounded-full transition-shadow ${query || 'group-focus-within:shadow-md group-focus-within:bg-white'}`} />
                    <div className="relative flex items-center bg-surface-lighter hover:bg-white hover:shadow-sm focus-within:bg-white focus-within:shadow-md rounded-full transition-all h-[48px]">
                        <button type="button" className="p-3 ml-1 rounded-full text-text-secondary hover:bg-surface-hover transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search mail"
                            className="flex-1 bg-transparent border-none outline-none text-base text-text-primary placeholder:text-text-secondary px-2 h-full"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="p-3 mr-2 rounded-full text-text-secondary hover:bg-surface-hover transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button type="button" className="p-3 mr-1 rounded-full text-text-secondary hover:bg-surface-hover transition-colors">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>

            <div className="flex-1"></div>

            {/* Profile (desktop) */}
            <div className="hidden md:flex items-center gap-2 pl-4">
                <button className="p-2 rounded-full hover:bg-surface-hover text-text-secondary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-surface-hover text-text-secondary mr-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:ring-4 ring-surface-hover transition-all" title={user?.email}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="absolute inset-0 bg-black/50" />
                    <aside className="absolute left-0 top-0 h-full w-72 bg-surface text-text-primary px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xl font-normal text-text-primary">MailFlow</span>
                            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full hover:bg-surface-hover">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {['inbox', 'starred', 'sent', 'drafts', 'trash'].map((f) => (
                            <button
                                key={f}
                                onClick={() => { navigate(`/mail/${f}`); setSidebarOpen(false); }}
                                className={`w-full text-left px-6 py-3 rounded-r-full text-sm font-medium capitalize mb-1 ${currentFolder === f ? 'bg-primary-light text-primary-dark font-bold' : 'text-text-primary hover:bg-surface-hover'}`}
                            >
                                {f}
                            </button>
                        ))}
                        <div className="border-t border-border mt-4 pt-4">
                            <button
                                onClick={logout}
                                className="w-full text-left px-6 py-3 rounded-r-full text-sm font-medium text-text-primary hover:bg-surface-hover"
                            >
                                Logout
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </header>
    );
};

export default TopBar;
