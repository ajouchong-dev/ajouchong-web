import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
        user: null,
    });

    useEffect(() => {
        // 로그인 상태 확인 (예: localStorage에서 토큰 확인)
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAuth({ isAuthenticated: true, token, user: null });
        }
    }, []);

    const login = (token, user) => {
        setAuth({ isAuthenticated: true, token, user });
        localStorage.setItem('accessToken', token); // 토큰 저장
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, token: null, user: null });
        localStorage.removeItem('accessToken'); // 토큰 삭제
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

