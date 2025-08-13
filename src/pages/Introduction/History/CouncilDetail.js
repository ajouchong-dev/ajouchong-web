import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './detail.css';

const councilData = {
    "2024": {
        title: "2024년 제43대 총학생회 '아우름'",
        ticket: "/images/history/ticket/ticket_aurum.jpg",
        photo: "/images/history/photo/photo_aurum.jpeg",
        organization: "/images/history/organization/organization_aurum.jpg",
    },
};

const CouncilDetail = () => {
    const { year } = useParams();
    const navigate = useNavigate();
    const data = councilData[year];

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/images/main/achim_square.jpeg';
    };

    const handleBackToList = () => {
        navigate('/introduction/history');
    };

    if (!data) {
        return (
            <div className="context">
                <div className="contextTitle">역대 총학생회 상세</div>
                <hr className="titleSeparator" />
                <div className="council-detail-wrapper">
                    <div className="council-card">
                        <h2>정보 없음</h2>
                        <p className="description">해당 연도의 정보가 없습니다.</p>
                        <button onClick={handleBackToList} className="back-button">
                            목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const renderImageBox = (src, alt, label) => (
        <div key={label} className="image-box">
            <img 
                src={src} 
                alt={alt} 
                onError={handleImageError}
                loading="lazy"
                className="council-image"
            />
            <p className="image-label">{label}</p>
        </div>
    );

    const renderImageGallery = () => (
        <div className="image-gallery">
            {renderImageBox(data.ticket, "출사표", "출사표")}
            {renderImageBox(data.photo, "단체사진", "단체사진")}
            {renderImageBox(data.organization, "조직도", "조직도")}
        </div>
    );

    return (
        <div className="context">
            <div className="contextTitle">역대 총학생회 상세</div>
            <hr className="titleSeparator" />
            <div className="council-detail-wrapper">
                <div className="council-card">
                    <h2 className="council-title">{data.title}</h2>
                    {renderImageGallery()}
                    <button onClick={handleBackToList} className="back-button">
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CouncilDetail;
