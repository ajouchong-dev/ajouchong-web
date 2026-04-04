import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { auth } = useAuth();

    if (auth.loading) {
        return <div>로딩 중...</div>;
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && auth.user?.role !== requiredRole) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
