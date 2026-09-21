import './styles.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const Sitemap = () => {
    const sitemapData = [
        {
            title: '소개',
            path: '/introduction/about',
            items: [
                { name: '총학생회 소개', path: '/introduction/about' },
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

    const isExternal = (path) => /^https?:\/\//i.test(path);

    const renderSitemapSection = (section) => (
        <section key={section.title} className="sitemap-group">
            <h2 className="sitemap-group-title">
                <Link to={section.path}>{section.title}</Link>
            </h2>
            <ul className="sitemap-links">
                {section.items.map((item) => (
                    <li key={item.path}>
                        <Link className="sitemap-link" to={item.path}>
                            <span className="sitemap-link-text">{item.name}</span>
                            {isExternal(item.path) && (
                                <ArrowUpRight className="sitemap-link-icon" size={14} aria-label="외부 링크" />
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );

    return (
        <div className="context">
            <div className="contextTitle">사이트맵</div>
            <hr className="titleSeparator"/>

            <nav className="sitemap-grid" aria-label="사이트맵">
                {sitemapData.map(renderSitemapSection)}
            </nav>
        </div>
    );
};

export default Sitemap;
