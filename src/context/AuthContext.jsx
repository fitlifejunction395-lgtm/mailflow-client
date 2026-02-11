import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.data.user);
        } catch {
            localStorage.removeItem('accessToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.data.accessToken);
        setUser(data.data.user);
        return data;
    };

    const signup = async (name, email, password) => {
        const { data } = await api.post('/auth/signup', { name, email, password });
        localStorage.setItem('accessToken', data.data.accessToken);
        setUser(data.data.user);
        return data;
    };

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // ignore errors on logout
        }
        localStorage.removeItem('accessToken');
        setUser(null);
    }, []);

    // Gmail OAuth connection
    const connectGmail = useCallback(async () => {
        try {
            const { data } = await api.get('/auth/google');
            // Redirect to Google OAuth page
            window.location.href = data.url;
        } catch (err) {
            console.error('Failed to start Gmail connection:', err);
        }
    }, []);

    const disconnectGmail = useCallback(async () => {
        try {
            await api.post('/auth/google/disconnect');
            setUser((prev) => ({
                ...prev,
                isGmailConnected: false,
                googleEmail: null,
            }));
        } catch (err) {
            console.error('Failed to disconnect Gmail:', err);
        }
    }, []);

    // Check URL params for Gmail connection result
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('gmail') === 'connected') {
            // Refresh user data to get updated Gmail status
            fetchUser();
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }
        if (params.get('error')) {
            console.error('OAuth error:', params.get('error'));
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                connectGmail,
                disconnectGmail,
                refreshUser: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
