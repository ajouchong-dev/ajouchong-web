import "./style.css";
import React from 'react';
import { useNavigate } from 'react-router-dom';

const councilList = [
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
        navigate(`/history/${year}`);
    };

    const renderTableRow = ({ year, title, leaders }) => (
        <tr
            key={year}
            onClick={() => handleRowClick(year)}
            className="clickable-row"
        >
            <td>{title}</td>
            <td>{leaders}</td>
        </tr>
    );

    return (
        <div className="context">
            <div className="contextTitle">역대 총학생회 소개</div>
            <hr className="titleSeparator" />

            <table className="council-history">
                <colgroup>
                    <col style={{ width: "65%" }} />
                    <col style={{ width: "35%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>해당연도</th>
                        <th>총, 부학생회장</th>
                    </tr>
                </thead>
                <tbody>
                    {councilList.map(renderTableRow)}
                </tbody>
            </table>
        </div>
    );
};

export default History;
