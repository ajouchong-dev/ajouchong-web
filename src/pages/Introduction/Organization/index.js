import React, { useState } from "react";
import "./styles.css";

/** 이미지 에러 시 기본 아바타로 교체 */
const Avatar = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const fallback =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <rect width='100%' height='100%' rx='12' fill='#dfe9e4'/>
        <circle cx='80' cy='70' r='34' fill='#b7d1c3'/>
        <rect x='28' y='110' width='104' height='36' rx='18' fill='#b7d1c3'/>
      </svg>
    `);
  return (
    <img
      className="avatar"
      src={imgSrc || fallback}
      alt={alt}
      onError={() => setImgSrc(fallback)}
      loading="lazy"
    />
  );
};

/** 하나의 박스 (회장단 or 각 국) */
function GroupBox({ title, roles = [], desc, members }) {
  return (
    <section className="group-box">
      <header className="group-box__title">{title}</header>

      {/* 1) 역할 + 사진 (가로 정렬) */}
      <div className="roles-row">
        {roles.map((r, i) => (
          <div className="role-item" key={i}>
            <Avatar src={r.photo} alt={`${title} ${r.role} ${r.name || ""}`} />
            <div className="role-meta">
              <span className="role-badge">{r.role}</span>
              <div className="role-name-line">
                {r.name && <span className="role-name">{r.name}</span>}
                {r.dept && <span className="role-dept">· {r.dept}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2) 소개 */}
      {desc && <div className="group-desc">{desc}</div>}

      {/* 3) 국원 (배열이 있고 길이>0일 때만 렌더) */}
      {Array.isArray(members) && members.length > 0 && (
        <div className="member-section">
          <div className="member-title">국원</div>
          <div className="member-list">
            {members.map((m, i) => (
              <span className="chip" key={i}>{m}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

const Organization = () => {
  // 회장단
  const leadershipRoles = [
    { role: "총학생회장", name: "이재건", dept: "건축학과",   photo: "/images/history/organization/members/jaegun.png" },
    { role: "부총학생회장", name: "송재원", dept: "산업공학과", photo: "/images/history/organization/members/jaewon.png" },
  ];

  // 각 국
  const divisions = [
  {
    title: "교육정책국",
    roles: [
      { role: "국장", name: "박규진", dept: "산업공학과", photo: "/images/history/organization/members/gyujin.jpeg" },
      { role: "차장", name: "오다빈", dept: "경제학과", photo: "/images/history/organization/members/dabin.png" },
    ],
    desc: "교육 제도 개선 제안, 수업·강의 질 관리 의견 수렴, 학사 관련 정책 협의 등을 담당합니다.",
    members: ["송은기", "유원희", "변선아"],
  },
  {
    title: "대외협력국",
    roles: [
      { role: "국장", name: "박준석", dept: "첨단신소재공학과", photo: "/images/history/organization/members/junstone.jpeg" },
      { role: "차장", name: "김혜성", dept: "소프트웨어학과", photo: "/images/history/organization/members/hyesung.jpeg" },
    ],
    desc: "기업·기관과의 파트너십, 후원 연계, 대외 커뮤니케이션을 총괄합니다.",
    members: ["김민주", "이해인", "정준기", "조윤솔", "염지윤", "최서아", "권영준"],
  },
  {
    title: "문화기획국",
    roles: [
      { role: "국장", name: "강던희", dept: "디지털미디어학과", photo: "/images/history/organization/members/donhee.jpeg" },
      { role: "차장", name: "윤창빈", dept: "기계공학과", photo: "/images/history/organization/members/changbin.jpeg" },
      { role: "차장", name: "이혜령", dept: "산업공학과", photo: "/images/history/organization/members/hyereong.png" },
    ],
    desc: "축제·전시·행사 등 학내 문화 프로그램을 기획하고 운영합니다.",
    members: ["조현덕", "조우진", "김혜령", "채수현","유서희", "이예원"],
  },
  {
    title: "소통발전국",
    roles: [
      { role: "국장", name: "유수뎡", dept: "소프트웨어학과", photo: "/images/history/organization/members/sujeong2.jpg" },
      { role: "차장", name: "오태림", dept: "소프트웨어학과", photo: "/images/history/organization/members/jaegun.png" },
    ],
    desc: "학생 의견 수렴 채널 운영, 공지·소통 콘텐츠 제작과 피드백 관리를 담당합니다.",
    members: ["정재훈", "조용진", "조은재", "윤채영", "조성현", "김태호"],
  },
  {
    title: "생활복지국",
    roles: [
      { role: "국장", name: "허준호", dept: "전자공학과", photo: "/images/history/organization/members/junho.jpeg" },
      { role: "차장", name: "이예은", dept: "지능형반도체공학과", photo: "/images/history/organization/members/yeeun.jpeg" },
    ],
    desc: "생활·복지 관련 제도 개선, 편의시설 모니터링 및 요구사항 반영.",
    members: ["오경진", "우지훈", "신준현", "강승완", "권시윤", "김로아","김상겸","이가영"],
  },
  {
    title: "콘텐츠제작국",
    roles: [
      { role: "국장", name: "권민지", dept: "건축학과", photo: "/images/history/organization/members/minji.png" },
      { role: "차장", name: "박수경", dept: "건축학과", photo: "/images/history/organization/members/sogyong2.jpeg.jpg" },
      { role: "차장", name: "장하연", dept: "건축학과", photo: "/images/history/organization/members/hayeon.png" },
    ],
    desc: "디자인·영상·웹 등 시각/디지털 콘텐츠 제작과 브랜드 자산 관리를 담당합니다.",
    members: ["김민선", "한상현", "정도영"],
  },
  {
    title: "행정자치국",
    roles: [
      { role: "국장", name: "이한규", dept: "전자공학과", photo: "/images/history/organization/members/han9.jpeg" },
      { role: "차장", name: "정윤수", dept: "응용화학생명공학과", photo: "/images/history/organization/members/yunsu.jpeg" },
    ],
    desc: "학생회 운영 전반에 걸친 행정 및 자치 업무를 담당합니다.",
    members: ["이승준", "한영경", "임현진", "김하은"],
  },
];

  return (
    <div className="context">
      <div className="contextTitle">조직도</div>
      <hr className="titleSeparator" />

      <div className="org-panel">
        {/* 회장단: members 전달 X → 국원 섹션 미표시 */}
        <GroupBox
          title="회장단"
          roles={leadershipRoles}
          desc="학생회의 총괄 의사결정과 운영을 책임지며 각 국과의 협업을 조정합니다."
        />

        {/* 각 국(동일 높이) */}
        <div className="division-grid">
          {divisions.map((g, i) => (
            <GroupBox
              key={i}
              title={g.title}
              roles={g.roles}
              desc={g.desc}
              members={g.members}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organization;
