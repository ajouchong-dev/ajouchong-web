import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const POSTS_PER_PAGE = 9;

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
    const navigate = useNavigate();

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get(apiEndpoint);
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
            const response = await axios.get(`/api/login/auth/info`, {
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
            <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                <td>{filteredPosts.length - (indexOfFirstPost + index)}</td>
                <td>{post.title}</td>
                <td>{maskName ? maskName(post.author) : post.author}</td>
                <td>{post.date}</td>
                <td>
                    {renderStatusCell ? renderStatusCell(post) : post.status}
                </td>
            </tr>
        ));
    };

    const renderPostList = () => (
        <>
            <div className="controls-container">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="제목을 입력하여 검색"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="search-button">검색</button>
                </div>

                <div className="write-container">
                    <button className="write-button" onClick={goToWritePage}>
                        글 작성하기
                    </button>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        {tableHeaders.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
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
    }, [fetchPosts]);

    return (
        <div className="context">
            <div className="contextTitle">{title}</div>
            <hr className="titleSeparator" />

            {selectedPostId && DetailComponent ? (
                <DetailComponent postId={selectedPostId} onBack={handleBackToList} />
            ) : (
                <div className="table-container">
                    {renderPostList()}
                </div>
            )}
        </div>
    );
};

export default PostList; 