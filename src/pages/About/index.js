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
                    src='/chairman.png'
                    // src={imageUrl}
                    alt="ajouchong"
                />
            <div className="aboutTextBox">
                <div className="aboutText">안녕하십니까 아주대학교 학우 여러분</div>
                <div className="aboutText">아주대학교 제43대 총학생회장 이홍서, 부총학생회장 이원재입니다.</div>
                <span className="space2"></span>
                <div className="aboutText">선거가 종료되며 중앙비상대책위원회에서 총학생회 체제로 변경됨에 따라</div>
                <div className="aboutText">학우 여러분께 정식으로 인사드릴 수 있게 되었습니다.</div>
                <div className="aboutText">소중한 한 표를 행사해주신 학우 여러분의 많은 관심과 참여에 감사드립니다.</div>
                <span className="space2"></span>
                <div className="aboutText">아우름은‘아울러 함께하는 우리의 아주’ 라는
                    슬로건을 내세우며 학우 여러분 앞에 서게 되었습니다.</div>
                <div className="aboutText">슬로건의 의미와 함께 학우 여러분께 보여드리는 각오를 말씀드리겠습니다.</div>
                <span className="space2"></span>
                <div className="aboutText">아울러 함께하는 학생 사회가 필요하다고 생각했습니다.</div>
                <div className="aboutText">위기의 상황을 바꾸는 일도, 우리의 일상과 문화를 형성하는 일도,</div>
                <div className="aboutText">우리의 목소리가 모여 그 힘이 있을 때 가능합니다.</div>
                <div className="aboutText">퍼즐 조각을 모아 하나의 그림을 완성하듯이</div>
                <div className="aboutText">학우 여러분의 의견에 귀 기울이고 함께 만들어가는 학생 사회라는 큰 그림을 위해 노력하겠습니다.</div>
                <span className="space2"></span>
                <div className="aboutText">우리의 아주라는 문화와 자부심을 중요하게 생각하고 있습니다.</div>
                <div className="aboutText">학우 여러분을 위해 존재하는 총학생회의 목적에 부합하도록 소통하고 헌신할 것을 진심으로 약속드립니다.</div>
                <div className="aboutText">나아가 학우 여러분의 자부심을 지킬 수 있는 우리 아주인의 문화를 형성하고 노력하겠습니다.</div>
                <span className="space2"></span>
                <div className="aboutText">아주대학교 학우 여러분, 총학생회는 아우름이라는 이름처럼 다양한 의견을 아우르기 위해 노력하겠습니다.</div>
                <div className="aboutText">우리 대학과 우리의 학교 생활의 가치를 높이기 위한</div>
                <div className="aboutText"> 학우 여러분의 관심과 참여, 비판까지 아낌없이 부탁드립니다.</div>
                <div className="aboutText"> 감사합니다.</div>
                <span className="space2"></span>
                <div className="aboutText">제43대 총학생회장 이홍서, 부총학생회장 이원재 올림</div>

            </div>
        </div>


    );
}
export default About;