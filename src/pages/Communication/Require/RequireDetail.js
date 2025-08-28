import './styles.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequireDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [isLiking, setIsLiking] = useState(false);
    const navigate = useNavigate();
    const didFetch = useRef(false);

    const fetchPostDetails = useCallback(async () => {
        try {
            const response = await axios.get(`/api/agora/${id}`, {
                withCredentials: true
            });
            
            if (response.data.code === 1) {
                const post = response.data.data;
                setPostDetails({
                    ...post,
                    isLiked: post.likedByCurrentMember
                });
            } else {
                console.error('게시글 조회 오류:', response.data.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    }, [id]);

    const handleLike = async () => {
        if (isLiking || !postDetails) return;

        const confirmMessage = postDetails.isLiked
            ? "해당 게시글의 공감을 취소 하시겠습니까?"
            : "해당 게시글에 공감하시겠습니까?";

        const confirmLike = window.confirm(confirmMessage);
        if (!confirmLike) return;

        setIsLiking(true);

        try {
            const response = await axios.post(
                `/api/agora/${id}/like`,
                {},
                { withCredentials: true }
            );

            if (response.data.code === 1) {
                const { isLiked, likeCount } = response.data.data;

                setPostDetails(prev => ({
                    ...prev,
                    apUserLikeCount: likeCount,
                    isLiked: isLiked
                }));
            } else {
                alert('로그인이 필요합니다.');
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
            <span><strong>작성일 |</strong> {formatDate(postDetails.createTime)}</span>
            <span><strong>조회수 |</strong> {postDetails.apHitCount}</span>
            <span><strong>좋아요 |</strong> {postDetails.apUserLikeCount}</span>
        </div>
    );

    const renderCommentSection = () => (
        <div className="comment-section">
            <div className="comment-item">
                <strong>승인 상태:</strong>
                <span className={postDetails.approve ? 'approval-approved' : 'approval-denied'}>
                    {postDetails.approve ? '가결' : '진행중'}
                </span>
            </div>
        </div>
    );

    const renderLikeSection = () => (
        <div className="like-section">
            <button onClick={handleLike} className="like-button" disabled={isLiking}>
                <img
                    src={postDetails.isLiked ? "/images/main/filled-heart.png" : "/images/main/heart.png"}
                    alt="좋아요"
                    className="like-icon"
                />
            </button>
            <span className="like-count">{postDetails.apUserLikeCount}</span>
        </div>
    );

    useEffect(() => {
        if (id && !didFetch.current) {
            didFetch.current = true;
            fetchPostDetails();
        }
    }, [id, fetchPostDetails]);

    if (!postDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="context">
            <div className="contextTitle">{postDetails.apTitle}</div>
            <hr className="titleSeparator" />
            {renderMetadata()}
            <p className="post-content">{postDetails.apContent}</p>
            {renderCommentSection()}
            {renderLikeSection()}
            <button onClick={handleBackToList} className="back-button">
                목록으로 돌아가기
            </button>
        </div>
    );
};

export default RequireDetail;
