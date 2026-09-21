import '../styles.css';
import './styles.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Heart } from 'lucide-react';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const AGREE_GOAL = 100; // 안건 상정에 필요한 공감 수

const RequireDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [isLiking, setIsLiking] = useState(false);
    const navigate = useNavigate();
    const didFetch = useRef(false);

    const fetchPostDetails = useCallback(async () => {
        try {
            const response = await apiClient.get(`/api/agora/${id}`, {
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
            const response = await apiClient.post(
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
        <div className="post-metadata board-meta">
            <span>작성일 <b>{formatDate(postDetails.createTime)}</b></span>
            <span>조회수 <b>{postDetails.apHitCount}</b></span>
            <span>좋아요 <b>{postDetails.apUserLikeCount}</b></span>
        </div>
    );

    // 공감 현황: 이미 있는 공감 수(apUserLikeCount)만 100 기준으로 보여준다
    const renderProgressPanel = () => {
        const likeCount = Number(postDetails.apUserLikeCount) || 0;
        const percent = Math.min(100, Math.round((likeCount / AGREE_GOAL) * 100));
        const remaining = Math.max(0, AGREE_GOAL - likeCount);

        return (
            <section className="req-panel" aria-label="공감 현황">
                <div className="req-panel-head">
                    <h3 className="req-panel-title">공감 현황</h3>
                    <div className="req-status">
                        <span className="req-status-label">승인 상태</span>
                        <span className={`ui-badge ${postDetails.approve ? 'is-ok' : 'is-brand'}`}>
                            {postDetails.approve ? '가결' : '진행중'}
                        </span>
                    </div>
                </div>

                <div className="req-count">
                    <strong className="req-count-now">{likeCount}</strong>
                    <span className="req-count-goal">/ {AGREE_GOAL}</span>
                </div>
                <div
                    className="ui-meter req-meter"
                    style={{ '--value': `${percent}%` }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={AGREE_GOAL}
                    aria-valuenow={Math.min(likeCount, AGREE_GOAL)}
                    aria-label="공감 진행률"
                >
                    <span />
                </div>
                <p className="req-remaining">
                    {remaining > 0
                        ? `${AGREE_GOAL}개까지 공감 ${remaining}개가 남았습니다.`
                        : `공감 ${AGREE_GOAL}개를 채웠습니다.`}
                </p>

                <div className="req-panel-action">
                    <button
                        onClick={handleLike}
                        className={`ui-btn req-like-btn ${postDetails.isLiked ? 'is-liked' : 'is-primary'}`}
                        disabled={isLiking}
                        aria-pressed={Boolean(postDetails.isLiked)}
                    >
                        <Heart
                            size={18}
                            fill={postDetails.isLiked ? 'currentColor' : 'none'}
                            aria-hidden="true"
                        />
                        {postDetails.isLiked ? '공감 취소' : '공감하기'}
                    </button>
                </div>
            </section>
        );
    };

    useEffect(() => {
        if (id && !didFetch.current) {
            didFetch.current = true;
            fetchPostDetails();
        }
    }, [id, fetchPostDetails]);

    if (!postDetails) {
        return (
            <div className="context" aria-busy="true">
                <div className="board-detail-skeleton">
                    <span className="board-skeleton is-title ui-skeleton" />
                    <span className="board-skeleton is-short ui-skeleton" />
                    <span className="board-skeleton is-block ui-skeleton" />
                </div>
                <span className="board-visually-hidden">Loading...</span>
            </div>
        );
    }

    return (
        <div className="context">
            <div className="contextTitle board-detail-title">{postDetails.apTitle}</div>
            <hr className="titleSeparator" />
            {renderMetadata()}
            <div className="req-layout">
                <p className="post-content req-content">{postDetails.apContent}</p>
                {renderProgressPanel()}
            </div>
            <button onClick={handleBackToList} className="back-button">
                <ArrowLeft size={18} aria-hidden="true" />
                목록으로
            </button>
        </div>
    );
};

export default RequireDetail;
