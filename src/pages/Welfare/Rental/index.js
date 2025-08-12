import './styles.css';
import React from 'react';

const Rental = () => {
    return (
        <div className="context">
            <div className="contextTitle">대여사업</div>
            <hr className="titleSeparator"/>
            <div className="rental-container">

                <button
                    className="rental-button"
                    onClick={() => window.open("https://forms.gle/buMhGLbFYeVjcdTi8", "_blank")}
                >
                    &gt; 대여사업 구글폼 바로가기
                </button>
                {/*<div className="rental-subTitle">물품 대여 현황</div>*/}
                {/*<div className="rental-box"></div>*/}
                <iframe className="rental-box"
                    src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJHth6JF5fzylhaW_6Rx6ZkqEd6iweJEyRzkM9DwbEfA23-B90roLf91PWLTXEX0PTwH7lNGQS_3sd/pubhtml?widget=true&amp;headers=false"></iframe>
                {/*<ul className="rental-button">*/}


                {/*</ul>*/}
                <div className="rental-info">
                    <div id="retal-title">총학생회 대여 사업 안내</div>
                    <hr className="tableSeparator"/>
                    <img className="rentalImg" src="/main/rental_1.png" alt="대여사업 안내 이미지 1"/>
                    <img className="rentalImg" src="/main/rental_2.png" alt="대여사업 안내 이미지 2"/>

                </div>

            </div>
        </div>
    );
}

export default Rental;