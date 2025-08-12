import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const API_BASE_URL = 'https://www.ajouchong.com/api/partnership';

const PromotionDetail = () => {
    const { postId } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [isLiking, setIsLiking] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const didFetch = useRef(false);

    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${postId}`, {
                withCredentials: true
            });

            if (response.data.code === 1) {
                setPostDetails({
                    ...response.data.data,
                    isLiked: response.data.data.likedByCurrentMember
                });
            } else {
                console.error('게시글 조회 오류:', response.data.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    };

    const handleLike = async () => {
        const confirmMessage = postDetails.isLiked
            ? "해당 게시글의 공감을 취소 하시겠습니까?"
            : "해당 게시글에 공감하시겠습니까?";

        const confirmLike = window.confirm(confirmMessage);
        if (!confirmLike) return;

        setIsLiking(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/${postId}/like`,
                {},
                { withCredentials: true }
            );

            if (response.data.code === 1) {
                const { isLiked, likeCount } = response.data.data;

                setPostDetails(prev => ({
                    ...prev,
                    psUserLikeCnt: likeCount,
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
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (postDetails.imageUrls && currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
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
            <span>작성일 | {formatDate(postDetails.psCreateTime)}</span>
            <span>조회수 | {postDetails.psHitCnt}</span>
            <span>좋아요 | {postDetails.psUserLikeCnt}</span>
        </div>
    );

    const renderImageGallery = () => {
        if (postDetails.imageUrls && postDetails.imageUrls.length > 0) {
            return (
                <div className="image-container">
                    {currentIndex > 0 && (
                        <button className="prev-btn" onClick={handlePrev}>
                            &lt;
                        </button>
                    )}
                    <img
                        src={postDetails.imageUrls[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="current-image"
                    />
                    {currentIndex < postDetails.imageUrls.length - 1 && (
                        <button className="next-btn" onClick={handleNext}>
                            &gt;
                        </button>
                    )}
                </div>
            );
        }
        
        return (
            <img src="/main/achim_square.jpeg" alt="Default" className="default-image"/>
        );
    };
    
    const renderLikeSection = () => (
        <div className="like-section">
            <button onClick={handleLike} className="like-button" disabled={isLiking}>
                <img
                    src={postDetails.isLiked ? "/main/filled-heart.png" : "/main/heart.png"}
                    alt="좋아요"
                    className="like-icon"
                />
            </button>
            <span className="like-count">{postDetails.psUserLikeCnt}</span>
        </div>
    );

    useEffect(() => {
        if (postId && !didFetch.current) {
            didFetch.current = true;
            fetchPostDetails();
        }
    }, [postId]);

    if (!postDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-detail">
            <h2>{postDetails.psTitle}</h2>
            <hr className="titleSeparator"/>
            {renderMetadata()}
            <p className="post-content">{postDetails.psContent}</p>

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

export default PromotionDetail;
