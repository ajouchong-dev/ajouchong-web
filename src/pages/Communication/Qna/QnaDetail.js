import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const API_BASE_URL = 'https://www.ajouchong.com/api';

const QnaDetail = () => {
    const { postId } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiking, setIsLiking] = useState(false);
    const navigate = useNavigate();
    const didFetch = useRef(false);

    const fetchPostDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/qna/${postId}`, {
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
    };

    const handleLike = async () => {
        if (isLiking) return;

        const confirmMessage = postDetails.isLiked
            ? "해당 게시글의 공감을 취소 하시겠습니까?"
            : "해당 게시글에 공감하시겠습니까?";

        const confirmLike = window.confirm(confirmMessage);
        if (!confirmLike) return;

        setIsLiking(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/qna/${postId}/like`,
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

    const renderAnswerSection = () => (
        <div className="post-answer">
            <strong>상태:</strong> {postDetails.replied ? '답변 완료' : '대기 중'}
            <p>{postDetails.answer || '답변이 아직 없습니다.'}</p>
        </div>
    );

    const renderLikeSection = () => (
        <div className="like-section">
            <button onClick={handleLike} className="like-button" disabled={isLiking}>
                <img
                    src={postDetails.isLiked ? "/main/filled-heart.png" : "/main/heart.png"}
                    alt="좋아요"
                    className="like-icon"
                />
            </button>
            <span className="like-count">{postDetails.qpUserLikeCnt}</span>
        </div>
    );

    useEffect(() => {
        if (postId && !didFetch.current) {
            didFetch.current = true;
            fetchPostDetails();
        }
    }, [postId]);

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
            {renderMetadata()}
            <p className="post-content">{postDetails.qpContent}</p>
            {renderAnswerSection()}
            {renderLikeSection()}
            <button onClick={handleBackToList} className="back-button">
                목록으로 돌아가기
            </button>
        </div>
    );
};

export default QnaDetail;
