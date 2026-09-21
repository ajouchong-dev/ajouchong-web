import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import "./style.css";

const councilList = [
    { year: "2026", title: "2026년 제45대 총학생회 'AU:SUM' ", leaders: "송재원(산공), 송은기(경영)" },
    { year: "2025", title: "2025년 제44대 총학생회 '아침'", leaders: "이재건(건축), 송재원(산공)" },
    { year: "2024", title: "2024년 제43대 총학생회 '아우름'", leaders: "이홍서(경제), 이원재(산공)" },
    { year: "2023", title: "2023년 제42대 총학생회 '위아'", leaders: "이효성(환안공), 이동현(전자)" },
    { year: "2022", title: "2022년 제41대 총학생회 '담아'", leaders: "김형우(불문), 박시연(산공)" },
    { year: "2021", title: "2021년 비상대책위원회", leaders: "김현빈(전자)" },
    { year: "2020", title: "2020년 제40대 총학생회 '아워'", leaders: "김현빈(전자), 이소민(문콘)" },
    { year: "2019", title: "2019년 제39대 총학생회 '다움'", leaders: "이기훈(경영), 김상서(기계)" },
    { year: "2018", title: "2018년 제38대 총학생회 '아이콘'", leaders: "이성호(건축), 박수빈(경영)" },
];

const History = () => {
    const navigate = useNavigate();

    const handleRowClick = (year) => {
        navigate(`/introduction/history/${year}`);
    };

    const renderItem = ({ year, title, leaders }, index) => (
        <li key={year} className={`history-row ${index === 0 ? 'is-current' : ''}`}>
            <button
                type="button"
                className="history-item"
                onClick={() => handleRowClick(year)}
            >
                <span className="history-item__year">{year}</span>
                <span className="history-item__title">{title.trim()}</span>
                <span className="history-item__leaders">
                    <span className="history-item__label">총, 부학생회장</span>
                    {leaders}
                </span>
                <ChevronRight className="history-item__arrow" size={20} aria-hidden="true" />
            </button>
        </li>
    );

    return (
        <div className="context">
            <div className="contextTitle">역대 총학생회 소개</div>
            <hr className="titleSeparator" />

            <div className="history-head" aria-hidden="true">
                <span className="history-head__year">해당연도</span>
                <span className="history-head__leaders">총, 부학생회장</span>
            </div>
            <ol className="history-list">
                {councilList.map(renderItem)}
            </ol>
        </div>
    );
};

export default History;
