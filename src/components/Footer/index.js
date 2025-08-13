import React from 'react';
import  './styles.css';
const Footer = (props) => (
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
                    <div className="info">
                        <span className="infotext">
                        <a href="/policy">이용약관</a>
                        </span>
                        <span className="space">|</span>
                        <span className="infotext">
                        <a href="/policy/termsofservice">개인정보처리방침</a>
                        </span>
                        <span className="space"></span>
                    </div>
                </div>
                <div className="column">
                    <span className="address">
                    16399) 경기도 수원시 영통구 월드컵로 206 아주대학교 신학생회관 208호
                    총학생회실
                    </span>
                    <span className="space"></span>
                    <span className="developer"> developer | 소프트웨어학과 오태림(FE) 유수정(BE) E-mail: <a href="mailto:ajouchongdev@gmail.com">ajouchongdev@gmail.com</a></span>
                </div>
                <div className="column">
                    <p className="copyright">&copy; {new Date().getFullYear()} Ajou University Council. All Rights Reserved.</p>
                </div>
            </div>

        </div>
    </footer>
);

export default Footer;