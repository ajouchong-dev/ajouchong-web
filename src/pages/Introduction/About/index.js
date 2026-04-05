import React from 'react';
import './styles.css';

const About = () => {
    const aboutTexts = [
        '안녕하십니까, 아주대학교 학우 여러분.',
        '아주대학교 제45대 총학생회 <AU:SUM>의 총학생회장 송재원, 부총학생회장 송은기입니다.',
        '보궐선거의 종료와 함께 임기를 맞아 학우 여러분께 정식으로 인사드립니다.',
        '먼저, 학생자치에 뜻을 모아주시고 소중한 선택을 보내주신 학우 여러분께 진심으로 감사의 말씀을 드립니다. 학우분들의 믿음을 무겁게 받아들이며 이에 보답할 수 있는 총학생회가 될 수 있도록 노력하겠습니다.',
        '2026년도, 우리학교는 교육제도의 격변과 지역 사회와의 연결 등 다양한 시대적 과제에 대한 준비가 필요합니다. 총학생회는 지속가능한 학생사회의 유지를 위해 새로운 국면에도 흔들리지 않는 학생자치 체계를 구축하고자 합니다.',
        'AU:SUM의 기조는 “우리의 목소리를 더해, 찬란한 아주의 내일로”입니다.',
        '교육과 생활, 문화와 소통, 권리와 자치의 모든 영역에서 학우 여러분의 목소리가 더 큰 힘을 가질 수 있도록 끝까지 책임을 다하겠습니다. 학우들의 의견을 듣는 데 그치지 않고 반영하여 학우 여러분이 체감할 수 있는 변화를 만들겠습니다.',
        '1만 학우 여러분의 목소리가 아주인으로서의 자부심이 될 수 있도록 최선을 다하겠습니다. 감사합니다.',
        '아주대학교 제45대 총학생회 AU:SUM 올림',
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
            <hr className="titleSeparator" />
            <div className="aboutTextBox">
                {aboutTexts.map(renderAboutText)}
            </div>
        </div>
    );
};

export default About;
