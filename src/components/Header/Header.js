import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../../pages/Auth/Login/login';
import './Header.css';
import { Menu, X } from 'lucide-react';

const NAVIGATION_MENUS = {
    introduction: {
        title: '소개',
        path: '/introduction/about',
        items: [
            { label: '총학생회 소개', path: '/introduction/about' },
            { label: '공약 소개', path: '/introduction/promise' },
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
            { label: '통합 소통 창구', path: 'https://forms.gle/V1hH3Gf5uyuC7CVp6', external: true }
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
            { label: '제휴백과', path: '/welfare/promotion' },
            { label: '대여사업', path: '/welfare/rental' }
        ]
    },
    acentia: {
        title: 'ACENTIA',
        path: '/acentia/intro',
        items: [
            { label: 'ACENTIA 소개', path: '/acentia/intro' },
            { label: 'ACENTIA 굿즈', path: '/Acentia/goods' },
            { label: '역대 ACENTIA', path: '/Acentia/record' }
        ]
    }
};

const UPPER_LINKS = [
    { label: '아주대학교', url: 'https://www.ajou.ac.kr/' },
    { label: '아주대 포탈', url: 'https://mportal.ajou.ac.kr/' },
    { label: '아주BB', url: 'https://eclass2.ajou.ac.kr/' }
];

const UPPER_LINKS_RIGHT = [
    { label: '사이트맵', path: '/sitemap' },
    { label: 'profile', path: '/profile' }
];

const Header = () => {
    const [dropdown, setDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { auth } = useAuth();

    useEffect(() => {
        const header = document.querySelector('.header');
        const handleScroll = () => {
            if (window.scrollY > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        if (location.pathname !== '/') {
            header.classList.add('scrolled');
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);

    // 현재 활성 메뉴 확인
    const getActiveMenu = () => {
        const path = location.pathname;
        return Object.keys(NAVIGATION_MENUS).find(menuKey => {
            const menu = NAVIGATION_MENUS[menuKey];
            return menu.items.some(item => item.path === path);
        });
    };

    const activeMenu = getActiveMenu();

    const handleMouseEnter = (menu) => setDropdown(menu);
    const handleMouseLeave = () => setDropdown(null);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleMobileDropdown = (menu) => {
        setDropdown(dropdown === menu ? null : menu);
    };

    const renderDropdownMenu = (menuKey, isMobile = false) => {
        const menu = NAVIGATION_MENUS[menuKey];
        if (!menu) return null;

        return (
            <ul className={isMobile ? "dropdown" : "dropdown-container"}>
                {menu.items.map((item, index) => (
                    <li key={index}>
                        {item.external ? (
                            <a href={item.path} target="_blank" rel="noopener noreferrer">
                                {item.label}
                            </a>
                        ) : (
                            <a href={item.path}>{item.label}</a>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    const renderUpperLinks = (links, isRight = false) => (
        <nav className={isRight ? "upnav-menu2" : "upnav-menu"}>
            <ul className="flex items-center">
                {links.map((link, index) => (
                    <React.Fragment key={index}>
                        <li>
                            {link.url ? (
                                <a href={link.url}>{link.label}</a>
                            ) : (
                                <a href={link.path}>{link.label}</a>
                            )}
                        </li>
                        {index < links.length - 1 && <span className="dot"> • </span>}
                    </React.Fragment>
                ))}
            </ul>
        </nav>
    );

    return (
        <header className="header">
            <div className="upper">
                {renderUpperLinks(UPPER_LINKS)}
                {renderUpperLinks(UPPER_LINKS_RIGHT, true)}
            </div>

            <div className="lower">
                <div className="logo">
                    <a href="/">
                        <img src="/images/logos/achim_header.svg" alt="로고"/>
                    </a>
                </div>

                <nav className="nav-menu">
                    <ul className="flex">
                        {Object.entries(NAVIGATION_MENUS).map(([key, menu]) => (
                            <li 
                                key={key}
                                className="menu-container"
                                onMouseEnter={() => handleMouseEnter(key)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div 
                                    className={`navtitle ${activeMenu === key ? 'active' : ''}`}
                                    onClick={() => window.location.href = menu.path}
                                >
                                    {menu.title}
                                </div>
                                {dropdown === key && renderDropdownMenu(key)}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="hamburger-menu cursor-pointer" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X size={28}/> : <Menu size={28}/>}
                </div>

                <nav className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="list-none">
                        {Object.entries(NAVIGATION_MENUS).map(([key, menu]) => (
                            <li 
                                key={key}
                                onClick={() => toggleMobileDropdown(key)}
                                className={`${dropdown === key ? 'active' : ''} cursor-pointer`}
                            >
                                {menu.title}
                                {dropdown === key && renderDropdownMenu(key, true)}
                            </li>
                        ))}
                    </ul>
                    
                    <nav className="other-menu">
                        <ul className="flex justify-center">
                            {UPPER_LINKS.map((link, index) => (
                                <React.Fragment key={index}>
                                    <li><a href={link.url}>{link.label}</a></li>
                                    {index < UPPER_LINKS.length - 1 && <span className="dot"> • </span>}
                                </React.Fragment>
                            ))}
                        </ul>
                    </nav>
                    <nav className="other-menu2">
                        <ul className="flex justify-center">
                            {UPPER_LINKS_RIGHT.map((link, index) => (
                                <React.Fragment key={index}>
                                    <li><a href={link.path}>{link.label}</a></li>
                                    {index < UPPER_LINKS_RIGHT.length - 1 && <span className="dot"> • </span>}
                                </React.Fragment>
                            ))}
                        </ul>
                    </nav>
                </nav>

                <div className="button">
                    <Login />
                </div>
            </div>
        </header>
    );
};

export default Header;