import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);


    const breadcrumbLabels = {
        introduction: '소개',
        about: '총학생회 소개',
        promise:'공약 소개',
        organization: '조직도',
        greeting:"인사말",
        map: "오시는 길",
        notice:"공지사항",
        planning:"학사일정",
        news:"소식",
        sitemap:"사이트맵",
        communication:"소통",
        qna:"Q&A",
        write:"글 작성",
        require:"100인 안건 상정제",
        resources:"자료실",
        bylaws:"세칙 및 회칙",
        proceeding:"회의록",
        audit:"감사자료",
        welfare:"학생복지",
        promotion:"제휴백과",
        rental:"대여사업",
        signin:"로그인",
        join:"회원가입",
        policy:"개인정보처리방침",
        termsofservice:"이용약관",
        personalinfo:"회원 정보 입력",
        password:"비밀번호 찾기",
        pwchange:"비밀번호 변경",
        campusmap: '캠퍼스 맵',
        commu:'통합 소통 창구'

    };
    const getBreadcrumbTitle = (path) => {
        if (path.includes('introduction')) return '소개';
        if (path.includes('news')) return '소식';
        if (path.includes('promise')) return '공약 소개';
        if (path.includes('organization')) return '조직도';
        // Add more conditions as needed
        return '';
    };
    return (
        <nav className="breadcrumb">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {pathnames.length > 0 && (
                    <>
                        <li>
                            <Link to={`/${pathnames[0]}`}>
                                {breadcrumbLabels[pathnames[0]]}
                            </Link>
                        </li>
                        {pathnames.slice(1).map((value, index) => {
                            const to = `/${pathnames.slice(0, index + 2).join('/')}`;
                            const isLast = index === pathnames.length - 2;
                            const label = breadcrumbLabels[value] || getBreadcrumbTitle(to);

                            return isLast ? (
                                <li key={to} className="breadcrumb-item">
                                    {label}
                                </li>
                            ) : (
                                <li key={to} className="breadcrumb-item">
                                    <Link to={to}>{label}</Link>
                                </li>
                            );
                        })}
                    </>
                )}
            </ul>
        </nav>
    );
};


export default Breadcrumb;