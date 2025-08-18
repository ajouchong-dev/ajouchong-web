import './styles.css';
import React from 'react';
import PostList from '../PostList';

const Qna = () => {
    const maskName = (name) => {
        if (!name) return '';
        if (name.length === 2) return name[0] + '*';
        if (name.length > 2) return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
        return name;
    };

    const formatPostData = (post) => ({
        id: post.qpostId,
        title: post.qpTitle,
        author: post.qpAuthor,
        date: new Date(post.qpCreateTime).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),
        status: post.replied ? '답변완료' : '대기중'
    });

    const tableHeaders = ['번호', '제목', '작성자', '작성일', '상태'];

    return (
        <PostList
            title="Q&A"
            apiEndpoint="/api/qna"
            formatPostData={formatPostData}
            writePagePath="/communication/qna/write"
            detailPagePath="/communication/qna"
            tableHeaders={tableHeaders}
            maskName={maskName}
        />
    );
};

export default Qna;
