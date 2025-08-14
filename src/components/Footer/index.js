import React from 'react';
import './styles.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    const footerLinks = [
        { label: '이용약관', path: '/policy' },
        { label: '개인정보처리방침', path: '/policy/termsofservice' }
    ];
    
    const developerInfo = {
        name: '소프트웨어학과 오태림(FE) 유수정(BE)',
        email: 'ajouchongdev@gmail.com'
    };
    
    const address = '16399) 경기도 수원시 영통구 월드컵로 206 아주대학교 신학생회관 208호 총학생회실';
    
    const renderFooterLinks = () => (
        <div className="info">
            {footerLinks.map((link, index) => (
                <React.Fragment key={link.path}>
                    <span className="infotext">
                        <a href={link.path}>{link.label}</a>
                    </span>
                    {index < footerLinks.length - 1 && <span className="space">|</span>}
                </React.Fragment>
            ))}
        </div>
    );
    
    const renderDeveloperInfo = () => (
        <span className="developer">
            developer | {developerInfo.name} E-mail:{' '}
            <a href={`mailto:${developerInfo.email}`}>{developerInfo.email}</a>
        </span>
    );
    
    return (
        <footer className="footer">
            <div className="main">
                <div className="mainleft">
                    <div className="main_logo">
                        <span className="title">AJOU UNIV</span>
                        <img src="/images/logos/achim_subLogo.svg" alt="로고" />
                    </div>
                </div>
                <div className="mainright">
                    <div className="column">
                        {renderFooterLinks()}
                    </div>
                    <div className="column">
                        <span className="address">{address}</span>
                        <span className="space"></span>
                        {renderDeveloperInfo()}
                    </div>
                    <div className="column">
                        <p className="copyright">
                            &copy; {currentYear} Ajou University Council. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;