import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { ChevronDown, Eye, Lock, Reply, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
    AdminCollapse,
    AdminEmpty,
    AdminField,
    AdminPanelHead,
    AdminSearch,
    AdminSkeleton,
    AdminStatus,
    useAutoDismiss,
    useChangedRows,
} from "./AdminUI";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const FEEDBACK_TITLE_PREFIX = "[홈페이지 피드백]";
const ANSWER_VIEW_PASSWORD = "020209";
const FEEDBACK_MANAGER_PASSWORD = "020209";
const getPostId = (post) => post?.qpostId ?? post?.qPostId ?? post?.id;

// 목록 표현용 (key, 행 강조 비교 기준, 상태 필터)
const getPostKey = (post) => String(getPostId(post) ?? post?.qpCreateTime ?? "");
const getPostSignature = (post) => `${post.replied}|${post.answer?.content || ""}`;
const STATUS_FILTERS = [
    { id: "all", label: "전체" },
    { id: "pending", label: "대기중" },
    { id: "replied", label: "답변완료" },
];

const FeedbackManager = () => {
    const { auth } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [activePost, setActivePost] = useState(null);
    const [answerDraft, setAnswerDraft] = useState("");
    const [deleting, setDeleting] = useState(null);

    const [passwordModalPost, setPasswordModalPost] = useState(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [answerViewPost, setAnswerViewPost] = useState(null);

    const [isManagerUnlocked, setIsManagerUnlocked] = useState(false);
    const [managerPassword, setManagerPassword] = useState("");
    const [managerPasswordError, setManagerPasswordError] = useState("");

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
            const response = await apiClient.get("/api/qna", authConfig);
            const allPosts = response.data?.data || [];
            const feedbackPosts = allPosts.filter((post) => (post.qpTitle || "").startsWith(FEEDBACK_TITLE_PREFIX));
            setItems(feedbackPosts);
        } catch (e) {
            setError(e.response?.data?.message || "피드백 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isManagerUnlocked) return;
        loadItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isManagerUnlocked]);

    const formatDate = (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString("ko-KR");
    };

    const handleSaveAnswer = async (postId) => {
        const content = answerDraft.trim();
        if (!content) {
            setError("답변 내용을 입력해주세요.");
            return;
        }

        setError("");
        setMessage("");
        try {
            await apiClient.post(`/api/admin/qna/${postId}/answer`, { content }, authConfig);
            setMessage("답변을 저장했습니다.");
            setAnswerDraft("");
            setActivePost(null);
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "답변 저장에 실패했습니다.");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("이 피드백을 삭제하시겠습니까?")) return;

        setDeleting(postId);
        setError("");
        setMessage("");
        try {
            await apiClient.delete(`/api/admin/qna/${postId}`, authConfig);
            setMessage("피드백을 삭제했습니다.");
            await loadItems();
        } catch (e) {
            setError(e.response?.data?.message || "삭제에 실패했습니다.");
        } finally {
            setDeleting(null);
        }
    };

    const openAnswerView = (post) => {
        setPasswordModalPost(post);
        setPasswordInput("");
        setPasswordError("");
    };

    const submitAnswerPassword = () => {
        if (passwordInput === ANSWER_VIEW_PASSWORD) {
            setAnswerViewPost(passwordModalPost);
            setPasswordModalPost(null);
            setPasswordInput("");
            setPasswordError("");
            return;
        }
        setPasswordError("비밀번호가 올바르지 않습니다.");
    };

    const postAnswerText = (post) => {
        if (!post?.answer?.content) return "아직 등록된 답변이 없습니다.";
        return post.answer.content;
    };

    const unlockManager = () => {
        if (managerPassword === FEEDBACK_MANAGER_PASSWORD) {
            setIsManagerUnlocked(true);
            setManagerPassword("");
            setManagerPasswordError("");
            return;
        }
        setManagerPasswordError("비밀번호가 올바르지 않습니다.");
    };

    // ── 표현용 상태 (데이터 로직과 무관) ──
    const [expandedKey, setExpandedKey] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [query, setQuery] = useState("");
    const changedRows = useChangedRows(items, getPostKey, getPostSignature);
    useAutoDismiss(message, setMessage);

    const pendingCount = items.filter((post) => !post.replied).length;
    const keyword = query.trim().toLowerCase();
    const visibleItems = items.filter((post) => {
        // 답변 작성 중인 글은 필터와 상관없이 계속 보여준다
        if (activePost && getPostId(post) === activePost) return true;
        if (statusFilter === "pending" && post.replied) return false;
        if (statusFilter === "replied" && !post.replied) return false;
        if (!keyword) return true;
        return [post.qpAuthor, post.qpContent].some((value) => String(value || "").toLowerCase().includes(keyword));
    });

    if (!isManagerUnlocked) {
        return (
            <section className="admin-section">
                <AdminPanelHead title="피드백 관리" description="피드백 관리를 보려면 비밀번호를 입력해주세요." />
                <form
                    className="admin-lock"
                    onSubmit={(event) => {
                        event.preventDefault();
                        unlockManager();
                    }}
                >
                    <div className="admin-lock-icon" aria-hidden="true">
                        <Lock size={20} />
                    </div>
                    <AdminField label="비밀번호 입력" htmlFor="feedback-manager-password">
                        <input
                            id="feedback-manager-password"
                            className="ui-input"
                            type="password"
                            value={managerPassword}
                            onChange={(event) => setManagerPassword(event.target.value)}
                            placeholder="비밀번호"
                            autoComplete="off"
                        />
                    </AdminField>
                    <AdminStatus error={managerPasswordError} />
                    <div className="admin-form-actions">
                        <button className="ui-btn is-primary" type="button" onClick={unlockManager}>
                            확인
                        </button>
                    </div>
                </form>
            </section>
        );
    }

    return (
        <section className="admin-section">
            <AdminPanelHead
                title="피드백 관리"
                count={`총 ${items.length}건 · 대기 ${pendingCount}건`}
                description="우하단 위젯으로 접수된 홈페이지 개선/학생회 의견입니다."
            />

            <AdminStatus
                message={message}
                error={error}
                onDismissMessage={() => setMessage("")}
                onDismissError={() => setError("")}
            />

            {items.length > 0 && (
                <div className="admin-toolbar">
                    <AdminSearch value={query} onChange={setQuery} placeholder="작성자, 내용 검색" />
                    <div className="admin-chips" role="group" aria-label="상태로 거르기">
                        {STATUS_FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                type="button"
                                className="ui-chip"
                                aria-pressed={statusFilter === filter.id}
                                onClick={() => setStatusFilter(filter.id)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading && items.length === 0 ? (
                <AdminSkeleton />
            ) : items.length === 0 ? (
                <AdminEmpty>접수된 피드백이 없습니다.</AdminEmpty>
            ) : visibleItems.length === 0 ? (
                <AdminEmpty>조건과 일치하는 피드백이 없습니다.</AdminEmpty>
            ) : (
                <ul className={`admin-inbox ${loading ? "is-loading" : ""}`} aria-busy={loading}>
                    {visibleItems.map((post) => {
                        const postId = getPostId(post);
                        const postKey = getPostKey(post);
                        const isAnswering = Boolean(activePost) && activePost === postId;
                        const isOpen = expandedKey === postKey || isAnswering;
                        const bodyId = `feedback-body-${postKey}`;
                        return (
                            <li
                                key={postKey}
                                className={[
                                    "admin-inbox-item",
                                    post.replied ? "" : "is-pending",
                                    isOpen ? "is-open" : "",
                                    changedRows.has(postKey) ? "is-flash" : "",
                                ].join(" ")}
                            >
                                <button
                                    type="button"
                                    className="admin-inbox-head"
                                    aria-expanded={isOpen}
                                    aria-controls={bodyId}
                                    onClick={() => setExpandedKey((prev) => (prev === postKey ? null : postKey))}
                                >
                                    <span className="admin-inbox-meta">
                                        <span className={`ui-badge ${post.replied ? "is-ok" : "is-warn"}`}>
                                            {post.replied ? "답변완료" : "대기중"}
                                        </span>
                                        <span className="admin-inbox-author">{post.qpAuthor || "-"}</span>
                                        <span className="admin-inbox-date">{formatDate(post.qpCreateTime)}</span>
                                        <span className="admin-inbox-id">#{postId ?? "-"}</span>
                                    </span>
                                    <span className="admin-inbox-preview">{post.qpContent}</span>
                                    <ChevronDown className="admin-inbox-chevron" size={18} aria-hidden="true" />
                                </button>

                                <AdminCollapse open={isOpen} id={bodyId}>
                                    <div className="admin-inbox-body">
                                        <p className="admin-feedback-content">{post.qpContent}</p>

                                        <div className="admin-actions">
                                            <button
                                                className="ui-btn is-small admin-act"
                                                type="button"
                                                disabled={!postId}
                                                onClick={() => {
                                                    setActivePost(postId);
                                                    setAnswerDraft(post.answer?.content || "");
                                                    setError("");
                                                    setMessage("");
                                                }}
                                            >
                                                <Reply size={14} aria-hidden="true" />
                                                답변작성
                                            </button>
                                            <button className="ui-btn is-small admin-act" type="button" onClick={() => openAnswerView(post)}>
                                                <Eye size={14} aria-hidden="true" />
                                                답변보기
                                            </button>
                                            <button
                                                className="ui-btn is-small is-danger admin-act"
                                                type="button"
                                                disabled={!postId || deleting === postId}
                                                onClick={() => handleDeletePost(postId)}
                                            >
                                                <Trash2 size={14} aria-hidden="true" />
                                                {deleting === postId ? "삭제중..." : "삭제"}
                                            </button>
                                        </div>

                                        {isAnswering && (
                                            <div className="admin-answer-editor">
                                                <h3>답변 작성 #{activePost}</h3>
                                                <textarea
                                                    className="ui-textarea"
                                                    rows={4}
                                                    value={answerDraft}
                                                    onChange={(event) => setAnswerDraft(event.target.value)}
                                                    placeholder="답변을 입력해주세요."
                                                    aria-label={`피드백 #${activePost} 답변`}
                                                />
                                                <div className="admin-form-actions">
                                                    <button
                                                        className="ui-btn"
                                                        type="button"
                                                        onClick={() => {
                                                            setActivePost(null);
                                                            setAnswerDraft("");
                                                        }}
                                                    >
                                                        취소
                                                    </button>
                                                    <button className="ui-btn is-primary" type="button" onClick={() => handleSaveAnswer(activePost)}>
                                                        답변 저장
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </AdminCollapse>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* 모달은 body로 포털: 페이지 진입 애니메이션(transform)의 영향을 받지 않게 한다 */}
            {passwordModalPost && createPortal(
                <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="답변 보기 비밀번호">
                    <form
                        className="admin-modal"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitAnswerPassword();
                        }}
                    >
                        <h3>답변 보기</h3>
                        <p>비밀번호를 입력하세요.</p>
                        <input
                            className="ui-input"
                            type="password"
                            value={passwordInput}
                            onChange={(event) => setPasswordInput(event.target.value)}
                            placeholder="비밀번호"
                            autoComplete="off"
                            aria-label="답변 보기 비밀번호"
                            autoFocus
                        />
                        <AdminStatus error={passwordError} />
                        <div className="admin-form-actions">
                            <button
                                className="ui-btn"
                                type="button"
                                onClick={() => {
                                    setPasswordModalPost(null);
                                    setPasswordInput("");
                                    setPasswordError("");
                                }}
                            >
                                닫기
                            </button>
                            <button className="ui-btn is-primary" type="button" onClick={submitAnswerPassword}>
                                확인
                            </button>
                        </div>
                    </form>
                </div>,
                document.body
            )}

            {answerViewPost && createPortal(
                <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="답변 내용">
                    <div className="admin-modal">
                        <h3>답변 내용</h3>
                        <p className="admin-answer-view-text">{postAnswerText(answerViewPost)}</p>
                        <div className="admin-form-actions">
                            <button
                                className="ui-btn is-primary"
                                type="button"
                                onClick={() => setAnswerViewPost(null)}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
};

export default FeedbackManager;
