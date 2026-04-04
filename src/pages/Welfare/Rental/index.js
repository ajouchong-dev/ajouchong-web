import './styles.css';
import React from 'react';

const Rental = () => {
    const RENTAL_FORM_URL = "https://forms.gle/buMhGLbFYeVjcdTi8";

    const rentalStatus = [
        { item: "매트 돗자리", total: 37, current: 15 },
        { item: "은박 돗자리", total: 48, current: 10 },
        { item: "축구공", total: 2, current: 2 },
        { item: "농구공", total: 2, current: 2 },
        { item: "피구공", total: 2, current: 2 },
        { item: "듀라 테이블", total: 6, current: 4 },
        { item: "의자", total: 22, current: 22 },
        { item: "전기 리드선(20M)", total: 2, current: 2 },
        { item: "이젤", total: 6, current: 6 },
        { item: "이사박스", total: 6, current: 6 },
        { item: "우산", total: 8, current: 7 }
    ];

    const rentalImages = [
        { src: "/images/rental/rental_1.png", alt: "대여사업 안내 이미지 1" },
        { src: "/images/rental/rental_2.png", alt: "대여사업 안내 이미지 2" }
    ];

    const handleOpenRentalForm = () => {
        window.open(RENTAL_FORM_URL, "_blank", "noopener,noreferrer");
    };

    const renderRentalFormButton = () => (
        <button
            className="rental-button"
            onClick={handleOpenRentalForm}
        >
            &gt; 대여사업 구글폼 바로가기
        </button>
    );

    const renderRentalStatus = () => (
        <div className="rental-status-wrap">
            <section className="rental-notice-box" aria-label="대여 방식 안내">
                <h3 className="rental-status-title">총학생회 대여사업 현황 : 물품 현황</h3>
                <div className="rental-notice-content">
                    <p>모든 물품 대여는 상시 대여 방식으로 운영되며, 총학생회실에 직접 방문</p>
                    <p>또는 생활복지국 국장 및 차장에게 연락 부탁드립니다.</p>
                    <p>대여 1일 전 구글 폼을 작성 시에는 우선적으로 대여 예정입니다.</p>
                    <p>구글폼은 게시글 및 프로필 하단 리틀리를 참고해주시길 바랍니다.</p>
                    <p>대여기간은 최대 3일입니다.</p>
                </div>
            </section>

            <div className="rental-table-scroll">
                <table className="rental-status-table" aria-label="물품 대여 현황 표">
                    <thead>
                        <tr>
                            <th>품목</th>
                            <th>총 수량</th>
                            <th>현재 수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentalStatus.map((row) => (
                            <tr key={row.item}>
                                <td>{row.item}</td>
                                <td>{row.total}</td>
                                <td>{row.current}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
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
            {renderRentalStatus()}
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
