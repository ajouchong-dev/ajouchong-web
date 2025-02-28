import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { googleLogout } from "@react-oauth/google";
import Cookies from "js-cookie";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const getStoredJwtToken = () => Cookies.get("jwtToken");

    const storeJwtToken = (newToken) => {
        if (newToken) {
            Cookies.set("jwtToken", newToken, { expires: 1 });
        }
    };

    const handleLogout = useCallback(() => {
        googleLogout();
        setUser(null);
        Cookies.remove("jwtToken");
        localStorage.removeItem("user");
        navigate("/");
        setTimeout(() => window.location.reload(), 500);
    }, [navigate]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                let jwtToken = getStoredJwtToken();

                if (!jwtToken) {
                    alert("로그인이 필요한 서비스입니다.");
                    setTimeout(() => handleLogout(), 500);
                    return;
                }

                const response = await axios.get("https://www.ajouchong.com/api/login/auth/info", {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                    withCredentials: true,
                });

                const { status, data } = response.data;

                if (status === 2 && data.jwtToken) {
                    storeJwtToken(data.jwtToken);
                }

                setUser(data.member);
            } catch (error) {

                if (error.response?.status === 401) {
                    console.log(error);
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    setTimeout(() => handleLogout(), 500);
                }
            }
        };

        fetchUserInfo();
    }, [handleLogout, navigate]);

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
            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default Profile;
