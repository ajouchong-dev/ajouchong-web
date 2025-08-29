import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const QnaDetail = () => {
    const { postId } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiking, setIsLiking] = useState(false);
    const navigate = useNavigate();
    const didFetch = useRef(false);

    const fetchPostDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/api/qna/${postId}`, {
                withCredentials: true
            });

            if (response.data.code === 1) {
                setPostDetails({
                    ...response.data.data,
                    isLiked: response.data.data.likedByCurrentMember
                });
            } else {
                console.error('Error fetching post details:', response.data.message);
            }
        } catch (error) {
            console.error('API request error:', error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    const handleLike = async () => {
        if (isLiking) return;

        const confirmMessage = postDetails.isLiked
            ? "해당 게시글의 공감을 취소 하시겠습니까?"
            : "해당 게시글에 공감하시겠습니까?";

        const confirmLike = window.confirm(confirmMessage);
        if (!confirmLike) return;

        setIsLiking(true);

        try {
            const response = await apiClient.post(
                `/api/qna/${postId}/like`,
                {},
                { withCredentials: true }
            );

            if (response.data.code === 1) {
                const { isLiked, likeCount } = response.data.data;

                setPostDetails(prev => ({
                    ...prev,
                    qpUserLikeCnt: likeCount,
                    isLiked: isLiked
                }));
            } else {
                console.error("좋아요 실패:", response.data.message);
                alert("로그인이 필요합니다.");
            }
        } catch (error) {
            console.error("좋아요 요청 오류:", error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleBackToList = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const renderMetadata = () => (
        <div className="post-metadata">
            <span>작성일 | {formatDate(postDetails.qpCreateTime)}</span>
            <span>조회수 | {postDetails.qpHitCnt}</span>
            <span>좋아요 | {postDetails.qpUserLikeCnt}</span>
        </div>
    );

    const renderAnswerSection = () => {
        const answerContent = postDetails.answer?.content || '답변이 아직 없습니다.';
        const answerCreateTime = postDetails.answer?.createTime;

        return (
            <div className="answer-container">
                <div className="answer-header">
                    <h3>답변</h3>
                    <span className={`answer-status ${postDetails.replied ? 'completed' : 'pending'}`}>
                        {postDetails.replied ? '답변 완료' : '대기 중'}
                    </span>
                </div>
                <div className="answer-content">
                    <p>{answerContent}</p>
                    {answerCreateTime && (
                        <div className="answer-meta">
                            <small>답변일: {formatDate(answerCreateTime)}</small>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderLikeSection = () => (
        <div className="like-section">
            <button onClick={handleLike} className="like-button" disabled={isLiking}>
                <img
                    src={postDetails.isLiked ? "/images/main/filled-heart.png" : "/images/main/heart.png"}
                    alt="좋아요"
                    className="like-icon"
                />
            </button>
            <span className="like-count">{postDetails.qpUserLikeCnt}</span>
        </div>
    );

    const renderLoading = () => (
        <div>Loading...</div>
    );

    const renderError = () => (
        <div>No post details found.</div>
    );

    const renderPostContent = () => (
        <div className="context">
            <div className="contextTitle">{postDetails.qpTitle}</div>
            <hr className="titleSeparator"/>
            {renderMetadata()}
            <p className="post-content">{postDetails.qpContent}</p>
            {renderAnswerSection()}
            {renderLikeSection()}
            <button onClick={handleBackToList} className="back-button">
                목록으로 돌아가기
            </button>
        </div>
    );

    useEffect(() => {
        if (postId && !didFetch.current) {
            didFetch.current = true;
            fetchPostDetails();
        }
    }, [postId, fetchPostDetails]);

    if (loading) {
        return renderLoading();
    }

    if (!postDetails) {
        return renderError();
    }

    return renderPostContent();
};

export default QnaDetail;
