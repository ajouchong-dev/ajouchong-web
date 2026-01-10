import './styles.css';
import React from 'react';

const PromiseComponent = () => {
    return (
        <div className="context">
            <div className="contextTitle">공약 소개</div>
            <hr className="titleSeparator" />
            {/* <img
                className="promiseImg"
                src='/images/main/promise.png'
                alt="공약 소개"
            /> */}
            <div className="promiseTextBox">
                <div className="promiseText">
                    <p>중앙비상대책위원회 운영으로 공약이 존재하지 않습니다.</p>
                    <a href="/introduction/history" target="_blank" rel="noopener noreferrer">역대 학생회 소개 바로가기</a>
                </div>
            </div>
        </div>
    );
};

export default PromiseComponent;
