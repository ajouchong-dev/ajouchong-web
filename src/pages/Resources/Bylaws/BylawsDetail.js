import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import './styles.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const BylawsDetail = () => {
    const { id } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const navigate = useNavigate();

    const fetchPostDetails = useCallback(async () => {
        try {
            const response = await apiClient.get(`/api/data/${id}`);
            if (response.data.code === 1) {
                setPostDetails(response.data.data);
            } else {
                console.error('게시글 조회 오류:', response.data.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    }, [id]);

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
        <section className="bylaws-attachment" aria-label="첨부파일">
            <span className="bylaws-attachment-icon" aria-hidden="true">
                <FileText size={20} />
            </span>
            <div className="bylaws-attachment-text">
                <strong>첨부파일</strong>
                <span>{postDetails.attachmentUrl ? '새 탭에서 문서를 열거나 내려받습니다.' : '없음'}</span>
            </div>
            {postDetails.attachmentUrl && (
                <a
                    href={postDetails.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-btn is-primary bylaws-attachment-button"
                >
                    <Download size={16} aria-hidden="true" />
                    첨부파일 다운로드
                </a>
            )}
        </section>
    );

    useEffect(() => {
        fetchPostDetails();
    }, [id, fetchPostDetails]);

    if (!postDetails) {
        return (
            <div className="context">
                <p className="loading-text">불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="context">
            <div className="contextTitle">{postDetails.rpTitle}</div>
            <hr className="titleSeparator" />
            {renderMetadata()}
            <div className="post-content">{postDetails.rpContent}</div>
            {renderAttachment()}
            <button type="button" onClick={handleBackToList} className="back-button">
                <ArrowLeft size={16} aria-hidden="true" />
                목록으로 돌아가기
            </button>
        </div>
    );
};

export default BylawsDetail;
