import './styles.css';
import axios from "axios";
import React, { useEffect, useState } from 'react';

const About = (props, context) => {

    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        // Fetch the image URL from the API using axios
        axios.get('/about/introduce')
            .then(response => {
                // Assuming the response has a structure like { imageUrl: "url_here" }
                setImageUrl(response.data.imageUrl);
            })
            .catch(error => {
                console.error('Error fetching the image URL:', error);
            });
    }, []);

    return (
        <div className="context">
                <div className="contextTitle">총학생회 소개</div>
                <hr className="titleSeparator"/>
                <img
                    className="aboutImg"
                    src='/chairman.jpeg'
                    // src={imageUrl}
                    alt="ajouchong_chairman"
                />
            <div className="aboutTextBox">
                <div className="aboutText">안녕하십니까, 아주대학교 1만 학우 여러분.</div>
                <div className="aboutText">아주대학교 제44대 총학생회 '아침'의 총학생회장 이재건, 부총학생회장 송재원입니다.</div>
                <span className="space2"></span>
                <div className="aboutText">2025년 을사년 새 아침이 밝아, 학우 여러분께 정식으로 인사드립니다.</div>
                <span className="space2"></span>
                <div className="aboutText">먼저, 지난 선거에서 보내주신 관심과 소중한 지지에 깊은 감사의 말씀을 드립니다.
                여러분의 신뢰를 무겁게 받아들이며, 그 믿음에 부응하고자 한 해 동안 학우 여러분의 목소리에 귀 기울이고,
                    함께 더 나은 학교를 만들어가는 데 최선을 다하겠습니다.
                </div>
                <span className="space2"></span>
                <div className="aboutText">2025년, 우리 학교는 융합 학문과 창의적 성장을 중심으로 새 지평을 열어가며 중요한 전환점을 맞이할 것입니다.
                    지속 가능하고 조화로운 발전을 추구하는 대학의 이념 아래,
                    학우 여러분의 생각과 뜻을 하나로 모아, 아주대학교만의 문화를 정립하고자 합니다.
                </div>
                <span className="space2"></span>
                <div className="aboutText">학생회의 본질을 지키며, 학우 여러분과 상호 소통하며 권익을 위해 함께 걸어가도록 노력하겠습니다.
                    아울러, 격려와 조언뿐만 아니라 때로는 날카로운 비판과 질책도 받아들이며 발전하는 학생회를 만들어가도록 하겠습니다.</div>
                <span className="space2"></span>
                <div className="aboutText">마지막으로, 학우 여러분의 다양한 의견을 경청하며, 여러분들을 위한 밝은 아침을 만들겠습니다.
                    2025년 한 해 동안 학우 여러분 모두가 건강하시고, 자신의 잠재력을 마음껏 발휘하며 뜻깊은 대학 생활을 보내시기를 진심으로 기원합니다.
                </div>
                <span className="space2"></span>
                <div className="aboutText">새해 복 많이 받으시길 바랍니다.</div>
                <span className="space2"></span>
                <div className="aboutText">2025년 1월 1일.</div>
                <div className="aboutText">아주대학교 제44대 총학생회 '아침' 올림</div>
            </div>
        </div>


    );
}
export default About;