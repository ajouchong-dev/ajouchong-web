import "./style.css";
import React from 'react';
import { Link } from 'react-router-dom'; // 🔹 링크를 위한 import 추가

const history = () => {
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
                    <tr>
                        <td>
                            <Link to="/history/2025" className="link">2025년 제44대 총학생회 '아침'</Link>
                        </td>
                        <td>이재건(건축), 송재원(산공)</td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/introduction/history/2024" className="link">2024년 제43대 총학생회 '아우름'</Link>
                        </td>
                        <td>이홍서(경제), 이원재(산공)</td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/history/2023" className="link">2023년 제42대 총학생회 '위아'</Link>
                        </td>
                        <td>이효성(환안공), 이동현(전자)</td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/history/2022" className="link">2022년 제41대 총학생회 '담아'</Link>
                        </td>
                        <td>김형우(불문), 박시연(산공)</td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/history/2021" className="link">2021년 비상대책위원회</Link>
                        </td>
                        <td>김현빈(전자)</td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/history/2020" className="link">2020년 제40대 총학생회 '아워'</Link>
                        </td>
                        <td>김현빈(전자), 이소민(문콘)</td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/history/2019" className="link">2019년 제39대 총학생회 '다움'</Link>
                        </td>
                        <td>이기훈(경영), 김상서(기계)</td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/history/2018" className="link">2018년 제38대 총학생회 '아이콘'</Link>
                        </td>
                        <td>이성호(건축), 박수빈(경영)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default history;
