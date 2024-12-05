import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
        user: null,
        loading: true,
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAuth({ isAuthenticated: true, token, user: null, loading: false });
        } else {
            setAuth({ isAuthenticated: false, token: null, user: null, loading: false });
        }
    }, []);

    const login = (token, user) => {
        localStorage.setItem('accessToken', token);
        setAuth({ isAuthenticated: true, token, user, loading: false });
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, token: null, user: null, loading: false });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
