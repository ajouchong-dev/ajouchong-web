import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { auth } = useAuth();

    if (auth.isAuthenticated === false) {
        alert('Login is required to access this page.');
        return <Navigate to="/" />;
    }

    if (!auth.isAuthenticated) {
        return null; // Show a loading indicator if the authentication state is unknown
    }

    return children;
};

export default ProtectedRoute;


