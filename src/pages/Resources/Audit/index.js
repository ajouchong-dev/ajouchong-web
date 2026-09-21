import '../styles.css';
import './styles.css';
import React from 'react';
import { ArrowUpRight, FolderOpen } from 'lucide-react';

const Audit = () => {
    return (
        <div className="context">
            <div className="contextTitle">감사자료</div>
            <hr className="titleSeparator" />
            <p className="page-lead">총학생회 감사자료는 Google Drive 폴더에 모아 두었습니다.</p>
            <ul className="resources-doc-list audit-list">
                <li className="resources-doc">
                    <a
                        className="resources-doc-main audit-link"
                        href="https://drive.google.com/drive/folders/1HTSIn5xBGrgxCVq38xlG-3YiKjKNUjZB"
                    >
                        <span className="resources-doc-icon" aria-hidden="true">
                            <FolderOpen size={18} />
                        </span>
                        <span className="resources-doc-text">
                            <span className="resources-doc-title">총학생회 학생회 감사자료 바로가기</span>
                            <span className="resources-doc-meta">drive.google.com</span>
                        </span>
                        <ArrowUpRight className="audit-link-arrow" size={18} aria-hidden="true" />
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default Audit;
