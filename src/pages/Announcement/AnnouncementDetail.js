// src/pages/Announcement/AnnouncementDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AnnouncementDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`https://www.ajouchong.com/api/notice/${id}`);
                if (response.data.code === 1) {
                    setPostDetails(response.data.data);
                    setLikeCount(response.data.data.npUserLikeCnt);

                    const storedLikeStatus = localStorage.getItem(`liked_${id}`);
                    if (storedLikeStatus === 'true') {
                        setLiked(true);
                    }
                } else {
                    console.error('Error fetching post details:', response.data.message);
                }
            } catch (error) {
                console.error('API request error:', error);
            }
        };

        fetchPostDetails();
    }, [id]);

    const handleLike = async () => {
        if (!liked) {
            const confirmLike = window.confirm("해당 게시글에 공감하시겠습니까?");
            if (confirmLike) {
                try {
                    const response = await axios.post(`https://www.ajouchong.com/api/notice/${id}/like`);
                    if (response.data.code === 1) {
                        setLikeCount(prevCount => prevCount + 1); // Increment like count
                        setLiked(true);
                        localStorage.setItem(`liked_${id}`, 'true');
                    } else {
                        console.error("Error liking the post:", response.data.message);
                    }
                } catch (error) {
                    console.error("API request error:", error);
                }
            }
        }
    };

    if (!postDetails) {
        return <div>Loading...</div>;
    }

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

    return (
        <div className="post-detail">
            <h2 className="post-title">{postDetails.npTitle}</h2>
            <hr className="titleSeparator"/>
            <div className="post-metadata">
                <span>작성일 | {new Date(postDetails.npCreateTime).toLocaleString()}</span>
                <span>조회수 | {postDetails.npHitCnt}</span>
            </div>
            <p className="post-content">{postDetails.npContent}</p>

            <div className="post-images">
                {postDetails.imageUrls && postDetails.imageUrls.length > 0 ? (
                    <div className="image-container">
                        {currentIndex > 0 && (
                            <button className="prev-btn" onClick={handlePrev}>
                                ❮
                            </button>
                        )}
                        <img
                            src={postDetails.imageUrls[currentIndex]}
                            alt={`Image ${currentIndex + 1}`}
                            className="current-image"
                        />
                        {currentIndex < postDetails.imageUrls.length - 1 && (
                            <button className="next-btn" onClick={handleNext}>
                                ❯
                            </button>
                        )}
                    </div>
                ) : (
                    <img src="/main/achim_square.jpeg" alt="Default" className="default-image"/>
                )}
            </div>

            <div className="like-section">
                <button onClick={handleLike} className="like-button" disabled={liked}>
                    <img
                        src={liked ? "/main/filled-heart.png" : "/main/heart.png"}
                        alt="좋아요"
                        className="like-icon"
                    />
                </button>
                <span className="like-count">{likeCount}</span>
            </div>

            <button onClick={() => navigate(-1)} className="back-button">목록으로 돌아가기</button>
        </div>
    );
};

export default AnnouncementDetail;
