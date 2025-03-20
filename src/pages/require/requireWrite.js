import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const RequireWrite = () => {
    const [form, setForm] = useState({ title: '', content: '' });
    const [message, setMessage] = useState({ success: '', error: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                await axios.get('https://www.ajouchong.com/api/login/auth/info', { withCredentials: true });
            } catch {
                alert('로그인이 필요합니다.');
                navigate('/communication/require'); // 로그인 페이지로 이동
            }
        };

        checkLoginStatus();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ success: '', error: '' });

        try {
            const response = await axios.post(
                'https://www.ajouchong.com/api/agora',
                { apTitle: form.title, apContent: form.content },
                { withCredentials: true, headers: { "Content-Type": "application/json" } }
            );

            if (response.data.code === 1) {
                alert('게시글이 성공적으로 작성되었습니다.');
                navigate('/communication/require');
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

    return (
        <div className="context">
            <div className="contextTitle">안건 상정 글 작성</div>
            <hr className="titleSeparator"/>

            <form onSubmit={handleSubmit} className="qna-form">
                <div className="form-group">
                    <label>제목</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>내용</label>
                    <textarea name="content" value={form.content} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-button">게시</button>
            </form>
        </div>
    );
};

export default RequireWrite;
