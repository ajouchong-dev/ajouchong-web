import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./styles.css";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import Cookies from "js-cookie";

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { auth, login, logout } = useAuth();

    const clearCookies = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("user");
    };

    const handleLogout = useCallback(async () => {
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
            navigate("/");
        }
    }, [navigate, logout]);

    const signInWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { data: userInfo } = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                    }
                );

                const refreshToken = Cookies.get("refreshToken") || null;

                const { data: backendData } = await axios.post(
                    '/api/login/auth/oauth',
                    {
                        accessToken: tokenResponse.access_token,
                        refreshToken: refreshToken,
                    },
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const { data } = backendData;
                const jwtToken = data.jwtToken;

                if (jwtToken) {
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
        },
        onError: (error) => console.error("Login Failed:", error),
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        access_type: "offline",
        prompt: "consent",
        hosted_domain: "ajou.ac.kr",
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (auth.isAuthenticated && auth.user) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get("/api/login/auth/info", {
                    withCredentials: true,
                });

                if (response.data.code === 1 && response.data.data) {
                    // AuthContext의 user 정보 업데이트
                    if (auth.token) {
                        // JWT 토큰이 있으면 AuthContext의 login 함수를 사용하여 업데이트
                        login(auth.token, response.data.data);
                    }
                } else {
                    console.warn("서버에서 사용자 정보를 제공하지 않음:", response.data.message);
                    if (auth.isAuthenticated) {
                        logout();
                    }
                }

            } catch (error) {
                console.error("사용자 정보를 불러오는 중 오류 발생:", error);

                if (error.response?.status === 401) {
                    console.warn("세션이 만료됨. 로그아웃 처리.");
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    handleLogout();
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, [auth.token, auth.isAuthenticated, auth.user, login, logout, handleLogout]);

    if (isLoading) {
        return <p className="loading-text">로딩 중...</p>;
    }

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <hr className="titleSeparator"/>
            {auth.isAuthenticated && auth.user ? (
                <div className="profile-info">
                    <p>이름: {auth.user.name}</p>
                    <p>이메일: {auth.user.email}</p>
                    <p>역할: {auth.user.role}</p>
                </div>
            ) : (
                <p className="loading-text">로그인이 필요한 서비스입니다.</p>
            )}

            <div className="login-container">
                {auth.isAuthenticated && auth.user ? (
                    <button className="auth-button" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <button className="auth-button" onClick={signInWithGoogle}>
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;