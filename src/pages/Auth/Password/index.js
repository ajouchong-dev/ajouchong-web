import './styles.css';
import React from 'react';

const Password = () => {
    return (
        <div className="context">
            <div className="contextTitle">비밀번호 찾기</div>

            <div className="pw-container">
                <div className="pw-row">
                    <div className="pw-info">성명</div>
                    <input type="text" className="pw-input"/>
                </div>
                <div className="pw-row">
                    <div className="pw-info">이메일</div>
                    <input type="password" className="pw-input"/>
                </div>
                <div className="pw-row">
                    <button className="pw-num">인증번호 받기</button>
                </div>
                <div className="pw-row">
                    <div className="pw-info">인증번호</div>
                    <input type="text" className="pw-input2"/>
                </div>
                <div className="pw-row">
                    <div className="pw-succ">* 인증이 완료되었습니다.</div>
                </div>
                <div className="pw-row">
                    <a className="pw-change" href="/pwchange">비밀번호 변경하기</a>
                </div>
            </div>


        </div>
    );
}


export default Password;