import './styles.css';
import React, { useEffect } from 'react';

const Campusmap = (props, context) => {
    return (
        <div className="context">
            <div className="contextTitle">캠퍼스 맵</div>
            <hr className="titleSeparator"/>
            <img
                className="campusImg"
                src='/campusmap_page-0001.jpg'
                alt="ajouchong"
            />
        </div>
    );
}
export default Campusmap;