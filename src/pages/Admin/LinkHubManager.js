import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const INITIAL_FORM = {
    title: "",
    link: "",
    active: true,
    showLink: true,
};

const LinkHubManager = () => {
    const { auth } = useAuth();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(INITIAL_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const authConfig = useMemo(
        () => ({
            headers: { Authorization: `Bearer ${auth.token}` },
            withCredentials: true,
        }),
        [auth.token]
    );

    const pickItems = (responseData) => {
        if (Array.isArray(responseData)) return responseData;
        if (Array.isArray(responseData?.links)) return responseData.links;
        if (Array.isArray(responseData?.data)) return responseData.data;
        return [];
    };

    const loadItems = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiClient.get("/api/admin/link", authConfig);
            setItems(pickItems(response.data));
        } catch (e) {
            setError(e.response?.data?.message || "링크 목록을 불러오지 못했습니다.");
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
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm(INITIAL_FORM);
        setEditingId(null);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({
            title: item.title || "",
            link: item.link || "",
            active: item.active ?? true,
            showLink: item.showLink ?? true,
        });
        setMessage("");
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            ...form,
            title: form.title.trim(),
            link: form.link.trim(),
        };

        try {
            if (editingId) {
                await apiClient.put(`/api/admin/link/${editingId}`, payload, authConfig);
                setMessage("링크를 수정했습니다.");
            } else {
                await apiClient.post("/api/admin/link/upload", payload, authConfig);
                setMessage("링크를 추가했습니다.");
            }
            resetForm();
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "저장에 실패했습니다.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("이 링크를 삭제하시겠습니까?")) return;
        setError("");
        setMessage("");
        try {
            await apiClient.delete(`/api/admin/link/${id}/delete`, authConfig);
            setMessage("링크를 삭제했습니다.");
            if (editingId === id) resetForm();
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "삭제에 실패했습니다.");
        }
    };

    return (
        <section className="admin-card admin-full">
            <div className="admin-section-head">
                <h2>LinkHub 관리</h2>
                <p>노출 여부와 링크 텍스트 표시 여부를 직접 설정할 수 있습니다.</p>
            </div>

            <form className="admin-form-grid" onSubmit={handleSubmit}>
                <label>
                    제목
                    <input name="title" value={form.title} onChange={handleChange} required />
                </label>
                <label>
                    링크 URL
                    <input name="link" value={form.link} onChange={handleChange} placeholder="https://..." required />
                </label>
                <label className="admin-checkbox">
                    <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                    노출 활성
                </label>
                <label className="admin-checkbox">
                    <input type="checkbox" name="showLink" checked={form.showLink} onChange={handleChange} />
                    링크 텍스트 표시
                </label>
                <div className="admin-form-actions admin-span-2">
                    <button className="admin-btn primary" type="submit">{editingId ? "수정 저장" : "링크 추가"}</button>
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
                    <p className="admin-empty">등록된 링크가 없습니다.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>링크</th>
                                <th>노출</th>
                                <th>표시 방식</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title || "-"}</td>
                                    <td>{item.link || "-"}</td>
                                    <td>{item.active ? "노출" : "숨김"}</td>
                                    <td>{item.showLink === false ? "제목만" : "제목+링크"}</td>
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

export default LinkHubManager;