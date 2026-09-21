import './styles.css';
import React from 'react';
import { Maximize2 } from 'lucide-react';

const CAMPUS_MAP_SRC = '/images/main/campusmap.jpg';

const Campusmap = () => {
    return (
        <div className="context">
            <div className="contextTitle">캠퍼스 맵</div>
            <hr className="titleSeparator"/>
            <figure className="campus-figure">
                {/* 누르면 원본 크기 이미지를 새 탭에서 연다 */}
                <a
                    className="campus-figure__link"
                    href={CAMPUS_MAP_SRC}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        className="campus-figure__image"
                        src={CAMPUS_MAP_SRC}
                        alt="아주대학교 캠퍼스 맵"
                    />
                </a>
                <figcaption className="campus-figure__caption">
                    <Maximize2 size={16} aria-hidden="true" />
                    지도를 누르면 원본 크기로 새 탭에서 열립니다.
                </figcaption>
            </figure>
        </div>
    );
};

export default Campusmap;
