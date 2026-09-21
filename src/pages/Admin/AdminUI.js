/*
 * 관리자 화면 공용 표현 컴포넌트 / 훅
 * 데이터 로직은 각 Manager에 그대로 두고, 여기에는 보여주는 방식만 둔다.
 */
import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Pencil, Plus, Search, UploadCloud, X } from "lucide-react";

const EMPTY_SET = new Set();

/* ───────── 훅 ───────── */

// 성공 메시지는 잠시 뒤 스스로 사라진다 (오류는 남겨둔다)
export const useAutoDismiss = (value, clear, delay = 5000) => {
    useEffect(() => {
        if (!value) return undefined;
        const timer = window.setTimeout(() => clear(""), delay);
        return () => window.clearTimeout(timer);
    }, [value, clear, delay]);
};

// 등록/수정 폼 패널 열림 상태. 수정이 시작되면 자동으로 열고 폼으로 스크롤한다.
export const useFormPanel = (editingKey) => {
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);
    const prevKeyRef = useRef(editingKey);

    const scrollToPanel = () => {
        window.requestAnimationFrame(() => {
            panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    useEffect(() => {
        const prevKey = prevKeyRef.current;
        prevKeyRef.current = editingKey;
        if (editingKey) {
            setOpen(true);
            scrollToPanel();
        } else if (prevKey) {
            // 수정이 끝났거나 취소되면 패널을 접는다
            setOpen(false);
        }
    }, [editingKey]);

    const reveal = () => {
        setOpen(true);
        scrollToPanel();
    };

    return { open, setOpen, panelRef, reveal };
};

// 목록을 다시 불러왔을 때 새로 생겼거나 내용이 바뀐 행의 id 집합 (잠깐 강조용)
export const useChangedRows = (items, getId, getSignature) => {
    const snapshotRef = useRef(null);
    const [changed, setChanged] = useState(EMPTY_SET);

    useEffect(() => {
        const next = new Map(
            items.map((item) => [
                String(getId(item)),
                getSignature ? getSignature(item) : JSON.stringify(item),
            ])
        );
        const prev = snapshotRef.current;
        if (next.size === 0 && !prev) return; // 첫 로드 전
        snapshotRef.current = next;
        if (!prev) return;

        const ids = [];
        next.forEach((signature, id) => {
            if (prev.get(id) !== signature) ids.push(id);
        });
        if (ids.length > 0) setChanged(new Set(ids));
    }, [items, getId, getSignature]);

    useEffect(() => {
        if (changed.size === 0) return undefined;
        const timer = window.setTimeout(() => setChanged(EMPTY_SET), 2000);
        return () => window.clearTimeout(timer);
    }, [changed]);

    return changed;
};

// 선택한 이미지 파일의 미리보기 URL (해제까지 처리)
export const useObjectUrls = (files) => {
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        const next = files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
        setPreviews(next);
        return () => next.forEach((preview) => URL.revokeObjectURL(preview.url));
    }, [files]);

    return previews;
};

/* ───────── 컴포넌트 ───────── */

export const AdminPanelHead = ({ title, count, description, children }) => (
    <header className="admin-panel-head">
        <div className="admin-panel-heading">
            <h2 className="admin-panel-title">
                {title}
                {count && <span className="admin-count">{count}</span>}
            </h2>
            {description && <p className="admin-panel-desc">{description}</p>}
        </div>
        {children && <div className="admin-panel-tools">{children}</div>}
    </header>
);

// "새로 등록" ↔ "닫기" ↔ "수정 취소" 토글 버튼
export const AdminFormToggle = ({ open, editing, label = "새로 등록", controls, onClick }) => (
    <button
        type="button"
        className={`ui-btn admin-form-toggle ${open ? "" : "is-primary"}`}
        aria-expanded={open}
        aria-controls={controls}
        onClick={onClick}
    >
        {open ? <X size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
        {open ? (editing ? "수정 취소" : "닫기") : label}
    </button>
);

export const AdminCollapse = ({ open, id, panelRef, children }) => (
    <div id={id} ref={panelRef} className={`admin-collapse ${open ? "is-open" : ""}`}>
        <div className="admin-collapse-inner">{children}</div>
    </div>
);

export const AdminEditBanner = ({ title, onCancel }) => (
    <div className="admin-edit-banner">
        <Pencil size={16} aria-hidden="true" />
        <p>
            수정 중: <strong>{title || "-"}</strong>
        </p>
        <button type="button" className="ui-btn is-small" onClick={onCancel}>
            수정 취소
        </button>
    </div>
);

export const AdminStatus = ({ message, error, onDismissMessage, onDismissError }) => {
    if (!message && !error) return null;
    return (
        <div className="admin-status-stack">
            {message && (
                <p className="admin-feedback success" role="status">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>{message}</span>
                    {onDismissMessage && (
                        <button type="button" className="admin-feedback-close" aria-label="메시지 닫기" onClick={onDismissMessage}>
                            <X size={16} aria-hidden="true" />
                        </button>
                    )}
                </p>
            )}
            {error && (
                <p className="admin-feedback error" role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{error}</span>
                    {onDismissError && (
                        <button type="button" className="admin-feedback-close" aria-label="오류 메시지 닫기" onClick={onDismissError}>
                            <X size={16} aria-hidden="true" />
                        </button>
                    )}
                </p>
            )}
        </div>
    );
};

export const AdminField = ({ label, htmlFor, required, hint, span, className = "", children }) => (
    <div className={`ui-field admin-field ${span ? "admin-span-2" : ""} ${className}`}>
        {htmlFor ? (
            <label htmlFor={htmlFor}>
                {label}
                {required && <span className="admin-required" aria-hidden="true"> *</span>}
            </label>
        ) : (
            <span className="ui-label">{label}</span>
        )}
        {children}
        {hint && <p className="admin-upload-hint">{hint}</p>}
    </div>
);

export const AdminCheckbox = ({ label, ...inputProps }) => (
    <label className="admin-checkbox">
        <input type="checkbox" {...inputProps} />
        <span>{label}</span>
    </label>
);

// 점선 드롭존처럼 보이지만 실제로는 영역 전체를 덮는 일반 file input
export const AdminFileDrop = ({ id, title, hint, busy = false, fileCount, inputProps }) => {
    const inputRef = useRef(null);
    const [over, setOver] = useState(false);

    // 폼이 초기화되어 선택 파일이 비면 input도 비워서 같은 파일을 다시 고를 수 있게 한다
    useEffect(() => {
        if (fileCount === 0 && inputRef.current) inputRef.current.value = "";
    }, [fileCount]);

    return (
        <div
            className={`admin-filedrop ${over ? "is-over" : ""} ${busy ? "is-busy" : ""}`}
            onDragEnter={() => setOver(true)}
            onDragLeave={() => setOver(false)}
            onDrop={() => setOver(false)}
        >
            <UploadCloud size={22} aria-hidden="true" />
            <span className="admin-filedrop-text">
                <span className="admin-filedrop-title">{title}</span>
                {hint && <span className="admin-upload-hint">{hint}</span>}
            </span>
            <input id={id} ref={inputRef} className="admin-filedrop-input" type="file" {...inputProps} />
        </div>
    );
};

export const AdminSearch = ({ value, onChange, placeholder, label }) => (
    <div className="admin-search">
        <Search size={16} aria-hidden="true" />
        <input
            type="search"
            className="ui-input admin-search-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-label={label || placeholder}
        />
    </div>
);

export const AdminSkeleton = ({ rows = 4 }) => (
    <div className="admin-skeleton" role="status" aria-label="불러오는 중">
        {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="ui-skeleton admin-skeleton-row" />
        ))}
    </div>
);

export const AdminEmpty = ({ children }) => <p className="ui-empty admin-empty">{children}</p>;
