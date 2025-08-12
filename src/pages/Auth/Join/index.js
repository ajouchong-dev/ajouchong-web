import './styles.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
    const [isAgreed, setIsAgreed] = useState(false);
    const navigate = useNavigate();

    const handleAgreementChange = (e) => {
        setIsAgreed(e.target.checked);
    };

    const handleJoinClick = () => {
        if (isAgreed) {
            navigate('/personal-info');
        }
    };

    return (
        <div className="context">
            <div className="contextTitle">AJOU UNIV</div>
            <img className="signinlogo" src="/aurum_black.png" alt="Ajou University Logo"/>
            <hr className="titleSeparator"/>
            <div className="agreementSection">
                <label className="agreementLabel">
                    <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={handleAgreementChange}
                    />
                    개인정보 이용에 동의합니다.
                </label>
            </div>

            <button
                className="joinButton"
                onClick={handleJoinClick}
                disabled={!isAgreed}
                style={{
                    backgroundColor: isAgreed ? "#282c34" : "#a9a9a9",
                    width: "135px",
                    height: "35px",
                    textDecoration: "none",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    right: "20px",
                    borderRadius: "10px",
                    border: "none",
                    display: "flex",
                    color: "#fdfdfd",
                    marginRight: "30px",
                    padding: "0"
                }}
            >
                회원가입
            </button>
        </div>
    );
}

export default Join;
