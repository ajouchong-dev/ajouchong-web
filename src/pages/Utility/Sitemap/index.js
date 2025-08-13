import './styles.css';
import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
    const sitemapData = [
        {
            title: '소개',
            path: '/introduction/about',
            items: [
                { name: '총학생회 소개', path: '/introduction/about' },
                { name: '공약 소개', path: '/introduction/promise' },
                { name: '조직도', path: '/introduction/organization' },
                { name: '역대 총학생회 소개', path: '/introduction/history' },
                { name: '오시는 길', path: '/introduction/map' },
                { name: '캠퍼스 맵', path: '/introduction/campusmap' }
            ]
        },
        {
            title: '소식',
            path: '/news/notice',
            items: [
                { name: '공지사항', path: '/news/notice' }
            ]
        },
        {
            title: '소통',
            path: '/communication/qna',
            items: [
                { name: 'Q&A', path: '/communication/qna' },
                { name: '100인 안건 상정제', path: '/communication/require' },
                { name: '통합 소통 창구', path: 'https://forms.gle/V1hH3Gf5uyuC7CVp6' }
            ]
        },
        {
            title: '자료실',
            path: '/resources/bylaws',
            items: [
                { name: '세칙 및 회칙', path: '/resources/bylaws' },
                { name: '회의록', path: '/resources/proceeding' },
                { name: '감사자료', path: '/resources/audit' }
            ]
        },
        {
            title: '학생복지',
            path: '/welfare/promotion',
            items: [
                { name: '제휴백과', path: '/welfare/promotion' },
                { name: '대여사업', path: '/welfare/rental' }
            ]
        },
        {
            title: 'ACENTIA',
            path: '/acentia/intro',
            items: [
                { name: 'ACENTIA 소개', path: '/acentia/intro' },
                { name: 'ACENTIA 굿즈', path: '/acentia/goods' },
                { name: '역대 ACENTIA', path: '/acentia/record' }
            ]
        }
    ];

    const renderSitemapSection = (section) => (
        <li key={section.title} className="list-container">
            <Link className="sitemapTitle" to={section.path}>
                {section.title}
            </Link>
            <hr className="listSeparator"/>
            <ul>
                {section.items.map((item) => (
                    <li key={item.path}>
                        <Link to={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </li>
    );

    const renderSitemapList = () => (
        <ul className="sitemap-list">
            {sitemapData.map(renderSitemapSection)}
        </ul>
    );

    return (
        <div className="context">
            <div className="contextTitle">사이트맵</div>
            <hr className="titleSeparator"/>

            <div className="sitemap">
                {renderSitemapList()}
            </div>
        </div>
    );
};

export default Sitemap;