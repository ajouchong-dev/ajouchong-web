import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const BylawsDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const navigate = useNavigate();

    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`/api/data/${id}`);
            if (response.data.code === 1) {
                setPostDetails(response.data.data);
            } else {
                console.error('게시글 조회 오류:', response.data.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
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
            <span>작성일 | {formatDate(postDetails.rpCreateTime)}</span>
        </div>
    );

    const renderAttachment = () => (
        <div className="post-attachment">
            <strong>첨부파일:</strong>
            {postDetails.attachmentUrl ? (
                <a href={postDetails.attachmentUrl} target="_blank" rel="noopener noreferrer">
                    첨부파일 다운로드
                </a>
            ) : (
                <span>없음</span>
            )}
        </div>
    );

    useEffect(() => {
        fetchPostDetails();
    }, [id]);

    if (!postDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="context">
            <div className="contextTitle">{postDetails.rpTitle}</div>
            <hr className="titleSeparator" />
            {renderMetadata()}
            <div className="post-content">{postDetails.rpContent}</div>
            {renderAttachment()}
            <button onClick={handleBackToList} className="back-button">
                목록으로 돌아가기
            </button>
        </div>
    );
};

export default BylawsDetail;
