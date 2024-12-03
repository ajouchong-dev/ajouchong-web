// RequireDetail.js
import './styles.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequireDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false); // Local "liked" state
    const navigate = useNavigate();

    // Check localStorage for like status on initial load
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`https://www.ajouchong.com/api/agora/${id}`);
                if (response.data.code === 1) {
                    const post = response.data.data;
                    setPostDetails(post);
                    setLikeCount(post.apUserLikeCount);

                    // Check if this post was liked by the user
                    const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
                    setLiked(likedPosts[id] || false);
                } else {
                    console.error('게시글 조회 오류:', response.data.message);
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchPostDetails();
    }, [id]);

    const handleLike = async () => {
        if (!liked) {
            const confirmLike = window.confirm("해당 안건에 공감하시겠습니까?");
            if (confirmLike) {
                try {
                    const response = await axios.post(`https://www.ajouchong.com/api/agora/${id}/like`);
                    if (response.data.code === 1) {
                        const newLikeCount = likeCount + 1;
                        const isApproved = newLikeCount >= 100;

                        setLikeCount(newLikeCount);
                        setLiked(true);

                        // Update the postDetails with the new like count and approval status
                        setPostDetails(prevDetails => ({
                            ...prevDetails,
                            apUserLikeCount: newLikeCount,
                            approve: isApproved
                        }));

                        // Save the liked status to localStorage
                        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
                        likedPosts[id] = true;
                        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
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
            <h2>{postDetails.apTitle}</h2>
            <hr className="titleSeparator" />
            <div className="post-metadata">
                <span><strong>작성일 |</strong> {new Date(postDetails.createTime).toLocaleString()}</span>
                <span><strong>수정일 |</strong> {new Date(postDetails.updateTime).toLocaleString()}</span>
                <span><strong>조회수 |</strong> {postDetails.apHitCount}</span>
                <span><strong>좋아요 |</strong> {likeCount}</span>
            </div>
            <p>{postDetails.apContent}</p>

            <div className="comment-section">
                <div className="comment-item">
                    <strong>승인 상태:</strong>
                    <span className={postDetails.approve ? 'approval-approved' : 'approval-denied'}>
                        {postDetails.approve ? '가결' : '부결'}
                    </span>
                </div>
                <div className="comment-item">
                    <strong>답변:</strong> {postDetails.answer || '답변 없음'}
                </div>
            </div>

            {/* Like Section */}
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

export default RequireDetail;
