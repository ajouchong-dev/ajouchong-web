import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, LogIn, LogOut, UserRound } from "lucide-react";
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
        return (
            <div className="context">
                <p className="loading-text">로딩 중...</p>
            </div>
        );
    }

    const isLoggedIn = auth.isAuthenticated && auth.user;
    const isAdmin = auth.isAuthenticated && auth.user?.role === "ADMIN";

    const renderProfileCard = () => {
        const { name, email, role } = auth.user;
        const initial = (name || email || "").trim().charAt(0).toUpperCase();

        return (
            <section className="ui-card profile-card">
                <div className="profile-head">
                    <span className="profile-avatar" aria-hidden="true">
                        {initial || <UserRound size={24} />}
                    </span>
                    <div className="profile-identity">
                        <div className="profile-name-row">
                            <strong className="profile-name">{name}</strong>
                            {role && (
                                <span className={`ui-badge ${role === "ADMIN" ? "is-brand" : ""}`}>{role}</span>
                            )}
                        </div>
                        <span className="profile-email">{email}</span>
                    </div>
                </div>

                <dl className="profile-fields">
                    <div className="profile-field">
                        <dt>이름</dt>
                        <dd>{name}</dd>
                    </div>
                    <div className="profile-field">
                        <dt>이메일</dt>
                        <dd>{email}</dd>
                    </div>
                    <div className="profile-field">
                        <dt>역할</dt>
                        <dd>{role}</dd>
                    </div>
                </dl>

                <div className="profile-actions">
                    {isAdmin && (
                        <Link to="/admin" className="ui-btn is-primary profile-admin-link">
                            관리자 페이지 이동
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    )}
                    <div className="login-container">
                        <button className="auth-button logout-button" onClick={() => handleLogout(navigate)}>
                            <LogOut size={16} aria-hidden="true" />
                            로그아웃
                        </button>
                    </div>
                </div>
            </section>
        );
    };

    const renderSignInCard = () => (
        <section className="ui-card profile-card">
            <span className="profile-signin-icon" aria-hidden="true">
                <UserRound size={22} />
            </span>
            <h2 className="profile-signin-title">로그인이 필요한 서비스입니다.</h2>
            <p className="profile-signin-text">Google 계정으로 로그인하면 내 정보를 확인할 수 있습니다.</p>
            <div className="profile-actions">
                <div className="login-container">
                    <button className="auth-button login-button" onClick={signInWithGoogle}>
                        <LogIn size={16} aria-hidden="true" />
                        Google 계정으로 로그인
                    </button>
                </div>
            </div>
        </section>
    );

    return (
        <div className="context">
            <div className="contextTitle">프로필</div>
            <hr className="titleSeparator" />
            {isLoggedIn ? renderProfileCard() : renderSignInCard()}
        </div>
    );
};

export default Profile;
