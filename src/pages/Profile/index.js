import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import {googleLogout} from "@react-oauth/google";
import Cookies from "js-cookie";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const jwtToken = localStorage.getItem("jwtToken");

                if (!jwtToken) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate("/");
                    return;
                }

                const response = await axios.get("https://www.ajouchong.com/api/login/auth/info", {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                console.log("User:", response.data);
                setUser(response.data.data.member);
            } catch (error) {
                console.error("사용자 정보 가져오기 실패:", error);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const logout = () => {
        googleLogout();
        setUser(null);

        localStorage.clear();
        Cookies.remove("jwtToken");

        navigate("/");
        window.location.reload();
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <hr className="titleSeparator"/>
            {user ? (
                <div className="profile-info">
                    <p>이름: {user.name}</p>
                    <p>이메일: {user.email}</p>
                </div>
            ) : (
                <p className="loading-text">로딩 중...</p>
            )}
            <p> </p>
            <button className="logout-btn" onClick={logout}>로그아웃</button>
        </div>
    );
};

export default Profile;
