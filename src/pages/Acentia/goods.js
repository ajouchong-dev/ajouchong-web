import React from "react";
import "./goods.css";

const Goods = () => {
    return (
        <div className="context">
            <div className="contextTitle">ACENTIA 굿즈 소개</div>
            <hr className="titleSeparator"/>
            <div className="goods-grid">
                <div className="goods-row top-row">
                    <div className="goods-item">
                        <img className="goodsImg" src="/main/baseball.png" alt="baseball-goods"/>
                        <p className="goods-text">야구티</p>
                    </div>
                    <div className="goods-item">
                        <img className="goodsImg" src="/main/basketball.png" alt="basketball-goods"/>
                        <p className="goods-text">농구티</p>
                    </div>
                </div>
                <div className="goods-row bottom-row">
                    <div className="goods-item">
                        <img className="goodsImg slogan-img" src="/main/slogan.png" alt="slogan-goods"/>
                        <p className="goods-text">슬로건 타올</p>
                    </div>
                    <div className="goods-item">
                        <img className="goodsImg" src="/main/scarf.png" alt="scarf-goods"/>
                        <p className="goods-text">아센티아 반다나</p>
                    </div>
                    <div className="goods-item">
                        <img className="goodsImg" src="/main/band.png" alt="band-goods"/>
                        <p className="goods-text">손목밴드</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Goods;