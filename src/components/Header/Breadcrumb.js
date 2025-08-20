import React, { useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const REDIRECT_MAPPINGS = {
    introduction: '/introduction/about',
    news: '/news/notice',
    communication: '/communication/qna',
    resources: '/resources/bylaws',
    welfare: '/welfare/promotion',
    acentia: '/acentia/intro',
    utility: '/utility/policy'
};

const BREADCRUMB_LABELS = {
    about: '총학생회 소개',
    promise: '공약 소개',
    organization: '조직도',
    history: '역대 총학생회',
    map: '오시는 길',
    campusmap: '캠퍼스 맵',

    notice: '공지사항',

    qna: 'Q&A',
    require: '100인 안건 상정제',
    write: '글 작성',

    bylaws: '세칙 및 회칙',
    proceeding: '회의록',
    audit: '감사자료',

    promotion: '제휴백과',
    rental: '대여사업',

    intro: 'ACENTIA 소개',
    goods: 'ACENTIA 굿즈',
    record: '역대 ACENTIA',

    termsofservice: '개인정보처리방침',
    policy: '이용약관',
    sitemap: '사이트맵',
    profile: '프로필',
};

const Breadcrumb = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const pathname = location.pathname;
        const segments = pathname.split('/').filter(Boolean);
        
        if (segments.length === 1) {
            const firstSegment = segments[0];
            const redirectPath = REDIRECT_MAPPINGS[firstSegment];
            
            if (redirectPath && pathname !== redirectPath) {
                navigate(redirectPath, { replace: true });
            }
        }
    }, [location.pathname, navigate]);
    
    const breadcrumbItems = useMemo(() => {
        const pathnames = location.pathname.split('/').filter(Boolean);
        
        return pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const label = BREADCRUMB_LABELS[value] || value;

            return {
                to,
                label,
                isLast
            };
        });
    }, [location.pathname]);

    const renderBreadcrumbItem = (item) => {
        return item.isLast ? (
            <li key={item.to} className="breadcrumb-item active">
                {item.label}
            </li>
        ) : (
            <li key={item.to} className="breadcrumb-item">
                <Link to={item.to}>{item.label}</Link>
            </li>
        );
    };

    return (
        <nav className="breadcrumb">
            <ul>
                <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                </li>
                {breadcrumbItems.map(renderBreadcrumbItem)}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
