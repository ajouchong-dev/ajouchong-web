import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PenLine, Search } from 'lucide-react';
import './styles.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const POSTS_PER_PAGE = 9;
const SKELETON_ROWS = 5;

const PostList = ({ 
    title, 
    apiEndpoint, 
    formatPostData, 
    writePagePath, 
    detailPagePath, 
    DetailComponent,
    tableHeaders,
    renderStatusCell,
    maskName = null 
}) => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 표시용: 첫 로딩 동안 스켈레톤
    const navigate = useNavigate();

    const fetchPosts = useCallback(async () => {
        try {
            const response = await apiClient.get(apiEndpoint);
            if (response.data.code === 1) {
                const fetchedPosts = response.data.data.map(formatPostData);
                const sortedPosts = fetchedPosts.sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                );
                setPosts(sortedPosts);
                setFilteredPosts(sortedPosts);
            } else {
                console.error('데이터를 불러오는 중 오류 발생:', response.data.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint, formatPostData]);

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            setFilteredPosts(posts);
        } else {
            const matchedPosts = posts.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPosts(matchedPosts);
        }
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim() === '') {
            setFilteredPosts(posts);
        } else {
            const matchedPosts = posts.filter(post =>
                post.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPosts(matchedPosts);
        }
        setCurrentPage(1);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const goToWritePage = async () => {
        try {
            const response = await apiClient.get(`/api/login/auth/info`, {
                withCredentials: true,
            });

            if (response.data.code === 1 && response.data.data) {
                navigate(writePagePath);
            } else {
                alert('로그인이 필요합니다.');
            }
        } catch (error) {
            alert('로그인이 필요합니다.');
        }
    };

    const handlePostClick = (postId) => {
        navigate(`${detailPagePath}/${postId}`);
    };

    const handleBackToList = () => {
        setSelectedPostId(null);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        
        return Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                aria-current={currentPage === index + 1 ? 'page' : undefined}
            >
                {index + 1}
            </button>
        ));
    };

    // 키보드로도 행을 열 수 있게 한다
    const handleRowKeyDown = (e, postId) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePostClick(postId);
        }
    };

    const renderTableRows = () => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

        return currentPosts.map((post, index) => (
            <tr
                key={post.id}
                className="clickable-row board-row"
                onClick={() => handlePostClick(post.id)}
                onKeyDown={(e) => handleRowKeyDown(e, post.id)}
                tabIndex={0}
            >
                <td className="board-cell is-num">{filteredPosts.length - (indexOfFirstPost + index)}</td>
                <td className="board-cell is-title">
                    <span className="board-title-text">{post.title}</span>
                </td>
                <td className="board-cell is-author">{maskName ? maskName(post.author) : post.author}</td>
                <td className="board-cell is-date">{post.date}</td>
                <td className="board-cell is-status">
                    {renderStatusCell ? renderStatusCell(post) : post.status}
                </td>
            </tr>
        ));
    };

    const renderSkeletonRows = () => (
        Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <tr key={`skeleton-${index}`} className="board-row is-skeleton" aria-hidden="true">
                <td className="board-cell is-num"><span className="board-skeleton is-tiny ui-skeleton" /></td>
                <td className="board-cell is-title"><span className="board-skeleton ui-skeleton" /></td>
                <td className="board-cell is-author"><span className="board-skeleton is-short ui-skeleton" /></td>
                <td className="board-cell is-date"><span className="board-skeleton is-short ui-skeleton" /></td>
                <td className="board-cell is-status"><span className="board-skeleton is-tiny ui-skeleton" /></td>
            </tr>
        ))
    );

    const renderPostList = () => (
        <>
            <div className="board-toolbar">
                <div className="board-search" role="search">
                    <div className="board-search-field">
                        <Search className="board-search-icon" size={18} aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="제목을 입력하여 검색"
                            aria-label={`${title} 제목 검색`}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            className="ui-input board-search-input"
                        />
                    </div>
                    <button type="button" onClick={handleSearch} className="ui-btn">검색</button>
                </div>

                <button type="button" className="ui-btn is-primary board-write-btn" onClick={goToWritePage}>
                    <PenLine size={16} aria-hidden="true" />
                    글 작성
                </button>
            </div>

            {!isLoading && (
                <p className="board-count">
                    총 <strong>{filteredPosts.length}</strong>건
                </p>
            )}

            {!isLoading && filteredPosts.length === 0 ? (
                <div className="ui-empty">
                    {posts.length === 0
                        ? '아직 등록된 글이 없습니다. 첫 글을 작성해 보세요.'
                        : '일치하는 게시글이 없습니다.'}
                </div>
            ) : (
                <div className="table-container">
                    <table className="table board-table" aria-busy={isLoading}>
                        <thead>
                            <tr>
                                {tableHeaders.map((header, index) => (
                                    <th key={index} className={`board-head is-col-${index}`}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? renderSkeletonRows() : renderTableRows()}
                        </tbody>
                    </table>
                </div>
            )}

            <nav className="pagination" aria-label={`${title} 페이지`}>
                {renderPagination()}
            </nav>
        </>
    );

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className="context">
            <div className="contextTitle">{title}</div>
            <hr className="titleSeparator" />

            {selectedPostId && DetailComponent ? (
                <DetailComponent postId={selectedPostId} onBack={handleBackToList} />
            ) : (
                renderPostList()
            )}
        </div>
    );
};

export default PostList; 