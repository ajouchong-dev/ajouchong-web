import React, { useEffect, useState, useCallback } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, FileText, HeartHandshake, MapPinned, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import './styles.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const pickNoticeId = (notice) => notice?.nPost_id ?? notice?.npost_id ?? notice?.id ?? null;

const SLIDER_IMAGES = [
    "/images/banner/main_7.jpg",
    "/images/banner/spring_1.jpeg",
    "/images/banner/spring_2.jpeg",
    "/images/banner/acentia_1.jpeg",
    "/images/banner/acentia_2.jpeg",
    "/images/banner/acentia_3.jpeg",
];

const QUICK_LINKS = [
    { title: '소개', path: '/introduction/about', icon: MapPinned },
    { title: '소식', path: '/news/notice', icon: Bell },
    { title: '소통', path: '/communication/qna', icon: MessageSquare },
    { title: '자료실', path: '/resources/bylaws', icon: FileText },
    { title: '학생복지', path: '/welfare/promotion', icon: HeartHandshake },
    { title: 'ACENTIA', path: '/acentia/intro', icon: Sparkles },
];

const Main = () => {
    const [notices, setNotices] = useState([]);
    const navigate = useNavigate();

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        pauseOnHover: false,
    };

    const formatNoticeData = (notice) => ({
        id: pickNoticeId(notice),
        title: notice.npTitle,
        content: notice.npContent,
        image: notice.imageUrls && notice.imageUrls.length > 0 
            ? notice.imageUrls[0] 
            : '/images/main/achim_square.jpeg',
        date: new Date(notice.npCreateTime).toLocaleDateString(),
    });

    const fetchNotices = useCallback(async () => {
        try {
            // console.log('API URL:', '/api/notice');
            const response = await apiClient.get('/api/notice');

            if (response.data.code === 1 && Array.isArray(response.data.data)) {
                const sortedNotices = response.data.data
                    .sort((a, b) => new Date(b.npCreateTime) - new Date(a.npCreateTime))
                    .slice(0, 4);

                const formattedNotices = sortedNotices
                    .map(formatNoticeData)
                    .filter((notice) => notice.id !== null);
                setNotices(formattedNotices);
            } else {
                console.error('Error fetching notices:', response.data.message);
            }
        } catch (error) {
            console.error('API request error:', error);
        }
    }, []);

    const handleNoticeClick = (id) => {
        navigate(`/notice/${id}`);
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/images/main/achim_square.jpeg';
    };

    const renderSlider = () => (
        <div className="slider">
            <div className="box">
                <Slider className="topslider" {...sliderSettings}>
                    {SLIDER_IMAGES.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={`Slide ${index}`} />
                        </div>
                    ))}
                </Slider>
                <div className="overlay">
                    <p>아주대학교 제45대 총학생회 AU:SUM </p>
                </div>
                <div className="title2">
                    <p>AJOU UNIV.</p>
                </div>
                <div className="hero-orbit hero-orbit-1"></div>
                <div className="hero-orbit hero-orbit-2"></div>
                <div className="hero-scroll-line"></div>
            </div>
        </div>
    );

    const renderQuickLinks = () => (
        <section className="main-link-section">
            <div className="main-link-grid">
                {QUICK_LINKS.map(({ title, path, icon: Icon }, index) => (
                    <Link
                        key={title}
                        to={path}
                        className="main-link-card"
                        style={{ '--delay': `${index * 70}ms` }}
                    >
                        <span className="main-link-icon">
                            <Icon size={24} strokeWidth={2.2} />
                        </span>
                        <span className="main-link-title">{title}</span>
                        <ArrowRight className="main-link-arrow" size={18} strokeWidth={2.4} />
                    </Link>
                ))}
            </div>
        </section>
    );

    const renderNoticeCard = (notice, index) => (
        <div
            className="notice-card"
            key={index}
            onClick={() => handleNoticeClick(notice.id)}
            style={{ cursor: 'pointer' }}
        >
            <img
                src={notice.image}
                alt={notice.title || '공지사항 이미지'}
                className="notice-image"
                onError={handleImageError}
            />
            <h3>{notice.title}</h3>
            <p>
                {notice.content.length > 30
                    ? `${notice.content.slice(0, 40)}...`
                    : notice.content}
            </p>
            <span>{notice.date}</span>
        </div>
    );

    const renderNoticesSection = () => (
        <div className="card-wrapper">
            <div className="notices-container">
                <div className="card-title">
                    <p>공지사항</p>
                    <span>다음 카드를 클릭하여 자세한 공지사항을 확인할 수 있습니다.</span>
                    <Link to="/news/notice" className="more-link">more &gt;</Link>
                    <div className="division-line" id="division-line"></div>
                </div>
                {notices.length > 0 ? (
                    notices.map(renderNoticeCard)
                ) : (
                    <p>공지사항이 없습니다.</p>
                )}
            </div>
        </div>
    );

    const renderMobileRentalShortcut = () => (
        <section className="mobile-rental-shortcut">
            <div className="mobile-rental-inner">
                <div>
                    <h3>대여사업 바로가기</h3>
                    <p>돗자리, 테이블, 의자 등 대여 가능 물품을 지금 확인해보세요.</p>
                </div>
                <Link to="/welfare/rental" className="mobile-rental-link">지금 보러가기</Link>
            </div>
        </section>
    );

    useEffect(() => {
        const elements = document.querySelectorAll('.more-link, .division-line, .card-title');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -10% 0px',
            threshold: 0
        });

        elements.forEach(element => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    return (
        <div className="root">
            {renderSlider()}
            {renderQuickLinks()}
            {renderMobileRentalShortcut()}
            {renderNoticesSection()}
        </div>
    );
};

export default Main;
