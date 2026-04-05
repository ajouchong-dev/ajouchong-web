import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "./styles.css";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://api.ajouchong.com",
});

const FEEDBACK_TITLE = "[홈페이지 피드백]";
const QUICK_LINKS = [
    { label: "공지사항", path: "/news/notice" },
    { label: "대여사업", path: "/welfare/rental" },
    { label: "제휴복지", path: "/welfare/promotion" },
    { label: "Q&A", path: "/communication/qna" },
    { label: "건의사항", path: "/communication/require" },
];

const FeedbackWidget = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("menu");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const resetMessages = () => {
        setMessage("");
        setError("");
    };

    const moveTo = (path) => {
        navigate(path);
        setIsOpen(false);
        setMode("menu");
        resetMessages();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) {
            setError("내용을 입력해주세요.");
            return;
        }

        if (!auth.isAuthenticated) {
            setError("로그인 후 이용 가능합니다.");
            setTimeout(() => navigate("/profile"), 600);
            return;
        }

        setSubmitting(true);
        resetMessages();
        try {
            await apiClient.post(
                "/api/qna",
                { qpTitle: FEEDBACK_TITLE, qpContent: trimmed },
                { withCredentials: true, headers: { "Content-Type": "application/json" } }
            );
            setMessage("의견이 접수되었습니다. 감사합니다.");
            setContent("");
        } catch (e) {
            setError(e.response?.data?.message || "의견 접수 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    const closePanel = () => {
        setIsOpen(false);
        setMode("menu");
        resetMessages();
    };

    return (
        <div className="feedback-widget">
            {isOpen && (
                <section className="feedback-panel" aria-label="홈페이지 도우미">
                    <div className="feedback-panel-head">
                        <img src="/images/logos/치토.jpeg" alt="치토" />
                        <div>
                            <h3>무엇을 도와드릴까요?</h3>
                            <p>원하는 메뉴를 선택하거나 의견을 남겨주세요.</p>
                        </div>
                    </div>

                    {mode === "menu" ? (
                        <>
                            <div className="feedback-quick-grid">
                                {QUICK_LINKS.map((item) => (
                                    <button
                                        key={item.path}
                                        type="button"
                                        className="feedback-quick-btn"
                                        onClick={() => moveTo(item.path)}
                                    >
                                        {item.label}로 이동
                                    </button>
                                ))}
                            </div>
                            <div className="feedback-actions">
                                <button
                                    type="button"
                                    className="feedback-btn muted"
                                    onClick={closePanel}
                                >
                                    닫기
                                </button>
                                <button
                                    type="button"
                                    className="feedback-btn primary"
                                    onClick={() => {
                                        setMode("feedback");
                                        resetMessages();
                                    }}
                                >
                                    의견 남기기
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p className="feedback-form-guide">홈페이지의 개선점이나 총학생회에게 하고싶은 말을 편하게 적어주세요!</p>
                            <textarea
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                placeholder="의견을 입력해주세요."
                                rows={5}
                                maxLength={2000}
                            />
                            {message && <div className="feedback-msg success">{message}</div>}
                            {error && <div className="feedback-msg error">{error}</div>}
                            <div className="feedback-actions">
                                <button
                                    type="button"
                                    className="feedback-btn muted"
                                    onClick={() => {
                                        setMode("menu");
                                        resetMessages();
                                    }}
                                >
                                    뒤로
                                </button>
                                <button type="submit" className="feedback-btn primary" disabled={submitting}>
                                    {submitting ? "전송 중..." : "보내기"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            )}

            <button
                type="button"
                className="feedback-fab"
                aria-label="도움 메뉴 열기"
                onClick={() => {
                    setIsOpen((prev) => !prev);
                    if (!isOpen) {
                        setMode("menu");
                        resetMessages();
                    }
                }}
            >
                ?
            </button>
        </div>
    );
};

export default FeedbackWidget;