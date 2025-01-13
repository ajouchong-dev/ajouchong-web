import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom';
import './styles.css';

const Main = () => {
    const [notices, setNotices] = useState([]);
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
    };

    // 슬라이더에 표시할 이미지 배열
    const images = [
        "/main/main_10.jpeg",
        "/main/main_9.jpeg",
        // "/main/main_1.jpg",
        // "/main/main_8.JPG",
        "/main/main_7.jpg",
    ];

    // 공지사항 데이터를 API에서 가져오기
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get("https://www.ajouchong.com/api/notice");
                console.log("API Response:", response.data);

                if (response.data.code === 1 && Array.isArray(response.data.data)) {
                    const sortedNotices = response.data.data
                        .sort((a, b) => new Date(b.npCreateTime) - new Date(a.npCreateTime))
                        .slice(0, 4);

                    const formattedNotices = sortedNotices.map(notice => ({
                        id: notice.npost_id,
                        title: notice.npTitle,
                        content: notice.npContent,
                        image: notice.imageUrls && notice.imageUrls.length > 0 ? notice.imageUrls[0] : '/main/aurum_square.jpeg',
                        date: new Date(notice.npCreateTime).toLocaleDateString(),
                    }));

                    setNotices(formattedNotices);
                    console.log("Formatted Notices:", formattedNotices);
                } else {
                    console.error('Error fetching notices:', response.data.message);
                }
            } catch (error) {
                console.error('API request error:', error);
            }
        };

        fetchNotices();
    }, []);

    // useEffect 설정
    useEffect(() => {
        const elements = document.querySelectorAll('.more-link, .division-line, .card-title');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // 애니메이션이 끝난 요소는 관찰 중단
                }
            });
        }, {
            rootMargin: '0px 0px -10% 0px', // 뷰포트의 10% 이전에 감지
            threshold: 0 // 요소가 약간이라도 보이면 감지
        });

        elements.forEach(element => observer.observe(element));

        return () => observer.disconnect();
    }, []);



    // 공지사항 클릭 시 상세 페이지로 이동
    const handleNoticeClick = (id) => {
        navigate(`/notice/${id}`);
    };

    return (
        <div className="root">
            <div className="slider">
                <div className="box">
                    <Slider className="topslider" {...settings}>
                        {images.map((image, index) => (
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

            <div className="card-wrapper">
                <div className="notices-container">
                    <div className="card-title">
                        <p>아침 공지사항</p>
                        <span>다음 카드를 클릭하여 자세한 공지사항을 확인할 수 있습니다.</span>
                        <Link to="/news/notice" className="more-link">more &gt;</Link>

                        <div className="division-line" id="division-line"></div>
                    </div>
                    {notices.length > 0 ? (
                        notices.map((notice, index) => (
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
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/main/achim_square.jpeg';
                                    }}
                                />
                                <h3>{notice.title}</h3>
                                <p>
                                    {notice.content.length > 30
                                        ? `${notice.content.slice(0, 30)}...`
                                        : notice.content}
                                </p>
                                <span>{notice.date}</span>
                            </div>
                        ))
                    ) : (
                        <p>공지사항이 없습니다.</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Main;
