import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import "./login.css";

const GOOGLE_API_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const Login = () => {
    const navigate = useNavigate();
    const { auth, login, logout } = useAuth();

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

    const handleLoginSuccess = async (tokenResponse) => {
        try {        
            const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
            const refreshToken = Cookies.get("refreshToken") || null;
            const backendData = await authenticateWithBackend(tokenResponse.access_token, refreshToken);
            
            const { data } = backendData;
            const jwtToken = data.jwtToken;

            if (jwtToken) {
                // AuthContext를 통해 로그인 처리
                login(jwtToken, userInfo);
                navigate("/profile");
            } else {
                console.error("JWT가 존재하지 않습니다.");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.error("JWT 만료됨 - 로그아웃 처리");
                handleLogout();
            } else {
                console.error("Login Error:", error);
            }
        }
    };

    const handleLoginError = (error) => {
        console.error("Login Failed:", error);
    };

    const handleLogout = async () => {
        try {
            await axios.post(`/api/login/auth/logout`, {}, {
                withCredentials: true
            });

            googleLogout();
            clearCookies();
            logout(); 
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            // 에러가 발생해도 클라이언트 측 로그아웃은 진행
            googleLogout();
            clearCookies();
            logout();
            navigate("/");
        }
    };

    const signInWithGoogle = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: handleLoginError,
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        access_type: "offline",
        prompt: "consent",
        hosted_domain: "ajou.ac.kr",
    });

    const renderAuthButton = () => {
        if (auth.isAuthenticated && auth.user) {
            return (
                <button className="auth-button logout-button" onClick={handleLogout}>
                    Logout
                </button>
            );
        }
        
        return (
            <button className="auth-button login-button" onClick={signInWithGoogle}>
                Login
            </button>
        );
    };

    return (
        <div className="login-container">
            {renderAuthButton()}
        </div>
    );
};

export default Login;