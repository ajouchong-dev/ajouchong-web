// src/pages/Qna/QnaDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import Cookies from "js-cookie";

const QnaDetail = () => {
    const { postId } = useParams(); // Extract postId from URL parameters
    const [postDetails, setPostDetails] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [isLiking, setIsLiking] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostDetails = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get(`https://www.ajouchong.com/api/qna/${postId}`);
                if (response.data.code === 1) {
                    setPostDetails(response.data.data);
                } else {
                    console.error('Error fetching post details:', response.data.message);
                }
            } catch (error) {
                console.error('API request error:', error);
            } finally {
                setLoading(false); // End loading regardless of success or failure
            }
        };

        if (postId) fetchPostDetails(); // Only fetch data if postId exists
    }, [postId]);

    const handleLike = async () => {
        if (!isLiking) {
            const confirmLike = window.confirm("해당 게시글에 공감하시겠습니까?");
            if (!confirmLike) return;

            setIsLiking(true);

            try {
                const response = await axios.post(
                    `https://www.ajouchong.com/api/qna/${postId}/like`,
                    {},
                    {
                        withCredentials: true, // 쿠키 자동 포함
                    }
                );

                if (response.data.code === 1) {
                    setPostDetails(prev => ({
                        ...prev,
                        qpUserLikeCnt: prev.qpUserLikeCnt + 1
                    }));
                } else {
                    console.error("좋아요 실패:", response.data.message);
                    alert('로그인이 필요합니다.');
                }
            } catch (error) {
                console.error("좋아요 요청 오류:", error);
            } finally {
                setIsLiking(false);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!postDetails) {
        return <div>No post details found.</div>;
    }

    return (
        <div className="post-detail">
            <h2 className="post-title">{postDetails.qpTitle}</h2>
            <hr className="titleSeparator"/>
            <div className="post-metadata">
                <span>작성일 | {new Date(postDetails.qpCreateTime).toLocaleString()}</span>
                <span>조회수 | {postDetails.qpHitCnt}</span>
                <span>좋아요 | {postDetails.qpUserLikeCnt}</span>
            </div>
            <p className="post-content">{postDetails.qpContent}</p>

            {/* Status and Answer */}
            <div className="post-answer">
                <strong>상태:</strong> {postDetails.replied ? '답변 완료' : '대기 중'}
                <p>{postDetails.answer || '답변이 아직 없습니다.'}</p>
            </div>

            <div className="like-section">
                <button onClick={handleLike} className="like-button" disabled={isLiking}>
                    <img
                        src={isLiking ? "/main/filled-heart.png" : "/main/heart.png"}
                        alt="좋아요"
                        className="like-icon"
                    />
                </button>
                <span className="like-count">{postDetails.qpUserLikeCnt}</span>
            </div>

            <button onClick={() => navigate(-1)} className="back-button">
                목록으로 돌아가기
            </button>
        </div>
    );
};

export default QnaDetail;
