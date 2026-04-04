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
// eslint-disable-next-line no-unused-vars
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

  // eslint-disable-next-line no-unused-vars
  const allDivisions = [
    {
      title: "회장단",
      roles: [
        {
          role: "총학생회장",
          name: "송재원",
          dept: "산업공학과(20)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "부총학생회장",
          name: "송은기",
          dept: "경영학과(22)",
          photo: "/images/logos/치토.jpeg",
        },
      ],
      desc: "총학생회를 대표하여 모든 사업 및 대내외적인 업무 총괄",
    },
    {
      title: "교육행정국",
      roles: [
        {
          role: "국장",
          name: "박준석",
          dept: "첨단신소재공학과(20)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "김찬호",
          dept: "첨단신소재공학과(22)",
          photo: "/images/logos/치토.jpeg",
        },
      ],
      desc: "교내 학사·행정 정책 기획 및 재정 관리·구매 업무 진행",
      members: [
        "치토, 대기중",
        
      ],
    },
    {
      title: "대외협력국",
      roles: [
        {
          role: "국장",
          name: "박종현",
          dept: "산업공학과(20)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "김정연",
          dept: "미래모밀리티공학과(20)",
          photo: "/images/logos/치토.jpeg",
        },
      ],
      desc: "교외 기관, 사업체와의 제휴 및 협력 진행",
      members: [
        "치토, 대기중",
      ],
    },
    {
      title: "문화기획국",
      roles: [
        {
          role: "국장",
          name: "염혜영",
          dept: "전자공학과(23)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "권현우",
          dept: "전자공학과(21)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "정지호",
          dept: "정치외교학과(23)",
          photo: "/images/logos/치토.jpeg",
        },
      ],
      desc: "학내 문화행사 기획 및 총괄",
      members: [
        "치토, 대기중",
      ],
    },
    {
      title: "생활복지국",
      roles: [
        {
          role: "국장",
          name: "이예은",
          dept: "지능형반도체공학과(23)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "맹준성",
          dept: "경제학과(21)",
          photo: "/images/logos/치토.jpeg",
        },
      ],
      desc: "학생 편의 및 혜택 제공을 위한 복지사업 진행",
      members: [
        "치토, 대기중",
      ],
    },
    {
      title: "소통개발국",
      roles: [
        {
          role: "국장",
          name: "정재훈",
          dept: "디지털미디어학과(21)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "이서현",
          dept: "산업공학과(23)",
          photo: "/images/logos/치토.jpeg",
        },
      ],
      desc: "다양한 앱·웹 기반의 소통 채널 운영 및 데이터베이스 시스템 개발",
      members: [
        "정재훈, 디지털미디어학과(21)",
        "조용진, 건축학과(23)",
        "조은재, 소프트웨어학과(23)",
        "윤채영, 정치외교학과(24)",
        "김태호, 자유전공학부(25)",
        "조성현, 자유전공학부(25)",
      ],
    },
    {
      title: "미디어홍보국",
      roles: [
        {
          role: "국장",
          name: "고명범",
          dept: "건축학과(22)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "김시은",
          dept: "디지털미디어학과(23)",
          photo: "/images/logos/치토.jpeg",
        },
      
      ],
      desc: "총학생회 인스타그램 게시물 및 축제 & 사업 홍보물 제작 및 총괄",
      members: [
        "치토, 대기중",
      ],
    },
    {
      title: "중앙조정국",
      roles: [
        {
          role: "국장",
          name: "김혜성",
          dept: "소프트웨어공학과(20)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "이상민",
          dept: "교통시스템공학과(21)",
          photo: "/images/logos/치토.jpeg",
        },
        {
          role: "차장",
          name: "이진솔",
          dept: "산업공학과(23)",
          photo: "/images/logos/치토.jpeg",
        },
      ],
      desc: "국 연계 사업 연결 및 조정",
      members: [
        "치토, 대기중",       
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
        <div className="organizationTextBox">
            <div className="organizationText">
              <p>제45대 총학생회 AU:SUM 조직도 임시 반영 중입니다.</p>
              <p>세부 직책 및 국원 정보는 추후 업데이트됩니다.</p>
              <a href="/introduction/history" target="_blank" rel="noopener noreferrer">역대 학생회 소개 바로가기</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
