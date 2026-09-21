import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    Bell, FileText, HeartHandshake, MapPinned, MessageSquare, Sparkles,
    ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import './styles.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const pickNoticeId = (notice) => notice?.nPost_id ?? notice?.npost_id ?? notice?.id ?? null;

// 원본(장당 10MB 이상)을 1920px로 줄인 사본. 원본은 /images/banner 에 그대로 있다.
const SLIDER_IMAGES = [
    "/images/banner/web/main_7.jpg",
    "/images/banner/web/spring_1.jpg",
    "/images/banner/web/spring_2.jpg",
    "/images/banner/web/acentia_1.jpg",
    "/images/banner/web/acentia_2.jpg",
    "/images/banner/web/acentia_3.jpg",
];

const SLIDE_INTERVAL = 7000;
const NOTICE_FALLBACK_IMAGE = '/images/main/achim_square.jpeg';
const AGENDA_GOAL = 100;

const QUICK_LINKS = [
    { title: '소개', desc: '총학생회와 조직도, 오시는 길', path: '/introduction/about', icon: MapPinned },
    { title: '소식', desc: '총학생회 공지사항', path: '/news/notice', icon: Bell },
    { title: '소통', desc: 'Q&A와 100인 안건 상정제', path: '/communication/qna', icon: MessageSquare },
    { title: '자료실', desc: '회칙, 회의록, 감사자료', path: '/resources/bylaws', icon: FileText },
    { title: '학생복지', desc: '제휴 혜택과 물품 대여', path: '/welfare/promotion', icon: HeartHandshake },
    { title: 'ACENTIA', desc: '아주대학교 대동제', path: '/acentia/intro', icon: Sparkles },
];

// 숫자가 0에서 목표값까지 올라가는 표시
const CountUp = ({ value }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !value) {
            setDisplay(value || 0);
            return undefined;
        }

        let frame;
        const start = performance.now();
        const duration = 700;
        const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [value]);

    return <>{display}</>;
};

const Main = () => {
    const [notices, setNotices] = useState([]);
    const [noticesLoaded, setNoticesLoaded] = useState(false);
    const [rentalItems, setRentalItems] = useState(null);
    const [agendas, setAgendas] = useState(null);
    const [slide, setSlide] = useState(0);
    const [isSliderPaused, setIsSliderPaused] = useState(false);
    const heroRef = useRef(null);
    const touchStartX = useRef(null);
    const navigate = useNavigate();

    const formatNoticeData = (notice) => ({
        id: pickNoticeId(notice),
        title: notice.npTitle,
        content: notice.npContent,
        image: notice.imageUrls && notice.imageUrls.length > 0
            ? notice.imageUrls[0]
            : NOTICE_FALLBACK_IMAGE,
        date: new Date(notice.npCreateTime).toLocaleDateString(),
    });

    const fetchNotices = useCallback(async () => {
        try {
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
        } finally {
            setNoticesLoaded(true);
        }
    }, []);

    // "지금 총학" 현황용. 실패하면 해당 칸은 숫자 없이 안내 문구만 보여준다.
    const fetchLiveStatus = useCallback(async () => {
        const [rentalResult, agendaResult] = await Promise.allSettled([
            apiClient.get('/api/rental/items'),
            apiClient.get('/api/agora'),
        ]);

        if (rentalResult.status === 'fulfilled' && Array.isArray(rentalResult.value.data?.data)) {
            setRentalItems(rentalResult.value.data.data);
        }
        if (agendaResult.status === 'fulfilled' && Array.isArray(agendaResult.value.data?.data)) {
            setAgendas(agendaResult.value.data.data);
        }
    }, []);

    useEffect(() => {
        fetchNotices();
        fetchLiveStatus();
    }, [fetchNotices, fetchLiveStatus]);

    const goToSlide = useCallback((index) => {
        setSlide((index + SLIDER_IMAGES.length) % SLIDER_IMAGES.length);
    }, []);

    useEffect(() => {
        if (isSliderPaused) return undefined;
        const timer = setInterval(() => {
            if (!document.hidden) setSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
        }, SLIDE_INTERVAL);
        return () => clearInterval(timer);
    }, [isSliderPaused, slide]);

    // 워드마크 그라데이션이 포인터를 따라 천천히 움직인다
    const handleHeroPointerMove = (event) => {
        const hero = heroRef.current;
        if (!hero || event.pointerType === 'touch') return;
        const rect = hero.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
        hero.style.setProperty('--sheen', `${Math.round(ratio * 100)}%`);
    };

    const handleTouchStart = (event) => {
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event) => {
        if (touchStartX.current === null) return;
        const deltaX = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(deltaX) > 40) goToSlide(slide + (deltaX < 0 ? 1 : -1));
        touchStartX.current = null;
    };

    const handleNoticeClick = (id) => {
        navigate(`/notice/${id}`);
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = NOTICE_FALLBACK_IMAGE;
    };

    const rentalSummary = useMemo(() => {
        if (!rentalItems) return null;
        const total = rentalItems.length;
        const available = rentalItems.filter((item) => item.currentQuantity > 0).length;
        return { total, available, percent: total ? Math.round((available / total) * 100) : 0 };
    }, [rentalItems]);

    const agendaSummary = useMemo(() => {
        if (!agendas) return null;
        const ongoing = agendas
            .filter((agenda) => !agenda.approve)
            .sort((a, b) => (b.apUserLikeCount || 0) - (a.apUserLikeCount || 0));
        const top = ongoing[0] || null;
        const likes = top?.apUserLikeCount;
        return {
            ongoingCount: ongoing.length,
            top,
            likes: typeof likes === 'number' ? likes : null,
        };
    }, [agendas]);

    const latestNotice = notices[0] || null;

    const renderHero = () => (
        <section
            className="home-hero"
            ref={heroRef}
            onPointerMove={handleHeroPointerMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* 화면 폭을 꽉 채우는 사진 */}
            <div className="home-hero-photos" aria-hidden="true">
                {SLIDER_IMAGES.map((image, index) => (
                    <img
                        key={image}
                        src={image}
                        alt=""
                        className={index === slide ? 'is-active' : ''}
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />
                ))}
            </div>

            <div className="home-hero-inner">
                <div className="home-hero-copy">
                    <p className="home-eyebrow">아주대학교 제45대 총학생회</p>
                    <h1 className="home-wordmark" aria-label="AU:SUM">
                        <span aria-hidden="true">AU</span>
                        <span className="home-wordmark-colon" aria-hidden="true">:</span>
                        <span aria-hidden="true">SUM</span>
                    </h1>
                    <p className="home-slogan">
                        우리의 목소리를 더해,<br />
                        찬란한 아주의 내일로
                    </p>
                    <div className="home-hero-actions">
                        <Link to="/news/notice" className="ui-btn home-hero-btn is-solid">
                            공지사항 보기
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <Link to="/welfare/rental" className="ui-btn home-hero-btn">물품 대여하기</Link>
                    </div>
                </div>

                <div
                    className="home-slider-bar"
                    role="group"
                    aria-label="캠퍼스 사진 넘기기"
                    onMouseEnter={() => setIsSliderPaused(true)}
                    onMouseLeave={() => setIsSliderPaused(false)}
                    onFocus={() => setIsSliderPaused(true)}
                    onBlur={() => setIsSliderPaused(false)}
                >
                    <span className="home-slider-count">
                        <strong>{String(slide + 1).padStart(2, '0')}</strong>
                        <span> / {String(SLIDER_IMAGES.length).padStart(2, '0')}</span>
                    </span>
                    <div className="home-slider-progress" aria-hidden="true">
                        <span
                            key={`${slide}-${isSliderPaused}`}
                            className={isSliderPaused ? 'is-paused' : ''}
                            style={{ animationDuration: `${SLIDE_INTERVAL}ms` }}
                        />
                    </div>
                    <button type="button" aria-label="이전 사진" onClick={() => goToSlide(slide - 1)}>
                        <ChevronLeft size={18} aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="다음 사진" onClick={() => goToSlide(slide + 1)}>
                        <ChevronRight size={18} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </section>
    );

    const renderLiveStatus = () => (
        <section className="home-live" aria-label="지금 총학">
            <div className="home-inner">
                <div className="home-live-head">
                    <span className="home-live-dot" aria-hidden="true"></span>
                    지금 총학
                </div>

                <div className="home-live-grid">
                    <Link
                        to={latestNotice ? `/notice/${latestNotice.id}` : '/news/notice'}
                        className="home-live-tile"
                    >
                        <span className="home-live-label">최근 공지</span>
                        {latestNotice ? (
                            <>
                                <strong className="home-live-text">{latestNotice.title}</strong>
                                <span className="home-live-sub">{latestNotice.date}</span>
                            </>
                        ) : (
                            <strong className="home-live-text is-muted">
                                {noticesLoaded ? '등록된 공지가 없습니다.' : '불러오는 중'}
                            </strong>
                        )}
                        <ArrowUpRight className="home-live-arrow" size={18} aria-hidden="true" />
                    </Link>

                    <Link to="/welfare/rental" className="home-live-tile">
                        <span className="home-live-label">대여 가능 물품</span>
                        {rentalSummary ? (
                            <>
                                <strong className="home-live-number">
                                    <CountUp value={rentalSummary.available} />
                                    <small> / {rentalSummary.total}종</small>
                                </strong>
                                <div className="ui-meter" style={{ '--value': `${rentalSummary.percent}%` }}>
                                    <span></span>
                                </div>
                            </>
                        ) : (
                            <strong className="home-live-text is-muted">돗자리, 테이블, 의자 등 대여 물품 확인하기</strong>
                        )}
                        <ArrowUpRight className="home-live-arrow" size={18} aria-hidden="true" />
                    </Link>

                    {agendaSummary?.top ? (
                        <Link to={`/communication/require/${agendaSummary.top.apostId}`} className="home-live-tile">
                            <span className="home-live-label">100인 안건 상정제</span>
                            <strong className="home-live-text">{agendaSummary.top.apTitle}</strong>
                            {agendaSummary.likes !== null ? (
                                <>
                                    <span className="home-live-sub">
                                        {agendaSummary.likes} / {AGENDA_GOAL}명 동의 · 진행 중 {agendaSummary.ongoingCount}건
                                    </span>
                                    <div
                                        className="ui-meter"
                                        style={{ '--value': `${Math.min(100, (agendaSummary.likes / AGENDA_GOAL) * 100)}%` }}
                                    >
                                        <span></span>
                                    </div>
                                </>
                            ) : (
                                <span className="home-live-sub">진행 중 {agendaSummary.ongoingCount}건</span>
                            )}
                            <ArrowUpRight className="home-live-arrow" size={18} aria-hidden="true" />
                        </Link>
                    ) : (
                        // 진행 중인 안건이 없을 때는 빈 칸 대신 Q&A 안내를 보여준다
                        <Link to="/communication/qna" className="home-live-tile">
                            <span className="home-live-label">Q&amp;A</span>
                            <strong className="home-live-text">궁금한 점을 남기면 총학생회가 답변합니다.</strong>
                            <span className="home-live-sub">질문 남기러 가기</span>
                            <ArrowUpRight className="home-live-arrow" size={18} aria-hidden="true" />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );

    const renderNoticeCard = (notice) => (
        <article
            className="notice-card"
            key={notice.id}
            role="link"
            tabIndex={0}
            onClick={() => handleNoticeClick(notice.id)}
            onKeyDown={(event) => {
                if (event.key === 'Enter') handleNoticeClick(notice.id);
            }}
        >
            <div className="notice-card-media">
                <img
                    src={notice.image}
                    alt=""
                    className="notice-image"
                    loading="lazy"
                    onError={handleImageError}
                />
            </div>
            <span className="notice-card-date">{notice.date}</span>
            <h3>{notice.title}</h3>
            <p>{notice.content}</p>
        </article>
    );

    const renderNoticesSection = () => (
        <section className="home-section home-inner">
            <div className="home-section-head">
                <div>
                    <h2>공지사항</h2>
                    <p>카드를 누르면 자세한 내용을 볼 수 있습니다.</p>
                </div>
                <Link to="/news/notice" className="home-more">
                    전체 보기
                    <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </div>

            {!noticesLoaded ? (
                <div className="notices-container" aria-hidden="true">
                    {[0, 1, 2, 3].map((index) => (
                        <div className="notice-card is-skeleton" key={index}>
                            <div className="notice-card-media ui-skeleton"></div>
                            <div className="ui-skeleton" style={{ height: 14, width: '40%' }}></div>
                            <div className="ui-skeleton" style={{ height: 20, width: '90%' }}></div>
                        </div>
                    ))}
                </div>
            ) : notices.length > 0 ? (
                <div className="notices-container">
                    {notices.map(renderNoticeCard)}
                </div>
            ) : (
                <p className="ui-empty">공지사항이 없습니다.</p>
            )}
        </section>
    );

    const renderQuickLinks = () => (
        <section className="home-band">
            <div className="home-inner">
                <div className="home-section-head">
                    <div>
                        <h2>바로가기</h2>
                    </div>
                </div>
                <div className="main-link-grid">
                    {QUICK_LINKS.map(({ title, desc, path, icon: Icon }) => (
                        <Link key={title} to={path} className="main-link-card">
                            <span className="main-link-icon">
                                <Icon size={20} strokeWidth={2} aria-hidden="true" />
                            </span>
                            <span className="main-link-body">
                                <span className="main-link-title">{title}</span>
                                <span className="main-link-desc">{desc}</span>
                            </span>
                            <ArrowRight className="main-link-arrow" size={18} aria-hidden="true" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );

    return (
        <div className="home">
            {renderHero()}
            {renderLiveStatus()}
            {renderNoticesSection()}
            {renderQuickLinks()}
        </div>
    );
};

export default Main;
