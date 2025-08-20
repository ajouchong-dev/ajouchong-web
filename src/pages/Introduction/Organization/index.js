import React, { useState } from "react";
import "./styles.css";

/** 이미지 에러 시 기본 아바타로 교체 */
const Avatar = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const fallback =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <rect width='100%' height='100%' rx='12' fill='#f0f0f0'/>
        <circle cx='80' cy='70' r='34' fill='#d0d0d0'/>
        <rect x='28' y='110' width='104' height='36' rx='18' fill='#d0d0d0'/>
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
  const isThreeRoles = roles.length === 3;
  const hasManyMembers = members && members.length >= 4;

  const splitMembersIntoColumns = (members) => {
    const midPoint = Math.ceil(members.length / 2);
    return {
      leftColumn: members.slice(0, midPoint),
      rightColumn: members.slice(midPoint)
    };
  };
  
  const memberColumns = hasManyMembers ? splitMembersIntoColumns(members) : null;
  
  return (
    <section className={`group-box ${isThreeRoles ? 'three-roles' : ''}`}>
      <header className="group-box__title">{title}</header>

      <div className="roles-container">
        {roles.map((r, i) => (
          <div className="role-item" key={i}>
            <div className="avatar-container">
              <Avatar src={r.photo} alt={`${title} ${r.role} ${r.name || ""}`} />
            </div>
            <div className="role-info">
              <div className="role-name">{r.name}</div>
              <div className="role-dept">{r.dept}</div>
            </div>
          </div>
        ))}
      </div>

      {desc && (
        <div className="description-section">
          <div className="description-line">
            <div className="line-bar"></div>
            <div className="description-text">{desc}</div>
          </div>
        </div>
      )}

      {Array.isArray(members) && members.length > 0 && (
        <div className="member-section">
          <div className="member-box">
            <div className="member-title">국원</div>
            {hasManyMembers ? (
              <div className="member-list two-columns">
                <div className="member-column">
                  {memberColumns.leftColumn.map((m, i) => (
                    <div key={i} className="member-item">{m}</div>
                  ))}
                </div>
                <div className="member-column">
                  {memberColumns.rightColumn.map((m, i) => (
                    <div key={i} className="member-item">{m}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="member-list">
                {members.map((m, i) => (
                  <div key={i} className="member-item">{m}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const Organization = () => {

  const allDivisions = [
    {
      title: "회장단",
      roles: [
        {
          role: "총학생회장",
          name: "이재건",
          dept: "건축학과(22)",
          photo: "/images/history/organization/members/jaegun.png",
        },
        {
          role: "부총학생회장",
          name: "송재원",
          dept: "산업공학과(20)",
          photo: "/images/history/organization/members/jaewon.png",
        },
      ],
      desc: "총학생회를 대표하여 모든 사업 및 대내외적인 업무 총괄",
    },
    {
      title: "교육정책국",
      roles: [
        {
          role: "국장",
          name: "박규진",
          dept: "산업공학과(20)",
          photo: "/images/history/organization/members/gyujin.jpeg",
        },
        {
          role: "차장",
          name: "오다빈",
          dept: "경제학과(22)",
          photo: "/images/history/organization/members/dabin.jpg",
        },
      ],
      desc: "교내 학사 관련 사업 진행 및 의결기구 진행 보조",
      members: [
        "송은기, 경영학과(22)",
        "유원희, 경영인텔리전스학과(23)",
        "변선아, 산업공학과(23)",
      ],
    },
    {
      title: "대외협력국",
      roles: [
        {
          role: "국장",
          name: "박준석",
          dept: "첨단신소재공학과(21)",
          photo: "/images/history/organization/members/junstone.jpeg",
        },
        {
          role: "차장",
          name: "김혜성",
          dept: "소프트웨어학과(20)",
          photo: "/images/history/organization/members/hyesung.png",
        },
      ],
      desc: "교외 기관, 사업체와의 제휴 및 협력 진행",
      members: [
        "김민주, 건설시스템공학과(23)",
        "이해인, 건설시스템공학과(23)",
        "정준기, 전자공학과(20)",
        "조윤솔, 디지털미디어학과(24)",
        "최서아, 영어영문학과(24)",
        "권영준, 경영학과(25)",
        "염지윤, 자유전공학부(25)",
      ],
    },
    {
      title: "문화기획국",
      roles: [
        {
          role: "국장",
          name: "강돈희",
          dept: "디지털미디어학과(22)",
          photo: "/images/history/organization/members/donhee.png",
        },
        {
          role: "차장",
          name: "윤창빈",
          dept: "기계공학과(21)",
          photo: "/images/history/organization/members/changbin.png",
        },
        {
          role: "차장",
          name: "이혜령",
          dept: "산업공학과(23)",
          photo: "/images/history/organization/members/hyereong.jpeg",
        },
      ],
      desc: "학내 문화행사 기획 및 총괄",
      members: [
        "조현덕, 건축학과(23)",
        "조우진, 경영인텔리전스학과(23)",
        "김혜령, 디지털미디어학과(23)",
        "채수현, 디지털미디어학과(23)",
        "유서희, 환경안전공학과(25)",
        "이예원, 문화콘텐츠학과(25)",
      ],
    },
    {
      title: "생활복지국",
      roles: [
        {
          role: "국장",
          name: "허준호",
          dept: "전자공학과(20)",
          photo: "/images/history/organization/members/junho.jpeg",
        },
        {
          role: "차장",
          name: "이예은",
          dept: "지능형반도체공학과(23)",
          photo: "/images/history/organization/members/yeeun.jpg",
        },
      ],
      desc: "학생 편의 및 혜택 제공을 위한 복지사업 진행",
      members: [
        "오경진, 전자공학과(20)",
        "신준현, 건축학과(24)",
        "이지훈, 경영학과(22)",
        "김상겸, 기계공학과(21)",
        "이강민, 건설시스템공학과(22)",
        "권시윤, 교통시스템공학과(24)",
        "김로아, 문화콘텐츠학과(24)",
        "강승완, 국방디지털융합학과(25)",
        "이가영, 첨단바이오융합대학(25)",
      ],
    },
    {
      title: "소통발전국",
      roles: [
        {
          role: "국장",
          name: "유수정",
          dept: "소프트웨어학과(22)",
          photo: "/images/history/organization/members/sujeong.jpg",
        },
        {
          role: "차장",
          name: "오태림",
          dept: "소프트웨어학과(22)",
          photo: "/images/history/organization/members/taelim.jpg",
        },
      ],
      desc: "총학생회 홈페이지 및 SNS를 통한 학우분들과 소통 진행",
      members: [
        "정재훈, 디지털미디어학과(21)",
        "조용진, 건축학과(22)",
        "조은재, 소프트웨어학과(23)",
        "윤채영, 정치외교학과(24)",
        "김태호, 자유전공학부(25)",
        "조성현, 자유전공학부(25)",
      ],
    },
    {
      title: "콘텐츠제작국",
      roles: [
        {
          role: "국장",
          name: "권민지",
          dept: "건축학과(22)",
          photo: "/images/history/organization/members/minji.png",
        },
        {
          role: "차장",
          name: "박수경",
          dept: "건축학과(22)",
          photo: "/images/history/organization/members/sogyong.jpg",
        },
        {
          role: "차장",
          name: "장하연",
          dept: "건축학과(22)",
          photo: "/images/history/organization/members/hayeon.jpg",
        },
      ],
      desc: "총학생회 게시물 제작 총괄",
      members: [
        "한상현, 건축학과(20)",
        "김민선, 문화콘텐츠학과(24)",
        "정도영, 불어불문학과(24)",
      ],
    },
    {
      title: "행정자치국",
      roles: [
        {
          role: "국장",
          name: "이한구",
          dept: "전자공학과(20)",
          photo: "/images/history/organization/members/han9.jpeg",
        },
        {
          role: "차장",
          name: "정윤수",
          dept: "응용화학생명공학과(21)",
          photo: "/images/history/organization/members/yunsu.jpg",
        },
      ],
      desc: "학생 자치 체계 확립 및 행정관리",
      members: [
        "이승준, 건축학과(22)",
        "김하은, 기계공학과(23)",
        "임현진, 첨단바이오융합대학(25)",
        "한영경, 자유전공학부(25)",        
      ],
    },
  ];

  return (
    <div className="context">
      <div className="contextTitle">조직도</div>
      <hr className="titleSeparator" />

      <div className="org-panel">
        <div className="org-grid">
          {allDivisions.map((division, index) => (
            <GroupBox
              key={index}
              title={division.title}
              roles={division.roles}
              desc={division.desc}
              members={division.members}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organization;
