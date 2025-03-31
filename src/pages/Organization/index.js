import './styles.css';
import React, { useEffect } from 'react';

const Organization = (props, context) => {
    return (
        <div className="context">
            <div className="contextTitle">조직도</div>
            <hr className="titleSeparator"/>
            <img
                className="organizationImg"
                src="/main/organization.png"
                alt="ajouchong"
            />
        </div>
    );
}
export default Organization;