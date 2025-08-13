import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const AnnouncementDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [isLiking, setIsLiking] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const didFetch = useRef(false);

    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`/api/notice/${id}`, {
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
    };

    const handleLikeToggle = async () => {
        const confirmMessage = postDetails.isLiked
            ? "해당 게시글의 공감을 취소 하시겠습니까?"
            : "해당 게시글에 공감하시겠습니까?";

        const confirmLike = window.confirm(confirmMessage);
        if (!confirmLike) return;

        setIsLiking(true);

        try {
            const response = await axios.post(
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

    const handleNext = () => {
        if (postDetails.imageUrls && currentIndex < postDetails.imageUrls.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (postDetails.imageUrls && currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
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
            <span>작성일 | {formatDate(postDetails.npCreateTime)}</span>
            <span>조회수 | {postDetails.npHitCnt}</span>
        </div>
    );

    const renderImageGallery = () => {
        if (postDetails.imageUrls && postDetails.imageUrls.length > 0) {
            return (
                <div className="image-container">
                    {currentIndex > 0 && (
                        <button className="prev-btn" onClick={handlePrev}>❮</button>
                    )}
                    <img
                        src={postDetails.imageUrls[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="current-image"
                    />
                    {currentIndex < postDetails.imageUrls.length - 1 && (
                        <button className="next-btn" onClick={handleNext}>❯</button>
                    )}
                </div>
            );
        }
        
        return (
            <img 
                src="/main/achim_square.jpeg" 
                alt="Default" 
                className="default-image"
            />
        );
    };

    const renderLikeSection = () => (
        <div className="like-section">
            <button onClick={handleLikeToggle} className="like-button" disabled={isLiking}>
                <img
                    src={postDetails.isLiked ? "/main/filled-heart.png" : "/main/heart.png"}
                    alt="좋아요"
                    className="like-icon"
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
    }, [id]);

    if (!postDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-detail">
            <h2 className="post-title">{postDetails.npTitle}</h2>
            <hr className="titleSeparator"/>
            {renderMetadata()}
            <p className="post-content">{postDetails.npContent}</p>

            <div className="post-images">
                {renderImageGallery()}
            </div>

            {renderLikeSection()}
            <button onClick={handleBackToList} className="back-button">
                목록으로 돌아가기
            </button>
        </div>
    );
};

export default AnnouncementDetail;
