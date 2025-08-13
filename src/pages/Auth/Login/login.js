import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "../styles.css";

const Login = () => {
    const navigate = useNavigate();
    const { auth, useGoogleAuth, handleLogout } = useAuth();

    const signInWithGoogle = useGoogleAuth(navigate);

    const renderAuthButton = () => {
        if (auth.isAuthenticated && auth.user) {
            return (
                <button className="auth-button logout-button" onClick={() => handleLogout(navigate)}>
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