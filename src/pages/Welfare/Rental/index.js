import "./styles.css";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Check, ChevronDown, Search, X } from "lucide-react";

const RENTAL_GALLERY_IMAGES = [
    "/images/rental/ausum1.jpg",
    "/images/rental/ausum2.jpg",
    "/images/rental/ausum3.jpg",
    "/images/rental/ausum4.jpg",
];
const IMAGE_FALLBACK = "/images/logos/치토.jpeg";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const FAQS = [
    { q: "최대 며칠까지 빌릴 수 있나요?", a: "기본 최대 대여기간은 2일입니다." },
    { q: "반납이 늦어지면 어떻게 되나요?", a: "다른 대여 일정에 영향이 생길 수 있어 반드시 사전 연락이 필요합니다." },
];

const statusOf = (current, total) => {
    if (current <= 0) return "품절";
    if (current <= Math.max(1, Math.ceil(total * 0.2))) return "임박";
    return "가능";
};

// 표시 전용: 상태 → 공용 뱃지 색
const STATUS_BADGE = { "가능": "is-ok", "임박": "is-warn", "품절": "is-danger" };

// 표시 전용: 재고 바 길이(%). 남은 수량이 있으면 최소 5%는 보이게 한다.
const stockPercent = (current, total) => {
    if (!(current > 0) || !(total > 0)) return 0;
    return Math.min(100, Math.max(5, Math.round((current / total) * 100)));
};

const getSafeImageSrc = (src) => {
    if (typeof src !== "string") return IMAGE_FALLBACK;
    const trimmed = src.trim();
    return trimmed ? trimmed : IMAGE_FALLBACK;
};

const Rental = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [openedFaq, setOpenedFaq] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await apiClient.get("/api/rental/items");
                const normalized = (response.data?.data || []).map((item) => ({
                    ...item,
                    total: item.totalQuantity,
                    current: item.currentQuantity,
                }));
                setItems(normalized);
            } catch (e) {
                setError("대여 품목 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const categories = useMemo(
        () => ["전체", ...Array.from(new Set(items.map((item) => item.category)))],
        [items]
    );

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase());
            const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
            const matchesAvailability = !onlyAvailable || item.current > 0;
            return matchesSearch && matchesCategory && matchesAvailability;
        }).sort((a, b) => b.current - a.current);
    }, [items, search, selectedCategory, onlyAvailable]);

    const summary = useMemo(() => {
        const availableKinds = items.filter((item) => item.current > 0).length;
        const lowStockKinds = items.filter((item) => statusOf(item.current, item.total) === "임박").length;
        const latestUpdated = items
            .map((item) => item.updatedAt)
            .filter(Boolean)
            .sort()
            .pop();
        return {
            totalKinds: items.length,
            availableKinds,
            lowStockKinds,
            lastUpdated: latestUpdated
                ? new Date(latestUpdated).toLocaleString("ko-KR")
                : new Date().toLocaleString("ko-KR"),
        };
    }, [items]);

    const filtersActive = search.trim() !== "" || selectedCategory !== "전체" || onlyAvailable;

    // 표시 전용: 필터를 처음 상태로 되돌린다.
    const resetFilters = () => {
        setSearch("");
        setSelectedCategory("전체");
        setOnlyAvailable(false);
    };

    return (
        <div className="context">
            <div className="contextTitle">대여사업</div>
            <hr className="titleSeparator" />

            <div className="rental-page">
                <section className="rental-intro">
                    <div className="rental-intro-text">
                        <h2>필요한 물품, 지금 바로 대여 신청</h2>
                        <p>검색하고, 수량 확인하고, 바로 신청하세요. 신청 전 체크리스트까지 한 화면에서 확인할 수 있습니다.</p>
                    </div>
                    <dl className="rental-stats">
                        <div className="rental-stat">
                            <dt>총 품목 수</dt>
                            <dd>{summary.totalKinds}</dd>
                        </div>
                        <div className="rental-stat">
                            <dt>대여 가능 품목</dt>
                            <dd>{summary.availableKinds}</dd>
                        </div>
                        <div className="rental-stat">
                            <dt>재고 임박 품목</dt>
                            <dd>{summary.lowStockKinds}</dd>
                        </div>
                        <div className="rental-stat is-date">
                            <dt>최종 업데이트</dt>
                            <dd>{summary.lastUpdated}</dd>
                        </div>
                    </dl>
                    <div className="rental-checklist">
                        <h3>신청 전 체크리스트</h3>
                        <ul>
                            <li><Check size={16} aria-hidden="true" /><span>최대 대여기간은 2일입니다.</span></li>
                            <li><Check size={16} aria-hidden="true" /><span>수령/반납은 총학생회실 방문 기준입니다.</span></li>
                        </ul>
                    </div>
                </section>

                <section className="rental-browse" aria-label="대여 품목">
                    <div className="rental-toolbar">
                        <div className="rental-toolbar-row">
                            <div className="rental-search">
                                <Search className="rental-search-icon" size={18} aria-hidden="true" />
                                <input
                                    type="text"
                                    className="ui-input rental-search-input"
                                    placeholder="품목명 검색 (예: 돗자리, 우산)"
                                    aria-label="품목명 검색"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        className="rental-search-clear"
                                        onClick={() => setSearch("")}
                                        aria-label="검색어 지우기"
                                    >
                                        <X size={16} aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                            <label className="rental-switch">
                                <input
                                    type="checkbox"
                                    checked={onlyAvailable}
                                    onChange={(event) => setOnlyAvailable(event.target.checked)}
                                />
                                <span className="rental-switch-track" aria-hidden="true" />
                                <span className="rental-switch-label">대여 가능만 보기</span>
                            </label>
                        </div>
                        <div className="rental-chips" role="group" aria-label="카테고리">
                            {categories.map((category) => (
                                <button
                                    type="button"
                                    key={category}
                                    className="ui-chip rental-chip"
                                    aria-pressed={selectedCategory === category}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading && (
                        <div className="rental-card-grid" role="status" aria-label="불러오는 중...">
                            {[0, 1, 2, 3, 4, 5].map((n) => (
                                <div className="rental-item is-loading" key={n} aria-hidden="true">
                                    <div className="rental-item-media ui-skeleton" />
                                    <div className="rental-item-body">
                                        <div className="rental-skeleton-line ui-skeleton" />
                                        <div className="rental-skeleton-line is-short ui-skeleton" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!loading && error && (
                        <p className="ui-empty rental-message is-error" role="alert">{error}</p>
                    )}
                    {!loading && !error && filteredItems.length === 0 && (
                        <div className="ui-empty rental-message">
                            <p>조건에 맞는 품목이 없습니다.</p>
                            {filtersActive && (
                                <button type="button" className="ui-btn is-small" onClick={resetFilters}>
                                    필터 초기화
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && !error && filteredItems.length > 0 && (
                        <>
                            <p className="rental-result-count" aria-live="polite">
                                품목 <strong>{filteredItems.length}</strong>개
                            </p>
                            <div className="rental-card-grid">
                                {filteredItems.map((item) => {
                                    const status = statusOf(item.current, item.total);
                                    return (
                                        <article
                                            className={`rental-item ${status === "품절" ? "is-soldout" : ""}`}
                                            key={item.id}
                                        >
                                            <div className="rental-item-media">
                                                <img
                                                    src={getSafeImageSrc(item.imageUrl)}
                                                    alt={`${item.name} 사진`}
                                                    loading="lazy"
                                                    onError={(event) => {
                                                        event.currentTarget.onerror = null;
                                                        event.currentTarget.src = IMAGE_FALLBACK;
                                                    }}
                                                />
                                                <span className={`ui-badge ${STATUS_BADGE[status]} rental-item-badge`}>
                                                    {status}
                                                </span>
                                            </div>
                                            <div className="rental-item-body">
                                                <p className="rental-item-category">{item.category}</p>
                                                <h4 className="rental-item-name">{item.name}</h4>
                                                <div
                                                    className="ui-meter rental-item-meter"
                                                    style={{ "--value": `${stockPercent(item.current, item.total)}%` }}
                                                    aria-hidden="true"
                                                >
                                                    <span />
                                                </div>
                                                <div className="rental-item-stock">
                                                    <span className="rental-item-footnote">
                                                        {item.current > 0 ? "대여 가능 품목" : "현재 품절"}
                                                    </span>
                                                    <span
                                                        className="rental-item-qty"
                                                        aria-label={`현재 수량 ${item.current}, 총 ${item.total}`}
                                                    >
                                                        <strong>{item.current}</strong> / {item.total}
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </section>

                {!loading && !error && filteredItems.length > 0 && (
                    <section className="rental-section">
                        <h3 className="rental-section-title">한눈에 보는 전체 재고</h3>
                        <div className="table-container">
                            <table className="table rental-overview-table" aria-label="전체 대여 재고">
                                <thead>
                                    <tr>
                                        <th>품목</th>
                                        <th>카테고리</th>
                                        <th className="is-num">총 수량</th>
                                        <th className="is-num">현재 수량</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => {
                                        const status = statusOf(item.current, item.total);
                                        return (
                                            <tr key={`table-${item.id}`}>
                                                <td className="rental-overview-name">{item.name}</td>
                                                <td>{item.category}</td>
                                                <td className="is-num">{item.total}</td>
                                                <td className="is-num">{item.current}</td>
                                                <td>
                                                    <span className={`ui-badge ${STATUS_BADGE[status]}`}>{status}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                <section className="rental-section">
                    <div className="rental-section-head">
                        <h3 className="rental-section-title">대여 물품 미리보기</h3>
                        <p>대여 가능한 주요 물품 사진입니다. 클릭하면 크게 볼 수 있습니다.</p>
                    </div>
                    <div className="rental-gallery">
                        {RENTAL_GALLERY_IMAGES.map((imageSrc, index) => (
                            <a
                                key={imageSrc}
                                className="rental-gallery-item"
                                href={imageSrc}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`대여 물품 이미지 ${index + 1} 크게 보기`}
                            >
                                <img
                                    src={getSafeImageSrc(imageSrc)}
                                    alt={`대여 물품 이미지 ${index + 1}`}
                                    loading="lazy"
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = IMAGE_FALLBACK;
                                    }}
                                />
                            </a>
                        ))}
                    </div>
                </section>

                <section className="rental-section">
                    <h3 className="rental-section-title">자주 묻는 질문</h3>
                    <div className="rental-faq-list">
                        {FAQS.map((faq, index) => {
                            const isOpen = openedFaq === index;
                            return (
                                <div key={faq.q} className={`rental-faq-item ${isOpen ? "is-open" : ""}`}>
                                    <h4 className="rental-faq-heading">
                                        <button
                                            type="button"
                                            id={`rental-faq-q-${index}`}
                                            className="rental-faq-q"
                                            aria-expanded={isOpen}
                                            aria-controls={`rental-faq-a-${index}`}
                                            onClick={() => setOpenedFaq(openedFaq === index ? -1 : index)}
                                        >
                                            <span>{faq.q}</span>
                                            <ChevronDown className="rental-faq-chevron" size={20} aria-hidden="true" />
                                        </button>
                                    </h4>
                                    <div
                                        id={`rental-faq-a-${index}`}
                                        className="rental-faq-panel"
                                        role="region"
                                        aria-labelledby={`rental-faq-q-${index}`}
                                    >
                                        <div className="rental-faq-panel-inner">
                                            <p className="rental-faq-a">{faq.a}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Rental;
