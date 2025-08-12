import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const API_BASE_URL = 'https://www.ajouchong.com/api/partnership';
const POSTS_PER_PAGE = 9;

const Promotion = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const formatPostData = (post) => ({
        id: post.psPostId,
        imageUrl: post.imageUrls[0] || '/main/achim_square.jpeg',
        title: post.psTitle,
        date: new Date(post.psCreateTime).toLocaleDateString(),
    });

    const fetchPosts = async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                id: 'your_id',
                password: 'your_password'
            });

            if (response.data.code === 1) {
                const fetchedPosts = response.data.data.map(formatPostData);
                setPosts(fetchedPosts);
                setFilteredPosts(fetchedPosts);
            } else {
                console.error('데이터를 불러오는 중 오류 발생:', response.data.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            setFilteredPosts(posts);
        }
    };

    const handleSearch = () => {
        const matchedPosts = posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(matchedPosts);
        setCurrentPage(1);
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
        <Link to={`/welfare/promotion/${post.id}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="post-box">
                <img src={post.imageUrl} alt={post.title} className="post-image"/>
                <div className="post-title">{post.title}</div>
                <div className="post-date">{post.date}</div>
            </div>
        </Link>
    );

    const renderSearchForm = () => (
        <div className="search-container">
            <input
                type="text"
                placeholder="제목을 입력하여 검색"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
                검색
            </button>
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
                            ? "제휴 내용이 없습니다." 
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
            <div className="contextTitle">제휴백과</div>
            <hr className="titleSeparator"/>

            {renderSearchForm()}
            {renderPostsList()}

            <div className="pagination">
                {renderPagination()}
            </div>
        </div>
    );
};

export default Promotion;
