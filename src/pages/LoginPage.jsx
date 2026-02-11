import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/mail/inbox');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface-light">
            <div className="w-full max-w-[450px] animate-fade-in bg-white rounded-2xl border border-border p-8 md:p-10 shadow-sm">

                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-normal text-text-primary mb-2">Sign in</h1>
                    <p className="text-text-secondary text-base">to continue to MailFlow</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full px-3 py-3 rounded border border-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-transparent"
                                placeholder="Email"
                                required
                                autoFocus
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-2 top-0 -translate-y-1/2 bg-white px-1 text-xs text-primary transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-muted peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary cursor-text"
                            >
                                Email or phone
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full px-3 py-3 rounded border border-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-transparent"
                                placeholder="Password"
                                required
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-2 top-0 -translate-y-1/2 bg-white px-1 text-xs text-primary transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-muted peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary cursor-text"
                            >
                                Enter your password
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link to="/forgot-password" className="text-primary font-medium hover:text-primary-dark">
                            Forgot email?
                        </Link>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Link to="/signup" className="btn btn-ghost text-primary font-medium mr-4">
                            Create account
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary rounded px-6 py-2 h-10 min-w-[80px]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Next'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="fixed bottom-4 flex justify-between w-full max-w-[450px] text-xs text-text-muted px-4">
                <div className="space-x-4">
                    <a href="#" className="hover:text-text-primary">English (United States)</a>
                </div>
                <div className="space-x-4">
                    <a href="#" className="hover:text-text-primary">Help</a>
                    <a href="#" className="hover:text-text-primary">Privacy</a>
                    <a href="#" className="hover:text-text-primary">Terms</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
