import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

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

    return (
        <section className="admin-card admin-full">
            <div className="admin-section-head">
                <h2>대여사업 재고 관리</h2>
                <p>수량은 테이블에서 + / - 버튼으로 즉시 조정할 수 있습니다.</p>
            </div>

            {message && <p className="admin-feedback success">{message}</p>}
            {error && <p className="admin-feedback error">{error}</p>}
            {loading && <p className="admin-empty">불러오는 중...</p>}

            <form className="admin-form-grid" onSubmit={handleSaveItem}>
                <label>
                    품목명
                    <input name="name" value={itemForm.name} onChange={onItemFormChange} required />
                </label>
                <label>
                    카테고리
                    <input name="category" value={itemForm.category} onChange={onItemFormChange} required />
                </label>
                <label>
                    총 수량
                    <input type="number" min={0} name="totalQuantity" value={itemForm.totalQuantity} onChange={onItemFormChange} required />
                </label>
                <label>
                    현재 수량
                    <input type="number" min={0} name="currentQuantity" value={itemForm.currentQuantity} onChange={onItemFormChange} required />
                </label>

                <label className="admin-span-2">
                    이미지 업로드
                    <div className="admin-upload-row">
                        <input type="file" accept="image/*" onChange={handleUploadImage} />
                        <span className="admin-upload-hint">{uploading ? "업로드 중..." : "파일 선택 시 자동 업로드"}</span>
                    </div>
                </label>

                <label className="admin-span-2">
                    이미지 URL (자동 입력)
                    <input name="imageUrl" value={itemForm.imageUrl} onChange={onItemFormChange} placeholder="업로드 후 자동 입력" />
                </label>

                <label className="admin-span-2">
                    이미지 미리보기
                    <img
                        className="admin-rental-preview"
                        src={itemForm.imageUrl || IMAGE_FALLBACK}
                        alt="품목 이미지 미리보기"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = IMAGE_FALLBACK;
                        }}
                    />
                </label>

                <label className="admin-span-2">
                    비고
                    <textarea name="note" rows={2} value={itemForm.note} onChange={onItemFormChange} />
                </label>
                <label>
                    노출 순서
                    <input type="number" min={1} name="displayOrder" value={itemForm.displayOrder} onChange={onItemFormChange} required />
                </label>
                <label className="admin-checkbox">
                    <input type="checkbox" name="active" checked={itemForm.active} onChange={onItemFormChange} />
                    노출 활성
                </label>
                <div className="admin-form-actions admin-span-2">
                    <button className="admin-btn primary" type="submit">
                        {editingItemId ? "품목 수정 저장" : "품목 추가"}
                    </button>
                    {editingItemId && (
                        <button className="admin-btn muted" type="button" onClick={resetItemForm}>
                            수정 취소
                        </button>
                    )}
                </div>
            </form>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>순서</th>
                            <th>이미지</th>
                            <th>품목명</th>
                            <th>카테고리</th>
                            <th>총 수량</th>
                            <th>현재 수량</th>
                            <th>빠른 조정</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const currentDisplay = Object.prototype.hasOwnProperty.call(pendingCurrentById, item.id)
                                ? pendingCurrentById[item.id]
                                : item.currentQuantity;
                            const isChanged = currentDisplay !== item.currentQuantity;
                            return (
                            <tr key={item.id}>
                                <td>{item.displayOrder}</td>
                                <td>
                                    <img
                                        className="admin-rental-thumb"
                                        src={item.imageUrl || IMAGE_FALLBACK}
                                        alt={`${item.name} 썸네일`}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = IMAGE_FALLBACK;
                                        }}
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.totalQuantity}</td>
                                <td>
                                    {currentDisplay}
                                    {isChanged && <span className="admin-pending-mark"> (변경됨)</span>}
                                </td>
                                <td>
                                    <div className="admin-stepper">
                                        <button
                                            type="button"
                                            className="admin-btn small"
                                            onClick={() => handleAdjustQuantityLocal(item, -1)}
                                            disabled={currentDisplay <= 0}
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-btn small"
                                            onClick={() => handleAdjustQuantityLocal(item, 1)}
                                            disabled={currentDisplay >= item.totalQuantity}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>{item.active ? "활성" : "비활성"}</td>
                                <td className="admin-actions">
                                    <button className="admin-btn small" type="button" onClick={() => handleQuickEditQuantity(item)}>수정</button>
                                    <button className="admin-btn small muted" type="button" onClick={() => handleEditItem(item)}>상세</button>
                                    <button className="admin-btn small danger" type="button" onClick={() => handleDeleteItem(item.id)}>삭제</button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default RentalManager;
