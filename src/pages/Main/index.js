import React, { useEffect, useState, useCallback } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';

const SLIDER_IMAGES = [
    "/images/banner/main_7.jpg",
    "/images/banner/spring_1.jpeg",
    "/images/banner/spring_2.jpeg",
    "/images/banner/acentia_1.jpeg",
    "/images/banner/acentia_2.jpeg",
    "/images/banner/acentia_3.jpeg",
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
    };

    const formatNoticeData = (notice) => ({
        id: notice.npost_id,
        title: notice.npTitle,
        content: notice.npContent,
        image: notice.imageUrls && notice.imageUrls.length > 0 
            ? notice.imageUrls[0] 
            : '/images/main/achim_square.jpeg',
        date: new Date(notice.npCreateTime).toLocaleDateString(),
    });

    const fetchNotices = useCallback(async () => {
        try {
            const response = await axios.get(`/api/notice`);

            if (response.data.code === 1 && Array.isArray(response.data.data)) {
                const sortedNotices = response.data.data
                    .sort((a, b) => new Date(b.npCreateTime) - new Date(a.npCreateTime))
                    .slice(0, 4);

                const formattedNotices = sortedNotices.map(formatNoticeData);
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
                    <p>아주대학교 제 44대 총학생회 아침</p>
                </div>
                <div className="title2">
                    <p>AJOU UNIV.</p>
                </div>
            </div>
        </div>
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
                    <p>아침 공지사항</p>
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
            {renderNoticesSection()}
        </div>
    );
};

export default Main;
