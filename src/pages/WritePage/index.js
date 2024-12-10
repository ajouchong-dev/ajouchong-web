import './styles.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QnAPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://www.ajouchong.com/api/qna', {
                qpTitle: title,
                qpContent: content
            });

            if (response.data.code === 1) {
                setSuccessMessage('게시글이 성공적으로 작성되었습니다.');
                setTitle(''); // 입력 필드 초기화
                setContent('');
                setTimeout(() => {
                    navigate('/communication/qna'); // Q&A 목록으로 이동
                }, 2000); // 2초 후 이동
            } else {
                setErrorMessage('게시글 작성에 실패했습니다.');
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
            setErrorMessage('게시글 작성 중 오류가 발생했습니다.');
        }
    };

    const handleBackToPosts = () => {
        navigate('/communication/qna'); // Adjust path as needed
    };

    return (
        <div className="context">
            <div className="contextTitle">QnA 작성</div>
            <hr className="titleSeparator" />

            <form onSubmit={handleSubmit} className="qna-form">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="내용을 입력하세요"
                    ></textarea>
                </div>
                <button type="submit" className="submit-button">게시</button>
            </form>

            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}

            <button onClick={handleBackToPosts} className="back-button">
                게시글 목록으로 돌아가기
            </button>
        </div>
    );
};

export default QnAPost;
