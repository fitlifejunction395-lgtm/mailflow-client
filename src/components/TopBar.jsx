import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
    const [query, setQuery] = useState('');
    const { searchEmails, fetchEmails, currentFolder, setComposeOpen, setComposeData } = useEmail();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        <header className="h-16 shrink-0 bg-surface-light flex items-center px-4 gap-3 z-30">
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
            <div className="flex items-center gap-2 shrink-0 w-60 pl-2 cursor-pointer" onClick={() => navigate('/mail/inbox')}>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#EA4335" />
                </svg>
                <span className="text-[22px] font-medium text-text-secondary hidden sm:inline leading-none relative top-[-1px] tracking-tight">
                    MailFlow
                </span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-[720px]">
                <div className="relative group">
                    <div className="relative flex items-center bg-surface-lighter focus-within:bg-white focus-within:shadow-md rounded-lg transition-all h-[46px] border border-transparent focus-within:border-border/50">
                        <button type="submit" className="p-3 ml-1 rounded-full text-text-secondary hover:bg-surface-hover transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search in mail"
                            className="flex-1 bg-transparent border-none outline-none text-base text-text-primary placeholder:text-text-secondary px-2 h-full"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="p-3 mr-2 rounded-full text-text-secondary hover:bg-surface-hover transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button type="button" className="p-3 mr-1 rounded-full text-text-secondary hover:bg-surface-hover transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>

            <div className="flex-1"></div>

            {/* Profile & Settings (desktop) */}
            <div className="hidden md:flex items-center gap-2 pl-2">
                <button className="p-2 rounded-full hover:bg-surface-hover text-text-secondary" title="Support">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button className="p-2 rounded-full hover:bg-surface-hover text-text-secondary mr-1" title="Settings">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>

                {/* Google Account Menu */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className={`ml-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm transition-all focus:outline-none focus:ring-4 focus:ring-surface-hover ${profileOpen ? 'ring-4 ring-surface-hover' : 'hover:ring-4'}`}
                        title={`Google Account: ${user?.name}\n${user?.email}`}
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </button>

                    {/* Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-lighter rounded-3xl shadow-lg border border-border overflow-hidden z-50 animate-fade-in ring-1 ring-black/5">
                            <div className="p-4 flex flex-col items-center bg-white m-2 rounded-2xl shadow-sm border border-border/50">
                                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-medium mb-3">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-medium text-text-primary">{user?.name}</h3>
                                <p className="text-sm text-text-secondary mb-4">{user?.email}</p>
                                <button className="px-6 py-2 rounded-full border border-border text-sm font-medium text-primary hover:bg-surface-light transition-colors">
                                    Manage your Google Account
                                </button>
                            </div>

                            <div className="flex border-t border-border/50 bg-white">
                                <button
                                    onClick={logout}
                                    className="flex-1 py-4 text-sm font-medium text-text-primary hover:bg-surface-light transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign out
                                </button>
                            </div>

                            <div className="py-2 bg-surface-lighter text-center">
                                <span className="text-xs text-text-muted hover:underline cursor-pointer mx-1">Privacy Policy</span>
                                <span className="text-xs text-text-muted">•</span>
                                <span className="text-xs text-text-muted hover:underline cursor-pointer mx-1">Terms of Service</span>
                            </div>
                        </div>
                    )}
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
                    </aside>
                </div>
            )}
        </header>
    );
};

export default TopBar;
