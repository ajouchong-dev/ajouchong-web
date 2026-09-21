import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Download, FileText } from 'lucide-react';
import '../styles.css';
import './styles.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const POSTS_PER_PAGE = 9;

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ko-KR');
};

const Bylaws = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ruleType, setRuleType] = useState('OFFICIAL');
    const [isLoading, setIsLoading] = useState(true); // 표시용 상태

    const formatPostData = (post) => ({
        id: post.rpostId,
        title: post.rpTitle,
        attachmentUrl: post.attachmentUrl,
        createdAt: post.rpCreateTime,
    });

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/api/data?type=${ruleType}`);
            if (response.data.code === 1) {
                const fetchedPosts = response.data.data.map(formatPostData);
                setPosts(fetchedPosts);
                setCurrentPage(1);
            } else {
                console.error('데이터를 불러오는 중 오류 발생:', response.data.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        } finally {
            setIsLoading(false);
        }
    }, [ruleType]);

    const handleOfficialClick = () => {
        setRuleType('OFFICIAL');
    };

    const handleDetailClick = () => {
        setRuleType('DETAIL');
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

        return Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            >
                {index + 1}
            </button>
        ));
    };

    const renderRows = () => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

        return currentPosts.map((post, index) => {
            const date = formatDate(post.createdAt);
            return (
                <li key={post.id} className="resources-doc">
                    <Link to={`/resources/bylaws/${post.id}`} className="resources-doc-main">
                        <span className="resources-doc-icon" aria-hidden="true">
                            <FileText size={18} />
                        </span>
                        <span className="resources-doc-text">
                            <span className="resources-doc-title">{post.title}</span>
                            <span className="resources-doc-meta">
                                No. {indexOfFirstPost + index + 1}
                                {date && ` · ${date}`}
                            </span>
                        </span>
                    </Link>
                    <div className="resources-doc-actions">
                        {post.attachmentUrl ? (
                            <a
                                href={post.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bylaws-attach"
                                aria-label={`${post.title} 첨부파일`}
                            >
                                <Download size={16} aria-hidden="true" />
                                <span className="bylaws-attach-label">첨부파일</span>
                            </a>
                        ) : (
                            <span className="resources-doc-none">첨부 없음</span>
                        )}
                    </div>
                </li>
            );
        });
    };

    const renderButtonGroup = () => (
        <div className="bylaws-filter" role="group" aria-label="문서 종류">
            <button
                type="button"
                className={`ui-chip ${ruleType === 'DETAIL' ? 'is-active' : ''}`}
                aria-pressed={ruleType === 'DETAIL'}
                onClick={handleDetailClick}
            >
                세칙
            </button>
            <button
                type="button"
                className={`ui-chip ${ruleType === 'OFFICIAL' ? 'is-active' : ''}`}
                aria-pressed={ruleType === 'OFFICIAL'}
                onClick={handleOfficialClick}
            >
                회칙
            </button>
        </div>
    );

    const renderPostsList = () => {
        if (isLoading && posts.length === 0) {
            return <p className="loading-text">불러오는 중...</p>;
        }

        if (posts.length === 0) {
            return (
                <p className="ui-empty">
                    아직 등록된 {ruleType === 'DETAIL' ? '세칙' : '회칙'}이 없습니다.
                </p>
            );
        }

        return <ul className="resources-doc-list" aria-busy={isLoading}>{renderRows()}</ul>;
    };

    useEffect(() => {
        fetchPosts();
    }, [ruleType, fetchPosts]);

    return (
        <div className="context">
            <div className="contextTitle">세칙 및 회칙</div>
            <hr className="titleSeparator" />

            {renderButtonGroup()}
            {renderPostsList()}

            <div className="pagination">
                {renderPagination()}
            </div>
        </div>
    );
};

export default Bylaws;