import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    if (!auth.isAuthenticated) {
        // 로그인 상태가 아니면 알림을 띄우고 메인 페이지로 리디렉션
        alert('로그인이 필요합니다.');
        navigate('/'); // 메인 페이지로 리디렉션
        return null; // 리디렉션 중에는 아무것도 렌더링하지 않음
    }

    return children; // 로그인 상태일 경우 자식 컴포넌트를 렌더링
};

export default ProtectedRoute;

