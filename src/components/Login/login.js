import React, { useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import axios from "axios";
import "./login.css";
import {useNavigate} from "react-router-dom";

const Login = ({ user, setUser }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);

    const signInWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                if (userInfo.data.hd !== "ajou.ac.kr") {
                    alert("@ajou.ac.kr 계정만 로그인 가능합니다.");
                    return;
                }

                setUser(userInfo.data);

                const backendResponse = await axios.post("https://ajouchong.com/api/login/auth/oauth", {
                    accessToken: tokenResponse.access_token,
                    // expiresIn: tokenResponse.expires_in,
                });

                // console.log("backRes", backendResponse.data);

                const jwtToken = backendResponse.data.data.jwtToken;

                if (jwtToken) {
                    localStorage.setItem("jwtToken", jwtToken);
                    localStorage.setItem("user", JSON.stringify(userInfo.data));
                    Cookies.set("jwtToken", jwtToken, { expires: 1 });

                    navigate("/profile");
                } else {
                    console.error("jwt Token이 존재하지 않습니다.");
                }
            } catch (error) {
                console.error("Login Error:", error);
            }
        },
        onError: (error) => console.error("Login Failed:", error),
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        access_type: "offline",
        prompt: "consent",
    });

    const logout = () => {
        googleLogout();
        setUser(null);

        localStorage.clear();
        Cookies.remove("jwtToken");

        navigate("/");
    };

    return (
        <div className="login-container">
            {user ? (
                <button className="auth-button" onClick={logout}>
                    Logout
                </button>
            ) : (
                <button onClick={signInWithGoogle} className="auth-button">
                    Login
                </button>
            )}
        </div>
    );
};

export default Login;
