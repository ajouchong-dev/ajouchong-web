import './styles.css';
import React, { useEffect, useState } from 'react';

// 이용약관·개인정보처리방침이 함께 쓰는 뼈대: 읽기 칼럼 + 데스크톱 전용 목차
const PolicyLayout = ({ title, sections, children }) => {
    const [activeId, setActiveId] = useState(sections[0]?.id || '');
    const sectionKey = sections.map((section) => section.id).join('|');

    // 지금 읽고 있는 조항을 목차에 표시
    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: '-96px 0px -60% 0px' }
        );

        sectionKey.split('|').forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sectionKey]);

    // 주소에 해시를 남기지 않고 해당 조항으로 스크롤
    const handleTocClick = (event, id) => {
        const element = document.getElementById(id);
        if (!element) return;
        event.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
    };

    return (
        <div className="context">
            <div className="contextTitle">{title}</div>
            <hr className="titleSeparator" />

            <div className="policy-layout">
                <nav className="policy-toc" aria-label={`${title} 목차`}>
                    <p className="policy-toc-title">목차</p>
                    <ol className="policy-toc-list">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    className={`policy-toc-link ${activeId === section.id ? 'is-active' : ''}`}
                                    aria-current={activeId === section.id ? 'location' : undefined}
                                    onClick={(event) => handleTocClick(event, section.id)}
                                >
                                    {section.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <article className="ui-prose policy-body">{children}</article>
            </div>
        </div>
    );
};

export default PolicyLayout;
