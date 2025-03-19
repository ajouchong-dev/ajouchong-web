import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const PromotionDetail = () => {
    const { postId } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [isLiking, setIsLiking] = useState(false);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const didFetch = useRef(false);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`https://www.ajouchong.com/api/partnership/${postId}`, {
                    withCredentials: true
                });
                // console.log(response.data.data);

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

        if (postId && !didFetch.current) {
            didFetch.current = true;
            fetchPostDetails();
        }
    }, [postId]);

    const handleLike = async () => {

        const confirmMessage = postDetails.isLiked
            ? "해당 게시글의 공감을 취소 하시겠습니까?"
            : "해당 게시글에 공감하시겠습니까?";

        const confirmLike = window.confirm(confirmMessage);
        if (!confirmLike) return;

        setIsLiking(true);

        try {
            const response = await axios.post(
                `https://www.ajouchong.com/api/partnership/${postId}/like`,
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
                <button onClick={handleLike} className="like-button">
                    <img
                        src={postDetails.isLiked ? "/main/filled-heart.png" : "/main/heart.png"}
                        alt="좋아요"
                        className="like-icon"
                    />
                </button>
                <span className="like-count">{postDetails.psUserLikeCnt}</span>
            </div>
            <button onClick={() => navigate(-1)} className="back-button">목록으로 돌아가기</button>
        </div>
    );
};

export default PromotionDetail;
