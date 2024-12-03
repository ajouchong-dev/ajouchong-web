import './styles.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QnAPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmSubmit = window.confirm('글을 게시하시겠습니까?');
        if (!confirmSubmit) return;

        try {
            const response = await axios.post('https://www.ajouchong.com/api/qna', {
                qpTitle: title,
                qpContent: content
            });

            if (response.data.code === 1) {
                setMessage('게시글이 게시되었습니다.');
                setTitle('');
                setContent('');
            } else {
                setMessage('게시글 작성에 실패했습니다.');
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
            setMessage('게시글 작성 중 오류가 발생했습니다.');
        }
    };

    const handleBackToPosts = () => {
        navigate('/communication/qna'); // Adjust path as needed
    };

    return (
        <div className="context">
            <div className="contextTitle">QnA 작성</div>
            <hr className="titleSeparator"/>

            <form onSubmit={handleSubmit} className="qna-form">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="submit-button">게시</button>
            </form>

            {message && <div className="message">{message}</div>}

            <button onClick={handleBackToPosts} className="back-button">
                게시글로 돌아가기
            </button>
        </div>
    );
};

export default QnAPost;
