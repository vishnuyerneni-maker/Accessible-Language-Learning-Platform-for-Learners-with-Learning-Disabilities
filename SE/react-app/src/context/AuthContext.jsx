import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData && userData.token) {
                    setUser(userData);
                } else {
                    localStorage.removeItem('user'); // Clear invalid data
                }
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Auto-logout functionality
    useEffect(() => {
        let inactivityTimer;

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            if (user) {
                // 30 minutes of inactivity
                inactivityTimer = setTimeout(() => {
                    logout();
                    window.location.href = '/'; 
                }, 30 * 60 * 1000); 
            }
        };

        if (user) {
            resetTimer();
            window.addEventListener('mousemove', resetTimer);
            window.addEventListener('keydown', resetTimer);
            window.addEventListener('click', resetTimer);
            window.addEventListener('scroll', resetTimer);
        }

        return () => {
            clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [user]);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login(username, password);
            if (response.data.success && response.data.requiresMfa) {
                return { requiresMfa: true, userId: response.data.userId };
            }
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                return { success: true, user: response.data };
            }
            return { success: false, message: 'Login failed. Unexpected response.' };
        } catch (error) {
            const msg = error.response?.data?.message || 'Backend unavailable. Please ensure the server is running.';
            return { success: false, message: msg };
        }
    };

    const verifyMfa = async (userId, code) => {
        try {
            const response = await authAPI.verifyMfa(userId, code);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                return { success: true, user: response.data };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'MFA failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                return { success: true };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, verifyMfa, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
