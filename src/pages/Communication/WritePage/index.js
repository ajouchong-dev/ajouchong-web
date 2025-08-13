import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const WritePage = () => {
    const [form, setForm] = useState({ title: '', content: '' });
    const [message, setMessage] = useState({ success: '', error: '' });
    const navigate = useNavigate();
    const location = useLocation();

    // URL 경로로부터 타입 구분
    const getTypeFromPath = () => {
        if (location.pathname.includes('/qna/write')) return 'qna';
        if (location.pathname.includes('/require/write')) return 'require';
        return 'qna'; 
    };

    const type = getTypeFromPath();

    const getConfig = () => {
        switch (type) {
            case 'qna':
                return {
                    apiEndpoint: '/api/qna',
                    requestData: { qpTitle: form.title, qpContent: form.content },
                    title: 'QnA 작성',
                    redirectPath: '/communication/qna',                    
                };
            case 'require':
                return {
                    apiEndpoint: '/api/agora',
                    requestData: { apTitle: form.title, apContent: form.content },
                    title: '안건 상정 글 작성',
                    redirectPath: '/communication/require',
                };
            default:
                return {
                    apiEndpoint: '/api/qna',
                    requestData: { qpTitle: form.title, qpContent: form.content },
                    title: 'QnA 작성',
                    redirectPath: '/communication/qna',                    
                };
        }
    };

    const config = getConfig();

    const checkLoginStatus = async () => {
        try {
            await axios.get("/api/login/auth/info", {
                withCredentials: true,
            });
        } catch {
            alert('로그인이 필요합니다.');
            navigate(config.redirectPath);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ success: '', error: '' });

        try {
            const response = await axios.post(
                config.apiEndpoint,
                config.requestData,
                { 
                    withCredentials: true, 
                    headers: { "Content-Type": "application/json" } 
                }
            );

            if (response.data.code === 1) {
                alert('게시글이 성공적으로 작성되었습니다.');
                navigate(config.redirectPath);
            } else {
                setMessage({ success: '', error: '게시글 작성에 실패했습니다.' });
            }
        } catch (error) {
            setMessage({
                success: '',
                error: error.response?.data?.message || '게시글 작성 중 오류가 발생했습니다.'
            });
        }
    };

    const handleBackToList = () => {
        navigate(config.redirectPath);
    };

    const renderMessage = () => (
        <>
            {message.success && <div className="message success">{message.success}</div>}
            {message.error && <div className="message error">{message.error}</div>}
        </>
    );

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="qna-form">
            <div className="form-group">
                <label htmlFor="title">제목</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="제목을 입력하세요"
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">내용</label>
                <textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    placeholder="내용을 입력하세요"
                />
            </div>
            <button type="submit" className="submit-button">게시</button>
        </form>
    );

    useEffect(() => {
        checkLoginStatus();
    }, [navigate]);

    return (
        <div className="context">
            <div className="contextTitle">{config.title}</div>
            <hr className="titleSeparator" />

            {renderForm()}
            {renderMessage()}

            <button onClick={handleBackToList} className="back-button">
                    게시글 목록으로 돌아가기
            </button>
        </div>
    );
};

export default WritePage;
