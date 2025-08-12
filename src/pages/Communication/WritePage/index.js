import './styles.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://www.ajouchong.com/api';

const QnAPost = () => {
    const [form, setForm] = useState({ title: '', content: '' });
    const [message, setMessage] = useState({ success: '', error: '' });
    const navigate = useNavigate();

    const checkLoginStatus = async () => {
        try {
            await axios.get(`${API_BASE_URL}/login/auth/info`, { withCredentials: true });
        } catch {
            alert('로그인이 필요합니다.');
            navigate('/');
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
                `${API_BASE_URL}/qna`,
                { qpTitle: form.title, qpContent: form.content },
                { withCredentials: true, headers: { "Content-Type": "application/json" } }
            );

            if (response.data.code === 1) {
                setMessage({ success: '게시글이 성공적으로 작성되었습니다.', error: '' });
                setForm({ title: '', content: '' });
                navigate('/communication/qna');
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
        navigate('/communication/qna');
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
            <div className="contextTitle">QnA 작성</div>
            <hr className="titleSeparator" />

            {renderForm()}
            {renderMessage()}

            <button onClick={handleBackToList} className="back-button">
                게시글 목록으로 돌아가기
            </button>
        </div>
    );
};

export default QnAPost;
