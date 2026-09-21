import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, X, ZoomIn } from 'lucide-react';
import './style.css';

const councilData = {
    "2026": {
        title: "2026년 제45대 총학생회 'AU:SUM' ",
        ticket: "/images/history/ticket/ticket_ausum.jpg",
        photo: "/images/history/photo/photo_ausum.jpg",
        organization: "/images/logos/AUSUM.jpg",
    },
    "2025": {
        title: "2025년 제44대 총학생회 '아침'",
        promise: "https://ajouchong-file.s3.ap-northeast-2.amazonaws.com/promise/promise_achim.pdf",
        ticket: "/images/history/ticket/ticket_achim.jpg",
        photo: "/images/history/photo/photo_achim.jpeg",
        organization: "/images/history/organization/organization_achim.jpg",
    },
    "2024": {
        title: "2024년 제43대 총학생회 '아우름'",
        promise: "https://ajouchong-file.s3.ap-northeast-2.amazonaws.com/promise/promise_aurum.pdf",
        ticket: "/images/history/ticket/ticket_aurum.jpg",
        photo: "/images/history/photo/photo_aurum.jpeg",
        organization: "/images/history/organization/organization_aurum.jpg",
    },
    "2023": {
        title: "2023년 제42대 총학생회 '위아'",
        promise: "https://ajouchong-file.s3.ap-northeast-2.amazonaws.com/promise/promise_wea.pdf",
        ticket: "/images/history/ticket/ticket_wea.png",
        photo: "/images/history/photo/photo_wea.jpeg",
        // organization: "/images/history/organization/organization_wea.jpg",
    },
    "2022": {
        title: "2022년 제41대 총학생회 '담아'",
        promise: "https://ajouchong-file.s3.ap-northeast-2.amazonaws.com/promise/promise_dama.pdf",
        ticket: "/images/history/ticket/ticket_dama.jpg",
        photo: "/images/history/photo/photo_dama.jpeg",
        // organization: "/images/history/organization/organization_dama.jpg",
    },
    "2021": {
        title: "2021년 비상대책위원회",
    },
    "2020": {
        title: "2020년 제40대 총학생회 '아워'",
        promise: "https://ajouchong-file.s3.ap-northeast-2.amazonaws.com/promise/promise_iour.pdf",
        ticket: "/images/history/ticket/ticket_iour.jpg",
        // photo: "/images/history/photo/photo_iour.jpeg",
        // organization: "/images/history/organization/organization_iour.jpg",
    },
    "2019": {
        title: "2019년 제39대 총학생회 '다움'",
        promise: "https://ajouchong-file.s3.ap-northeast-2.amazonaws.com/promise/promise_daum.pdf",
        ticket: "/images/history/ticket/ticket_daum.jpg",
        // photo: "/images/history/photo/photo_daum.jpeg",
        // organization: "/images/history/organization/organization_daum.jpg",
    },
    "2018": {
        title: "2018년 제38대 총학생회 '아이콘'",
        promise: "https://ajouchong-file.s3.ap-northeast-2.amazonaws.com/promise/promise_eyecon.PDF",
        ticket: "/images/history/ticket/ticket_eyecon.jpg",
        // photo: "/images/history/photo/photo_eyecon.jpeg",
        //organization: "/images/history/organization/organization_eyecon.jpg",
    },
};

/** 이미지 크게 보기 (Esc·배경 클릭으로 닫힘) */
const Lightbox = ({ image, onClose, onImageError }) => {
    const closeRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            // 포커스가 뒤 화면으로 빠져나가지 않게 닫기 버튼에 묶어 둔다
            if (e.key === 'Tab') {
                e.preventDefault();
                if (closeRef.current) closeRef.current.focus();
            }
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
        if (closeRef.current) closeRef.current.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return createPortal(
        <div
            className="council-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${image.label} 크게 보기`}
            onClick={onClose}
        >
            <button
                type="button"
                ref={closeRef}
                className="council-lightbox__close"
                aria-label="닫기"
                onClick={onClose}
            >
                <X size={22} aria-hidden="true" />
            </button>
            <img
                className="council-lightbox__image"
                src={image.src}
                alt={image.alt}
                onError={onImageError}
                onClick={(e) => e.stopPropagation()}
            />
        </div>,
        document.body
    );
};

const CouncilDetail = () => {
    const { year } = useParams();
    const navigate = useNavigate();
    const data = councilData[year];
    const [activeImage, setActiveImage] = useState(null);
    const lastTriggerRef = useRef(null);

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/images/main/achim_square.jpeg';
    };

    const handleBackToList = () => {
        navigate('/introduction/history');
    };

    const handlePromiseClick = (promiseUrl) => {
        window.open(promiseUrl, '_blank');
    };

    const openLightbox = (e, img) => {
        lastTriggerRef.current = e.currentTarget;
        // 대체 이미지로 바뀐 경우에도 화면에 보이는 그대로 크게 보여준다
        const shown = e.currentTarget.querySelector('img');
        setActiveImage({ ...img, src: shown ? shown.currentSrc || shown.src : img.src });
    };

    const closeLightbox = useCallback(() => {
        setActiveImage(null);
        if (lastTriggerRef.current) lastTriggerRef.current.focus();
    }, []);

    const renderBackButton = () => (
        <button type="button" onClick={handleBackToList} className="back-button">
            <ArrowLeft size={18} aria-hidden="true" />
            목록으로 돌아가기
        </button>
    );

    if (!data) {
        return (
            <div className="context">
                <div className="contextTitle">역대 총학생회 상세</div>
                <hr className="titleSeparator" />
                <div className="council-detail">
                    <h2 className="council-title">정보 없음</h2>
                    <p className="ui-empty">해당 연도의 정보가 없습니다.</p>
                    {renderBackButton()}
                </div>
            </div>
        );
    }

    const renderImageBox = (img) => {
        if (!img.src) return null;

        return (
            <figure key={img.label} className="council-figure">
                <figcaption className="council-figure__label">{img.label}</figcaption>
                <button
                    type="button"
                    className="council-figure__button"
                    onClick={(e) => openLightbox(e, img)}
                    aria-label={`${img.label} 크게 보기`}
                >
                    <img
                        src={img.src}
                        alt={img.alt}
                        onError={handleImageError}
                        loading="lazy"
                        className="council-figure__image"
                    />
                    <span className="council-figure__zoom" aria-hidden="true">
                        <ZoomIn size={18} />
                    </span>
                </button>
            </figure>
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
            return <p className="ui-empty">이미지가 없습니다.</p>;
        }

        return (
            <div className="council-gallery">
                {validImages.map(renderImageBox)}
            </div>
        );
    };

    const renderPromiseLink = () => {
        if (!data.promise) return null;

        return (
            <button
                type="button"
                onClick={() => handlePromiseClick(data.promise)}
                className="ui-btn council-promise"
            >
                <FileText size={18} aria-hidden="true" />
                정책집 바로가기
            </button>
        );
    };

    return (
        <div className="context">
            <div className="contextTitle">역대 총학생회 상세</div>
            <hr className="titleSeparator" />
            <div className="council-detail">
                <header className="council-header">
                    <div className="council-header__text">
                        <span className="council-year">{year}</span>
                        <h2 className="council-title">{data.title}</h2>
                    </div>
                    {renderPromiseLink()}
                </header>
                {renderImageGallery()}
                {renderBackButton()}
            </div>
            {activeImage && (
                <Lightbox
                    image={activeImage}
                    onClose={closeLightbox}
                    onImageError={handleImageError}
                />
            )}
        </div>
    );
};

export default CouncilDetail;
