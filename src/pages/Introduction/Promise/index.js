import './styles.css';
import React from 'react';

const PromiseComponent = () => {
    return (
        <div className="context">
            <div className="contextTitle">공약 소개</div>
            <hr className="titleSeparator" />
            <img
                className="promiseImg"
                src='/images/main/promise.png'
                alt="공약 소개"
            />
        </div>
    );
};

export default PromiseComponent;
