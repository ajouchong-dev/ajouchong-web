import React from 'react';
import { useParams } from 'react-router-dom';
import './detail.css'; // detail.css는 반드시 존재해야 함

// 🔽 연도별 상세 정보 객체 (문자열 key + 정확한 경로)
const councilData = {
  "2025": {
    title: "2025년 제44대 총학생회 '아침'",
    출사표: "/assets/2025/정책집.pdf",
    조직도: "/assets/2025/조직도.png",
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
  },
};

const CouncilDetail = () => {
  const { year } = useParams(); // URL 파라미터에서 연도 추출
  const data = councilData[year];

  if (!data) {
    return <div style={{ padding: '2rem' }}>해당 연도의 정보가 없습니다.</div>;
  }

  return (
    <div className="council-detail">
      <h2>{data.title}</h2>
      <p className="notice">맨 위 오른쪽 상단에 정책집을 다운받을 수 있도록 (첨부파일)</p>
      <ul className="file-list">
        <li>
          <a href={data.출사표} target="_blank" rel="noreferrer">
            📄 출사표 다운로드
          </a>
        </li>
        <li>
          <img src={data.조직도} alt="조직도" className="image-preview" />
        </li>
        <li>
          <img src={data.단체사진} alt="단체사진" className="image-preview" />
        </li>
      </ul>
    </div>
  );
};

export default CouncilDetail;
