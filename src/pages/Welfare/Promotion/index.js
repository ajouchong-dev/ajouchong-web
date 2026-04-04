import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.ajouchong.com'
});

const Promotion = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPartners = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiClient.get('/api/promotion');
                setPartners(response.data?.data || []);
            } catch (e) {
                setError('제휴 항목을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadPartners();
    }, []);

    const renderPromotionContainer = () => (
        <div className="promotion-container">
            <section className="promotion-header-card">
                <h2>총학생회 제휴사업 안내</h2>
                <p>아래 제휴 혜택은 수시로 업데이트됩니다. 방문 전 세부 조건을 확인해주세요.</p>
            </section>

            {loading && <p className="promotion-message">불러오는 중...</p>}
            {error && <p className="promotion-message error">{error}</p>}

            {!loading && !error && partners.length === 0 && (
                <p className="promotion-message">등록된 제휴 항목이 없습니다.</p>
            )}

            {!loading && !error && partners.length > 0 && (
                <div className="promotion-table-wrap">
                    <table className="promotion-table" aria-label="제휴사업 표">
                        <thead>
                            <tr>
                                <th>업체명</th>
                                <th>카테고리</th>
                                <th>혜택</th>
                                <th>위치</th>
                                <th>안내</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map((item) => (
                                <tr key={item.id}>
                                    <td className="promotion-name-cell">
                                        <strong>{item.name}</strong>
                                        {item.homepageUrl && (
                                            <a href={item.homepageUrl} target="_blank" rel="noopener noreferrer">
                                                공식 링크
                                            </a>
                                        )}
                                    </td>
                                    <td>{item.category}</td>
                                    <td>{item.benefit}</td>
                                    <td>{item.location}</td>
                                    <td>{item.note || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div className="context">
            <div className="contextTitle">제휴백과</div>
            <hr className="titleSeparator"/>
            {renderPromotionContainer()}
        </div>
    );
};

export default Promotion;
