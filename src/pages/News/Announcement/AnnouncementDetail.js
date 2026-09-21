import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import './styles.css';

// API 전용 axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const AnnouncementDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [isLiking, setIsLiking] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false); // 표시용: 이미지 크게 보기
    const navigate = useNavigate();
    const didFetch = useRef(false);

    const fetchPostDetails = useCallback(async () => {
        try {
            const response = await apiClient.get(`/api/notice/${id}`, {
                withCredentials: true
            });

            if (response.data.code === 1) {
                const post = response.data.data;
                setPostDetails({
                    ...post,
                    isLiked: post.likedByCurrentUser
                });
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error('API request error:', error);
        }
    }, [id]);

    const handleLikeToggle = async () => {
        const confirmMessage = postDetails.isLiked
            ? "해당 게시글의 공감을 취소 하시겠습니까?"
            : "해당 게시글에 공감하시겠습니까?";

        const confirmLike = window.confirm(confirmMessage);
        if (!confirmLike) return;

        setIsLiking(true);

        try {
            const response = await apiClient.post(
                `/api/notice/${id}/like`,
                {},
                { withCredentials: true }
            );

            if (response.data.code === 1) {
                const { isLiked, likeCount } = response.data.data;

                setPostDetails(prev => ({
                    ...prev,
                    npUserLikeCnt: likeCount,
                    isLiked: isLiked
                }));
            } else {
                alert("로그인이 필요한 서비스 입니다.");
                console.error("Error toggling like:", response.data.message);
            }
        } catch (error) {
            console.error("API request error:", error);
        } finally {
            setIsLiking(false);
        }
    };

    const imageCount = postDetails?.imageUrls?.length || 0;

    const handleNext = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex < imageCount - 1 ? prevIndex + 1 : prevIndex));
    }, [imageCount]);

    const handlePrev = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }, []);

    const handleBackToList = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatContent = (content) => {
        if (!content) return '';
        return content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index < content.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    const renderMetadata = () => (
        <div className="post-metadata ann-meta">
            <span>작성일 <b>{formatDate(postDetails.npCreateTime)}</b></span>
            <span>조회수 <b>{postDetails.npHitCnt}</b></span>
        </div>
    );

    const renderImageGallery = () => {
        if (imageCount > 0) {
            return (
                <div className="ann-gallery">
                    <div className="ann-gallery-stage">
                        <button
                            type="button"
                            className="ann-gallery-view"
                            onClick={() => setIsLightboxOpen(true)}
                            aria-label="이미지 크게 보기"
                        >
                            <img
                                src={postDetails.imageUrls[currentIndex]}
                                alt={`${currentIndex + 1}`}
                                className="ann-gallery-image"
                            />
                        </button>
                        {currentIndex > 0 && (
                            <button
                                type="button"
                                className="ann-gallery-nav is-prev"
                                onClick={handlePrev}
                                aria-label="이전 이미지"
                            >
                                <ChevronLeft size={20} aria-hidden="true" />
                            </button>
                        )}
                        {currentIndex < imageCount - 1 && (
                            <button
                                type="button"
                                className="ann-gallery-nav is-next"
                                onClick={handleNext}
                                aria-label="다음 이미지"
                            >
                                <ChevronRight size={20} aria-hidden="true" />
                            </button>
                        )}
                        {imageCount > 1 && (
                            <span className="ann-gallery-counter">
                                {currentIndex + 1} / {imageCount}
                            </span>
                        )}
                    </div>

                    {imageCount > 1 && (
                        <ul className="ann-gallery-thumbs">
                            {postDetails.imageUrls.map((url, index) => (
                                <li key={`${url}-${index}`}>
                                    <button
                                        type="button"
                                        className={`ann-gallery-thumb ${index === currentIndex ? 'is-active' : ''}`}
                                        onClick={() => setCurrentIndex(index)}
                                        aria-label={`${index + 1}번째 이미지 보기`}
                                        aria-current={index === currentIndex ? 'true' : undefined}
                                    >
                                        <img src={url} alt="" loading="lazy" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }

        return (
            <img
                src="/images/main/achim_square.jpeg"
                alt="Default"
                className="ann-default-image"
            />
        );
    };

    const renderLightbox = () => {
        if (!isLightboxOpen || imageCount === 0) return null;

        return (
            <div
                className="ann-lightbox"
                role="dialog"
                aria-modal="true"
                aria-label="이미지 크게 보기"
                onClick={() => setIsLightboxOpen(false)}
            >
                <img
                    src={postDetails.imageUrls[currentIndex]}
                    alt={`${currentIndex + 1}`}
                    className="ann-lightbox-image"
                    onClick={(e) => e.stopPropagation()}
                />
                <button
                    type="button"
                    className="ann-lightbox-btn is-close"
                    onClick={() => setIsLightboxOpen(false)}
                    aria-label="닫기"
                    autoFocus
                >
                    <X size={22} aria-hidden="true" />
                </button>
                {currentIndex > 0 && (
                    <button
                        type="button"
                        className="ann-lightbox-btn is-prev"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        aria-label="이전 이미지"
                    >
                        <ChevronLeft size={24} aria-hidden="true" />
                    </button>
                )}
                {currentIndex < imageCount - 1 && (
                    <button
                        type="button"
                        className="ann-lightbox-btn is-next"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        aria-label="다음 이미지"
                    >
                        <ChevronRight size={24} aria-hidden="true" />
                    </button>
                )}
                {imageCount > 1 && (
                    <span className="ann-lightbox-counter">
                        {currentIndex + 1} / {imageCount}
                    </span>
                )}
            </div>
        );
    };

    const renderLikeSection = () => (
        <div className="like-section">
            <button
                onClick={handleLikeToggle}
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
            <span className="like-count">{postDetails.npUserLikeCnt}</span>
        </div>
    );

    useEffect(() => {
        if (id && !didFetch.current) {
            didFetch.current = true;
            fetchPostDetails();
        }
    }, [id, fetchPostDetails]);

    // 라이트박스: Esc 닫기, 방향키 이동, 배경 스크롤 잠금
    useEffect(() => {
        if (!isLightboxOpen) return undefined;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isLightboxOpen, handleNext, handlePrev]);

    if (!postDetails) {
        return (
            <div className="context" aria-busy="true">
                <div className="ann-detail-skeleton">
                    <div className="ann-skeleton-line is-title ui-skeleton" />
                    <div className="ann-skeleton-line is-short ui-skeleton" />
                    <div className="ann-skeleton-block ui-skeleton" />
                </div>
                <span className="ann-visually-hidden">Loading...</span>
            </div>
        );
    }

    return (
        <div className="context">
            <div className="contextTitle ann-detail-title">{postDetails.npTitle}</div>
            <hr className="titleSeparator"/>
            {renderMetadata()}

            <div className="ann-detail-images">
                {renderImageGallery()}
            </div>
            <div className="post-content">{formatContent(postDetails.npContent)}</div>

            {renderLikeSection()}
            <button onClick={handleBackToList} className="back-button">
                <ArrowLeft size={18} aria-hidden="true" />
                목록으로
            </button>
            {renderLightbox()}
        </div>
    );
};

export default AnnouncementDetail;
