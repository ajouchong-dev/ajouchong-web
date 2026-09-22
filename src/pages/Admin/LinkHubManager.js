import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowDown, ArrowUp, GripVertical, Pencil, RotateCcw, Save, Trash2 } from "lucide-react";
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
    title: "",
    link: "",
    active: true,
    showLink: true,
};

const getItemId = (item) => item.id;

const LinkHubManager = () => {
    const { auth } = useAuth();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(INITIAL_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [orderedIds, setOrderedIds] = useState(null); // null이면 서버 순서 그대로
    const [savingOrder, setSavingOrder] = useState(false);
    const [dragId, setDragId] = useState(null); // 끌고 있는 행
    const [overId, setOverId] = useState(null); // 놓을 자리(그 행 위에 들어간다)

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
            setOrderedIds(null);
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

    const moveItem = (id, direction) => {
        const current = orderedIds ?? items.map(getItemId);
        const index = current.indexOf(id);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= current.length) return;
        const next = [...current];
        [next[index], next[target]] = [next[target], next[index]];
        setOrderedIds(next);
    };

    // 끌던 행을 targetId 행 자리에 끼워 넣는다 (targetId 행은 아래로 밀린다)
    const moveItemTo = (id, targetId) => {
        if (id === targetId) return;
        const current = orderedIds ?? items.map(getItemId);
        const from = current.indexOf(id);
        const to = current.indexOf(targetId);
        if (from < 0 || to < 0) return;
        const next = [...current];
        next.splice(from, 1);
        next.splice(to, 0, id);
        setOrderedIds(next);
    };

    const handleDragStart = (event, id) => {
        setDragId(id);
        event.dataTransfer.effectAllowed = "move";
        // Firefox는 데이터가 있어야 드래그가 시작된다
        event.dataTransfer.setData("text/plain", String(id));
    };

    const handleDragOver = (event, id) => {
        if (dragId === null) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        if (overId !== id) setOverId(id);
    };

    const handleDrop = (event, id) => {
        event.preventDefault();
        if (dragId !== null) moveItemTo(dragId, id);
        setDragId(null);
        setOverId(null);
    };

    const handleDragEnd = () => {
        setDragId(null);
        setOverId(null);
    };

    const handleSaveOrder = async () => {
        if (!orderedIds) return;
        setSavingOrder(true);
        setError("");
        setMessage("");
        try {
            const response = await apiClient.patch("/api/admin/link/order", { orderedIds }, authConfig);
            const saved = pickItems(response.data);
            if (saved.length > 0) {
                setItems(saved);
                setOrderedIds(null);
            } else {
                await loadItems();
            }
            setMessage("링크 순서를 저장했습니다.");
        } catch (e) {
            setError(e.response?.data?.message || "순서 저장에 실패했습니다.");
        } finally {
            setSavingOrder(false);
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

    // ── 표현용 상태 (데이터 로직과 무관) ──
    const [query, setQuery] = useState("");
    const formPanel = useFormPanel(editingId);
    const changedRows = useChangedRows(items, getItemId);
    useAutoDismiss(message, setMessage);

    const editingItem = items.find((item) => item.id === editingId);
    const keyword = query.trim().toLowerCase();
    const orderDirty = orderedIds !== null;
    const sortedItems = orderedIds
        ? orderedIds.map((id) => items.find((item) => getItemId(item) === id)).filter(Boolean)
        : items;
    const visibleItems = keyword
        ? sortedItems.filter((item) =>
            [item.title, item.link].some((value) => String(value || "").toLowerCase().includes(keyword)))
        : sortedItems;
    // 검색으로 일부만 보일 때는 순서 이동을 막는다 (안 보이는 항목과 자리가 바뀌는 혼란 방지)
    const canReorder = !keyword && !loading;

    return (
        <section className="admin-section">
            <AdminPanelHead
                title="LinkHub 관리"
                count={keyword ? `${items.length}건 중 ${visibleItems.length}건` : `총 ${items.length}건`}
                description="노출 여부와 링크 텍스트 표시 여부를 직접 설정할 수 있습니다."
            >
                <AdminFormToggle
                    open={formPanel.open}
                    editing={Boolean(editingId)}
                    label="링크 추가"
                    controls="linkhub-form-panel"
                    onClick={() => (editingId ? resetForm() : formPanel.setOpen((prev) => !prev))}
                />
            </AdminPanelHead>

            <AdminStatus
                message={message}
                error={error}
                onDismissMessage={() => setMessage("")}
                onDismissError={() => setError("")}
            />

            <AdminCollapse open={formPanel.open} id="linkhub-form-panel" panelRef={formPanel.panelRef}>
                <form className="admin-form-card" onSubmit={handleSubmit}>
                    {editingId && <AdminEditBanner title={editingItem?.title || form.title} onCancel={resetForm} />}
                    <div className="admin-form-grid">
                        <AdminField label="제목" htmlFor="linkhub-title" required>
                            <input id="linkhub-title" className="ui-input" name="title" value={form.title} onChange={handleChange} required />
                        </AdminField>
                        <AdminField label="링크 URL" htmlFor="linkhub-link" required>
                            <input id="linkhub-link" className="ui-input" name="link" value={form.link} onChange={handleChange} placeholder="https://..." required />
                        </AdminField>
                        <AdminCheckbox label="노출 활성" name="active" checked={form.active} onChange={handleChange} />
                        <AdminCheckbox label="링크 텍스트 표시" name="showLink" checked={form.showLink} onChange={handleChange} />
                    </div>

                    <div className="admin-form-actions">
                        {editingId && (
                            <button className="ui-btn" type="button" onClick={resetForm}>수정 취소</button>
                        )}
                        <button className="ui-btn is-primary" type="submit">{editingId ? "수정 저장" : "링크 추가"}</button>
                    </div>
                </form>
            </AdminCollapse>

            {items.length > 0 && (
                <div className="admin-toolbar">
                    <AdminSearch value={query} onChange={setQuery} placeholder="제목, 링크 검색" />
                    {orderDirty && (
                        <div className="admin-order-actions">
                            <button
                                className="ui-btn is-small"
                                type="button"
                                onClick={() => setOrderedIds(null)}
                                disabled={savingOrder}
                            >
                                <RotateCcw size={14} aria-hidden="true" />
                                되돌리기
                            </button>
                            <button
                                className="ui-btn is-small is-primary"
                                type="button"
                                onClick={handleSaveOrder}
                                disabled={savingOrder}
                            >
                                <Save size={14} aria-hidden="true" />
                                {savingOrder ? "저장 중..." : "순서 저장"}
                            </button>
                        </div>
                    )}
                    <span className="admin-toolbar-summary">
                        {orderDirty ? (
                            <strong>순서가 바뀌었습니다. 저장을 눌러야 반영됩니다.</strong>
                        ) : keyword ? (
                            "검색 중에는 순서를 옮길 수 없습니다."
                        ) : (
                            "행을 끌어서 놓거나 화살표로 노출 순서를 바꿀 수 있습니다."
                        )}
                    </span>
                </div>
            )}

            {loading && items.length === 0 ? (
                <AdminSkeleton />
            ) : items.length === 0 ? (
                <AdminEmpty>등록된 링크가 없습니다.</AdminEmpty>
            ) : visibleItems.length === 0 ? (
                <AdminEmpty>검색어와 일치하는 링크가 없습니다.</AdminEmpty>
            ) : (
                <div className={`admin-table-wrap ${loading ? "is-loading" : ""}`} aria-busy={loading}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-col-order">순서</th>
                                <th>제목</th>
                                <th>링크</th>
                                <th>노출</th>
                                <th>표시 방식</th>
                                <th className="admin-col-actions">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleItems.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={[
                                        changedRows.has(String(item.id)) ? "is-flash" : "",
                                        editingId === item.id ? "is-editing" : "",
                                        canReorder ? "is-draggable" : "",
                                        dragId === item.id ? "is-dragging" : "",
                                        overId === item.id && dragId !== item.id ? "is-drop-target" : "",
                                    ].filter(Boolean).join(" ")}
                                    draggable={canReorder}
                                    onDragStart={(event) => handleDragStart(event, item.id)}
                                    onDragOver={(event) => handleDragOver(event, item.id)}
                                    onDrop={(event) => handleDrop(event, item.id)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <td className="admin-cell-order" data-label="순서">
                                        <div className="admin-order-cell">
                                            <span className="admin-order-grip" aria-hidden="true">
                                                <GripVertical size={16} />
                                            </span>
                                            <span className="admin-order-num">{index + 1}</span>
                                            <button
                                                className="admin-order-btn"
                                                type="button"
                                                aria-label={`${item.title} 위로`}
                                                disabled={!canReorder || index === 0}
                                                onClick={() => moveItem(item.id, -1)}
                                            >
                                                <ArrowUp size={16} aria-hidden="true" />
                                            </button>
                                            <button
                                                className="admin-order-btn"
                                                type="button"
                                                aria-label={`${item.title} 아래로`}
                                                disabled={!canReorder || index === visibleItems.length - 1}
                                                onClick={() => moveItem(item.id, 1)}
                                            >
                                                <ArrowDown size={16} aria-hidden="true" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="admin-cell-title">{item.title || "-"}</td>
                                    <td className="admin-cell-wide admin-cell-url">{item.link || "-"}</td>
                                    <td className="admin-cell-badge">
                                        <span className={`ui-badge ${item.active ? "is-ok" : ""}`}>{item.active ? "노출" : "숨김"}</span>
                                    </td>
                                    <td className="admin-cell-badge">
                                        <span className="ui-badge">{item.showLink === false ? "제목만" : "제목+링크"}</span>
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

export default LinkHubManager;
