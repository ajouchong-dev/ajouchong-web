import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import Cookies from "js-cookie";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        googleLogout();
        setUser(null);

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("user");

        navigate("/");
        setTimeout(() => window.location.reload(), 500);
    }, [navigate]);

    const signInWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { data: userInfo } = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                    }
                );

                // console.log("Google User Info:", userInfo);

                const refreshToken = Cookies.get("refreshToken") || null;

                const { data: backendData } = await axios.post(
                    "http://localhost:8080/api/login/auth/oauth",
                    {
                        accessToken: tokenResponse.access_token,
                        refreshToken: refreshToken,
                    },
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const { status, data } = backendData;
                const jwtToken = data.jwtToken;

                if (jwtToken) {

                    setUser(userInfo);
                    localStorage.setItem("user", JSON.stringify(userInfo));

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
            try {
                const response = await axios.get("http://localhost:8080/api/login/auth/info", {
                    withCredentials: true, // 쿠키 기반 인증
                });

                console.log("API 응답:", response.data);
                console.log("응답 데이터:", response.data.data);

                if (response.data.code === 1 && response.data.data) {
                    setUser(response.data.data);
                } else {
                    console.warn("서버에서 사용자 정보를 제공하지 않음:", response.data.message);
                    setUser(null);
                }

            } catch (error) {
                console.error("사용자 정보를 불러오는 중 오류 발생:", error);

                if (error.response) {
                    // console.error("서버 응답 상태 코드:", error.response.status);
                    // console.error("서버 응답 데이터:", error.response.data);

                    if (error.response.status === 401) {
                        console.warn("세션이 만료됨. 로그아웃 처리.");
                        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                        handleLogout();
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (isLoading) {
        return <p className="loading-text">로딩 중...</p>;
    }

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <hr className="titleSeparator"/>
            {user ? (
                <div className="profile-info">
                    <p>이름: {user.name}</p>
                    <p>이메일: {user.email}</p>
                    <p>역할: {user.role}</p>
                </div>
            ) : (
                <p className="loading-text">사용자 정보를 불러올 수 없습니다.</p>
            )}

            <div className="login-container">
                {user ? (
                    <button className="auth-button" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <button onClick={signInWithGoogle} className="auth-button">
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;
