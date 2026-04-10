import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

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

    return (
        <section className="admin-card admin-full">
            <div className="admin-section-head">
                <h2>회의록 관리</h2>
                <p>카테고리/문서 추가, 수정, 삭제와 PDF 드래그 앤 드롭 업로드를 한 화면에서 처리할 수 있습니다.</p>
            </div>

            {message && <p className="admin-feedback success">{message}</p>}
            {error && <p className="admin-feedback error">{error}</p>}

            <div className="proceeding-admin-grid">
                <div className="proceeding-admin-panel">
                    <h3>카테고리 관리</h3>
                    <form className="admin-form-grid" onSubmit={handleCategorySubmit}>
                        <label>
                            카테고리명
                            <input name="name" value={categoryForm.name} onChange={handleCategoryChange} required />
                        </label>
                        <label>
                            표시 순서
                            <input
                                type="number"
                                min={1}
                                name="displayOrder"
                                value={categoryForm.displayOrder}
                                onChange={handleCategoryChange}
                                required
                            />
                        </label>
                        <label className="admin-span-2">
                            설명
                            <textarea
                                name="description"
                                rows={2}
                                value={categoryForm.description}
                                onChange={handleCategoryChange}
                            />
                        </label>
                        <label className="admin-checkbox">
                            <input type="checkbox" name="active" checked={categoryForm.active} onChange={handleCategoryChange} />
                            활성
                        </label>
                        <div className="admin-form-actions admin-span-2">
                            <button className="admin-btn primary" type="submit">{editingCategoryId ? "수정 저장" : "카테고리 추가"}</button>
                            {editingCategoryId && (
                                <button className="admin-btn muted" type="button" onClick={resetCategoryForm}>수정 취소</button>
                            )}
                        </div>
                    </form>

                    <div className="admin-table-wrap">
                        {loading ? (
                            <p className="admin-empty">불러오는 중...</p>
                        ) : categories.length === 0 ? (
                            <p className="admin-empty">카테고리가 없습니다.</p>
                        ) : (
                            <table className="admin-table proceeding-admin-table">
                                <thead>
                                    <tr>
                                        <th>순서</th>
                                        <th>카테고리명</th>
                                        <th>상태</th>
                                        <th>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.displayOrder}</td>
                                            <td>{item.name}</td>
                                            <td>{item.active ? "활성" : "비활성"}</td>
                                            <td className="admin-actions">
                                                <button className="admin-btn small" type="button" onClick={() => handleEditCategory(item)}>수정</button>
                                                <button className="admin-btn small danger" type="button" onClick={() => handleDeleteCategory(item.id)}>삭제</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="proceeding-admin-panel">
                    <h3>문서 관리</h3>
                    <form className="admin-form-grid" onSubmit={handleDocumentSubmit}>
                        <label>
                            카테고리
                            <select
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
                        </label>
                        <label>
                            회의 일자
                            <input
                                type="date"
                                name="meetingDate"
                                value={documentForm.meetingDate}
                                onChange={handleDocumentChange}
                            />
                        </label>
                        <label className="admin-span-2">
                            문서 제목
                            <input name="title" value={documentForm.title} onChange={handleDocumentChange} required />
                        </label>

                        <div className="admin-span-2 proceeding-upload-wrap">
                            <p className="proceeding-upload-label">PDF 업로드</p>
                            <div
                                className={`proceeding-dropzone ${dragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
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
                                <p>{uploading ? "업로드 중..." : "PDF 파일을 여기로 끌어놓거나"}</p>
                                <button
                                    type="button"
                                    className="admin-btn muted"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    파일 선택
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    className="proceeding-file-input"
                                    onChange={onFileInputChange}
                                />
                            </div>
                        </div>

                        <label className="admin-span-2">
                            파일 URL
                            <input
                                name="fileUrl"
                                value={documentForm.fileUrl}
                                onChange={handleDocumentChange}
                                placeholder="https://..."
                                required
                            />
                        </label>
                        <label>
                            표시 순서
                            <input
                                type="number"
                                min={1}
                                name="displayOrder"
                                value={documentForm.displayOrder}
                                onChange={handleDocumentChange}
                                required
                            />
                        </label>
                        <label className="admin-checkbox">
                            <input type="checkbox" name="active" checked={documentForm.active} onChange={handleDocumentChange} />
                            활성
                        </label>
                        <div className="admin-form-actions admin-span-2">
                            <button className="admin-btn primary" type="submit" disabled={categories.length === 0 || uploading}>
                                {editingDocumentId ? "수정 저장" : "문서 추가"}
                            </button>
                            {editingDocumentId && (
                                <button className="admin-btn muted" type="button" onClick={resetDocumentForm}>수정 취소</button>
                            )}
                        </div>
                    </form>

                    <div className="admin-table-wrap">
                        {loading ? (
                            <p className="admin-empty">불러오는 중...</p>
                        ) : documents.length === 0 ? (
                            <p className="admin-empty">문서가 없습니다.</p>
                        ) : (
                            <table className="admin-table proceeding-admin-table">
                                <thead>
                                    <tr>
                                        <th>카테고리</th>
                                        <th>제목</th>
                                        <th>날짜</th>
                                        <th>순서</th>
                                        <th>상태</th>
                                        <th>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.categoryName}</td>
                                            <td className="proceeding-doc-title">{item.title}</td>
                                            <td>{item.meetingDate || "-"}</td>
                                            <td>{item.displayOrder}</td>
                                            <td>{item.active ? "활성" : "비활성"}</td>
                                            <td className="admin-actions">
                                                <button className="admin-btn small" type="button" onClick={() => handleEditDocument(item)}>수정</button>
                                                <button className="admin-btn small danger" type="button" onClick={() => handleDeleteDocument(item.id)}>삭제</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProceedingManager;
