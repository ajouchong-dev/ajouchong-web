import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleOAuthHandler = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const authorizationCode = queryParams.get('code');

        if (!authorizationCode) {
            alert('Authorization code missing. Redirecting to login.');
            navigate('/login');
            return;
        }

        const handleLogin = async () => {
            try {
                const response = await fetch(`https://www.ajouchong.com/api/login/oauth/google?code=${authorizationCode}`);
                if (response.ok) {
                    const data = await response.json();
                    login(data.data, { email: 'UserEmail' }); // Set the token and optional user details
                    alert(data.message || 'Login successful!');
                    navigate('/'); // Redirect to the main page
                } else {
                    alert('Login failed. Please try again.');
                    navigate('/login');
                }
            } catch (error) {
                alert('Error during login. Redirecting to login page.');
                navigate('/login');
            }
        };

        handleLogin();
    }, [navigate, login]);

    return <h2>Logging in...</h2>;
};

export default GoogleOAuthHandler;
