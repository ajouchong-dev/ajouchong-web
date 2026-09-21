import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpRight, Info, MapPin } from 'lucide-react';
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
        <div className="promo-page">
            <section className="promo-intro">
                <h2>총학생회 제휴사업 안내</h2>
                <p>아래 제휴 혜택은 수시로 업데이트됩니다. 방문 전 세부 조건을 확인해주세요.</p>
            </section>

            {loading && (
                <div className="promo-grid" role="status" aria-label="불러오는 중...">
                    {[0, 1, 2, 3].map((n) => (
                        <div className="promo-card is-loading" key={n} aria-hidden="true">
                            <div className="promo-skeleton-line is-short ui-skeleton" />
                            <div className="promo-skeleton-line is-tall ui-skeleton" />
                            <div className="promo-skeleton-line ui-skeleton" />
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="ui-empty promo-message is-error" role="alert">{error}</p>}

            {!loading && !error && partners.length === 0 && (
                <p className="ui-empty promo-message">등록된 제휴 항목이 없습니다.</p>
            )}

            {!loading && !error && partners.length > 0 && (
                <ul className="promo-grid" aria-label="제휴사업 목록">
                    {partners.map((item) => (
                        <li className="promo-card" key={item.id}>
                            <div className="promo-card-head">
                                {item.category && <span className="ui-badge is-brand">{item.category}</span>}
                                <h3 className="promo-card-name">{item.name}</h3>
                            </div>
                            <p className="promo-card-benefit">{item.benefit}</p>
                            <dl className="promo-card-meta">
                                {item.location && (
                                    <div>
                                        <dt><MapPin size={15} aria-hidden="true" />위치</dt>
                                        <dd>{item.location}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt><Info size={15} aria-hidden="true" />안내</dt>
                                    <dd>{item.note || '-'}</dd>
                                </div>
                            </dl>
                            {item.homepageUrl && (
                                <a
                                    className="promo-card-link"
                                    href={item.homepageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    공식 링크
                                    <ArrowUpRight size={16} aria-hidden="true" />
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
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
