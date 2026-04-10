import "./styles.css";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Download, ExternalLink, FileText, FolderClosed } from "lucide-react";

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

            <div className="proceeding-v2-layout">
                <section className="proceeding-v2-card">
                    <h2>위원회 선택</h2>
                    {loading && <p className="proceeding-v2-state">불러오는 중...</p>}
                    {!loading && error && <p className="proceeding-v2-state error">{error}</p>}
                    {!loading && !error && categories.length === 0 && (
                        <p className="proceeding-v2-state">등록된 회의록이 없습니다.</p>
                    )}

                    <ul className="proceeding-category-list">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <button
                                    type="button"
                                    className={`proceeding-category-item ${selectedCategoryId === category.id ? "active" : ""}`}
                                    onClick={() => setSelectedCategoryId(category.id)}
                                >
                                    <span className="proceeding-icon-wrap">
                                        <FolderClosed size={16} />
                                    </span>
                                    <span className="proceeding-category-text">
                                        <strong>{category.name}</strong>
                                        {category.description && <small>{category.description}</small>}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="proceeding-v2-card">
                    <h2>{selectedCategory?.name || "회의록 목록"}</h2>
                    {!loading && !error && selectedCategory && documents.length === 0 && (
                        <p className="proceeding-v2-state">이 카테고리에 문서가 없습니다.</p>
                    )}

                    <ul className="proceeding-document-list">
                        {documents.map((doc) => (
                            <li key={doc.id} className="proceeding-document-item">
                                <div className="proceeding-doc-main">
                                    <span className="proceeding-icon-wrap red">
                                        <FileText size={16} />
                                    </span>
                                    <div className="proceeding-doc-text">
                                        <strong>{doc.title}</strong>
                                        <small>{formatDate(doc.meetingDate)}</small>
                                    </div>
                                </div>
                                <div className="proceeding-doc-actions">
                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" aria-label="문서 열기">
                                        <ExternalLink size={16} />
                                    </a>
                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" download aria-label="문서 다운로드">
                                        <Download size={16} />
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Proceeding;
