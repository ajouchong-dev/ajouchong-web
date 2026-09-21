import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
    AdminCheckbox,
    AdminCollapse,
    AdminEditBanner,
    AdminEmpty,
    AdminField,
    AdminFormToggle,
    AdminPanelHead,
    AdminSearch,
    AdminSkeleton,
    AdminStatus,
    useAutoDismiss,
    useChangedRows,
    useFormPanel,
} from "./AdminUI";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const INITIAL_FORM = {
    name: "",
    category: "",
    benefit: "",
    location: "",
    homepageUrl: "",
    note: "",
    displayOrder: 1,
    active: true,
};

const getItemId = (item) => item.id;

const PromotionManager = () => {
    const { auth } = useAuth();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(INITIAL_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const authConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${auth.token}` },
        withCredentials: true,
    }), [auth.token]);

    const loadItems = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiClient.get("/api/admin/promotion", authConfig);
            setItems(response.data?.data || []);
        } catch (e) {
            setError(e.response?.data?.message || "제휴 항목을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (name === "displayOrder" ? Number(value) : value),
        }));
    };

    const resetForm = () => {
        setForm(INITIAL_FORM);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            ...form,
            homepageUrl: form.homepageUrl.trim() || null,
            note: form.note.trim() || null,
        };

        try {
            if (editingId) {
                await apiClient.put(`/api/admin/promotion/${editingId}`, payload, authConfig);
                setMessage("제휴 항목을 수정했습니다.");
            } else {
                await apiClient.post("/api/admin/promotion", payload, authConfig);
                setMessage("제휴 항목을 추가했습니다.");
            }
            resetForm();
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "저장에 실패했습니다.");
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({
            name: item.name || "",
            category: item.category || "",
            benefit: item.benefit || "",
            location: item.location || "",
            homepageUrl: item.homepageUrl || "",
            note: item.note || "",
            displayOrder: item.displayOrder ?? 1,
            active: item.active ?? true,
        });
        setMessage("");
        setError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("이 항목을 삭제하시겠습니까?")) return;
        setError("");
        setMessage("");
        try {
            await apiClient.delete(`/api/admin/promotion/${id}`, authConfig);
            setMessage("제휴 항목을 삭제했습니다.");
            if (editingId === id) resetForm();
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "삭제에 실패했습니다.");
        }
    };

    // ── 표현용 상태 (데이터 로직과 무관) ──
    const [query, setQuery] = useState("");
    const formPanel = useFormPanel(editingId);
    const changedRows = useChangedRows(items, getItemId);
    useAutoDismiss(message, setMessage);

    const editingItem = items.find((item) => item.id === editingId);
    const keyword = query.trim().toLowerCase();
    const visibleItems = keyword
        ? items.filter((item) =>
            [item.name, item.category, item.location, item.benefit]
                .some((value) => String(value || "").toLowerCase().includes(keyword)))
        : items;

    return (
        <section className="admin-section">
            <AdminPanelHead
                title="제휴사업 관리"
                count={keyword ? `${items.length}건 중 ${visibleItems.length}건` : `총 ${items.length}건`}
                description="추가, 수정, 삭제하면 제휴백과 페이지에 즉시 반영됩니다."
            >
                <AdminFormToggle
                    open={formPanel.open}
                    editing={Boolean(editingId)}
                    label="항목 추가"
                    controls="promotion-form-panel"
                    onClick={() => (editingId ? resetForm() : formPanel.setOpen((prev) => !prev))}
                />
            </AdminPanelHead>

            <AdminStatus
                message={message}
                error={error}
                onDismissMessage={() => setMessage("")}
                onDismissError={() => setError("")}
            />

            <AdminCollapse open={formPanel.open} id="promotion-form-panel" panelRef={formPanel.panelRef}>
                <form className="admin-form-card" onSubmit={handleSubmit}>
                    {editingId && <AdminEditBanner title={editingItem?.name || form.name} onCancel={resetForm} />}
                    <div className="admin-form-grid">
                        <AdminField label="업체명" htmlFor="promotion-name" required>
                            <input id="promotion-name" className="ui-input" name="name" value={form.name} onChange={handleChange} required />
                        </AdminField>
                        <AdminField label="카테고리" htmlFor="promotion-category" required>
                            <input id="promotion-category" className="ui-input" name="category" value={form.category} onChange={handleChange} required />
                        </AdminField>
                        <AdminField label="혜택 내용" htmlFor="promotion-benefit" required span>
                            <textarea id="promotion-benefit" className="ui-textarea admin-textarea-sm" name="benefit" value={form.benefit} onChange={handleChange} rows={3} required />
                        </AdminField>
                        <AdminField label="위치" htmlFor="promotion-location" required>
                            <input id="promotion-location" className="ui-input" name="location" value={form.location} onChange={handleChange} required />
                        </AdminField>
                        <AdminField label="홈페이지 URL" htmlFor="promotion-homepage">
                            <input id="promotion-homepage" className="ui-input" name="homepageUrl" value={form.homepageUrl} onChange={handleChange} placeholder="https://..." />
                        </AdminField>
                        <AdminField label="비고" htmlFor="promotion-note" span>
                            <textarea id="promotion-note" className="ui-textarea admin-textarea-sm" name="note" value={form.note} onChange={handleChange} rows={2} />
                        </AdminField>
                        <AdminField label="노출 순서" htmlFor="promotion-order" required>
                            <input id="promotion-order" className="ui-input" type="number" min={1} name="displayOrder" value={form.displayOrder} onChange={handleChange} required />
                        </AdminField>
                        <AdminCheckbox label="노출 상태(활성)" name="active" checked={form.active} onChange={handleChange} />
                    </div>

                    <div className="admin-form-actions">
                        {editingId && (
                            <button className="ui-btn" type="button" onClick={resetForm}>수정 취소</button>
                        )}
                        <button className="ui-btn is-primary" type="submit">{editingId ? "수정 저장" : "항목 추가"}</button>
                    </div>
                </form>
            </AdminCollapse>

            {items.length > 0 && (
                <div className="admin-toolbar">
                    <AdminSearch value={query} onChange={setQuery} placeholder="업체명, 카테고리, 위치 검색" />
                </div>
            )}

            {loading && items.length === 0 ? (
                <AdminSkeleton />
            ) : items.length === 0 ? (
                <AdminEmpty>등록된 제휴 항목이 없습니다.</AdminEmpty>
            ) : visibleItems.length === 0 ? (
                <AdminEmpty>검색어와 일치하는 제휴 항목이 없습니다.</AdminEmpty>
            ) : (
                <div className={`admin-table-wrap ${loading ? "is-loading" : ""}`} aria-busy={loading}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-col-num">순서</th>
                                <th>업체명</th>
                                <th>카테고리</th>
                                <th>위치</th>
                                <th>상태</th>
                                <th className="admin-col-actions">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleItems.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`${changedRows.has(String(item.id)) ? "is-flash" : ""} ${editingId === item.id ? "is-editing" : ""}`}
                                >
                                    <td className="admin-cell-num" data-label="순서">{item.displayOrder}</td>
                                    <td className="admin-cell-title">{item.name}</td>
                                    <td data-label="카테고리">{item.category}</td>
                                    <td data-label="위치">{item.location}</td>
                                    <td className="admin-cell-badge">
                                        <span className={`ui-badge ${item.active ? "is-ok" : ""}`}>{item.active ? "활성" : "비활성"}</span>
                                    </td>
                                    <td className="admin-cell-actions">
                                        <div className="admin-actions">
                                            <button
                                                className="ui-btn is-small admin-act"
                                                type="button"
                                                onClick={() => {
                                                    handleEdit(item);
                                                    formPanel.reveal();
                                                }}
                                            >
                                                <Pencil size={14} aria-hidden="true" />
                                                수정
                                            </button>
                                            <button className="ui-btn is-small is-danger admin-act" type="button" onClick={() => handleDelete(item.id)}>
                                                <Trash2 size={14} aria-hidden="true" />
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default PromotionManager;
