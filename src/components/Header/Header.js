import React, {  useState, useEffect }  from 'react';
import './Header.css';
import { useNavigate,useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // AuthContext 가져오기

import Breadcrumb from './Breadcrumb';
import axios from 'axios';

const Header = () => {
    const [dropdown, setDropdown] = useState(null);
    const location = useLocation();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const { auth, logout } = useAuth(); // 로그인 상태와 로그아웃 함수 가져오기



    const [isLoggedIn, setIsLoggedIn] = useState(false);

     const handleGoogleLogin = () => {
        const clientId = '440712020433-ljqa7d2r8drohnblmmfum3cls1et2kuq.apps.googleusercontent.com';
        const redirectUri = 'https://www.ajouchong.com/api/login/oauth/google';

        // Google OAuth URL 생성
        const googleAuthUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(
                'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            )}&` +
            `hd=ajou.ac.kr`;

        if (process.env.NODE_ENV === 'development') {
            console.log("Google OAuth URL:", googleAuthUrl);
        }

        // Google OAuth URL로 리디렉션
        window.location.href = googleAuthUrl;
    };


    const handleLogout = () => {
        logout(); // AuthContext에서 상태 초기화
        localStorage.removeItem('accessToken'); // JWT 토큰 삭제
        alert('로그아웃 되었습니다.');
    };





    const handleMouseEnter = (menu) => {
        setDropdown(menu);
    };

    const handleMouseLeave = () => {
        setDropdown(null);
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

        // Apply the scrolled class if not on the main page
        if (location.pathname !== '/') {
            header.classList.add('scrolled');
        }

        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location]);

    useEffect(() => {
        // Check for token on component load to set initial login status
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    // const handleLogout = async () => {
    //     const confirmLogout = window.confirm('로그아웃 하시겠습니까?');
    //     if (confirmLogout) {
    //         try {
    //             const response = await axios.post('http://ajouchong.com:8080/api/auth/logout');
    //             if (response.data.code === 1) {
    //                 // Successful logout: update state, clear token, redirect to sign-in
    //                 setIsLoggedIn(false);
    //                 localStorage.removeItem('token');
    //                 navigate('/');
    //             } else {
    //                 console.error('Logout error:', response.data.message);
    //             }
    //         } catch (error) {
    //             console.error('Logout request failed:', error);
    //         }
    //     }
    // };


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

    // const isMainPage = currentPath === '/';
    // const isIntroductionActive = ['/about', '/promise', '/organization', '/map'].includes(currentPath);
    // const isNewsActive = ['/announcement', '/planning'].includes(currentPath);
    // const isResourcesActive = ['/bylaws', '/proceeding', '/audit'].includes(currentPath);
    // const isCommunicationActive = ['/qna', '/require'].includes(currentPath);
    // const isWelfareActive = ['/promotion', '/rental'].includes(currentPath);

    const navtitle = getNavtitle();
    const isMainPage = location.pathname === '/';
    const isIntroductionActive = ['/introduction/about', '/introduction/promise', '/introduction/organization', '/introduction/map','/introduction/campusmap'].includes(location.pathname);
    const isNewsActive = ['/news/announcement',  '/news/planning'].includes(location.pathname);
    const isResourcesActive = ['/resources/bylaws',  '/resources/proceeding','/resources/audit'].includes(location.pathname);
    const isCommunicationActive = ['/communication/qna', '/communication/require'].includes(location.pathname);
    const isWelfareActive = ['/welfare/promotion', '/welfare/rental'].includes(location.pathname);

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
                        {auth.isAuthenticated ? ( // 로그인 상태에 따라 조건부 렌더링
                            <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                로그아웃
                            </li>
                        ) : (
                            <li onClick={handleGoogleLogin} style={{ cursor: 'pointer' }}>
                                로그인
                            </li>
                        )}

                    </ul>
                </nav>

            </div>

            <div className="lower">
                <div className="logo">
                    <a href="/">
                        <img src="/aurum_black.png" alt="로고"/>
                    </a>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li className="menu-container"
                            onMouseEnter={() => handleMouseEnter('introduction')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={`navtitle ${isIntroductionActive ? 'active' : ''}`}
                                 href="/introduction">소개
                            </div>
                            {dropdown === 'introduction' && (
                                <ul className="dropdown-container">
                                    <li><a href="/introduction/about">총학생회 소개</a></li>
                                    <li><a href="/introduction/promise">공약 소개</a></li>
                                    <li><a href="/introduction/organization">조직도</a></li>
                                    <li><a href="/introduction/map">오시는 길</a></li>
                                    <li><a href="/introduction/campusmap">캠퍼스 맵</a></li>
                                </ul>
                            )}
                        </li>
                        <li
                            onMouseEnter={() => handleMouseEnter('news')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={`navtitle ${isNewsActive ? 'active' : ''}`} href="/news">소식</div>
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
                                 href="/communication">소통
                            </div>
                            {dropdown === 'communication' && (
                                <ul className="dropdown-container">
                                    <li><a href="/communication/qna">Q&A</a></li>
                                    <li><a href="/communication/require">100인 안건 상정제</a></li>
                                    <li><a href="/communication/commu">통합 소통 창구</a></li>
                                </ul>
                            )}
                        </li>
                        <li
                            onMouseEnter={() => handleMouseEnter('resources')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={`navtitle ${isResourcesActive ? 'active' : ''}`} href="/resources">자료실</div>
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
                                 href="/student-welfare">학생복지
                            </div>
                            {dropdown === 'welfare' && (
                                <ul className="dropdown-container">
                                    <li><a href="/welfare/promotion">제휴백과</a></li>
                                    <li><a href="/welfare/rental">대여사업</a></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
                <div className="button">
                    {auth.isAuthenticated ? (
                        <button onClick={handleLogout} className="auth-button">Logout</button>
                    ) : (
                        <button onClick={handleGoogleLogin} className="auth-button">Login</button>
                    )}
                </div>
            </div>
        </header>
            {/*{!isMainPage && <Breadcrumb />}*/}
            {/*{location.pathname !== '/' && <Breadcrumb navtitle={navtitle} />}*/}
        </div>
    );
}

export default Header;