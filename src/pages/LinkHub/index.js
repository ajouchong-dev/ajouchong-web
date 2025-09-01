import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

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
            console.log(response.data);

            // API 응답 구조에 따라 links 데이터 추출
            let linksData = [];
            if (response.data && Array.isArray(response.data)) {
                linksData = response.data;
            } else if (response.data && Array.isArray(response.data.links)) {
                linksData = response.data.links;
            } else if (response.data && Array.isArray(response.data.data)) {
                linksData = response.data.data;
            } else {
                console.log('API 응답 구조:', response.data);
                linksData = [];
            }

            setLinks(linksData);    
        } catch (err) {
            console.error('링크 목록을 가져오는 중 오류가 발생했습니다:', err);            
        } finally {
            setLoading(false);
        }
    };

    const handleLinkClick = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return (
            <div className="link-hub-container">
                <div className="loading">링크를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="context">
            <div className="contextTitle">LinkHub</div>
            <hr className="titleSeparator" />
            <div className="links-grid">
                {links.map((link, index) => (
                    <div
                        key={index}
                        className="link-card"
                        onClick={() => handleLinkClick(link.url)}
                    >
                        <h3 className="link-title">{link.title}</h3>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default LinkHub;