import "./style.css";
import React from "react";

const acentia = () => {
    return (
        <div className="context">
            <div className="contextTitle">2025 ACENTIA 영상</div>
            <hr className="titleSeparator"/>
            <video className="video-player" controls>
                <source src="/videos/2025_acentia.mp4" type="video/mp4"/>
                해당 브라우저는 비디오를 지원하지 않습니다.
            </video>

        </div>
    );
};

export default acentia;