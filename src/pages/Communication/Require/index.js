import './styles.css';
import React from 'react';
import PostList from '../PostList';

const Require = () => {
    const formatPostData = (post) => ({
        id: post.apostId,
        title: post.apTitle,
        author: post.author,
        date: new Date(post.createTime).toLocaleDateString(),
        status: post.approve ? '가결' : '진행중',
    });

    const renderStatusCell = (post) => (
        <span className={`status ${post.status === '가결' ? 'completed' : 'pending'}`}>
            {post.status}
        </span>
    );

    const tableHeaders = ['번호', '제목', '작성자', '작성일', '상태'];

    return (
        <PostList
            title="100인 안건 상정제"
            apiEndpoint="/api/agora"
            formatPostData={formatPostData}
            writePagePath="/communication/require/write"
            detailPagePath="/communication/require"
            tableHeaders={tableHeaders}
            renderStatusCell={renderStatusCell}
        />
    );
};

export default Require;