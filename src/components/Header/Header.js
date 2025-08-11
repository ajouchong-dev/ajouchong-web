import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from './Breadcrumb';
import Login from '../Login/login';
import './Header.css';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [dropdown, setDropdown] = useState(null);
    const location = useLocation();
    const { auth } = useAuth();
    const [user, setUser] = useState(auth.user);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState(null);
    const handleToggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

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
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location]);

    const handleMouseEnter = (menu) => setDropdown(menu);
    const handleMouseLeave = () => setDropdown(null);


    const getNavtitle = () => {
        switch (location.pathname) {
            case '/about':
                return '총학생회 소개';
            case '/promise':
                return '공약 소개';
            case '/organization':
                return '조직도';
            case '/map':
                return '오시는 길';
            case '/greeting':
                return '인사말';

            default:
                return '';
        }
    };
    const currentPath = location.pathname;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navtitle = getNavtitle();
    const isMainPage = location.pathname === '/';
    const isIntroductionActive = ['/introduction/about', '/introduction/promise', '/introduction/organization',  '/introduction/history', '/introduction/map','/introduction/campusmap'].includes(location.pathname);
    const isNewsActive = ['/news/announcement',  '/news/planning'].includes(location.pathname);
    const isResourcesActive = ['/resources/bylaws',  '/resources/proceeding','/resources/audit'].includes(location.pathname);
    const isCommunicationActive = ['/communication/qna', '/communication/require'].includes(location.pathname);
    const isWelfareActive = ['/welfare/promotion', '/welfare/rental'].includes(location.pathname);
    const isAcentiaActive = ['/acentia/intro', '/acentia/goods', '/acentia/history'].includes(location.pathname);

    return (
        <div>
            <header className="header">
                <div className="upper">
                    <nav className="upnav-menu">
                        <ul>
                            <li><a href="https://www.ajou.ac.kr/">아주대학교</a></li>
                            <span className="dot"> • </span>
                            <li><a href="https://mportal.ajou.ac.kr/">아주대 포탈</a></li>
                            <span className="dot"> • </span>
                            <li><a href="https://eclass2.ajou.ac.kr/">아주BB</a></li>
                        </ul>
                    </nav>
                    <nav className="upnav-menu2">
                        <ul>
                            <li><a href="/sitemap">사이트맵</a></li>
                            <span className="dot"> • </span>
                            <li><a href="/profile">profile</a></li>
                        </ul>
                    </nav>
                </div>

                <div className="lower">
                    <div className="logo">
                        <a href="/">
                            <img src="/achim_header.svg" alt="로고"/>
                        </a>
                    </div>

                    <nav className="nav-menu">
                        <ul>
                            <li className="menu-container"
                                onMouseEnter={() => handleMouseEnter('introduction')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className={`navtitle ${isIntroductionActive ? 'active' : ''}`}
                                     onClick={() => window.location.href = '/introduction/about'}>소개
                                </div>
                                {dropdown === 'introduction' && (
                                    <ul className="dropdown-container">
                                        <li><a href="/introduction/about">총학생회 소개</a></li>
                                        <li><a href="/introduction/promise">공약 소개</a></li>
                                        <li><a href="/introduction/organization">조직도</a></li>
                                        <li><a href="/introduction/history">역대 총학생회 소개</a></li>
                                        <li><a href="/introduction/map">오시는 길</a></li>
                                        <li><a href="/introduction/campusmap">캠퍼스 맵</a></li>
                                    </ul>
                                )}
                            </li>
                            <li
                                onMouseEnter={() => handleMouseEnter('news')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className={`navtitle ${isNewsActive ? 'active' : ''}`} 
                                     onClick={() => window.location.href = '/news/notice'}>소식</div>
                                {dropdown === 'news' && (
                                    <ul className="dropdown-container">
                                        <li><a href="/news/notice">공지사항</a></li>
                                        {/*<li><a href="/news/planning">학사일정</a></li>*/}
                                    </ul>
                                )}
                            </li>
                            <li
                                onMouseEnter={() => handleMouseEnter('communication')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className={`navtitle ${isCommunicationActive ? 'active' : ''}`}
                                     onClick={() => window.location.href = '/communication/qna'}>소통
                                </div>
                                {dropdown === 'communication' && (
                                    <ul className="dropdown-container">
                                        <li><a href="/communication/qna">Q&A</a></li>
                                        <li><a href="/communication/require">100인 안건 상정제</a></li>
                                        <li><a href="https://forms.gle/V1hH3Gf5uyuC7CVp6" target="_blank"
                                               rel="noopener noreferrer">
                                            통합 소통 창구</a></li>
                                    </ul>
                                )}
                            </li>
                            <li
                                onMouseEnter={() => handleMouseEnter('resources')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className={`navtitle ${isResourcesActive ? 'active' : ''}`}
                                     onClick={() => window.location.href = '/resources/bylaws'}>자료실
                                </div>
                                {dropdown === 'resources' && (
                                    <ul className="dropdown-container">
                                        <li><a href="/resources/bylaws">세칙 및 회칙</a></li>
                                        <li><a href="/resources/proceeding">회의록</a></li>
                                        <li><a href="/resources/audit">감사자료</a></li>
                                    </ul>
                                )}
                            </li>
                            <li
                                onMouseEnter={() => handleMouseEnter('welfare')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className={`navtitle ${isWelfareActive ? 'active' : ''}`}
                                     onClick={() => window.location.href = '/welfare/promotion'}>학생복지
                                </div>
                                {dropdown === 'welfare' && (
                                    <ul className="dropdown-container">
                                        <li><a href="/welfare/promotion">제휴백과</a></li>
                                        <li><a href="/welfare/rental">대여사업</a></li>
                                    </ul>
                                )}
                            </li>
                            <li
                                onMouseEnter={() => handleMouseEnter('acentia')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className={`navtitle ${isAcentiaActive ? 'active' : ''}`}
                                     onClick={() => window.location.href = '/acentia/intro'}>ACENTIA
                                </div>
                                {dropdown === 'acentia' && (
                                    <ul className="dropdown-container">
                                        <li><a href="/acentia/intro">ACENTIA 소개</a></li>
                                        <li><a href="/Acentia/goods">ACENTIA 굿즈</a></li>
                                        <li><a href="/acentia/history">역대 ACENTIA</a></li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </nav>

                    <div className="hamburger-menu" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <X size={28}/> : <Menu size={28}/>}
                    </div>

                    <nav className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                        <ul>
                            <li onClick={() => setDropdown(dropdown === 'introduction' ? null : 'introduction')}
                                className={dropdown === 'introduction' ? 'active' : ''}>
                                소개
                                {dropdown === 'introduction' && (
                                    <ul className="dropdown">
                                        <li><a href="/introduction/about">총학생회 소개</a></li>
                                        <li><a href="/introduction/promise">공약 소개</a></li>
                                        <li><a href="/introduction/organization">조직도</a></li>
                                        <li><a href="/introduction/map">오시는 길</a></li>
                                        <li><a href="/introduction/campusmap">캠퍼스 맵</a></li>
                                    </ul>
                                )}
                            </li>
                            <li onClick={() => setDropdown(dropdown === 'news' ? null : 'news')}
                                className={dropdown === 'news' ? 'active' : ''}>
                                소식
                                {dropdown === 'news' && (
                                    <ul className="dropdown">
                                        <li><a href="/news/notice">공지사항</a></li>
                                    </ul>
                                )}
                            </li>
                            <li onClick={() => setDropdown(dropdown === 'communication' ? null : 'communication')}
                                className={dropdown === 'communication' ? 'active' : ''}>
                                소통
                                {dropdown === 'communication' && (
                                    <ul className="dropdown">
                                        <li><a href="/communication/qna">Q&A</a></li>
                                        <li><a href="/communication/require">100인 안건 상정제</a></li>
                                        <li><a href="https://forms.gle/V1hH3Gf5uyuC7CVp6" target="_blank"
                                               rel="noopener noreferrer">통합 소통 창구</a></li>
                                    </ul>
                                )}
                            </li>
                            <li onClick={() => setDropdown(dropdown === 'resources' ? null : 'resources')}
                                className={dropdown === 'resources' ? 'active' : ''}>
                                자료실
                                {dropdown === 'resources' && (
                                    <ul className="dropdown">
                                        <li><a href="/resources/bylaws">세칙 및 회칙</a></li>
                                        <li><a href="/resources/proceeding">회의록</a></li>
                                        <li><a href="/resources/audit">감사자료</a></li>
                                    </ul>
                                )}
                            </li>
                            <li onClick={() => setDropdown(dropdown === 'welfare' ? null : 'welfare')}
                                className={dropdown === 'welfare' ? 'active' : ''}>
                                학생복지
                                {dropdown === 'welfare' && (
                                    <ul className="dropdown">
                                        <li><a href="/welfare/promotion">제휴백과</a></li>
                                        <li><a href="/welfare/rental">대여사업</a></li>
                                    </ul>
                                )}
                            </li>
                            <li onClick={() => setDropdown(dropdown === 'acentia' ? null : 'acentia')}
                                className={dropdown === 'acentia' ? 'active' : ''}>
                                ACENTIA
                                {dropdown === 'acentia' && (
                                    <ul className="dropdown">
                                        <li><a href="/acentia/intro">ACENTIA 소개</a></li>
                                        <li><a href="/Acentia/goods">ACENTIA 굿즈</a></li>
                                        <li><a href="/acentia/history">역대 ACENTIA</a></li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                        <nav className="other-menu">
                            <ul>
                                <li><a href="https://www.ajou.ac.kr/">아주대학교</a></li>
                                <span className="dot"> • </span>
                                <li><a href="https://mportal.ajou.ac.kr/">아주대 포탈</a></li>
                                <span className="dot"> • </span>
                                <li><a href="https://eclass2.ajou.ac.kr/">아주BB</a></li>
                            </ul>
                        </nav>
                        <nav className="other-menu2">
                            <ul>
                                <li><a href="/sitemap">사이트맵</a></li>
                                <span className="dot"> • </span>
                                <li><a href="/profile">profile</a></li>
                            </ul>
                        </nav>
                    </nav>

                    <div className="button">
                        <Login user={user} setUser={setUser} />
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;