import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const POSTS_PER_PAGE = 9;

const Bylaws = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ruleType, setRuleType] = useState('OFFICIAL');
    const navigate = useNavigate();

    const formatPostData = (post) => ({
        id: post.rpostId,
        title: post.rpTitle,
        attachmentUrl: post.attachmentUrl,
    });

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`/api/data?type=${ruleType}`);
            if (response.data.code === 1) {
                const fetchedPosts = response.data.data.map(formatPostData);
                setPosts(fetchedPosts);
                setCurrentPage(1);
            } else {
                console.error('데이터를 불러오는 중 오류 발생:', response.data.message);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    };

    const handleOfficialClick = () => {
        setRuleType('OFFICIAL');
    };

    const handleDetailClick = () => {
        setRuleType('DETAIL');
    };

    const handlePostClick = (postId) => {
        navigate(`/resources/bylaws/${postId}`);
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
        
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

    const renderTableRows = () => {
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

        return currentPosts.map((post, index) => (
            <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                <td>{indexOfFirstPost + index + 1}</td>
                <td>{post.title}</td>
                <td>
                    {post.attachmentUrl ? (
                        <a href={post.attachmentUrl} target="_blank" rel="noopener noreferrer">
                            첨부파일
                        </a>
                    ) : (
                        '없음'
                    )}
                </td>
            </tr>
        ));
    };

    const renderButtonGroup = () => (
        <>
            <button
                className={`bylaw-button ${ruleType === 'DETAIL' ? 'active' : ''}`}
                onClick={handleDetailClick}
            >
                세칙
            </button>
            <button
                className={`bylaw-button ${ruleType === 'OFFICIAL' ? 'active' : ''}`}
                onClick={handleOfficialClick}
            >
                회칙
            </button>
        </>
    );

    const renderPostsList = () => (
        <table className="announcement-table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>첨부파일</th>
                </tr>
            </thead>
            <tbody>
                {renderTableRows()}
            </tbody>
        </table>
    );

    useEffect(() => {
        fetchPosts();
    }, [ruleType]);

    return (
        <div className="context">
            <div className="contextTitle">세칙 및 회칙</div>
            <hr className="titleSeparator"/>

            {renderButtonGroup()}
            {renderPostsList()}

            <div className="pagination">
                {renderPagination()}
            </div>
        </div>
    );
};

export default Bylaws;
