import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
        user: null,
    });

    useEffect(() => {
        // Check login status on mount
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAuth({ isAuthenticated: true, token, user: null });
            // Optionally fetch user details here if needed
        }
    }, []);

    const login = (token, user) => {
        setAuth({ isAuthenticated: true, token, user });
        localStorage.setItem('accessToken', token); // Save token
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, token: null, user: null });
        localStorage.removeItem('accessToken'); // Remove token
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


