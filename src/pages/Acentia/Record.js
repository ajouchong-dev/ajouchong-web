import React from "react";
import "./record.css";

const Record = () => {
    return (
        <div className="context">
            <div className="contextTitle">역대 ACENTIA</div>
            <hr className="titleSeparator"/>
            <table className="acentia-record">
                <colgroup>
                    <col style={{width: "35%"}}/>
                    <col style={{width: "65%"}}/>
                </colgroup>
                <thead>
                <tr>
                    <th>해당연도</th>
                    <th>ACENTIA 이름</th>
                </tr>
                </thead>
                <tbody>
                {/*<tr>*/}
                {/*    <td>*/}
                {/*        2026년 제45대 총학생회 ''*/}
                {/*    </td>*/}
                {/*    <td> </td>*/}
                {/*</tr>*/}
                <tr>
                    <td>2025년 제44대 총학생회 '아침'</td>
                    <td> &lt;ACENTIA&gt;日出(일출): 파란 물결의 찬란한 시작</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Record;