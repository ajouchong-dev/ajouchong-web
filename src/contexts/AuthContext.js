import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: !!localStorage.getItem('accessToken'),
        token: localStorage.getItem('accessToken'),
        user: null,
    });

    const login = (token, user) => {
        localStorage.setItem('accessToken', token);
        setAuth({ isAuthenticated: true, token, user });
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setAuth({ isAuthenticated: false, token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
