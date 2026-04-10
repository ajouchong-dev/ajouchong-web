import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const normalizeUrl = (value) => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
};

const toDomain = (value) => {
    try {
        const url = new URL(normalizeUrl(value));
        return url.host;
    } catch (e) {
        return value || '';
    }
};

const LinkHub = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/link');

            let linksData = [];
            if (response.data && Array.isArray(response.data)) {
                linksData = response.data;
            } else if (response.data && Array.isArray(response.data.links)) {
                linksData = response.data.links;
            } else if (response.data && Array.isArray(response.data.data)) {
                linksData = response.data.data;
            }

            setLinks(linksData);
        } catch (err) {
            setLinks([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="context">
                <div className="contextTitle">LinkHub</div>
                <hr className="titleSeparator" />
                <div className="loading">링크를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="context">
            <div className="contextTitle">LinkHub</div>
            <hr className="titleSeparator" />

            {links.length === 0 ? (
                <div className="link-empty">등록된 링크가 없습니다.</div>
            ) : (
                <div className="links-grid">
                    {links.map((item, index) => {
                        const safeUrl = normalizeUrl(item.link);
                        const shouldShowLinkText = item.showLink !== false;
                        return (
                            <a
                                key={item.id || index}
                                className="link-card"
                                href={safeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${item.title} 링크 열기`}
                            >
                                <span className="link-title">{item.title}</span>
                                {shouldShowLinkText && (
                                    <span className="link-url">{toDomain(item.link)}</span>
                                )}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LinkHub;
