import React from 'react';
import { useParams } from 'react-router-dom';
import './detail.css'; // 반드시 존재해야 하는 CSS

// 🔽 연도별 총학생회 정보
const councilData = {
  "2025": {
    title: "2025년 제44대 총학생회 '아침'",
    출사표: "/assets/2025/정책집.pdf",
    조직도: "/assets/2025/출사표.png",
    단체사진: "/assets/2025/단체사진.jpg"
  },
  "2024": {
    title: "2024년 제43대 총학생회 '아우름'",
    출사표: "/assets/2024/출사표.pdf",
    조직도: "/assets/2024/조직도.png",
    단체사진: "/assets/2024/단체사진.jpg"
  },
  "2023": {
    title: "2023년 제42대 총학생회 '위아'",
    출사표: "/assets/2023/출사표.pdf",
    조직도: "/assets/2023/조직도.png",
    단체사진: "/assets/2023/단체사진.jpg"
  }
};

const CouncilDetail = () => {
  const { year } = useParams(); // URL 파라미터에서 연도 추출
  const data = councilData[year];

  if (!data) {
    return <div style={{ padding: '2rem' }}>해당 연도의 정보가 없습니다.</div>;
  }

  return (
    <div className="council-detail-wrapper">
      <div className="council-card">
        <h2>{data.title}</h2>

        <a href={data.출사표} target="_blank" rel="noreferrer" className="download-link">
          📄 출사표 다운로드
        </a>

        <div className="image-gallery">
          <div className="image-box">
            <img src={data.조직도} alt="조직도" />
            <p>조직도</p>
          </div>
          <div className="image-box">
            <img src={data.단체사진} alt="단체사진" />
            <p>단체사진</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilDetail;
