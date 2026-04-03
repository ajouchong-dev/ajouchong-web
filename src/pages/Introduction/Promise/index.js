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
                    <p>제45대 총학생회 AU:SUM 공약은 현재 임시 반영 상태입니다.</p>
                    <p>정식 공약집과 세부 이행 계획은 추후 업데이트됩니다.</p>
                    <a href="/introduction/history" target="_blank" rel="noopener noreferrer">역대 학생회 소개 바로가기</a>
                </div>
            </div>
        </div>
    );
};

export default PromiseComponent;
