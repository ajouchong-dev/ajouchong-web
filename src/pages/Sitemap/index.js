import './styles.css';
import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
    return (
        <div className="context">
            <div className="contextTitle">사이트맵</div>
            <hr className="titleSeparator"/>

            <div className="sitemap">
                <ul className="sitemap-list">
                    <div className="list-container">
                        <Link className="sitemapTitle" to="/introduction">소개</Link>
                        <hr className="listSeparator"/>
                        <ul>
                            <li><Link to="/introduction/about">총학생회 소개</Link></li>
                            <li><Link to="/introduction/promise">공약 소개</Link></li>
                            <li><Link to="/introduction/organization">조직도</Link></li>
                            <li><Link to="/introduction/map">오시는 길</Link></li>
                            <li><Link to="/introduction/sitemap">사이트 맵</Link></li>
                        </ul>
                    </div>
                    {/*<hr className="listSeparator"/>*/}
                    <li className="list-container">
                        <Link className="sitemapTitle" to="/news">소식</Link>
                        <hr className="listSeparator"/>
                        <ul>
                            <li><Link to="/news/announcement">공지사항</Link></li>
                            {/*<li><Link to="/news/planning">학사일정</Link></li>*/}
                        </ul>
                    </li>

                    <li className="list-container">
                        <Link className="sitemapTitle" to="/communication">소통</Link>
                        <hr className="listSeparator"/>
                        <ul>
                            <li><Link to="/communication/qna">Q&A</Link></li>
                            <li><Link to="/communication/require">100인 안건 상정제</Link></li>
                            <li><Link to="/communication/commu">통합 소통 창구</Link></li>
                        </ul>
                    </li>

                    <li className="list-container">
                        <Link className="sitemapTitle" to="/resources">자료실</Link>
                        <hr className="listSeparator"/>
                        <ul>
                            <li><Link to="/resources/bylaws">회칙 및 세칙</Link></li>
                            <li><Link to="/resources/proceeding">회의록</Link></li>
                            <li><Link to="/resources/audit">감사자료</Link></li>
                        </ul>
                    </li>

                    <li className="list-container">
                        <Link className="sitemapTitle" to="/welfare">학생복지</Link>
                        <hr className="listSeparator"/>
                        <ul>
                            <li><Link to="/welfare/promotion">제휴백과</Link></li>
                            <li><Link to="/welfare/rental">대여사업</Link></li>
                        </ul>
                    </li>
                </ul>
            </div>

        </div>

    );
}

export default Sitemap;