// RequireDetail.js
import './styles.css';
import React, {useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequireDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [isLiking, setIsLiking] = useState(false); // Local "liked" state
    const navigate = useNavigate();
    const didFetch = useRef(false);

    // Check localStorage for like status on initial load
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`https://www.ajouchong.com/api/agora/${id}`);
                //console.log(response.data);
                if (response.data.code === 1) {
                    const post = response.data.data;
                    setPostDetails(post);
                } else {
                    console.error('게시글 조회 오류:', response.data.message);
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        if (id && !didFetch.current) {
            didFetch.current = true;
            fetchPostDetails();
        }
    }, [id]);

    const handleLike = async () => {
        if (isLiking) return;

        const isCurrentlyLiked = postDetails.isLiked;
        const confirmMessage = isCurrentlyLiked
            ? "해당 게시글의 공감을 취소 하시겠습니까?"
            : "해당 게시글에 공감하시겠습니까?";

        const confirmLike = window.confirm(confirmMessage);
        if (!confirmLike) return;

        setIsLiking(true);

        try {
            const response = await axios.post(
                `https://www.ajouchong.com/api/agora/${id}/like`,
                {},
                { withCredentials: true }
            );

            console.log(response.data.data);
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

    if (!postDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-detail">
            <h2>{postDetails.apTitle}</h2>
            <hr className="titleSeparator" />
            <div className="post-metadata">
                <span><strong>작성일 |</strong> {new Date(postDetails.createTime).toLocaleString()}</span>
                <span><strong>조회수 |</strong> {postDetails.apHitCount}</span>
                <span><strong>좋아요 |</strong> {postDetails.apUserLikeCount}</span>
            </div>
            <p>{postDetails.apContent}</p>

            <div className="comment-section">
                <div className="comment-item">
                    <strong>승인 상태:</strong>
                    <span className={postDetails.approve ? 'approval-approved' : 'approval-denied'}>
                        {postDetails.approve ? '가결' : '진행중'}
                    </span>
                </div>
                <div className="comment-item">
                    <strong>답변:</strong> {postDetails.answer || '답변 없음'}
                </div>
            </div>

            {/* Like Section */}
            <div className="like-section">
                <button onClick={handleLike} className="like-button" disabled={isLiking}>
                    <img
                        src={postDetails.isLiked ? "/main/filled-heart.png" : "/main/heart.png"}
                        alt="좋아요"
                        className="like-icon"
                    />
                </button>
                <span className="like-count">{postDetails.apUserLikeCount}</span>
            </div>

            <button onClick={() => navigate(-1)} className="back-button">목록으로 돌아가기</button>
        </div>
    );
};

export default RequireDetail;
