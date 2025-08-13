import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "../styles.css";

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { auth, useGoogleAuth, handleLogout } = useAuth();

    const signInWithGoogle = useGoogleAuth(navigate);

    useEffect(() => {
        // 이미 인증된 상태이고 사용자 정보가 있으면 로딩 완료
        if (auth.isAuthenticated && auth.user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
    }, [auth.isAuthenticated, auth.user]);

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
                    <button className="auth-button" onClick={() => handleLogout(navigate)}>
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