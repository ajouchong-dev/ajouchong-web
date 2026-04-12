import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const INITIAL_FORM = {
    title: "",
    content: "",
};

const pickNoticeId = (item) => item?.nPost_id ?? item?.npost_id ?? item?.id ?? null;

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
            window.scrollTo({ top: 0, behavior: "smooth" });
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

    return (
        <section className="admin-card admin-full">
            <div className="admin-section-head">
                <h2>공지사항 관리</h2>
                <p>공지사항을 등록, 수정, 삭제할 수 있습니다.</p>
            </div>

            <form className="admin-form-grid" onSubmit={handleSubmit}>
                <label className="admin-span-2">
                    제목
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={500}
                        required
                    />
                </label>

                <label className="admin-span-2">
                    내용
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        rows={6}
                        required
                    />
                </label>

                <label className="admin-span-2">
                    이미지 업로드
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>

                {editingId && editingImages.length > 0 && imageFiles.length === 0 && (
                    <div className="admin-span-2">
                        <p className="admin-upload-hint">현재 등록 이미지</p>
                        <div className="admin-notice-preview-row">
                            {editingImages.map((url) => (
                                <img
                                    key={url}
                                    src={url}
                                    alt="공지 이미지 미리보기"
                                    className="admin-notice-thumb"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {imageFiles.length > 0 && (
                    <p className="admin-upload-hint admin-span-2">
                        새 이미지 {imageFiles.length}개가 선택되었습니다. 저장하면 기존 이미지를 새 이미지로 교체합니다.
                    </p>
                )}

                <div className="admin-form-actions admin-span-2">
                    <button className="admin-btn primary" type="submit" disabled={submitting}>
                        {submitting ? "저장 중..." : (editingId ? "수정 저장" : "공지 등록")}
                    </button>
                    {editingId && (
                        <button className="admin-btn muted" type="button" onClick={resetForm}>
                            수정 취소
                        </button>
                    )}
                </div>
            </form>

            {message && <p className="admin-feedback success">{message}</p>}
            {error && <p className="admin-feedback error">{error}</p>}

            <div className="admin-table-wrap">
                {loading ? (
                    <p className="admin-empty">불러오는 중...</p>
                ) : posts.length === 0 ? (
                    <p className="admin-empty">등록된 공지사항이 없습니다.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>제목</th>
                                <th>등록일</th>
                                <th>수정일</th>
                                <th>조회수</th>
                                <th>공감수</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>{post.title || "-"}</td>
                                    <td>{formatDate(post.createdAt)}</td>
                                    <td>{formatDate(post.updatedAt)}</td>
                                    <td>{post.hitCount}</td>
                                    <td>{post.likeCount}</td>
                                    <td className="admin-actions">
                                        <button className="admin-btn small" type="button" onClick={() => handleEdit(post.id)}>
                                            수정
                                        </button>
                                        <button className="admin-btn small danger" type="button" onClick={() => handleDelete(post.id)}>
                                            삭제
                                        </button>
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

export default NoticeManager;
