import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const Announcement = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("https://www.ajouchong.com/api/notice", {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true, // 쿠키 자동 포함
                });

                if (response.data.code === 1) {
                    const fetchedPosts = response.data.data.map(post => ({
                        id: post.npost_id,
                        imageUrl: post.imageUrls[0] || '/aurum_square.jpeg',
                        title: post.npTitle,
                        date: new Date(post.npCreateTime).toLocaleDateString(),
                    }));
                    setPosts(fetchedPosts);
                    setFilteredPosts(fetchedPosts);
                } else {
                    console.error('Error fetching data:', response.data.message);
                }
            } catch (error) {
                console.error('API request error:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleSearch = () => {
        if (searchQuery === '') {
            setFilteredPosts(posts);
        } else {
            const matchedPosts = posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredPosts(matchedPosts);
        }
    };

    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="context">
            <div className="contextTitle">공지사항</div>
            <hr className="titleSeparator" />

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

            <div className="posts-container">
                {currentPosts.length > 0 ? (
                    currentPosts.map(post => (
                        <div className="post-box" key={post.id}>
                            <Link to={`/notice/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img
                                    src={post.imageUrl}
                                    alt={post.title || '공지사항 이미지'}
                                    className="post-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/main/achim_square.jpeg';
                                    }}
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
                    ))
                ) : (
                    <div className="no-results">일치하는 게시물이 없습니다.</div>
                )}
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Announcement;
