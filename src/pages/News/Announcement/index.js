import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';
import './styles.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const POSTS_PER_PAGE = 9;
const SKELETON_COUNT = 6;
const pickNoticeId = (post) => post?.nPost_id ?? post?.npost_id ?? post?.id ?? null;

const Announcement = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true); // 표시용: 첫 로딩 동안 스켈레톤

    const formatPostData = (post) => ({
        id: pickNoticeId(post),
        imageUrl: post.imageUrls[0] || '/images/main/achim_square.jpeg',
        title: post.npTitle,
        date: new Date(post.npCreateTime).toLocaleDateString(),
    });

    const fetchPosts = useCallback(async () => {
        try {
            const response = await apiClient.get(`/api/notice`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.code === 1) {
                const fetchedPosts = response.data.data
                    .map(formatPostData)
                    .filter((post) => post.id !== null);
                setPosts(fetchedPosts);
                setFilteredPosts(fetchedPosts);
            } else {
                console.error('Error fetching data:', response.data.message);
            }
        } catch (error) {
            console.error('API request error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSearch = () => {
        if (searchQuery === '') {
            setFilteredPosts(posts);
        } else {
            const matchedPosts = posts.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPosts(matchedPosts);
        }
        setCurrentPage(1);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/images/main/achim_square.jpeg';
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

        return Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                aria-current={currentPage === index + 1 ? 'page' : undefined}
            >
                {index + 1}
            </button>
        ));
    };

    const renderPostCard = (post) => (
        <li className="ann-grid-item" key={post.id}>
            <Link to={`/notice/${post.id}`} className="ann-card">
                <div className="ann-card-thumb">
                    <img
                        src={post.imageUrl}
                        alt={post.title || '공지사항 이미지'}
                        className="ann-card-image"
                        loading="lazy"
                        onError={handleImageError}
                    />
                </div>
                <div className="ann-card-body">
                    <h2 className="ann-card-title">{post.title}</h2>
                    <div className="ann-card-date">{post.date}</div>
                </div>
            </Link>
        </li>
    );

    const renderSkeletonCard = (_, index) => (
        <li className="ann-grid-item" key={`skeleton-${index}`} aria-hidden="true">
            <div className="ann-card is-skeleton">
                <div className="ann-card-thumb ui-skeleton" />
                <div className="ann-card-body">
                    <div className="ann-skeleton-line ui-skeleton" />
                    <div className="ann-skeleton-line is-short ui-skeleton" />
                </div>
            </div>
        </li>
    );

    const renderSearchForm = () => (
        <div className="ann-toolbar">
            <form className="ann-search" role="search" onSubmit={handleSearchSubmit}>
                <div className="ann-search-field">
                    <Search className="ann-search-icon" size={18} aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="제목을 입력하여 검색"
                        aria-label="공지사항 제목 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ui-input ann-search-input"
                    />
                </div>
                <button type="submit" className="ui-btn">검색</button>
            </form>
            {!isLoading && (
                <p className="ann-count">
                    총 <strong>{filteredPosts.length}</strong>건
                </p>
            )}
        </div>
    );

    const renderPostsList = () => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

        if (isLoading) {
            return (
                <ul className="ann-grid" aria-busy="true">
                    {Array.from({ length: SKELETON_COUNT }, renderSkeletonCard)}
                </ul>
            );
        }

        if (currentPosts.length === 0) {
            return (
                <div className="ui-empty">
                    {posts.length === 0
                        ? "아직 등록된 공지가 없습니다."
                        : "일치하는 게시글이 없습니다."
                    }
                </div>
            );
        }

        return (
            <ul className="ann-grid">
                {currentPosts.map(renderPostCard)}
            </ul>
        );
    };

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className="context">
            <div className="contextTitle">공지사항</div>
            <hr className="titleSeparator" />

            {renderSearchForm()}
            {renderPostsList()}

            <nav className="pagination" aria-label="공지사항 페이지">
                {renderPagination()}
            </nav>
        </div>
    );
};

export default Announcement;
