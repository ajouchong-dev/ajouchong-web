import React from "react";

const MyPage = ({ user }) => {
    if (!user) {
        return <h2>로그인이 필요합니다.</h2>;
    }

    return (
        <div>
            <h1>마이 페이지</h1>
            <p>이름: {user.name}</p>
            <p>이메일: {user.email}</p>
        </div>
    );
};

export default MyPage;
