import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const POSTS_PER_PAGE = 9;

const Announcement = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const formatPostData = (post) => ({
        id: post.npost_id,
        imageUrl: post.imageUrls[0] || '/images/main/achim_square.jpeg',
        title: post.npTitle,
        date: new Date(post.npCreateTime).toLocaleDateString(),
    });

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`/api/notice`, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.code === 1) {
                const fetchedPosts = response.data.data.map(formatPostData);
                setPosts(fetchedPosts);
                setFilteredPosts(fetchedPosts);
            } else {
                console.error('Error fetching data:', response.data.message);
            }
        } catch (error) {
            console.error('API request error:', error);
        }
    };

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

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/main/achim_square.jpeg';
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        
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

    const renderPostCard = (post) => (
        <div className="post-box" key={post.id}>
            <Link to={`/notice/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                    src={post.imageUrl}
                    alt={post.title || '공지사항 이미지'}
                    className="post-image"
                    onError={handleImageError}
                    style={{ cursor: 'pointer' }}
                />
            </Link>
            <Link to={`/notice/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="post-title" style={{ cursor: 'pointer' }}>
                    {post.title}
                </div>
            </Link>
            <div className="post-date">{post.date}</div>
        </div>
    );

    const renderSearchForm = () => (
        <div className="search-container">
            <input
                type="text"
                placeholder="제목을 입력하여 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">검색</button>
        </div>
    );

    const renderPostsList = () => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

        return (
            <div className="posts-container">
                {currentPosts.length > 0 ? (
                    currentPosts.map(renderPostCard)
                ) : (
                    <div className="no-results">
                        {posts.length === 0 
                            ? "공지사항이 없습니다." 
                            : "일치하는 게시글이 없습니다."
                        }
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="context">
            <div className="contextTitle">공지사항</div>
            <hr className="titleSeparator" />

            {renderSearchForm()}
            {renderPostsList()}

            <div className="pagination">
                {renderPagination()}
            </div>
        </div>
    );
};

export default Announcement;
