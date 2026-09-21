import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight } from 'lucide-react';
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
                <p className="loading-text">링크를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="context">
            <div className="contextTitle">LinkHub</div>
            <hr className="titleSeparator" />

            {links.length === 0 ? (
                <p className="ui-empty">등록된 링크가 없습니다.</p>
            ) : (
                <ul className="linkhub-list">
                    {links.map((item, index) => {
                        const safeUrl = normalizeUrl(item.link);
                        const shouldShowLinkText = item.showLink !== false;
                        return (
                            <li key={item.id || index}>
                                <a
                                    className="linkhub-item"
                                    href={safeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${item.title} 링크 열기`}
                                >
                                    <span className="linkhub-item-text">
                                        <span className="linkhub-item-title">{item.title}</span>
                                        {shouldShowLinkText && (
                                            <span className="linkhub-item-url">{toDomain(item.link)}</span>
                                        )}
                                    </span>
                                    <ArrowUpRight className="linkhub-item-arrow" size={18} aria-hidden="true" />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default LinkHub;
