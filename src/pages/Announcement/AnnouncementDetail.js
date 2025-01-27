// src/pages/Announcement/AnnouncementDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const AnnouncementDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();

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
                    postDetails.imageUrls.map((url, index) => (
                        <img key={index} src={url} alt={`Image ${index + 1}`} />
                    ))
                ) : (
                    <img src="/main/aurum_square.jpeg" alt="Default" />
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
