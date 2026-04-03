import React from 'react';
import './styles.css';

const About = () => {
    const aboutTexts = [
        "\n안녕하십니까, 아주대학교 학우 여러분.",
        "현재 홈페이지는 2026학년도 제45대 총학생회 AU:SUM 체제로 임시 반영되어 있습니다.",
        "회장단 소개, 국서별 조직도, 정책집, 사업 소개 등 상세 내용은 순차적으로 업데이트될 예정입니다.",
        "임시 안내 기간 동안에도 학우 여러분께 필요한 공지와 정보는 지속적으로 전달드리겠습니다.",
        "감사합니다.",
        "2026년 \n아주대학교 제45대 총학생회 AU:SUM (임시)"
    ];

    const renderAboutText = (text, index) => (
        <React.Fragment key={index}>
            <div className="aboutText">{text}</div>
            {index < aboutTexts.length - 1 && <span className="space2"></span>}
        </React.Fragment>
    );

    return (
        <div className="context">
            <div className="contextTitle">총학생회 소개</div>
            <hr className="titleSeparator"/>
            {/* <img
                className="aboutImg"
                src='/images/main/chairman.jpeg'
                alt="ajouchong_chairman"
            /> */}
            <div className="aboutTextBox">
                {aboutTexts.map(renderAboutText)}
            </div>
        </div>
    );
};

export default About;
