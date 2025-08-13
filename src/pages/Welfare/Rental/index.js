import './styles.css';
import React from 'react';

const Rental = () => {
    const RENTAL_FORM_URL = "https://forms.gle/buMhGLbFYeVjcdTi8";
    const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJHth6JF5fzylhaW_6Rx6ZkqEd6iweJEyRzkM9DwbEfA23-B90roLf91PWLTXEX0PTwH7lNGQS_3sd/pubhtml?widget=true&amp;headers=false";
    
    const rentalImages = [
        { src: "/images/rental/rental_1.png", alt: "대여사업 안내 이미지 1" },
        { src: "/images/rental/rental_2.png", alt: "대여사업 안내 이미지 2" }
    ];

    const handleOpenRentalForm = () => {
        window.open(RENTAL_FORM_URL, "_blank");
    };

    const renderRentalFormButton = () => (
        <button
            className="rental-button"
            onClick={handleOpenRentalForm}
        >
            &gt; 대여사업 구글폼 바로가기
        </button>
    );

    const renderRentalSpreadsheet = () => (
        <iframe 
            className="rental-box"
            src={SPREADSHEET_URL}
            title="대여 현황 스프레드시트"
        />
    );

    const renderRentalImages = () => (
        <div className="rental-images">
            {rentalImages.map((image, index) => (
                <img 
                    key={index}
                    className="rentalImg" 
                    src={image.src} 
                    alt={image.alt}
                />
            ))}
        </div>
    );

    const renderRentalInfo = () => (
        <div className="rental-info">
            <div id="rental-title">총학생회 대여 사업 안내</div>
            <hr className="tableSeparator"/>
            {renderRentalImages()}
        </div>
    );

    const renderRentalContainer = () => (
        <div className="rental-container">
            {renderRentalFormButton()}
            {renderRentalSpreadsheet()}
            {renderRentalInfo()}
        </div>
    );

    return (
        <div className="context">
            <div className="contextTitle">대여사업</div>
            <hr className="titleSeparator"/>
            {renderRentalContainer()}
        </div>
    );
};

export default Rental;