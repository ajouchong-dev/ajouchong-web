import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './styles.css';

const FOOTER_LINKS = [
    { label: '이용약관', path: '/policy' },
    { label: '개인정보처리방침', path: '/policy/termsofservice' },
    { label: '사이트맵', path: '/sitemap' },
    { label: 'LinkHub', path: '/linkHub' }
];

const EXTERNAL_LINKS = [
    { label: '아주대학교', url: 'https://www.ajou.ac.kr/' },
    { label: '아주대 포탈', url: 'https://mportal.ajou.ac.kr/' },
    { label: '아주BB', url: 'https://eclass2.ajou.ac.kr/' }
];

const DEVELOPER = {
    name: '디지털미디어학과 정재훈(Full-Stack)',
    email: 'ajouchongdev@gmail.com'
};

const ADDRESS = '16399) 경기도 수원시 영통구 월드컵로 206 아주대학교 신학생회관 208호 총학생회실';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <p className="footer-wordmark">AU:SUM</p>
                    <p className="footer-tagline">아주대학교 제45대 총학생회</p>
                </div>

                <nav className="footer-nav" aria-label="하단 메뉴">
                    <ul>
                        {FOOTER_LINKS.map((link) => (
                            <li key={link.path}>
                                <Link to={link.path}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                    <ul>
                        {EXTERNAL_LINKS.map((link) => (
                            <li key={link.url}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.label}
                                    <ArrowUpRight size={13} aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="footer-meta">
                    <p className="address">{ADDRESS}</p>
                    <p className="developer">
                        developer | {DEVELOPER.name} · E-mail{' '}
                        <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a>
                    </p>
                    <p className="copyright">
                        &copy; {currentYear} Ajou University Council. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
