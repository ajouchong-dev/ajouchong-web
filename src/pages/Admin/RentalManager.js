import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowDownUp, Minus, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
    AdminCheckbox,
    AdminCollapse,
    AdminEditBanner,
    AdminEmpty,
    AdminField,
    AdminFileDrop,
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

const IMAGE_FALLBACK =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='240'><rect width='100%' height='100%' fill='#edf3fa'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#56708f' font-size='16' font-family='Arial'>No Image</text></svg>`
    );

const ITEM_FORM_INITIAL = {
    name: "",
    category: "",
    totalQuantity: 1,
    currentQuantity: 1,
    imageUrl: "",
    note: "",
    displayOrder: 1,
    active: true,
};

const getItemId = (item) => item.id;

// 재고 상태 표시 기준: 공개 대여 페이지(pages/Welfare/Rental)의 statusOf와 같은 규칙
const stockStatusOf = (current, total) => {
    if (current <= 0) return "품절";
    if (current <= Math.max(1, Math.ceil(total * 0.2))) return "임박";
    return "가능";
};

const stockRatio = (item) => (item.totalQuantity > 0 ? item.currentQuantity / item.totalQuantity : 0);

const RentalManager = () => {
    const { auth } = useAuth();
    const [items, setItems] = useState([]);
    const [itemForm, setItemForm] = useState(ITEM_FORM_INITIAL);
    const [pendingCurrentById, setPendingCurrentById] = useState({});
    const [editingItemId, setEditingItemId] = useState(null);
    const [originalEditingItem, setOriginalEditingItem] = useState(null);
    const [uploading, setUploading] = useState(false);
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

    const loadItems = async () => {
        setLoading(true);
        setError("");
        try {
            const itemsRes = await apiClient.get("/api/admin/rental/items", authConfig);
            setItems(itemsRes.data?.data || []);
            setPendingCurrentById({});
        } catch (e) {
            setError(e.response?.data?.message || "대여 품목 데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onItemFormChange = (event) => {
        const { name, value, type, checked } = event.target;
        setItemForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (["totalQuantity", "currentQuantity", "displayOrder"].includes(name) ? Number(value) : value),
        }));
    };

    const resetItemForm = () => {
        setItemForm(ITEM_FORM_INITIAL);
        setEditingItemId(null);
        setOriginalEditingItem(null);
    };

    const handleUploadImage = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await apiClient.post("/api/admin/rental/items/upload-image", formData, {
                ...authConfig,
                headers: {
                    ...authConfig.headers,
                    "Content-Type": "multipart/form-data",
                },
            });
            const imageUrl = response.data?.data?.imageUrl;
            setItemForm((prev) => ({ ...prev, imageUrl: imageUrl || "" }));
            setMessage("이미지 업로드 완료");
        } catch (e) {
            setError(e.response?.data?.message || "이미지 업로드 실패");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveItem = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        try {
            const payload = {
                ...itemForm,
                imageUrl: itemForm.imageUrl.trim() || null,
                note: itemForm.note.trim() || null,
            };
            if (editingItemId) {
                const totalChanged = originalEditingItem && originalEditingItem.totalQuantity !== payload.totalQuantity;
                const currentChanged = originalEditingItem && originalEditingItem.currentQuantity !== payload.currentQuantity;
                if (totalChanged || currentChanged) {
                    const confirmMessage = [
                        `총 수량: ${originalEditingItem.totalQuantity} -> ${payload.totalQuantity}`,
                        `현재 수량: ${originalEditingItem.currentQuantity} -> ${payload.currentQuantity}`,
                        "변경하시겠습니까?"
                    ].join("\n");
                    if (!window.confirm(confirmMessage)) {
                        return;
                    }
                }
                await apiClient.put(`/api/admin/rental/items/${editingItemId}`, payload, authConfig);
                setMessage("대여 품목을 수정했습니다.");
            } else {
                await apiClient.post("/api/admin/rental/items", payload, authConfig);
                setMessage("대여 품목을 추가했습니다.");
            }
            resetItemForm();
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "품목 저장에 실패했습니다.");
        }
    };

    const handleAdjustQuantityLocal = (item, delta) => {
        const base = Object.prototype.hasOwnProperty.call(pendingCurrentById, item.id)
            ? pendingCurrentById[item.id]
            : item.currentQuantity;
        const next = base + delta;
        if (next < 0 || next > item.totalQuantity) return;
        setPendingCurrentById((prev) => ({
            ...prev,
            [item.id]: next,
        }));
    };

    const handleEditItem = (item) => {
        setEditingItemId(item.id);
        setItemForm({
            name: item.name,
            category: item.category,
            totalQuantity: item.totalQuantity,
            currentQuantity: item.currentQuantity,
            imageUrl: item.imageUrl || "",
            note: item.note || "",
            displayOrder: item.displayOrder,
            active: item.active,
        });
        setOriginalEditingItem({
            totalQuantity: item.totalQuantity,
            currentQuantity: item.currentQuantity,
        });
        setMessage("");
        setError("");
    };

    const handleQuickEditQuantity = async (item) => {
        const nextCurrent = Object.prototype.hasOwnProperty.call(pendingCurrentById, item.id)
            ? pendingCurrentById[item.id]
            : item.currentQuantity;

        if (nextCurrent === item.currentQuantity) {
            window.alert("빠른 조정으로 변경된 수량이 없습니다.");
            return;
        }

        const confirmMessage = [
            `총 수량: ${item.totalQuantity} -> ${item.totalQuantity}`,
            `현재 수량: ${item.currentQuantity} -> ${nextCurrent}`,
            "이렇게 바꾸겠습니까?"
        ].join("\n");

        if (!window.confirm(confirmMessage)) {
            return;
        }

        setMessage("");
        setError("");
        try {
            await apiClient.put(
                `/api/admin/rental/items/${item.id}`,
                {
                    name: item.name,
                    category: item.category,
                    totalQuantity: item.totalQuantity,
                    currentQuantity: nextCurrent,
                    imageUrl: item.imageUrl || null,
                    note: item.note || null,
                    displayOrder: item.displayOrder,
                    active: item.active,
                },
                authConfig
            );
            setMessage("수량을 수정했습니다.");
            setPendingCurrentById((prev) => {
                const next = { ...prev };
                delete next[item.id];
                return next;
            });
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "수량 수정에 실패했습니다.");
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("해당 품목을 삭제하시겠습니까?")) return;
        setMessage("");
        setError("");
        try {
            await apiClient.delete(`/api/admin/rental/items/${id}`, authConfig);
            setMessage("품목을 삭제했습니다.");
            if (editingItemId === id) resetItemForm();
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "품목 삭제에 실패했습니다.");
        }
    };

    // ── 표현용 상태 (데이터 로직과 무관) ──
    const [query, setQuery] = useState("");
    const [lowStockFirst, setLowStockFirst] = useState(false);
    const formPanel = useFormPanel(editingItemId);
    const changedRows = useChangedRows(items, getItemId);
    useAutoDismiss(message, setMessage);

    const editingItem = items.find((item) => item.id === editingItemId);
    const keyword = query.trim().toLowerCase();
    const filteredItems = keyword
        ? items.filter((item) =>
            [item.name, item.category].some((value) => String(value || "").toLowerCase().includes(keyword)))
        : items;
    const visibleItems = lowStockFirst
        ? [...filteredItems].sort((a, b) => stockRatio(a) - stockRatio(b))
        : filteredItems;
    const soldOutCount = items.filter((item) => stockStatusOf(item.currentQuantity, item.totalQuantity) === "품절").length;
    const lowCount = items.filter((item) => stockStatusOf(item.currentQuantity, item.totalQuantity) === "임박").length;

    return (
        <section className="admin-section">
            <AdminPanelHead
                title="대여사업 재고 관리"
                count={keyword ? `${items.length}건 중 ${visibleItems.length}건` : `총 ${items.length}건`}
                description="수량은 목록의 + / - 버튼으로 조정한 뒤 '수량 저장'을 누르면 반영됩니다."
            >
                <AdminFormToggle
                    open={formPanel.open}
                    editing={Boolean(editingItemId)}
                    label="품목 추가"
                    controls="rental-form-panel"
                    onClick={() => (editingItemId ? resetItemForm() : formPanel.setOpen((prev) => !prev))}
                />
            </AdminPanelHead>

            <AdminStatus
                message={message}
                error={error}
                onDismissMessage={() => setMessage("")}
                onDismissError={() => setError("")}
            />

            <AdminCollapse open={formPanel.open} id="rental-form-panel" panelRef={formPanel.panelRef}>
                <form className="admin-form-card" onSubmit={handleSaveItem}>
                    {editingItemId && <AdminEditBanner title={editingItem?.name || itemForm.name} onCancel={resetItemForm} />}
                    <div className="admin-form-grid">
                        <AdminField label="품목명" htmlFor="rental-name" required>
                            <input id="rental-name" className="ui-input" name="name" value={itemForm.name} onChange={onItemFormChange} required />
                        </AdminField>
                        <AdminField label="카테고리" htmlFor="rental-category" required>
                            <input id="rental-category" className="ui-input" name="category" value={itemForm.category} onChange={onItemFormChange} required />
                        </AdminField>
                        <AdminField label="총 수량" htmlFor="rental-total" required>
                            <input id="rental-total" className="ui-input" type="number" min={0} name="totalQuantity" value={itemForm.totalQuantity} onChange={onItemFormChange} required />
                        </AdminField>
                        <AdminField label="현재 수량" htmlFor="rental-current" required>
                            <input id="rental-current" className="ui-input" type="number" min={0} name="currentQuantity" value={itemForm.currentQuantity} onChange={onItemFormChange} required />
                        </AdminField>

                        <AdminField label="이미지 업로드" htmlFor="rental-image-file" span>
                            <AdminFileDrop
                                id="rental-image-file"
                                title="이미지를 끌어놓거나 눌러서 선택"
                                hint={uploading ? "업로드 중..." : "파일 선택 시 자동 업로드"}
                                busy={uploading}
                                inputProps={{ accept: "image/*", onChange: handleUploadImage }}
                            />
                        </AdminField>

                        <AdminField label="이미지 URL (자동 입력)" htmlFor="rental-image-url" span>
                            <input id="rental-image-url" className="ui-input" name="imageUrl" value={itemForm.imageUrl} onChange={onItemFormChange} placeholder="업로드 후 자동 입력" />
                        </AdminField>

                        <AdminField label="이미지 미리보기" span>
                            <img
                                className="admin-rental-preview"
                                src={itemForm.imageUrl || IMAGE_FALLBACK}
                                alt="품목 이미지 미리보기"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = IMAGE_FALLBACK;
                                }}
                            />
                        </AdminField>

                        <AdminField label="비고" htmlFor="rental-note" span>
                            <textarea id="rental-note" className="ui-textarea admin-textarea-sm" name="note" rows={2} value={itemForm.note} onChange={onItemFormChange} />
                        </AdminField>
                        <AdminField label="노출 순서" htmlFor="rental-order" required>
                            <input id="rental-order" className="ui-input" type="number" min={1} name="displayOrder" value={itemForm.displayOrder} onChange={onItemFormChange} required />
                        </AdminField>
                        <AdminCheckbox label="노출 활성" name="active" checked={itemForm.active} onChange={onItemFormChange} />
                    </div>

                    <div className="admin-form-actions">
                        {editingItemId && (
                            <button className="ui-btn" type="button" onClick={resetItemForm}>
                                수정 취소
                            </button>
                        )}
                        <button className="ui-btn is-primary" type="submit">
                            {editingItemId ? "품목 수정 저장" : "품목 추가"}
                        </button>
                    </div>
                </form>
            </AdminCollapse>

            {items.length > 0 && (
                <div className="admin-toolbar">
                    <AdminSearch value={query} onChange={setQuery} placeholder="품목명, 카테고리 검색" />
                    <button
                        type="button"
                        className="ui-chip admin-toolbar-chip"
                        aria-pressed={lowStockFirst}
                        onClick={() => setLowStockFirst((prev) => !prev)}
                    >
                        <ArrowDownUp size={14} aria-hidden="true" />
                        재고 적은 순
                    </button>
                    <p className="admin-toolbar-summary">
                        품절 <strong>{soldOutCount}</strong> · 임박 <strong>{lowCount}</strong>
                    </p>
                </div>
            )}

            {loading && items.length === 0 ? (
                <AdminSkeleton />
            ) : items.length === 0 ? (
                <AdminEmpty>등록된 대여 품목이 없습니다.</AdminEmpty>
            ) : visibleItems.length === 0 ? (
                <AdminEmpty>검색어와 일치하는 품목이 없습니다.</AdminEmpty>
            ) : (
                <div className={`admin-table-wrap ${loading ? "is-loading" : ""}`} aria-busy={loading}>
                    <table className="admin-table has-thumb">
                        <thead>
                            <tr>
                                <th className="admin-col-num">순서</th>
                                <th>이미지</th>
                                <th>품목명</th>
                                <th>카테고리</th>
                                <th>재고 (현재 / 총)</th>
                                <th>빠른 조정</th>
                                <th>상태</th>
                                <th className="admin-col-actions">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleItems.map((item) => {
                                const currentDisplay = Object.prototype.hasOwnProperty.call(pendingCurrentById, item.id)
                                    ? pendingCurrentById[item.id]
                                    : item.currentQuantity;
                                const isChanged = currentDisplay !== item.currentQuantity;
                                const stockStatus = stockStatusOf(currentDisplay, item.totalQuantity);
                                const stockPercent = item.totalQuantity > 0
                                    ? Math.min(100, Math.max(0, (currentDisplay / item.totalQuantity) * 100))
                                    : 0;
                                const rowClass = [
                                    changedRows.has(String(item.id)) ? "is-flash" : "",
                                    isChanged ? "is-dirty" : "",
                                    editingItemId === item.id ? "is-editing" : "",
                                ].join(" ");
                                return (
                                    <tr key={item.id} className={rowClass}>
                                        <td className="admin-cell-num" data-label="순서">{item.displayOrder}</td>
                                        <td className="admin-cell-thumb">
                                            <img
                                                className="admin-thumb"
                                                src={item.imageUrl || IMAGE_FALLBACK}
                                                alt={`${item.name} 썸네일`}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = IMAGE_FALLBACK;
                                                }}
                                            />
                                        </td>
                                        <td className="admin-cell-title">{item.name}</td>
                                        <td data-label="카테고리">{item.category}</td>
                                        <td className="admin-cell-wide admin-cell-stock">
                                            <div className="admin-stock">
                                                <div className="admin-stock-line">
                                                    <span className="admin-stock-nums">
                                                        <strong>{currentDisplay}</strong> / {item.totalQuantity}
                                                    </span>
                                                    {stockStatus === "품절" && <span className="ui-badge is-danger">품절</span>}
                                                    {stockStatus === "임박" && <span className="ui-badge is-warn">재고 임박</span>}
                                                    {isChanged && <span className="admin-pending-mark">(변경됨 · 저장 전)</span>}
                                                </div>
                                                <div className="ui-meter" style={{ "--value": `${stockPercent}%` }}><span /></div>
                                            </div>
                                        </td>
                                        <td className="admin-cell-wide">
                                            <div className="admin-stepper-row">
                                                <div className="admin-stepper" role="group" aria-label={`${item.name} 현재 수량 조정`}>
                                                    <button
                                                        type="button"
                                                        className="admin-stepper-btn"
                                                        aria-label="1개 줄이기"
                                                        onClick={() => handleAdjustQuantityLocal(item, -1)}
                                                        disabled={currentDisplay <= 0}
                                                    >
                                                        <Minus size={18} aria-hidden="true" />
                                                    </button>
                                                    <span className="admin-stepper-value" aria-live="polite">{currentDisplay}</span>
                                                    <button
                                                        type="button"
                                                        className="admin-stepper-btn"
                                                        aria-label="1개 늘리기"
                                                        onClick={() => handleAdjustQuantityLocal(item, 1)}
                                                        disabled={currentDisplay >= item.totalQuantity}
                                                    >
                                                        <Plus size={18} aria-hidden="true" />
                                                    </button>
                                                </div>
                                                <button
                                                    className={`ui-btn admin-stepper-save ${isChanged ? "is-brand" : ""}`}
                                                    type="button"
                                                    onClick={() => handleQuickEditQuantity(item)}
                                                >
                                                    <Save size={16} aria-hidden="true" />
                                                    수량 저장
                                                </button>
                                            </div>
                                        </td>
                                        <td className="admin-cell-badge">
                                            <span className={`ui-badge ${item.active ? "is-ok" : ""}`}>{item.active ? "활성" : "비활성"}</span>
                                        </td>
                                        <td className="admin-cell-actions">
                                            <div className="admin-actions">
                                                <button
                                                    className="ui-btn is-small admin-act"
                                                    type="button"
                                                    onClick={() => {
                                                        handleEditItem(item);
                                                        formPanel.reveal();
                                                    }}
                                                >
                                                    <Pencil size={14} aria-hidden="true" />
                                                    상세 수정
                                                </button>
                                                <button className="ui-btn is-small is-danger admin-act" type="button" onClick={() => handleDeleteItem(item.id)}>
                                                    <Trash2 size={14} aria-hidden="true" />
                                                    삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default RentalManager;
