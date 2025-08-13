import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("jwtToken");
        return {
            isAuthenticated: !!token,
            token,
            user: null,
            loading: true, // 초기 로딩 상태 추가
        };
    });

    const fetchUser = async (token) => {
        try {
            const response = await fetch("/api/login/auth/info", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                if (userData.code === 1 && userData.data) {
                    setAuth((prev) => ({
                        ...prev,
                        user: userData.data,
                        loading: false,
                    }));
                } else {
                    throw new Error("유저 정보를 불러올 수 없습니다.");
                }
            } else {
                throw new Error("유저 정보를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            logout();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            fetchUser(token);
        } else {
            setAuth((prev) => ({
                ...prev,
                loading: false,
            }));
        }
    }, []);

    const login = (token, user) => {
        localStorage.setItem("jwtToken", token);
        setAuth({ isAuthenticated: true, token, user, loading: false });
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        setAuth({ isAuthenticated: false, token: null, user: null, loading: false });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
