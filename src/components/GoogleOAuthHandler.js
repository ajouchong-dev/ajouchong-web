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
            alert('Authorization code가 누락되었습니다.');
            navigate('/');
            return;
        }

        const fetchToken = async () => {
            try {
                const response = await fetch(`https://www.ajouchong.com/api/login/oauth/google?code=${authorizationCode}`);
                if (response.ok) {
                    const data = await response.json();
                    login(data.token, data.user); // 서버에서 받은 토큰과 사용자 정보로 로그인
                    navigate('/');
                } else {
                    alert('로그인 실패: 서버 오류');
                    navigate('/');
                }
            } catch (error) {
                console.error('토큰 요청 중 오류 발생:', error);
                alert('로그인 처리 중 오류가 발생했습니다.');
                navigate('/');
            }
        };

        fetchToken();
    }, [navigate, login]);

    return <h2>로그인 처리 중...</h2>;
};

export default GoogleOAuthHandler;
