import './styles.css';
import React from 'react';

const Campusmap = () => {
    return (
        <div className="context">
            <div className="contextTitle">캠퍼스 맵</div>
            <hr className="titleSeparator"/>
            <img
                className="campusImg"
                src='/images/main/campusmap.jpg'
                alt="아주대학교 캠퍼스 맵"
            />
        </div>
    );
};

export default Campusmap;