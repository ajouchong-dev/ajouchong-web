// src/pages/PromotionDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const PromotionDetail = () => {
    const { postId } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`https://www.ajouchong.com/api/partnership/${postId}`);
                if (response.data.code === 1) {
                    setPostDetails(response.data.data);
                    setLikeCount(response.data.data.psUserLikeCnt);

                    const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
                    setLiked(!!likedPosts[postId]);
                    // const post = response.data.data;
                    // setPostDetails({
                    //     id: post.psPostId,
                    //     title: post.psTitle,
                    //     content: post.psContent,
                    //     userLikeCount: post.psUserLikeCnt,
                    //     hitCount: post.psHitCnt,
                    //     createTime: new Date(post.psCreateTime).toLocaleString(),
                    //     updateTime: new Date(post.psUpdateTime).toLocaleString(),
                    //     imageUrls: post.imageUrls.length ? post.imageUrls : ['/default-image.jpg']

                } else {
                    console.error('게시글 조회 오류:', response.data.message);
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchPostDetails();
    }, [postId]);

    const handleLike = async () => {
        if (!liked) {
            const userConfirmed = window.confirm('해당 제휴에 공감하시겠습니까?');
            if (userConfirmed) {
                try {
                    const response = await axios.post(`https://www.ajouchong.com/api/partnership/${postId}/like`);
                    if (response.data.code === 1) {
                        setLikeCount(likeCount + 1);
                        setLiked(true);

                        // Save liked state in local storage
                        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
                        likedPosts[postId] = true;
                        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
                    } else {
                        console.error("좋아요 오류:", response.data.message);
                    }
                } catch (error) {
                    console.error("API 요청 오류:", error);
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
            <h2>{postDetails.psTitle}</h2>
            <hr className="titleSeparator"/>
            <div className="post-metadata">
                <span>작성일 | {new Date(postDetails.psCreateTime).toLocaleString()}</span>
                <span>조회수 | {postDetails.psHitCnt}</span>
                <span>좋아요 | {postDetails.psUserLikeCnt}</span>
            </div>
            <p className="post-content">{postDetails.psContent}</p>

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

export default PromotionDetail;
