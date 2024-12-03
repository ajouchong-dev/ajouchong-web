import React from 'react';

const ProtectedRoute = ({ isLoggedIn, children }) => {
    const handleGoogleLogin = () => {
        const clientId = '440712020433-ljqa7d2r8drohnblmmfum3cls1et2kuq.apps.googleusercontent.com';
        const redirectUri = 'https://www.ajouchong.com/api/login/oauth/google'; // Google Cloud Console에 설정된 URI와 일치해야 함

        const googleAuthUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${redirectUri}&` +
            `response_type=code&` +
            `scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&` +
            `hd=ajou.ac.kr`;

        window.location.href = googleAuthUrl;
    };

    if (!isLoggedIn) {
        // Redirect to Google OAuth login
        handleGoogleLogin();
        return null; // Do not render anything while redirecting
    }

    // Render the child components if logged in
    return children;
};

export default ProtectedRoute;
