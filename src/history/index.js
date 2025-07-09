import "./style.css";
import React from 'react';

const history = () => {
    return (
        <div className="context">
            <div className="contextTitle">역대 총학생회 소개</div>
            <hr className="titleSeparator" />

        <table className="council-history">
            <colgroup>
                <col style={{width: "65%"}}/>
                <col style={{width: "35%"}}/>
            </colgroup>
            <thead>
            <tr>
                <th>해당연도</th>
                <th>총, 부학생회장</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    2025년 제44대 총학생회 '아침'
                </td>
                <td>이재건(건축), 송재원(산공)</td>
            </tr>
            <tr>
                <td>
                    2024년 제43대 총학생회 '아우름'
                </td>
                <td>이홍서(경제), 이원재(산공)</td>
            </tr>
            <tr>
                <td>
                    2023년 제42대 총학생회 '위아'
                </td>
                <td>이효성(환안공), 김동현(전자)</td>
            </tr>
            <tr>
                <td>
                    2022년 제41대 총학생회 '담아'
                </td>
                <td>김형우(불문), 박시현(산공)</td>
            </tr>
            <tr>
                <td>
                    2021년 비상대책위원회
                </td>
                <td>김현빈(전자)</td>
            </tr>
            <tr>
                <td>
                    2020년 제40대 총학생회 '아워'
                </td>
                <td>김현빈(전자), 이소민(문콘)</td>
            </tr>
            <tr>
                <td>
                    2019년 제38대 총학생회 '다음'
                </td>
                <td>이기훈(경영), 김상서(기계)</td>
            </tr>
            </tbody>

        </table>
        </div>
    );
}

export default history;