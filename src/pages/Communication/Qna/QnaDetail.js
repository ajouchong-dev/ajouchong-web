import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Heart } from 'lucide-react';
import '../styles.css';
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
        <div className="post-metadata board-meta">
            <span>작성일 <b>{formatDate(postDetails.qpCreateTime)}</b></span>
            <span>조회수 <b>{postDetails.qpHitCnt}</b></span>
            <span>좋아요 <b>{postDetails.qpUserLikeCnt}</b></span>
        </div>
    );

    const renderAnswerSection = () => {
        const answerContent = postDetails.answer?.content || '답변이 아직 없습니다.';
        const answerCreateTime = postDetails.answer?.createTime;

        return (
            <section className={`qna-answer ${postDetails.answer?.content ? '' : 'is-empty'}`}>
                <div className="qna-answer-header">
                    <h3 className="qna-block-label">
                        <span className="qna-mark is-answer" aria-hidden="true">A</span>
                        답변
                    </h3>
                    <span className={`ui-badge ${postDetails.replied ? 'is-ok' : 'is-warn'}`}>
                        {postDetails.replied ? '답변 완료' : '대기 중'}
                    </span>
                </div>
                <div className="qna-answer-body">
                    <p className="qna-answer-text">{answerContent}</p>
                    {answerCreateTime && (
                        <div className="qna-answer-meta">
                            <small>답변일: {formatDate(answerCreateTime)}</small>
                        </div>
                    )}
                </div>
            </section>
        );
    };

    const renderLikeSection = () => (
        <div className="like-section">
            <button
                onClick={handleLike}
                className="like-button"
                disabled={isLiking}
                aria-label="좋아요"
                aria-pressed={Boolean(postDetails.isLiked)}
            >
                <Heart
                    className="like-icon"
                    fill={postDetails.isLiked ? 'currentColor' : 'none'}
                    aria-hidden="true"
                />
            </button>
            <span className="like-count">{postDetails.qpUserLikeCnt}</span>
        </div>
    );

    const renderLoading = () => (
        <div className="context" aria-busy="true">
            <div className="board-detail-skeleton">
                <span className="board-skeleton is-title ui-skeleton" />
                <span className="board-skeleton is-short ui-skeleton" />
                <span className="board-skeleton is-block ui-skeleton" />
            </div>
            <span className="board-visually-hidden">Loading...</span>
        </div>
    );

    const renderError = () => (
        <div className="context">
            <div className="ui-empty">게시글을 찾을 수 없습니다.</div>
            <button onClick={handleBackToList} className="back-button">
                <ArrowLeft size={18} aria-hidden="true" />
                목록으로
            </button>
        </div>
    );

    const renderPostContent = () => (
        <div className="context">
            <div className="contextTitle board-detail-title">{postDetails.qpTitle}</div>
            <hr className="titleSeparator"/>
            {renderMetadata()}
            <div className="qna-thread">
                <section className="qna-question">
                    <h3 className="qna-block-label">
                        <span className="qna-mark" aria-hidden="true">Q</span>
                        질문
                    </h3>
                    <p className="post-content qna-question-text">{postDetails.qpContent}</p>
                </section>
                {renderAnswerSection()}
            </div>
            {renderLikeSection()}
            <button onClick={handleBackToList} className="back-button">
                <ArrowLeft size={18} aria-hidden="true" />
                목록으로
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
