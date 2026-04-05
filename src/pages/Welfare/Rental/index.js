import "./styles.css";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const INQUIRY_FORM_URL = "https://forms.gle/V1hH3Gf5uyuC7CVp6";
const IMAGE_FALLBACK =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#edf3fa'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#56708f' font-size='28' font-family='Arial'>이미지 준비중</text></svg>`
    );

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const FAQS = [
    { q: "대여 물품은 어디서 수령하나요?", a: "총학생회실 방문 수령입니다. 신청 후 안내되는 시간에 방문해주세요." },
    { q: "최대 며칠까지 빌릴 수 있나요?", a: "기본 최대 대여기간은 3일입니다." },
    { q: "대여 연장이 가능한가요?", a: "동일 품목 예약 상황에 따라 가능 여부가 달라집니다. 문의 폼으로 먼저 연락해주세요." },
    { q: "반납이 늦어지면 어떻게 되나요?", a: "다른 대여 일정에 영향이 생길 수 있어 반드시 사전 연락이 필요합니다." },
];

const statusOf = (current, total) => {
    if (current <= 0) return "품절";
    if (current <= Math.max(1, Math.ceil(total * 0.2))) return "임박";
    return "가능";
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

    const openExternal = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="context">
            <div className="contextTitle">대여사업</div>
            <hr className="titleSeparator" />

            <div className="rental-v2-container">
                <section className="rental-hero">
                    <div className="rental-hero-main">
                        <h2>필요한 물품, 지금 바로 대여 신청</h2>
                        <p>검색하고, 수량 확인하고, 바로 신청하세요. 신청 전 체크리스트까지 한 화면에서 확인할 수 있습니다.</p>
                        <div className="rental-cta-group">
                            <button className="rental-cta secondary" onClick={() => openExternal(INQUIRY_FORM_URL)}>
                                문의하기
                            </button>
                        </div>
                    </div>
                    <div className="rental-summary-grid">
                        <article className="rental-summary-card">
                            <span>총 품목 수</span>
                            <strong>{summary.totalKinds}</strong>
                        </article>
                        <article className="rental-summary-card">
                            <span>대여 가능 품목</span>
                            <strong>{summary.availableKinds}</strong>
                        </article>
                        <article className="rental-summary-card">
                            <span>재고 임박 품목</span>
                            <strong>{summary.lowStockKinds}</strong>
                        </article>
                        <article className="rental-summary-card">
                            <span>최종 업데이트</span>
                            <strong className="rental-updated-at">{summary.lastUpdated}</strong>
                        </article>
                    </div>
                </section>

                <section className="rental-checklist">
                    <h3>신청 전 체크리스트</h3>
                    <ul>
                        <li>대여 1일 전까지 신청하면 우선 배정됩니다.</li>
                        <li>최대 대여기간은 3일입니다.</li>
                        <li>수령/반납은 총학생회실 방문 기준입니다.</li>
                    </ul>
                </section>

                <section className="rental-filter-bar">
                    <input
                        type="text"
                        placeholder="품목명 검색 (예: 돗자리, 우산)"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <label className="rental-only-toggle">
                        <input
                            type="checkbox"
                            checked={onlyAvailable}
                            onChange={(event) => setOnlyAvailable(event.target.checked)}
                        />
                        대여 가능만 보기
                    </label>
                </section>

                <section>
                    {loading && <p className="rental-load-msg">불러오는 중...</p>}
                    {!loading && error && <p className="rental-load-msg error">{error}</p>}
                    {!loading && !error && filteredItems.length === 0 && (
                        <p className="rental-load-msg">조건에 맞는 품목이 없습니다.</p>
                    )}
                    <div className="rental-card-grid">
                        {!loading && !error && filteredItems.map((item) => {
                            const status = statusOf(item.current, item.total);
                            return (
                                <article className="rental-item-card" key={item.id}>
                                    <img
                                        src={item.imageUrl}
                                        alt={`${item.name} 사진`}
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null;
                                            event.currentTarget.src = IMAGE_FALLBACK;
                                        }}
                                    />
                                    <div className="rental-item-head">
                                        <h4>{item.name}</h4>
                                        <span className={`rental-status-badge ${status}`}>{status}</span>
                                    </div>
                                    <p className="rental-item-category">{item.category}</p>
                                    <p className="rental-item-qty">
                                        현재 수량 <strong>{item.current}</strong> / 총 {item.total}
                                    </p>
                                    <div className="rental-item-progress">
                                        <span style={{ width: `${Math.max(5, Math.round((item.current / item.total) * 100))}%` }} />
                                    </div>
                                    <div className="rental-item-footnote">
                                        {item.current > 0 ? "대여 가능 품목" : "현재 품절"}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {!loading && !error && filteredItems.length > 0 && <section className="rental-table-wrap">
                    <h3>한눈에 보는 전체 재고</h3>
                    <table className="rental-overview-table" aria-label="전체 대여 재고">
                        <thead>
                            <tr>
                                <th>품목</th>
                                <th>카테고리</th>
                                <th>총 수량</th>
                                <th>현재 수량</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => {
                                const status = statusOf(item.current, item.total);
                                return (
                                    <tr key={`table-${item.id}`}>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.total}</td>
                                        <td>{item.current}</td>
                                        <td><span className={`rental-status-chip ${status}`}>{status}</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>}

                <section className="rental-faq">
                    <h3>자주 묻는 질문</h3>
                    {FAQS.map((faq, index) => (
                        <button
                            key={faq.q}
                            className={`rental-faq-item ${openedFaq === index ? "open" : ""}`}
                            onClick={() => setOpenedFaq(openedFaq === index ? -1 : index)}
                        >
                            <div className="rental-faq-q">{faq.q}</div>
                            {openedFaq === index && <div className="rental-faq-a">{faq.a}</div>}
                        </button>
                    ))}
                </section>
            </div>

        </div>
    );
};

export default Rental;
