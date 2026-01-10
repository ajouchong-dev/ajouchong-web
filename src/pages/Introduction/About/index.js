import React from 'react';
import './styles.css';

const About = () => {
    const aboutTexts = [
        "\n안녕하십니까, 아주대학교 학우 여러분. \n2026학년도 아주대학교 중앙비상대책위원장 이재건입니다. \n병오년 붉은 말의 해, 새해의 첫머리에서 학우 여러분께 정식으로 인사 올립니다.",
        "중앙비상대책위원회는 학생자치의 공백을 메우고, 학우 여러분의 권익보호와 알권리를 지키는 방향으로 운영하겠습니다.",
        "총학생회칙에 따라 중앙비상대책위원회는 총학생회장단의 결원 기간 동안, 총학생회장단에 준하는 업무와 권한을 바탕으로 학생사회 주요 기구들의 의결과 결정에 책임있게 임하겠습니다. ‘비상’이라는 이름이 동요가 아니라 안정의 표지로 남도록, 저희는 초지일관(初志一貫) 맡은 책무를 다하겠습니다.",
        "지난 시간 학우 여러분께서 학생자치에 보내주신 관심과 신뢰는 결코 당연한 것이 아니었습니다. 그 관심은 공동체를 움직이는 동력이었고, 그 신뢰는 우리가 스스로를 바로 세우는 기준이었습니다. 학생자치는 결국 ‘함께’라는 마음에서 시작됩니다. 누군가의 수고만으로 완성되는 일이 아니라, 우리가 같은 방향을 바라볼 때 비로소 이어질 수 있습니다.",
        "듣는 일은 더 빠르게, 설명은 더 명확하게, 공유는 더 투명하게 하겠습니다. 필요한 사안 앞에서는 흐릿하게 넘어가지 않겠습니다. 비판 앞에서도 변명보다 성찰을 선택하겠습니다.",
        "2026년은 학우 여러분들께서 다시 박차를 가하는 한 해가 되길 바랍니다. 학우 여러분의 오늘이 흔들리지 않도록, 중앙비상대책위원회가 끝까지 무게를 감당하겠습니다.",
        "새해에는 학우 여러분 모두 건강하시고, 만사형통(萬事亨通)하시며 뜻하신 바 이루시길 기원합니다. \n새해복 많이 받으십시오.",
        "2026년 1월 1일 \n아주대학교 중앙비상대책위원장 이재건 올림"
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