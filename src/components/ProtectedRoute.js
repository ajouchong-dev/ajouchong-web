import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { auth } = useAuth();

    if (!auth.isAuthenticated) {
        // 로그인 상태가 아니면 Google OAuth로 리디렉션
        const clientId = '440712020433-ljqa7d2r8drohnblmmfum3cls1et2kuq.apps.googleusercontent.com';
        const redirectUri = 'https://www.ajouchong.com/api/login/oauth/google';

        const googleAuthUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${redirectUri}&` +
            `response_type=code&` +
            `scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&` +
            `hd=ajou.ac.kr`;

        window.location.href = googleAuthUrl;
        return null; // 리디렉션 중에는 아무것도 렌더링하지 않음
    }

    return children; // 로그인 상태일 경우 자식 컴포넌트를 렌더링
};

export default ProtectedRoute;
