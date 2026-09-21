import React from "react";
import "./styles.css";

const RECORDS = [
    { year: "2026", council: "2026년 제45대 총학생회 'AU:SUM'", name: "추후 업데이트 예정", pending: true },
    { year: "2025", council: "2025년 제44대 총학생회 '아침'", name: "<ACENTIA>日出(일출): 파란 물결의 찬란한 시작", pending: false },
];

const Record = () => {
    return (
        <div className="context">
            <div className="contextTitle">역대 ACENTIA</div>
            <hr className="titleSeparator"/>
            <div className="acentia-record">
                <div className="acentia-record-head" aria-hidden="true">
                    <span>해당연도</span>
                    <span>ACENTIA 이름</span>
                </div>
                <ol className="acentia-record-list">
                    {RECORDS.map((record) => (
                        <li className={`acentia-record-item ${record.pending ? "is-pending" : ""}`} key={record.year}>
                            <div className="acentia-record-when">
                                <span className="acentia-record-year" aria-hidden="true">{record.year}</span>
                                <span className="acentia-record-council">{record.council}</span>
                            </div>
                            <p className="acentia-record-name">{record.name}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default Record;
