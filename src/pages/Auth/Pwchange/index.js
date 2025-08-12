import './styles.css';
import React from 'react';

const Passwordchange = () => {
    return (
        <div className="context">
            <div className="contextTitle">비밀번호 변경하기</div>

            <div className="pw-container">
                <div className="pw-row">
                    <div className="pw-info">변경할 비밀번호</div>
                    <input type="text" className="pw-input"/>
                </div>
                <div className="pw-row">
                    <div className="pw-info">비밀번호 확인</div>
                    <input type="password" className="pw-input"/>
                </div>

                <div className="pw-row">
                    <a className="pw-change" >비밀번호 변경하기</a>
                </div>
            </div>


        </div>
    );
}


export default Passwordchange;