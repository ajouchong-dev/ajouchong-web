import React from "react";
import "./styles.css";

const Intro = () => {
    return (
        <div className="context">
            <div className="contextTitle">ACENTIA 소개</div>
            <hr className="titleSeparator"/>

            <section className="acentia-info">
                <h2 className="acentia-name">ACENTIA (아센티아)</h2>
                <p className="acentia-description">
                    : 축제의 장에서 터져 나오는 열정과 잠재력을 바탕으로, 더 큰 세상을 향해
                    나아가는 아주인들의 도전과 상승을 의미합니다.
                </p>
                <p className="acentia-description">
                    2025년 대동제 공식 명칭으로 공표하며, 아주대학교의 대표 축제로 자리매김하였습니다.
                </p>
            </section>

            <section className="video-section">
                <h3 className="video-title">2025년도 ACENTIA 공식 영상</h3>
                <div className="video-wrapper">
                    <video className="video-player" controls>
                        <source src="/videos/2025_acentia.mp4" type="video/mp4"/>
                        해당 브라우저는 비디오를 지원하지 않습니다.
                    </video>
                </div>
            </section>
        </div>
    );
};

export default Intro;