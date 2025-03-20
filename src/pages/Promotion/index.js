import './styles.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Promotion = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://www.ajouchong.com/api/partnership', {
                    id: 'your_id',
                    password: 'your_password'
                });

                if (response.data.code === 1) {
                    const fetchedPosts = response.data.data.map(post => ({
                        id: post.psPostId,
                        imageUrl: post.imageUrls[0] || '/main/aurum_square.jpeg',
                        title: post.psTitle,
                        date: new Date(post.psCreateTime).toLocaleDateString(),
                    }));
                    setPosts(fetchedPosts);
                    setFilteredPosts(fetchedPosts);
                } else {
                    console.error('데이터를 불러오는 중 오류 발생:', response.data.message);
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchPosts();
    }, []);


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

    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="context">
            <div className="contextTitle">제휴백과</div>
            <hr className="titleSeparator"/>

            {/* ✅ 검색창 추가 */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="제목을 입력하여 검색"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">검색</button>
            </div>

            <div className="posts-container">
                {currentPosts.map(post => (
                    <Link to={`/welfare/promotion/${post.id}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="post-box">
                            <img src={post.imageUrl} alt={post.title} className="post-image"/>
                            <div className="post-title">{post.title}</div>
                            <div className="post-date">{post.date}</div>
                        </div>
                    </Link>
                ))}
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

export default Promotion;
