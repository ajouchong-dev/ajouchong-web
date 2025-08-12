import './styles.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QnaDetail from './QnaDetail';
import axios from "axios";

const API_BASE_URL = 'https://www.ajouchong.com/api';
const POSTS_PER_PAGE = 9;

const Qna = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const navigate = useNavigate();

    const maskName = (name) => {
        if (!name) return '';
        if (name.length === 2) return name[0] + '*';
        if (name.length > 2) return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
        return name;
    };

    const formatPostData = (post) => ({
        id: post.qpostId,
        title: post.qpTitle,
        author: maskName(post.qpAuthor),
        date: new Date(post.qpCreateTime).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),
        views: post.replied ? '답변완료' : '대기중'
    });

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/qna`);
            const result = await response.json();

            if (result.code === 1) {
                const formattedPosts = result.data.map(formatPostData);
                setPosts(formattedPosts);
                setFilteredPosts(formattedPosts);
            } else {
                console.error('데이터를 불러오는 중 오류 발생:', result.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
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
    };

    const goToWritePage = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/login/auth/info`, {
                withCredentials: true,
            });

            if (response.data.code === 1 && response.data.data) {
                navigate('/communication/qna/write');
            } else {
                alert('로그인이 필요합니다.');
                navigate('/communication/qna');
            }
        } catch (error) {
            alert('로그인이 필요합니다.');
            navigate('/communication/qna');
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/communication/qna/${postId}`);
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
            >
                {index + 1}
            </button>
        ));
    };

    const renderTableRows = () => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

        return currentPosts.map((post) => (
            <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.author || '익명'}</td>
                <td>{post.date}</td>
                <td>{post.views}</td>
            </tr>
        ));
    };

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
                        <th>날짜</th>
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
            <div className="contextTitle">Q&A</div>
            <hr className="titleSeparator" />

            {!selectedPostId && renderSearchForm()}

            {selectedPostId ? (
                <QnaDetail postId={selectedPostId} onBack={handleBackToList} />
            ) : (
                renderPostList()
            )}
        </div>
    );
};

export default Qna;
