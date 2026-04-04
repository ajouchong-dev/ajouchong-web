import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import PromotionManager from "./PromotionManager";
import RentalManager from "./RentalManager";
import "./styles.css";

const Admin = () => {
    const { auth } = useAuth();

    return (
        <div className="context">
            <div className="contextTitle">관리자 페이지</div>
            <hr className="titleSeparator" />

            <div className="admin-container">
                <div className="admin-card">
                    <h2>접속 정보</h2>
                    <p><strong>이름:</strong> {auth.user?.name || "-"}</p>
                    <p><strong>이메일:</strong> {auth.user?.email || "-"}</p>
                    <p><strong>권한:</strong> {auth.user?.role || "-"}</p>
                </div>

                <div className="admin-card">
                    <h2>관리자 안내</h2>
                    <p>이 페이지는 ADMIN 권한 계정만 접근할 수 있습니다.</p>
                    <p>아래에서 제휴사업 표를 직접 관리할 수 있습니다.</p>
                </div>

                <PromotionManager />
                <RentalManager />
            </div>
        </div>
    );
};

export default Admin;
