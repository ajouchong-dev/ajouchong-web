import "../styles.css";
import "./styles.css";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Download, ExternalLink, FileText } from "lucide-react";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("ko-KR");
};

const Proceeding = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProceeding = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await apiClient.get("/api/proceeding");
                const nextCategories = response.data?.data || [];
                setCategories(nextCategories);
                setSelectedCategoryId(nextCategories[0]?.id || null);
            } catch (e) {
                setError(e.response?.data?.message || "회의록 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadProceeding();
    }, []);

    const selectedCategory = useMemo(
        () => categories.find((category) => category.id === selectedCategoryId) || null,
        [categories, selectedCategoryId]
    );

    const documents = selectedCategory?.documents || [];

    return (
        <div className="context">
            <div className="contextTitle">회의록</div>
            <hr className="titleSeparator" />

            <section className="proceeding-filter" aria-labelledby="proceeding-filter-title">
                <h2 id="proceeding-filter-title" className="proceeding-filter-title">위원회 선택</h2>
                {loading && <p className="loading-text">불러오는 중...</p>}
                {!loading && error && <p className="ui-empty proceeding-error" role="alert">{error}</p>}
                {!loading && !error && categories.length === 0 && (
                    <p className="ui-empty">등록된 회의록이 없습니다.</p>
                )}

                {categories.length > 0 && (
                    <ul className="proceeding-chip-list">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <button
                                    type="button"
                                    className={`ui-chip ${selectedCategoryId === category.id ? "is-active" : ""}`}
                                    aria-pressed={selectedCategoryId === category.id}
                                    onClick={() => setSelectedCategoryId(category.id)}
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 선택된 위원회가 있을 때만 문서 영역을 그린다 */}
            {selectedCategory && (
                <section className="proceeding-documents">
                    <header className="proceeding-documents-head">
                        <div className="proceeding-documents-heading">
                            <h2 className="proceeding-documents-title">{selectedCategory.name}</h2>
                            {selectedCategory.description && (
                                <p className="proceeding-documents-desc">{selectedCategory.description}</p>
                            )}
                        </div>
                        {documents.length > 0 && (
                            <span className="proceeding-documents-count">총 {documents.length}건</span>
                        )}
                    </header>

                    {!loading && !error && documents.length === 0 && (
                        <p className="ui-empty">이 카테고리에 문서가 없습니다.</p>
                    )}

                    {documents.length > 0 && (
                        <ul className="resources-doc-list">
                            {documents.map((doc) => (
                                <li key={doc.id} className="resources-doc">
                                    <div className="resources-doc-main">
                                        <span className="resources-doc-icon" aria-hidden="true">
                                            <FileText size={18} />
                                        </span>
                                        <div className="resources-doc-text">
                                            <strong className="resources-doc-title">{doc.title}</strong>
                                            <small className="resources-doc-meta">{formatDate(doc.meetingDate)}</small>
                                        </div>
                                    </div>
                                    <div className="resources-doc-actions">
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="resources-doc-action"
                                            aria-label="문서 열기"
                                            title="문서 열기"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="resources-doc-action"
                                            aria-label="문서 다운로드"
                                            title="문서 다운로드"
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </div>
    );
};

export default Proceeding;
