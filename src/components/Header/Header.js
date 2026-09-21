import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Login from '../../pages/Auth/Login/login';
import './Header.css';
import { ChevronDown, ArrowUpRight, UserRound } from 'lucide-react';

const NAVIGATION_MENUS = {
    introduction: {
        title: '소개',
        path: '/introduction/about',
        items: [
            { label: '총학생회 소개', path: '/introduction/about' },
            { label: '조직도', path: '/introduction/organization' },
            { label: '역대 총학생회 소개', path: '/introduction/history' },
            { label: '오시는 길', path: '/introduction/map' },
            { label: '캠퍼스 맵', path: '/introduction/campusmap' }
        ]
    },
    news: {
        title: '소식',
        path: '/news/notice',
        items: [
            { label: '공지사항', path: '/news/notice' }
        ]
    },
    communication: {
        title: '소통',
        path: '/communication/qna',
        items: [
            { label: 'Q&A', path: '/communication/qna' },
            { label: '100인 안건 상정제', path: '/communication/require' },
            { label: '통합 소통 창구', path: 'https://docs.google.com/forms/d/e/1FAIpQLSfAtCkQTXki8tjigTkU_-WeSas8_DuGsiv9kTMno_AQQSBmKA/viewform', external: true }
        ]
    },
    resources: {
        title: '자료실',
        path: '/resources/bylaws',
        items: [
            { label: '세칙 및 회칙', path: '/resources/bylaws' },
            { label: '회의록', path: '/resources/proceeding' },
            { label: '감사자료', path: '/resources/audit' }
        ]
    },
    welfare: {
        title: '학생복지',
        path: '/welfare/promotion',
        items: [
            { label: '제휴강좌', path: '/welfare/promotion' },
            { label: '대여사업', path: '/welfare/rental' }
        ]
    },
    acentia: {
        title: 'ACENTIA',
        path: '/acentia/intro',
        items: [
            { label: 'ACENTIA 소개', path: '/acentia/intro' },
            { label: 'ACENTIA 굿즈', path: '/acentia/goods' },
            { label: '역대 ACENTIA', path: '/acentia/record' }
        ]
    }
};

const MENU_ENTRIES = Object.entries(NAVIGATION_MENUS);

const UPPER_LINKS = [
    { label: '아주대학교', url: 'https://www.ajou.ac.kr/' },
    { label: '아주대 포탈', url: 'https://mportal.ajou.ac.kr/' },
    { label: '아주BB', url: 'https://eclass2.ajou.ac.kr/' }
];

const UPPER_LINKS_RIGHT = [
    { label: 'LinkHub', path: '/linkHub' },
    { label: '사이트맵', path: '/sitemap' },
    { label: 'profile', path: '/profile' }
];

// 상세 페이지(/notice/3 등)에서도 상위 메뉴가 활성으로 보이도록 접두어로도 판정한다
const ACTIVE_PREFIXES = {
    introduction: ['/introduction'],
    news: ['/news', '/notice'],
    communication: ['/communication'],
    resources: ['/resources'],
    welfare: ['/welfare'],
    acentia: ['/acentia']
};

const Header = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileGroup, setMobileGroup] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const closeTimer = useRef(null);
    const location = useLocation();

    const activeMenu = MENU_ENTRIES.find(([key]) =>
        ACTIVE_PREFIXES[key].some((prefix) => location.pathname.startsWith(prefix))
    )?.[0];

    const openMega = useCallback((key) => {
        clearTimeout(closeTimer.current);
        setOpenMenu(key);
    }, []);

    // 마우스가 메뉴와 패널 사이를 지나갈 때 바로 닫히지 않게 약간 늦춘다
    const scheduleCloseMega = useCallback(() => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
    }, []);

    const closeAll = useCallback(() => {
        clearTimeout(closeTimer.current);
        setOpenMenu(null);
        setIsMobileMenuOpen(false);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 4);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        closeAll();
        setMobileGroup(null);
    }, [location.pathname, closeAll]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') closeAll();
        };
        const handleResize = () => {
            if (window.innerWidth > 960) setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
        };
    }, [closeAll]);

    useEffect(() => {
        document.body.classList.toggle('mobile-menu-active', isMobileMenuOpen);
        return () => document.body.classList.remove('mobile-menu-active');
    }, [isMobileMenuOpen]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const renderMenuItem = (item) => (
        item.external ? (
            <a href={item.path} target="_blank" rel="noopener noreferrer" onClick={closeAll}>
                {item.label}
                <ArrowUpRight size={14} aria-hidden="true" />
            </a>
        ) : (
            <Link
                to={item.path}
                className={location.pathname === item.path ? 'is-current' : ''}
                onClick={closeAll}
            >
                {item.label}
            </Link>
        )
    );

    const headerClassName = [
        'site-header',
        isScrolled ? 'is-scrolled' : '',
        openMenu ? 'is-mega-open' : '',
        isMobileMenuOpen ? 'is-mobile-open' : ''
    ].filter(Boolean).join(' ');

    return (
        <header className={headerClassName}>
            <div className="site-header-inner">
                <Link to="/" className="site-logo" aria-label="아주대학교 총학생회 홈">
                    <img src="/images/logos/ajouLogo_header.svg" alt="아주대학교" />
                    <span className="site-logo-label">총학생회</span>
                </Link>

                <nav className="site-nav" aria-label="주 메뉴" onMouseLeave={scheduleCloseMega}>
                    <ul>
                        {MENU_ENTRIES.map(([key, menu]) => (
                            <li key={key} onMouseEnter={() => openMega(key)}>
                                <Link
                                    to={menu.path}
                                    className={[
                                        'site-nav-title',
                                        activeMenu === key ? 'is-active' : '',
                                        openMenu === key ? 'is-open' : ''
                                    ].filter(Boolean).join(' ')}
                                    aria-expanded={openMenu === key}
                                    onFocus={() => openMega(key)}
                                    onClick={closeAll}
                                >
                                    {menu.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="site-actions">
                    <Link to="/linkHub" className="site-action-link">LinkHub</Link>
                    <Link to="/sitemap" className="site-action-link">사이트맵</Link>
                    <Link to="/profile" className="site-action-icon" aria-label="프로필">
                        <UserRound size={18} aria-hidden="true" />
                    </Link>
                    <Login />
                </div>

                <button
                    type="button"
                    className="site-burger"
                    aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="site-mobile-menu"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                >
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* 데스크톱: 전체 메뉴 패널 */}
            <div
                className={`site-mega ${openMenu ? 'is-open' : ''}`}
                onMouseEnter={() => clearTimeout(closeTimer.current)}
                onMouseLeave={scheduleCloseMega}
                aria-hidden={!openMenu}
            >
                <div className="site-mega-inner">
                    {MENU_ENTRIES.map(([key, menu]) => (
                        <div
                            key={key}
                            className={`site-mega-col ${openMenu === key ? 'is-focus' : ''}`}
                            onMouseEnter={() => openMega(key)}
                        >
                            <p className="site-mega-title">{menu.title}</p>
                            <ul>
                                {menu.items.map((item) => (
                                    <li key={item.label}>{renderMenuItem(item)}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="site-mega-foot">
                    <div className="site-mega-foot-inner">
                        <span>바로가기</span>
                        {UPPER_LINKS.map((link) => (
                            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.label}
                                <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* 모바일: 전체 화면 메뉴 */}
            <div
                id="site-mobile-menu"
                className={`site-mobile ${isMobileMenuOpen ? 'is-open' : ''}`}
                aria-hidden={!isMobileMenuOpen}
            >
                <ul className="site-mobile-groups">
                    {MENU_ENTRIES.map(([key, menu]) => {
                        const isOpen = mobileGroup === key;
                        return (
                            <li key={key} className={isOpen ? 'is-open' : ''}>
                                <button
                                    type="button"
                                    className={`site-mobile-title ${activeMenu === key ? 'is-active' : ''}`}
                                    aria-expanded={isOpen}
                                    onClick={() => setMobileGroup(isOpen ? null : key)}
                                >
                                    {menu.title}
                                    <ChevronDown size={20} aria-hidden="true" />
                                </button>
                                <div className="site-mobile-items">
                                    <ul>
                                        {menu.items.map((item) => (
                                            <li key={item.label}>{renderMenuItem(item)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div className="site-mobile-foot">
                    <div className="site-mobile-login">
                        <Login />
                    </div>
                    <div className="site-mobile-links">
                        {UPPER_LINKS_RIGHT.map((link) => (
                            <Link key={link.path} to={link.path} onClick={closeAll}>{link.label}</Link>
                        ))}
                    </div>
                    <div className="site-mobile-links is-external">
                        {UPPER_LINKS.map((link) => (
                            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.label}
                                <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
