import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, UploadCloud } from "lucide-react";
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

const INITIAL_CATEGORY_FORM = {
    name: "",
    description: "",
    displayOrder: 1,
    active: true,
};

const INITIAL_DOCUMENT_FORM = {
    categoryId: "",
    title: "",
    fileUrl: "",
    meetingDate: "",
    displayOrder: 1,
    active: true,
};

const getItemId = (item) => item.id;

const ProceedingManager = () => {
    const { auth } = useAuth();
    const fileInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM);
    const [documentForm, setDocumentForm] = useState(INITIAL_DOCUMENT_FORM);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingDocumentId, setEditingDocumentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const authConfig = useMemo(
        () => ({
            headers: { Authorization: `Bearer ${auth.token}` },
            withCredentials: true,
        }),
        [auth.token]
    );

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const [categoriesRes, documentsRes] = await Promise.all([
                apiClient.get("/api/admin/proceeding/categories", authConfig),
                apiClient.get("/api/admin/proceeding/documents", authConfig),
            ]);

            const categoryData = categoriesRes.data?.data || [];
            const documentData = documentsRes.data?.data || [];

            setCategories(categoryData);
            setDocuments(documentData);

            if (!editingDocumentId && categoryData.length > 0 && !documentForm.categoryId) {
                setDocumentForm((prev) => ({ ...prev, categoryId: String(categoryData[0].id) }));
            }
        } catch (e) {
            setError(e.response?.data?.message || "회의록 데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetCategoryForm = () => {
        setCategoryForm(INITIAL_CATEGORY_FORM);
        setEditingCategoryId(null);
    };

    const resetDocumentForm = () => {
        setDocumentForm({
            ...INITIAL_DOCUMENT_FORM,
            categoryId: categories[0] ? String(categories[0].id) : "",
        });
        setEditingDocumentId(null);
        setDragging(false);
    };

    const handleCategoryChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCategoryForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (name === "displayOrder" ? Number(value) : value),
        }));
    };

    const handleDocumentChange = (event) => {
        const { name, value, type, checked } = event.target;
        setDocumentForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (name === "displayOrder" ? Number(value) : value),
        }));
    };

    const handleCategorySubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            ...categoryForm,
            name: categoryForm.name.trim(),
            description: categoryForm.description.trim() || null,
        };

        try {
            if (editingCategoryId) {
                await apiClient.put(`/api/admin/proceeding/categories/${editingCategoryId}`, payload, authConfig);
                setMessage("회의록 카테고리를 수정했습니다.");
            } else {
                await apiClient.post("/api/admin/proceeding/categories", payload, authConfig);
                setMessage("회의록 카테고리를 추가했습니다.");
            }

            resetCategoryForm();
            await loadData();
        } catch (e) {
            setError(e.response?.data?.message || "카테고리 저장에 실패했습니다.");
        }
    };

    const uploadDocumentFile = async (file) => {
        if (!file) return;

        const filename = (file.name || "").toLowerCase();
        if (!filename.endsWith(".pdf")) {
            setError("PDF 파일만 업로드할 수 있습니다.");
            return;
        }

        setUploading(true);
        setError("");
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await apiClient.post(
                "/api/admin/proceeding/documents/upload-file",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            const uploadedUrl = response.data?.data?.fileUrl || "";
            if (!uploadedUrl) {
                throw new Error("업로드 URL을 받지 못했습니다.");
            }

            const titleFromFile = file.name.replace(/\.pdf$/i, "").trim();
            setDocumentForm((prev) => ({
                ...prev,
                fileUrl: uploadedUrl,
                title: prev.title.trim() ? prev.title : titleFromFile,
            }));

            setMessage("PDF 업로드가 완료되었습니다. 필요하면 제목/날짜를 수정 후 저장하세요.");
        } catch (e) {
            setError(e.response?.data?.message || e.message || "파일 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
            setDragging(false);
        }
    };

    const onFileInputChange = async (event) => {
        const file = event.target.files?.[0];
        await uploadDocumentFile(file);
        event.target.value = "";
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        await uploadDocumentFile(file);
    };

    const handleDocumentSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            ...documentForm,
            categoryId: Number(documentForm.categoryId),
            title: documentForm.title.trim(),
            fileUrl: documentForm.fileUrl.trim(),
            meetingDate: documentForm.meetingDate || null,
        };

        try {
            if (editingDocumentId) {
                await apiClient.put(`/api/admin/proceeding/documents/${editingDocumentId}`, payload, authConfig);
                setMessage("회의록 문서를 수정했습니다.");
            } else {
                await apiClient.post("/api/admin/proceeding/documents", payload, authConfig);
                setMessage("회의록 문서를 추가했습니다.");
            }
            resetDocumentForm();
            await loadData();
        } catch (e) {
            setError(e.response?.data?.message || "문서 저장에 실패했습니다.");
        }
    };

    const handleEditCategory = (item) => {
        setEditingCategoryId(item.id);
        setCategoryForm({
            name: item.name || "",
            description: item.description || "",
            displayOrder: item.displayOrder ?? 1,
            active: item.active ?? true,
        });
        setMessage("");
        setError("");
    };

    const handleEditDocument = (item) => {
        setEditingDocumentId(item.id);
        setDocumentForm({
            categoryId: String(item.categoryId || ""),
            title: item.title || "",
            fileUrl: item.fileUrl || "",
            meetingDate: item.meetingDate || "",
            displayOrder: item.displayOrder ?? 1,
            active: item.active ?? true,
        });
        setMessage("");
        setError("");
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("카테고리를 삭제하시겠습니까? 연결된 문서도 함께 삭제됩니다.")) return;

        setError("");
        setMessage("");
        try {
            await apiClient.delete(`/api/admin/proceeding/categories/${id}`, authConfig);
            if (editingCategoryId === id) resetCategoryForm();
            setMessage("카테고리를 삭제했습니다.");
            await loadData();
        } catch (e) {
            setError(e.response?.data?.message || "카테고리 삭제에 실패했습니다.");
        }
    };

    const handleDeleteDocument = async (id) => {
        if (!window.confirm("문서를 삭제하시겠습니까?")) return;

        setError("");
        setMessage("");
        try {
            await apiClient.delete(`/api/admin/proceeding/documents/${id}`, authConfig);
            if (editingDocumentId === id) resetDocumentForm();
            setMessage("문서를 삭제했습니다.");
            await loadData();
        } catch (e) {
            setError(e.response?.data?.message || "문서 삭제에 실패했습니다.");
        }
    };

    // ── 표현용 상태 (데이터 로직과 무관) ──
    const [view, setView] = useState("documents");
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const categoryPanel = useFormPanel(editingCategoryId);
    const documentPanel = useFormPanel(editingDocumentId);
    const changedCategoryRows = useChangedRows(categories, getItemId);
    const changedDocumentRows = useChangedRows(documents, getItemId);
    useAutoDismiss(message, setMessage, 7000);

    const editingCategory = categories.find((item) => item.id === editingCategoryId);
    const editingDocument = documents.find((item) => item.id === editingDocumentId);
    const keyword = query.trim().toLowerCase();
    const visibleDocuments = documents.filter((item) => {
        if (categoryFilter && String(item.categoryId) !== categoryFilter) return false;
        if (!keyword) return true;
        return [item.title, item.categoryName, item.meetingDate]
            .some((value) => String(value || "").toLowerCase().includes(keyword));
    });
    const isFiltering = Boolean(keyword || categoryFilter);

    return (
        <section className="admin-section">
            <AdminPanelHead
                title="회의록 관리"
                count={`문서 ${documents.length}건 · 카테고리 ${categories.length}개`}
                description="카테고리/문서 추가, 수정, 삭제와 PDF 드래그 앤 드롭 업로드를 한 화면에서 처리할 수 있습니다."
            />

            <AdminStatus
                message={message}
                error={error}
                onDismissMessage={() => setMessage("")}
                onDismissError={() => setError("")}
            />

            <div className="admin-segment" role="group" aria-label="회의록 관리 영역">
                <button
                    type="button"
                    className="ui-chip"
                    aria-pressed={view === "documents"}
                    onClick={() => setView("documents")}
                >
                    문서 {documents.length}
                </button>
                <button
                    type="button"
                    className="ui-chip"
                    aria-pressed={view === "categories"}
                    onClick={() => setView("categories")}
                >
                    카테고리 {categories.length}
                </button>
            </div>

            <div className="admin-subpanel" hidden={view !== "categories"}>
                <div className="admin-subpanel-head">
                    <h3>카테고리 관리</h3>
                    <AdminFormToggle
                        open={categoryPanel.open}
                        editing={Boolean(editingCategoryId)}
                        label="카테고리 추가"
                        controls="proceeding-category-form-panel"
                        onClick={() => (editingCategoryId ? resetCategoryForm() : categoryPanel.setOpen((prev) => !prev))}
                    />
                </div>

                <AdminCollapse open={categoryPanel.open} id="proceeding-category-form-panel" panelRef={categoryPanel.panelRef}>
                    <form className="admin-form-card" onSubmit={handleCategorySubmit}>
                        {editingCategoryId && (
                            <AdminEditBanner title={editingCategory?.name || categoryForm.name} onCancel={resetCategoryForm} />
                        )}
                        <div className="admin-form-grid">
                            <AdminField label="카테고리명" htmlFor="proceeding-category-name" required>
                                <input id="proceeding-category-name" className="ui-input" name="name" value={categoryForm.name} onChange={handleCategoryChange} required />
                            </AdminField>
                            <AdminField label="표시 순서" htmlFor="proceeding-category-order" required>
                                <input
                                    id="proceeding-category-order"
                                    className="ui-input"
                                    type="number"
                                    min={1}
                                    name="displayOrder"
                                    value={categoryForm.displayOrder}
                                    onChange={handleCategoryChange}
                                    required
                                />
                            </AdminField>
                            <AdminField label="설명" htmlFor="proceeding-category-description" span>
                                <textarea
                                    id="proceeding-category-description"
                                    className="ui-textarea admin-textarea-sm"
                                    name="description"
                                    rows={2}
                                    value={categoryForm.description}
                                    onChange={handleCategoryChange}
                                />
                            </AdminField>
                            <AdminCheckbox label="활성" name="active" checked={categoryForm.active} onChange={handleCategoryChange} />
                        </div>
                        <div className="admin-form-actions">
                            {editingCategoryId && (
                                <button className="ui-btn" type="button" onClick={resetCategoryForm}>수정 취소</button>
                            )}
                            <button className="ui-btn is-primary" type="submit">{editingCategoryId ? "수정 저장" : "카테고리 추가"}</button>
                        </div>
                    </form>
                </AdminCollapse>

                {loading && categories.length === 0 ? (
                    <AdminSkeleton rows={3} />
                ) : categories.length === 0 ? (
                    <AdminEmpty>카테고리가 없습니다.</AdminEmpty>
                ) : (
                    <div className={`admin-table-wrap ${loading ? "is-loading" : ""}`} aria-busy={loading}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-col-num">순서</th>
                                    <th>카테고리명</th>
                                    <th>상태</th>
                                    <th className="admin-col-actions">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`${changedCategoryRows.has(String(item.id)) ? "is-flash" : ""} ${editingCategoryId === item.id ? "is-editing" : ""}`}
                                    >
                                        <td className="admin-cell-num" data-label="순서">{item.displayOrder}</td>
                                        <td className="admin-cell-title">{item.name}</td>
                                        <td className="admin-cell-badge">
                                            <span className={`ui-badge ${item.active ? "is-ok" : ""}`}>{item.active ? "활성" : "비활성"}</span>
                                        </td>
                                        <td className="admin-cell-actions">
                                            <div className="admin-actions">
                                                <button
                                                    className="ui-btn is-small admin-act"
                                                    type="button"
                                                    onClick={() => {
                                                        handleEditCategory(item);
                                                        categoryPanel.reveal();
                                                    }}
                                                >
                                                    <Pencil size={14} aria-hidden="true" />
                                                    수정
                                                </button>
                                                <button className="ui-btn is-small is-danger admin-act" type="button" onClick={() => handleDeleteCategory(item.id)}>
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
            </div>

            <div className="admin-subpanel" hidden={view !== "documents"}>
                <div className="admin-subpanel-head">
                    <h3>문서 관리</h3>
                    <AdminFormToggle
                        open={documentPanel.open}
                        editing={Boolean(editingDocumentId)}
                        label="문서 추가"
                        controls="proceeding-document-form-panel"
                        onClick={() => (editingDocumentId ? resetDocumentForm() : documentPanel.setOpen((prev) => !prev))}
                    />
                </div>

                <AdminCollapse open={documentPanel.open} id="proceeding-document-form-panel" panelRef={documentPanel.panelRef}>
                    <form className="admin-form-card" onSubmit={handleDocumentSubmit}>
                        {editingDocumentId && (
                            <AdminEditBanner title={editingDocument?.title || documentForm.title} onCancel={resetDocumentForm} />
                        )}
                        <div className="admin-form-grid">
                            <AdminField label="카테고리" htmlFor="proceeding-document-category" required>
                                <select
                                    id="proceeding-document-category"
                                    className="ui-select"
                                    name="categoryId"
                                    value={documentForm.categoryId}
                                    onChange={handleDocumentChange}
                                    required
                                >
                                    {categories.length === 0 ? (
                                        <option value="">카테고리를 먼저 추가하세요</option>
                                    ) : (
                                        categories.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                    )}
                                </select>
                            </AdminField>
                            <AdminField label="회의 일자" htmlFor="proceeding-document-date">
                                <input
                                    id="proceeding-document-date"
                                    className="ui-input"
                                    type="date"
                                    name="meetingDate"
                                    value={documentForm.meetingDate}
                                    onChange={handleDocumentChange}
                                />
                            </AdminField>
                            <AdminField label="문서 제목" htmlFor="proceeding-document-title" required span>
                                <input id="proceeding-document-title" className="ui-input" name="title" value={documentForm.title} onChange={handleDocumentChange} required />
                            </AdminField>

                            <AdminField label="PDF 업로드" span hint="업로드가 끝나면 아래 파일 URL이 자동으로 채워집니다.">
                                <div
                                    className={`admin-dropzone ${dragging ? "is-over" : ""} ${uploading ? "is-busy" : ""}`}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDragging(true);
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDragging(true);
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDragging(false);
                                    }}
                                    onDrop={handleDrop}
                                >
                                    <UploadCloud size={22} aria-hidden="true" />
                                    <p>{uploading ? "업로드 중..." : "PDF 파일을 여기로 끌어놓거나"}</p>
                                    <button
                                        type="button"
                                        className="ui-btn"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                    >
                                        파일 선택
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        className="admin-dropzone-input"
                                        onChange={onFileInputChange}
                                    />
                                </div>
                            </AdminField>

                            <AdminField label="파일 URL" htmlFor="proceeding-document-url" required span>
                                <input
                                    id="proceeding-document-url"
                                    className="ui-input"
                                    name="fileUrl"
                                    value={documentForm.fileUrl}
                                    onChange={handleDocumentChange}
                                    placeholder="https://..."
                                    required
                                />
                            </AdminField>
                            <AdminField label="표시 순서" htmlFor="proceeding-document-order" required>
                                <input
                                    id="proceeding-document-order"
                                    className="ui-input"
                                    type="number"
                                    min={1}
                                    name="displayOrder"
                                    value={documentForm.displayOrder}
                                    onChange={handleDocumentChange}
                                    required
                                />
                            </AdminField>
                            <AdminCheckbox label="활성" name="active" checked={documentForm.active} onChange={handleDocumentChange} />
                        </div>
                        <div className="admin-form-actions">
                            {editingDocumentId && (
                                <button className="ui-btn" type="button" onClick={resetDocumentForm}>수정 취소</button>
                            )}
                            <button className="ui-btn is-primary" type="submit" disabled={categories.length === 0 || uploading}>
                                {editingDocumentId ? "수정 저장" : "문서 추가"}
                            </button>
                        </div>
                    </form>
                </AdminCollapse>

                {documents.length > 0 && (
                    <div className="admin-toolbar">
                        <AdminSearch value={query} onChange={setQuery} placeholder="제목, 카테고리, 날짜 검색" />
                        <select
                            className="ui-select admin-toolbar-select"
                            aria-label="카테고리로 거르기"
                            value={categoryFilter}
                            onChange={(event) => setCategoryFilter(event.target.value)}
                        >
                            <option value="">전체 카테고리</option>
                            {categories.map((item) => (
                                <option key={item.id} value={String(item.id)}>{item.name}</option>
                            ))}
                        </select>
                        {isFiltering && (
                            <p className="admin-toolbar-summary">
                                {documents.length}건 중 <strong>{visibleDocuments.length}</strong>건
                            </p>
                        )}
                    </div>
                )}

                {loading && documents.length === 0 ? (
                    <AdminSkeleton />
                ) : documents.length === 0 ? (
                    <AdminEmpty>문서가 없습니다.</AdminEmpty>
                ) : visibleDocuments.length === 0 ? (
                    <AdminEmpty>조건과 일치하는 문서가 없습니다.</AdminEmpty>
                ) : (
                    <div className={`admin-table-wrap ${loading ? "is-loading" : ""}`} aria-busy={loading}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>카테고리</th>
                                    <th>제목</th>
                                    <th>날짜</th>
                                    <th className="admin-col-num">순서</th>
                                    <th>상태</th>
                                    <th className="admin-col-actions">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleDocuments.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`${changedDocumentRows.has(String(item.id)) ? "is-flash" : ""} ${editingDocumentId === item.id ? "is-editing" : ""}`}
                                    >
                                        <td data-label="카테고리">{item.categoryName}</td>
                                        <td className="admin-cell-title">{item.title}</td>
                                        <td className="admin-cell-date" data-label="회의일">{item.meetingDate || "-"}</td>
                                        <td className="admin-cell-num" data-label="순서">{item.displayOrder}</td>
                                        <td className="admin-cell-badge">
                                            <span className={`ui-badge ${item.active ? "is-ok" : ""}`}>{item.active ? "활성" : "비활성"}</span>
                                        </td>
                                        <td className="admin-cell-actions">
                                            <div className="admin-actions">
                                                <button
                                                    className="ui-btn is-small admin-act"
                                                    type="button"
                                                    onClick={() => {
                                                        handleEditDocument(item);
                                                        documentPanel.reveal();
                                                    }}
                                                >
                                                    <Pencil size={14} aria-hidden="true" />
                                                    수정
                                                </button>
                                                <button className="ui-btn is-small is-danger admin-act" type="button" onClick={() => handleDeleteDocument(item.id)}>
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
            </div>
        </section>
    );
};

export default ProceedingManager;
