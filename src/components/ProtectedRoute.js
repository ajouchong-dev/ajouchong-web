import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { auth } = useAuth();

    if (auth.loading) {
        return <div>로딩 중...</div>;
    }

    if (!auth.isAuthenticated) {
        alert('로그인이 필요합니다.');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;