import React from 'react';
import { useParams } from 'react-router-dom';
import './detail.css';

const councilData = {
    
    "2024": {
        title: "2024년 제43대 총학생회 '아우름'",
        출사표: "/assets/2024/출사표.pdf",
        조직도: "/assets/2024/조직도.png",
        단체사진: "/assets/2024/단체사진.jpg"
    },
    "2023": {
        title: "2023년 제42대 총학생회 '위아'",
        출사표: "/assets/2023/출사표.pdf",
        조직도: "/assets/2023/조직도.png",
        단체사진: "/assets/2023/단체사진.jpg"
    }
};

const CouncilDetail = () => {
    const { year } = useParams();
    const data = councilData[year];

    if (!data) {
        return (
            <div className="council-detail-wrapper">
                <div className="council-card">
                    <h2>정보 없음</h2>
                    <p className="description">해당 연도의 정보가 없습니다.</p>
                </div>
            </div>
        );
    }

    const renderImageBox = (src, alt, label) => (
        <div key={label} className="image-box">
            <img src={src} alt={alt} />
            <p>{label}</p>
        </div>
    );

    return (
        <div className="council-detail-wrapper">
            <div className="council-card">
                <h2>{data.title}</h2>
                <p className="description">
                    {year}년도 총학생회 활동 정보입니다.
                </p>

                <a 
                    href={data.출사표} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="download-link"
                >
                    📄 정책집 다운로드
                </a>

                <div className="image-gallery">
                    {renderImageBox(data.조직도, "조직도", "조직도")}
                    {renderImageBox(data.단체사진, "단체사진", "단체사진")}
                </div>
            </div>
        </div>
    );
};

export default CouncilDetail;
