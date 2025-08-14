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
function GroupBox({ title, roles = [], desc, members = [] }) {
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

      {/* 2) 국 소개 */}
      {desc && (
        <div className="group-desc">
          {desc}
        </div>
      )}

      {/* 3) 국원 칩 리스트 */}
      {members?.length > 0 && (
        <div className="member-list">
          {members.map((m, i) => (
            <span className="chip" key={i}>{m}</span>
          ))}
        </div>
      )}
    </section>
  );
}

const Organization = () => {
  // 회장단
  const leadershipRoles = [
    {
      role: "총학생회장",
      name: "이재건",
      dept: "건축학과",
      photo: "/images/members/president.jpg", // 없으면 비워두면 자동 대체
    },
    {
      role: "부총학생회장",
      name: "송재원",
      dept: "산업공학과",
      photo: "/images/members/vice.jpg",
    },
  ];

  // 각 국
  const divisions = [
    {
      title: "교육정책국",
      roles: [
        { role: "국장", name: "박규진", dept: "산업공학과", photo: "" },
        { role: "차장", name: "", dept: "", photo: "" },
      ],
      desc:
        "교육 제도 개선 제안, 수업·강의 질 관리 의견 수렴, 학사 관련 정책 협의 등을 담당합니다.",
      members: ["김OO", "이OO", "박OO", "최OO"],
    },
    {
      title: "대외협력국",
      roles: [
        { role: "국장", name: "박준석", dept: "첨단신소재공학과", photo: "" },
        { role: "차장", name: "", dept: "", photo: "" },
      ],
      desc:
        "기업·기관과의 파트너십, 후원 연계, 대외 커뮤니케이션을 총괄합니다.",
      members: ["정OO", "문OO", "강OO"],
    },
    {
      title: "문화기획국",
      roles: [
        { role: "국장", name: "강도희", dept: "디지털미디어학과", photo: "" },
        { role: "차장", name: "", dept: "", photo: "" },
      ],
      desc:
        "축제·전시·행사 등 학내 문화 프로그램을 기획하고 운영합니다.",
      members: ["노OO", "권OO", "주OO"],
    },
    {
      title: "소통발전국",
      roles: [
        { role: "국장", name: "유수정", dept: "소프트웨어학과", photo: "" },
        { role: "차장", name: "", dept: "", photo: "" },
      ],
      desc:
        "학생 의견 수렴 채널 운영, 공지·소통 콘텐츠 제작과 피드백 관리.",
      members: ["송OO", "장OO"],
    },
    {
      title: "생활복지국",
      roles: [
        { role: "국장", name: "허준호", dept: "전자공학과", photo: "" },
        { role: "차장", name: "", dept: "", photo: "" },
      ],
      desc:
        "생활·복지 관련 제도 개선, 편의시설 모니터링 및 요구사항 반영.",
      members: ["김OO", "서OO", "류OO", "임OO"],
    },
    {
      title: "콘텐츠제작국",
      roles: [
        { role: "국장", name: "권민재", dept: "건축학과", photo: "" },
        { role: "차장", name: "", dept: "", photo: "" },
      ],
      desc:
        "디자인·영상·웹 등 시각/디지털 콘텐츠 제작과 브랜드 자산 관리.",
      members: ["이OO", "박OO"],
    },
    {
      title: "기타",
      roles: [
        { role: "국장", name: "…", dept: "…", photo: "" },
        { role: "차장", name: "…", dept: "", photo: "" },
      ],
      desc: "기타 업무를 담당합니다.",
      members: [],
    },
  ];

  return (
    <div className="context">
      <div className="contextTitle">조직도</div>
      <hr className="titleSeparator" />

      <div className="org-panel">
        {/* 회장단: 하나의 박스 안에 회장/부회장(가로) + 소개 + 구성원칩 */}
        <GroupBox
          title="회장단"
          roles={leadershipRoles}
          desc="학생회의 총괄 의사결정과 운영을 책임지며 각 국과의 협업을 조정합니다."
          members={["비서단", "정책보좌", "홍보보좌"]}
        />

        {/* 각 국: 같은 형식 */}
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
