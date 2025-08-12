// src/pages/BylawsDetail.js
import './styles.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BylawsDetail = () => {
    const { id } = useParams(); // URL에서 id를 추출
    const [postDetails, setPostDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`https://www.ajouchong.com/api/data/${id}`);
                if (response.data.code === 1) {
                    setPostDetails(response.data.data);
                } else {
                    console.error('게시글 조회 오류:', response.data.message);
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchPostDetails();
    }, [id]);

    if (!postDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-detail">
            <h2 className="post-title">{postDetails.rpTitle}</h2>
            <hr className="titleSeparator"/>
            <div className="post-metadata">
                <span>작성일 | {new Date(postDetails.rpCreateTime).toLocaleString()}</span>
            </div>
            <p className="post-content">{postDetails.rpContent}</p>

            <div className="post-attachment">
                <strong>첨부파일:</strong>
                {postDetails.attachmentUrl ? (
                    <a href={postDetails.attachmentUrl} target="_blank" rel="noopener noreferrer">첨부파일 다운로드</a>
                ) : (
                    <span>없음</span>
                )}
            </div>

            <button onClick={() => navigate(-1)} className="back-button">목록으로 돌아가기</button>
        </div>
    );
};

export default BylawsDetail;
