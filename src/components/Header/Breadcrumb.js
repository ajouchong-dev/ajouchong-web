import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

const BREADCRUMB_LABELS = {
    introduction: '소개',
    about: '총학생회 소개',
    promise: '공약 소개',
    organization: '조직도',
    greeting: '인사말',
    map: '오시는 길',
    notice: '공지사항',
    planning: '학사일정',
    news: '소식',
    sitemap: '사이트맵',
    communication: '소통',
    qna: 'Q&A',
    write: '글 작성',
    require: '100인 안건 상정제',
    resources: '자료실',
    bylaws: '세칙 및 회칙',
    proceeding: '회의록',
    audit: '감사자료',
    welfare: '학생복지',
    promotion: '제휴백과',
    rental: '대여사업',
    signin: '로그인',
    join: '회원가입',
    policy: '개인정보처리방침',
    termsofservice: '이용약관',
    campusmap: '캠퍼스 맵',
    commu: '통합 소통 창구',
};

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean);

    const renderBreadcrumbItem = (value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = BREADCRUMB_LABELS[value] || value;

        return isLast ? (
            <li key={to} className="breadcrumb-item active">
                {label}
            </li>
        ) : (
            <li key={to} className="breadcrumb-item">
                <Link to={to}>{label}</Link>
            </li>
        );
    };

    return (
        <nav className="breadcrumb">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {pathnames.map(renderBreadcrumbItem)}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
