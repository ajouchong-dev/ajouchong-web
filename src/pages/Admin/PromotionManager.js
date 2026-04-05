import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

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

    return (
        <section className="admin-card admin-full">
            <div className="admin-section-head">
                <h2>제휴사업 관리</h2>
                <p>추가, 수정, 삭제하면 제휴백과 페이지에 즉시 반영됩니다.</p>
            </div>

            <form className="admin-form-grid" onSubmit={handleSubmit}>
                <label>
                    업체명
                    <input name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label>
                    카테고리
                    <input name="category" value={form.category} onChange={handleChange} required />
                </label>
                <label className="admin-span-2">
                    혜택 내용
                    <textarea name="benefit" value={form.benefit} onChange={handleChange} rows={3} required />
                </label>
                <label>
                    위치
                    <input name="location" value={form.location} onChange={handleChange} required />
                </label>
                <label>
                    홈페이지 URL
                    <input name="homepageUrl" value={form.homepageUrl} onChange={handleChange} placeholder="https://..." />
                </label>
                <label className="admin-span-2">
                    비고
                    <textarea name="note" value={form.note} onChange={handleChange} rows={2} />
                </label>
                <label>
                    노출 순서
                    <input type="number" min={1} name="displayOrder" value={form.displayOrder} onChange={handleChange} required />
                </label>
                <label className="admin-checkbox">
                    <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                    노출 상태(활성)
                </label>

                <div className="admin-form-actions admin-span-2">
                    <button className="admin-btn primary" type="submit">{editingId ? "수정 저장" : "항목 추가"}</button>
                    {editingId && (
                        <button className="admin-btn muted" type="button" onClick={resetForm}>수정 취소</button>
                    )}
                </div>
            </form>

            {message && <p className="admin-feedback success">{message}</p>}
            {error && <p className="admin-feedback error">{error}</p>}

            <div className="admin-table-wrap">
                {loading ? (
                    <p className="admin-empty">불러오는 중...</p>
                ) : items.length === 0 ? (
                    <p className="admin-empty">등록된 제휴 항목이 없습니다.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>순서</th>
                                <th>업체명</th>
                                <th>카테고리</th>
                                <th>위치</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.displayOrder}</td>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.location}</td>
                                    <td>{item.active ? "활성" : "비활성"}</td>
                                    <td className="admin-actions">
                                        <button className="admin-btn small" type="button" onClick={() => handleEdit(item)}>수정</button>
                                        <button className="admin-btn small danger" type="button" onClick={() => handleDelete(item.id)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
};

export default PromotionManager;

