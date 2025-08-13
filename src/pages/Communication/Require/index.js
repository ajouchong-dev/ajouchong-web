import './styles.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const POSTS_PER_PAGE = 9;

const Require = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const formatPostData = (post) => ({
        id: post.apostId,
        title: post.apTitle,
        author: post.author,
        date: new Date(post.createTime).toLocaleDateString(),
        status: post.approve ? '가결' : '진행중',
    });

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`/api/agora`);
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
        }
    };

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

    const goToWritePage = async () => {
        try {
            const response = await axios.get(`/api/login/auth/info`, {
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

    const handlePostClick = (postId) => {
        navigate(`/communication/require/${postId}`);
    };

    const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        
        return Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            >
                {index + 1}
            </button>
        ));
    };

    const renderTableRows = () => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

        return currentPosts.map((post, index) => (
            <tr key={post.id}>
                <td>{filteredPosts.length - (indexOfFirstPost + index)}</td>
                <td>
                    <span
                        className="title-link"
                        onClick={() => handlePostClick(post.id)}
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
        ));
    };

    const renderSearchForm = () => (
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
    );

    const renderPostList = () => (
        <>
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
                    {renderTableRows()}
                </tbody>
            </table>

            <div className="pagination">
                {renderPagination()}
            </div>
        </>
    );

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="context">
            <div className="contextTitle">100인 안건 상정제</div>
            <hr className="titleSeparator"/>

            {renderSearchForm()}
            {renderPostList()}
        </div>
    );
};

export default Require;
