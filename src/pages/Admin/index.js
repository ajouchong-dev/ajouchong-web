import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Handshake, Link2, Megaphone, MessageSquare, Package } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import PromotionManager from "./PromotionManager";
import RentalManager from "./RentalManager";
import FeedbackManager from "./FeedbackManager";
import LinkHubManager from "./LinkHubManager";
import ProceedingManager from "./ProceedingManager";
import NoticeManager from "./NoticeManager";
import "./styles.css";

const SECTIONS = [
    { id: "notice", label: "공지사항", icon: Megaphone, Component: NoticeManager },
    { id: "proceeding", label: "회의록", icon: FileText, Component: ProceedingManager },
    { id: "promotion", label: "제휴", icon: Handshake, Component: PromotionManager },
    { id: "rental", label: "대여", icon: Package, Component: RentalManager },
    { id: "linkhub", label: "링크허브", icon: Link2, Component: LinkHubManager },
    { id: "feedback", label: "피드백", icon: MessageSquare, Component: FeedbackManager },
];

const sectionFromHash = (hash) => {
    const id = (hash || "").replace(/^#/, "");
    return SECTIONS.some((section) => section.id === id) ? id : SECTIONS[0].id;
};

const Admin = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const activeId = sectionFromHash(location.hash);
    const activeSection = SECTIONS.find((section) => section.id === activeId);

    // 한 번 연 메뉴는 계속 마운트해 둔다 (작성 중이던 폼, 피드백 잠금 해제 상태 유지)
    const [visited, setVisited] = useState(() => [activeId]);
    const navListRef = useRef(null);
    const mainRef = useRef(null);
    const tabRefs = useRef({});

    useEffect(() => {
        setVisited((prev) => (prev.includes(activeId) ? prev : [...prev, activeId]));

        // 모바일 가로 탭: 활성 탭을 가운데로
        const list = navListRef.current;
        const tab = tabRefs.current[activeId];
        if (list && tab && list.scrollWidth > list.clientWidth) {
            list.scrollTo({
                left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
                behavior: "smooth",
            });
        }
    }, [activeId]);

    const selectSection = (id) => {
        if (id === activeId) return;
        navigate({ hash: `#${id}` }, { replace: true });

        // 목록 아래쪽에서 탭을 바꾸면 새 패널의 머리로 올린다 (고정 헤더·탭 높이는 scroll-margin-top으로 보정)
        const main = mainRef.current;
        if (main) {
            const stickyOffset = parseFloat(window.getComputedStyle(main).scrollMarginTop) || 0;
            if (main.getBoundingClientRect().top < stickyOffset) {
                main.scrollIntoView({ block: "start" });
            }
        }
    };

    const handleTabKeyDown = (event, index) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        const next = SECTIONS[(index + step + SECTIONS.length) % SECTIONS.length];
        selectSection(next.id);
        tabRefs.current[next.id]?.focus();
    };

    return (
        <div className="context is-wide admin-console">
            <div className="admin-titlebar">
                <div className="contextTitle">
                    관리자
                    <span className="admin-title-section">{activeSection.label}</span>
                </div>
                <div className="admin-account">
                    <dl className="admin-account-list" aria-label="접속 정보">
                        <div>
                            <dt>이름</dt>
                            <dd>{auth.user?.name || "-"}</dd>
                        </div>
                        <div>
                            <dt>이메일</dt>
                            <dd>{auth.user?.email || "-"}</dd>
                        </div>
                        <div>
                            <dt>권한</dt>
                            <dd><span className="ui-badge is-brand">{auth.user?.role || "-"}</span></dd>
                        </div>
                    </dl>
                    <p className="admin-account-note">이 페이지는 ADMIN 권한 계정만 접근할 수 있습니다.</p>
                </div>
            </div>
            <hr className="titleSeparator" />

            <div className="admin-layout">
                <nav className="admin-nav" aria-label="관리 메뉴">
                    <div className="admin-nav-list" role="tablist" ref={navListRef}>
                        {SECTIONS.map((section, index) => {
                            const Icon = section.icon;
                            const isActive = section.id === activeId;
                            return (
                                <button
                                    key={section.id}
                                    ref={(node) => {
                                        tabRefs.current[section.id] = node;
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`admin-tab-${section.id}`}
                                    aria-selected={isActive}
                                    aria-controls={`admin-panel-${section.id}`}
                                    tabIndex={isActive ? 0 : -1}
                                    className={`admin-nav-item ${isActive ? "is-active" : ""}`}
                                    onClick={() => selectSection(section.id)}
                                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                                >
                                    <Icon size={18} aria-hidden="true" />
                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <div className="admin-main" ref={mainRef}>
                    {SECTIONS.map(({ id, Component }) => {
                        if (!visited.includes(id) && id !== activeId) return null;
                        return (
                            <div
                                key={id}
                                role="tabpanel"
                                id={`admin-panel-${id}`}
                                aria-labelledby={`admin-tab-${id}`}
                                className="admin-panel"
                                hidden={id !== activeId}
                            >
                                <Component />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Admin;
