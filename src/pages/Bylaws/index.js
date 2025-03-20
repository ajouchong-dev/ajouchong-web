import './styles.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bylaws = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ruleType, setRuleType] = useState('OFFICIAL'); // 초기에는 OFFICIAL로 설정
    const postsPerPage = 9; // 한 페이지당 보여줄 게시물 수
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`https://www.ajouchong.com/api/data?type=${ruleType}`);
                if (response.data.code === 1) {
                    const fetchedPosts = response.data.data.map(post => ({
                        id: post.rpostId,
                        title: post.rpTitle,
                        attachmentUrl: post.attachmentUrl,
                    }));
                    setPosts(fetchedPosts);
                    setCurrentPage(1); // 새로운 데이터를 가져올 때 첫 페이지로 이동
                } else {
                    console.error('데이터를 불러오는 중 오류 발생:', response.data.message);
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchPosts();
    }, [ruleType]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleOfficialClick = () => {
        setRuleType('OFFICIAL');
    };

    const handleDetailClick = () => {
        setRuleType('DETAIL');
    };

    const handlePostClick = (postId) => {
        navigate(`/resources/bylaws/${postId}`); // 상세 페이지로 이동
    };

    return (
        <div className="context">
            <div className="contextTitle">세칙 및 회칙</div>
            <hr className="titleSeparator"/>

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

            <table className="announcement-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>첨부파일</th>
                </tr>
                </thead>
                <tbody>
                {currentPosts.map((post, index) => (
                    <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                        <td>{indexOfFirstPost + index + 1}</td>
                        <td>{post.title}</td>
                        <td>
                            {post.attachmentUrl ? (
                                <a href={post.attachmentUrl} target="_blank" rel="noopener noreferrer">첨부파일</a>
                            ) : (
                                '없음'
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({length: totalPages}, (_, index) => (
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

export default Bylaws;
