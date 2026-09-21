import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
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
    useObjectUrls,
} from "./AdminUI";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const INITIAL_FORM = {
    title: "",
    content: "",
};

const pickNoticeId = (item) => item?.nPost_id ?? item?.npost_id ?? item?.id ?? null;

// 목록 표현용 (행 강조 비교 기준, 정렬 토글)
const getPostId = (post) => post.id;
const getPostSignature = (post) => `${post.title}|${post.updatedAt}`;
const SORT_NEXT = { default: "newest", newest: "oldest", oldest: "default" };
const SORT_LABEL = { default: "기본 순서", newest: "최신 등록순", oldest: "오래된 등록순" };

const NoticeManager = () => {
    const { auth } = useAuth();
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState(INITIAL_FORM);
    const [imageFiles, setImageFiles] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingImages, setEditingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const authConfig = useMemo(
        () => ({
            headers: { Authorization: `Bearer ${auth.token}` },
            withCredentials: true,
        }),
        [auth.token]
    );

    const normalizePost = (post) => ({
        id: pickNoticeId(post),
        title: post?.npTitle || "",
        content: post?.npContent || "",
        createdAt: post?.npCreateTime || null,
        updatedAt: post?.npUpdateTime || null,
        hitCount: post?.npHitCnt ?? 0,
        likeCount: post?.npUserLikeCnt ?? 0,
        imageUrls: Array.isArray(post?.imageUrls) ? post.imageUrls : [],
    });

    const loadPosts = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiClient.get("/api/admin/notice", authConfig);
            const rows = Array.isArray(response.data?.data) ? response.data.data : [];
            setPosts(rows.map(normalizePost).filter((item) => item.id !== null));
        } catch (e) {
            setError(e.response?.data?.message || "공지사항 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetForm = () => {
        setForm(INITIAL_FORM);
        setImageFiles([]);
        setEditingId(null);
        setEditingImages([]);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        setImageFiles(Array.from(event.target.files || []));
    };

    const handleEdit = async (id) => {
        setError("");
        setMessage("");
        try {
            const response = await apiClient.get(`/api/admin/notice/${id}`, authConfig);
            const data = normalizePost(response.data?.data || {});
            setEditingId(data.id);
            setForm({ title: data.title, content: data.content });
            setEditingImages(data.imageUrls);
            setImageFiles([]);
            formPanel.reveal(); // 페이지 맨 위 대신 수정 폼으로 스크롤
        } catch (e) {
            setError(e.response?.data?.message || "공지사항 상세를 불러오지 못했습니다.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!form.title.trim() || !form.content.trim()) {
            setError("제목과 내용을 입력해 주세요.");
            return;
        }

        const payload = new FormData();
        payload.append("title", form.title.trim());
        payload.append("content", form.content.trim());
        imageFiles.forEach((file) => payload.append("imageFiles", file));

        setSubmitting(true);
        try {
            if (editingId) {
                await apiClient.put(`/api/admin/notice/${editingId}`, payload, {
                    ...authConfig,
                    headers: {
                        ...authConfig.headers,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setMessage("공지사항을 수정했습니다.");
            } else {
                await apiClient.post("/api/admin/notice", payload, {
                    ...authConfig,
                    headers: {
                        ...authConfig.headers,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setMessage("공지사항을 등록했습니다.");
            }
            resetForm();
            await loadPosts();
        } catch (e) {
            setError(e.response?.data?.message || "저장 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("이 공지사항을 삭제할까요?")) return;

        setError("");
        setMessage("");
        try {
            await apiClient.delete(`/api/admin/notice/${id}`, authConfig);
            setMessage("공지사항을 삭제했습니다.");
            if (editingId === id) {
                resetForm();
            }
            await loadPosts();
        } catch (e) {
            setError(e.response?.data?.message || "삭제 중 오류가 발생했습니다.");
        }
    };

    const formatDate = (value) => {
        if (!value) return "-";
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "-";
        return parsed.toLocaleString();
    };

    // ── 표현용 상태 (데이터 로직과 무관) ──
    const [query, setQuery] = useState("");
    const [sortMode, setSortMode] = useState("default");
    const formPanel = useFormPanel(editingId);
    const changedRows = useChangedRows(posts, getPostId, getPostSignature);
    const newImagePreviews = useObjectUrls(imageFiles);
    useAutoDismiss(message, setMessage);

    const editingPost = posts.find((post) => post.id === editingId);
    const keyword = query.trim().toLowerCase();
    const filteredPosts = keyword
        ? posts.filter((post) => `${post.id} ${post.title}`.toLowerCase().includes(keyword))
        : posts;
    const visiblePosts = sortMode === "default"
        ? filteredPosts
        : [...filteredPosts].sort((a, b) => {
            const diff = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            return sortMode === "newest" ? -diff : diff;
        });

    return (
        <section className="admin-section">
            <AdminPanelHead
                title="공지사항 관리"
                count={keyword ? `${posts.length}건 중 ${visiblePosts.length}건` : `총 ${posts.length}건`}
                description="공지사항을 등록, 수정, 삭제할 수 있습니다."
            >
                <AdminFormToggle
                    open={formPanel.open}
                    editing={Boolean(editingId)}
                    label="새로 등록"
                    controls="notice-form-panel"
                    onClick={() => (editingId ? resetForm() : formPanel.setOpen((prev) => !prev))}
                />
            </AdminPanelHead>

            <AdminStatus
                message={message}
                error={error}
                onDismissMessage={() => setMessage("")}
                onDismissError={() => setError("")}
            />

            <AdminCollapse open={formPanel.open} id="notice-form-panel" panelRef={formPanel.panelRef}>
                <form className="admin-form-card" onSubmit={handleSubmit}>
                    {editingId && <AdminEditBanner title={editingPost?.title || form.title} onCancel={resetForm} />}
                    <div className="admin-form-grid">
                        <AdminField label="제목" htmlFor="notice-title" required span>
                            <input
                                id="notice-title"
                                className="ui-input"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                maxLength={500}
                                required
                            />
                        </AdminField>

                        <AdminField label="내용" htmlFor="notice-content" required span>
                            <textarea
                                id="notice-content"
                                className="ui-textarea"
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                rows={6}
                                required
                            />
                        </AdminField>

                        <AdminField label="이미지 업로드" htmlFor="notice-images" span>
                            <AdminFileDrop
                                id="notice-images"
                                title="이미지를 끌어놓거나 눌러서 선택"
                                hint="여러 장을 한 번에 선택할 수 있습니다."
                                fileCount={imageFiles.length}
                                inputProps={{ multiple: true, accept: "image/*", onChange: handleImageChange }}
                            />
                        </AdminField>

                        {editingId && editingImages.length > 0 && imageFiles.length === 0 && (
                            <div className="admin-span-2">
                                <p className="admin-upload-hint">현재 등록 이미지</p>
                                <div className="admin-preview-row">
                                    {editingImages.map((url) => (
                                        <img
                                            key={url}
                                            src={url}
                                            alt="공지 이미지 미리보기"
                                            className="admin-preview-thumb"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {imageFiles.length > 0 && (
                            <div className="admin-span-2">
                                <p className="admin-upload-hint">
                                    새 이미지 {imageFiles.length}개가 선택되었습니다. 저장하면 기존 이미지를 새 이미지로 교체합니다.
                                </p>
                                <ul className="admin-preview-row admin-preview-list">
                                    {newImagePreviews.map((preview) => (
                                        <li key={preview.url}>
                                            <img src={preview.url} alt="" className="admin-preview-thumb" />
                                            <span>{preview.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="admin-form-actions">
                        {editingId && (
                            <button className="ui-btn" type="button" onClick={resetForm}>
                                수정 취소
                            </button>
                        )}
                        <button className="ui-btn is-primary" type="submit" disabled={submitting}>
                            {submitting ? "저장 중..." : (editingId ? "수정 저장" : "공지 등록")}
                        </button>
                    </div>
                </form>
            </AdminCollapse>

            {posts.length > 0 && (
                <div className="admin-toolbar">
                    <AdminSearch value={query} onChange={setQuery} placeholder="제목, ID 검색" />
                    <button
                        type="button"
                        className="ui-btn admin-sort-btn"
                        onClick={() => setSortMode((prev) => SORT_NEXT[prev])}
                    >
                        <ArrowDownUp size={16} aria-hidden="true" />
                        {SORT_LABEL[sortMode]}
                    </button>
                </div>
            )}

            {loading && posts.length === 0 ? (
                <AdminSkeleton />
            ) : posts.length === 0 ? (
                <AdminEmpty>등록된 공지사항이 없습니다.</AdminEmpty>
            ) : visiblePosts.length === 0 ? (
                <AdminEmpty>검색어와 일치하는 공지사항이 없습니다.</AdminEmpty>
            ) : (
                <div className={`admin-table-wrap ${loading ? "is-loading" : ""}`} aria-busy={loading}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-col-num">ID</th>
                                <th>제목</th>
                                <th>등록일</th>
                                <th>수정일</th>
                                <th className="admin-col-num">조회수</th>
                                <th className="admin-col-num">공감수</th>
                                <th className="admin-col-actions">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visiblePosts.map((post) => (
                                <tr
                                    key={post.id}
                                    className={`${changedRows.has(String(post.id)) ? "is-flash" : ""} ${editingId === post.id ? "is-editing" : ""}`}
                                >
                                    <td className="admin-cell-num" data-label="ID">{post.id}</td>
                                    <td className="admin-cell-title">{post.title || "-"}</td>
                                    <td className="admin-cell-date" data-label="등록">{formatDate(post.createdAt)}</td>
                                    <td className="admin-cell-date" data-label="수정">{formatDate(post.updatedAt)}</td>
                                    <td className="admin-cell-num" data-label="조회">{post.hitCount}</td>
                                    <td className="admin-cell-num" data-label="공감">{post.likeCount}</td>
                                    <td className="admin-cell-actions">
                                        <div className="admin-actions">
                                            <button className="ui-btn is-small admin-act" type="button" onClick={() => handleEdit(post.id)}>
                                                <Pencil size={14} aria-hidden="true" />
                                                수정
                                            </button>
                                            <button className="ui-btn is-small is-danger admin-act" type="button" onClick={() => handleDelete(post.id)}>
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

export default NoticeManager;
