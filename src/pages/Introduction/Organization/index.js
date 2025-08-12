import './styles.css';
import React from 'react';

const Organization = () => {
    return (
        <div className="context">
            <div className="contextTitle">조직도</div>
            <hr className="titleSeparator"/>
            <img
                className="organizationImg"
                src="/main/organization.png"
                alt="아주대학교 총학생회 조직도"
            />
        </div>
    );
};

export default Organization;