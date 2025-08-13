import React, { createContext, useContext, useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import axios from "axios";

const AuthContext = createContext();

const GOOGLE_API_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("jwtToken");
        const user = localStorage.getItem("user");
        return {
            isAuthenticated: !!token,
            token,
            user: user ? JSON.parse(user) : null,
            loading: true,
        };
    });

    const clearCookies = () => {
        Cookies.remove("refreshToken");
        Cookies.remove("accessToken");
        localStorage.removeItem("user");
    };

    const authenticateWithBackend = async (accessToken, refreshToken) => {
        const response = await axios.post(
            `/api/login/auth/oauth`,
            {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    };

    const fetchGoogleUserInfo = async (accessToken) => {
        const response = await axios.get(GOOGLE_API_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    };

    const handleLoginSuccess = async (tokenResponse, navigate) => {
        try {        
            const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
            const refreshToken = Cookies.get("refreshToken") || null;
            const backendData = await authenticateWithBackend(tokenResponse.access_token, refreshToken);
            
            const { data } = backendData;
            const jwtToken = data.jwtToken;

            if (jwtToken) {
                login(jwtToken, userInfo);
                if (navigate) navigate("/profile");
            } else {
                console.error("JWT가 존재하지 않습니다.");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.error("JWT 만료됨 - 로그아웃 처리");
                handleLogout(navigate);
            } else {
                console.error("Login Error:", error);
            }
        }
    };

    const handleLogout = async (navigate) => {
        try {
            await axios.post(`/api/login/auth/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Backend logout error:", error);
        } finally {
            googleLogout();
            clearCookies();
            logout();
            if (navigate) navigate("/");
        }
    };

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
                    localStorage.setItem("user", JSON.stringify(userData.data));
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
        localStorage.setItem("user", JSON.stringify(user));
        setAuth({ isAuthenticated: true, token, user, loading: false });
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        setAuth({ isAuthenticated: false, token: null, user: null, loading: false });
    };

    const useGoogleAuth = (navigate) => {
        return useGoogleLogin({
            onSuccess: (tokenResponse) => handleLoginSuccess(tokenResponse, navigate),
            onError: (error) => console.error("Login Failed:", error),
            scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
            access_type: "offline",
            prompt: "consent",
            hosted_domain: "ajou.ac.kr",
        });
    };

    return (
        <AuthContext.Provider value={{ 
            auth, 
            login, 
            logout, 
            handleLogout, 
            useGoogleAuth,
            clearCookies 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
