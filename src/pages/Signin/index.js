import './styles.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await axios.post('https://www.ajouchong.com/api/auth/login', {
                email,
                password
            });
            if (response.data.code === 1) {
                alert(response.data.message); // 로그인 성공 메시지
                navigate('/'); // 로그인 후 이동할 경로 설정
            } else {
                setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            setErrorMessage('로그인 요청 오류가 발생했습니다.');
            console.error('API 요청 오류:', error);
        }
    };

    return (
        <div className="context">
            <div className="contextTitle">AJOU UNIV</div>
            <img className="signinlogo" src="/aurum_black.png" alt="Ajou University Logo"/>

            <div className="signin-container">
                <input
                    type="text"
                    placeholder="e-mail"
                    className="signin-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    className="signin-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="signin-button" onClick={handleSignIn}>Sign In</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>

            <div className="findpw">
                <a href="/join">회원가입</a>
                <span className="space">|</span>
                <a href="/password">비밀번호 찾기</a>
            </div>
        </div>
    );
}

export default Signin;