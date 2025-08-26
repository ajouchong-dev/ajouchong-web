import React from 'react';
import './styles.css';

const Promotion = () => {
    const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLEA9FvUAUgccoG0GbJUCbK7qJI8ddlce84OektKTxvcXqNInUUxxFEx5QrOX6nG5V7ptjd455vamN/pubhtml?widget=true&amp;headers=false";

    const renderPromotionSpreadsheet = () => (
        <iframe 
            className="promotion-box"
            src={SPREADSHEET_URL}
            title="제휴 현황 스프레드시트"
        />
    );

    const renderPromotionContainer = () => (
        <div className="promotion-container">          
            {renderPromotionSpreadsheet()}
        </div>
    );

    return (
        <div className="context">
            <div className="contextTitle">제휴백과</div>
            <hr className="titleSeparator"/>
            {renderPromotionContainer()}
        </div>
    );
};

export default Promotion;
