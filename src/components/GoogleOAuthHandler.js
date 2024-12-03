import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // useAuth import

const GoogleOAuthCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        // URL에서 Authorization Code 추출
        const queryParams = new URLSearchParams(window.location.search);
        const authorizationCode = queryParams.get('code');

        if (!authorizationCode) {
            console.error('Authorization code not found in URL:', window.location.search);
            alert('Authorization code가 누락되었습니다.');
            navigate('/login'); // 실패 시 로그인 페이지로 리디렉션
            return;
        }

        console.log('Authorization code received:', authorizationCode);

        // Authorization Code를 서버로 전달
        handleGoogleOAuthCallback(authorizationCode);
    }, [navigate]);

    const handleGoogleOAuthCallback = async (authorizationCode) => {
        try {
            const requestUrl = `https://www.ajouchong.com/api/login/oauth/google?code=${authorizationCode}`;
            console.log('Final Request URL:', requestUrl);

            const response = await fetch(requestUrl, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json(); // JSON 응답 파싱
                console.log('JWT token received:', data.data);

                // JWT 토큰 저장
                localStorage.setItem('accessToken', data.data);

                // 로그인 상태 업데이트
                login(data.data, { email: 'tae1231@ajou.ac.kr' }); // 사용자 정보를 업데이트

                alert(data.message || '로그인 성공!');
                navigate('/'); // 성공 시 메인 화면으로 리디렉션
            } else {
                const errorText = await response.text();
                console.error('Failed response:', errorText);
                alert('로그인 처리 중 오류가 발생했습니다.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error during OAuth callback:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
            navigate('/login'); // 실패 시 로그인 페이지로 리디렉션
        }
    };

    return <h2>로그인 처리 중...</h2>;
};

export default GoogleOAuthCallback;
