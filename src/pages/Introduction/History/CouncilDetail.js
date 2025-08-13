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
    "2023": {
        title: "2023년 제42대 총학생회 '위아'",
        ticket: "/images/history/ticket/ticket_wea.png",
        photo: "/images/history/photo/photo_wea.jpeg",
        // organization: "/images/history/organization/organization_wea.jpg",
    },
    "2022": {
        title: "2022년 제41대 총학생회 '담아'",
        ticket: "/images/history/ticket/ticket_dama.jpg",
        photo: "/images/history/photo/photo_dama.jpeg",
        // organization: "/images/history/organization/organization_dama.jpg",
    },
    "2021": {
        title: "2021년 비상대책위원회",
    },
    "2020": {
        title: "2020년 제40대 총학생회 '아워'",
        ticket: "/images/history/ticket/ticket_iour.jpg",
        // photo: "/images/history/photo/photo_iour.jpeg",
        // organization: "/images/history/organization/organization_iour.jpg",
    },
    "2019": {
        title: "2019년 제39대 총학생회 '다움'",
        ticket: "/images/history/ticket/ticket_daum.jpg",
        // photo: "/images/history/photo/photo_daum.jpeg",
        // organization: "/images/history/organization/organization_daum.jpg",
    },
    "2018": {
        title: "2018년 제38대 총학생회 '아이콘'",
        ticket: "/images/history/ticket/ticket_eyecon.jpg",
        // photo: "/images/history/photo/photo_eyecon.jpeg",
        //organization: "/images/history/organization/organization_eyecon.jpg",
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

    const renderImageBox = (src, alt, label) => {
        if (!src) return null;
        
        return (
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
    };

    const renderImageGallery = () => {
        const images = [
            { src: data.ticket, alt: "출사표", label: "출사표" },
            { src: data.photo, alt: "단체사진", label: "단체사진" },
            { src: data.organization, alt: "조직도", label: "조직도" }
        ];

        const validImages = images.filter(img => img.src);

        if (validImages.length === 0) {
            return (
                <div className="no-images">
                    <p>이미지가 없습니다.</p>
                </div>
            );
        }

        return (
            <div className="image-gallery">
                {validImages.map(img => renderImageBox(img.src, img.alt, img.label))}
            </div>
        );
    };

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
