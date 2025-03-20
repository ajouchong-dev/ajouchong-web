import './styles.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Require = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const postsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://www.ajouchong.com/api/agora');
                if (response.data.code === 1) {
                    const fetchedPosts = response.data.data.map(post => ({
                        id: post.apostId,
                        title: post.apTitle,
                        author: post.author,
                        date: new Date(post.createTime).toLocaleDateString(),
                        status: post.approve ? '가결' : '진행중',
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
    };

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

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleClick = (pageNumber) => setCurrentPage(pageNumber);

    const goToWritePage = async () => {
        try {
            const response = await axios.get("https://www.ajouchong.com/api/login/auth/info", {
                withCredentials: true,
            });

            if (response.data.code === 1 && response.data.data) {
                navigate('/communication/require/write');
            } else {
                alert('로그인이 필요합니다.');
                navigate('/communication/require');
            }

        } catch (error) {
            console.error(error);
            navigate('/');
        }
    };

    return (
        <div className="context">
            <div className="contextTitle">100인 안건 상정제</div>
            <hr className="titleSeparator"/>

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

            <div className="write-container">
                <button className="write-button" onClick={goToWritePage}>
                    글 작성하기
                </button>
            </div>

            <table className="announcement-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>상태</th>
                </tr>
                </thead>
                <tbody>
                {currentPosts.map(post => (
                    <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>
                            <span
                                className="title-link"
                                onClick={() => navigate(`/communication/require/${post.id}`)}
                            >
                                {post.title}
                            </span>
                        </td>
                        <td>{post.author}</td>
                        <td>{post.date}</td>
                        <td>
                            <span className={`status ${post.status === '가결' ? 'approved' : 'rejected'}`}>
                                {post.status}
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handleClick(index + 1)}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Require;
