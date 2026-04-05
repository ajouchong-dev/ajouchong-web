import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const FEEDBACK_TITLE = "[홈페이지 피드백]";
const ANSWER_VIEW_PASSWORD = "020209";
const FEEDBACK_MANAGER_PASSWORD = "020209";
const getPostId = (post) => post?.qpostId ?? post?.qPostId ?? post?.id;

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
            const feedbackPosts = allPosts.filter((post) => post.qpTitle === FEEDBACK_TITLE);
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
            setMessage("답변이 저장되었습니다.");
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
            setMessage("피드백이 삭제되었습니다.");
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

    if (!isManagerUnlocked) {
        return (
            <section className="admin-card admin-full">
                <div className="admin-section-head">
                    <h2>피드백 관리</h2>
                    <p>피드백 관리를 보려면 비밀번호를 입력해주세요.</p>
                </div>
                <div className="admin-answer-editor">
                    <h3>비밀번호 입력</h3>
                    <input
                        type="password"
                        value={managerPassword}
                        onChange={(event) => setManagerPassword(event.target.value)}
                        placeholder="비밀번호"
                    />
                    {managerPasswordError && <p className="admin-feedback error">{managerPasswordError}</p>}
                    <div className="admin-form-actions">
                        <button className="admin-btn primary" type="button" onClick={unlockManager}>
                            확인
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="admin-card admin-full">
            <div className="admin-section-head">
                <h2>피드백 관리</h2>
                <p>우하단 ? 위젯으로 접수된 홈페이지 개선/학생회 의견입니다.</p>
            </div>

            {message && <p className="admin-feedback success">{message}</p>}
            {error && <p className="admin-feedback error">{error}</p>}

            <div className="admin-table-wrap">
                {loading ? (
                    <p className="admin-empty">불러오는 중...</p>
                ) : items.length === 0 ? (
                    <p className="admin-empty">접수된 피드백이 없습니다.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>작성자</th>
                                <th>의견</th>
                                <th>작성일</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((post) => {
                                const postId = getPostId(post);
                                return (
                                <tr key={postId}>
                                    <td>{postId ?? "-"}</td>
                                    <td>{post.qpAuthor || "-"}</td>
                                    <td className="admin-feedback-content">{post.qpContent}</td>
                                    <td>{formatDate(post.qpCreateTime)}</td>
                                    <td>{post.replied ? "답변완료" : "대기중"}</td>
                                    <td className="admin-actions">
                                        <button
                                            className="admin-btn small"
                                            type="button"
                                            disabled={!postId}
                                            onClick={() => {
                                                setActivePost(postId);
                                                setAnswerDraft(post.answer?.content || "");
                                                setError("");
                                                setMessage("");
                                            }}
                                        >
                                            답변작성
                                        </button>
                                        <button className="admin-btn small muted" type="button" onClick={() => openAnswerView(post)}>
                                            답변보기
                                        </button>
                                        <button
                                            className="admin-btn small danger"
                                            type="button"
                                            disabled={!postId || deleting === postId}
                                            onClick={() => handleDeletePost(postId)}
                                        >
                                            {deleting === postId ? "삭제중..." : "삭제"}
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                )}
            </div>

            {activePost && (
                <div className="admin-answer-editor">
                    <h3>답변 작성 #{activePost}</h3>
                    <textarea
                        rows={4}
                        value={answerDraft}
                        onChange={(event) => setAnswerDraft(event.target.value)}
                        placeholder="답변을 입력해주세요."
                    />
                    <div className="admin-form-actions">
                        <button className="admin-btn primary" type="button" onClick={() => handleSaveAnswer(activePost)}>
                            답변 저장
                        </button>
                        <button
                            className="admin-btn muted"
                            type="button"
                            onClick={() => {
                                setActivePost(null);
                                setAnswerDraft("");
                            }}
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}

            {passwordModalPost && (
                <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="답변 보기 비밀번호">
                    <div className="admin-modal">
                        <h3>답변 보기</h3>
                        <p>비밀번호를 입력하세요.</p>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(event) => setPasswordInput(event.target.value)}
                            placeholder="비밀번호"
                        />
                        {passwordError && <p className="admin-feedback error">{passwordError}</p>}
                        <div className="admin-form-actions">
                            <button className="admin-btn primary" type="button" onClick={submitAnswerPassword}>
                                확인
                            </button>
                            <button
                                className="admin-btn muted"
                                type="button"
                                onClick={() => {
                                    setPasswordModalPost(null);
                                    setPasswordInput("");
                                    setPasswordError("");
                                }}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {answerViewPost && (
                <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="답변 내용">
                    <div className="admin-modal">
                        <h3>답변 내용</h3>
                        <p className="admin-answer-view-text">{postAnswerText(answerViewPost)}</p>
                        <div className="admin-form-actions">
                            <button
                                className="admin-btn primary"
                                type="button"
                                onClick={() => setAnswerViewPost(null)}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default FeedbackManager;
