// src/pages/Qna.js
import './styles.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QnaDetail from './QnaDetail';

const Qna = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const postsPerPage = 9;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://www.ajouchong.com/api/qna');
                const result = await response.json();

                if (result.code === 1) {
                    const formattedPosts = result.data.map(post => ({
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
                    }));
                    setPosts(formattedPosts);
                    setFilteredPosts(formattedPosts); // 초기에는 전체 게시물 표시
                } else {
                    console.error('데이터를 불러오는 중 오류 발생:', result.message);
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchPosts();
    }, []);

    const maskName = (name) => {
        if (!name) return '';
        if (name.length === 2) return name[0] + '*'; // 두 글자면 첫 글자만 보이게
        if (name.length > 2) return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]; // 첫 글자와 마지막 글자만 남기기
        return name;
    };

    const handleSearch = () => {
        if (searchQuery === '') {
            setFilteredPosts(posts); // 검색어가 없으면 전체 게시물 표시
        } else {
            const matchedPosts = posts.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) // 검색어가 포함된 제목 찾기
            );
            setFilteredPosts(matchedPosts);
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToWritePage = () => {
        navigate('/communication/qna/write'); // 글 작성 페이지로 이동
    };

    const handlePostClick = (postId) => {
        navigate(`/communication/qna/${postId}`);
    };

    const handleBackToList = () => {
        setSelectedPostId(null);
    };

    return (
        <div className="context">
            <div className="contextTitle">Q&A</div>
            <hr className="titleSeparator" />

            {!selectedPostId && (
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
            )}

            {selectedPostId ? (
                <QnaDetail postId={selectedPostId} onBack={handleBackToList} />
            ) : (
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
                        {currentPosts.map((post, index) => (
                            <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                                <td>{index + 1}</td>
                                <td>{post.title}</td>
                                <td>{post.author || '익명'}</td>
                                <td>{post.date}</td>
                                <td>{post.views}</td>
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
                </>
            )}
        </div>
    );
};

export default Qna;
