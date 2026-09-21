import React from "react";
import "./styles.css";

// layout은 표시 전용: large = 윗줄 큰 칸, wide = 가로로 긴 상품(모바일에서 한 줄 차지)
const GOODS = [
    { src: "/images/goods/baseball.webp", alt: "baseball-goods", name: "야구티", layout: "is-large" },
    { src: "/images/goods/basketball.webp", alt: "basketball-goods", name: "농구티", layout: "is-large" },
    { src: "/images/goods/slogan.webp", alt: "slogan-goods", name: "슬로건 타올", layout: "is-wide" },
    { src: "/images/goods/scarf.webp", alt: "scarf-goods", name: "아센티아 반다나", layout: "" },
    { src: "/images/goods/band.webp", alt: "band-goods", name: "손목밴드", layout: "" },
];

const Goods = () => {
    return (
        <div className="context">
            <div className="contextTitle">ACENTIA 굿즈 소개</div>
            <hr className="titleSeparator" />
            <ul className="acentia-goods-grid">
                {GOODS.map((item) => (
                    <li className={`acentia-goods-item ${item.layout}`} key={item.src}>
                        <figure className="acentia-goods-figure">
                            <div className="acentia-goods-media">
                                <img className="acentia-goods-img" src={item.src} alt={item.alt} loading="lazy" />
                            </div>
                            <figcaption className="acentia-goods-text">{item.name}</figcaption>
                        </figure>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Goods;
