import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import "./styles.css";

const allDivisions = [
  {
    title: "회장단",
    roles: [
      {
        role: "총학생회장",
        name: "송재원",
        dept: "산업공학과(20)",
        photo: "/images/history/organization/members/jaewon.png",
      },
      {
        role: "부총학생회장",
        name: "송은기",
        dept: "경영학과(22)",
        photo: "/images/history/organization/members/송은기.jpg",
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
        photo: "/images/history/organization/members/박준석.jpg",
      },
      {
        role: "차장",
        name: "김찬호",
        dept: "첨단신소재공학과(21)",
        photo: "/images/history/organization/members/김찬호.jpg",
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
        photo: "/images/history/organization/members/박종현.jpg",
      },
      {
        role: "차장",
        name: "김정연",
        dept: "미래모빌리티공학과(23)",
        photo: "/images/history/organization/members/김정연.jpg",
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
        photo: "/images/history/organization/members/염혜영2.jpg",
      },
      {
        role: "차장",
        name: "권현우",
        dept: "전자공학과(21)",
        photo: "/images/history/organization/members/권현우.jpg",
      },
      {
        role: "차장",
        name: "정지호",
        dept: "정치외교학과(23)",
        photo: "/images/history/organization/members/정지호.jpg",
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
        photo: "/images/history/organization/members/yeeun.jpg",
      },
      {
        role: "차장",
        name: "맹준성",
        dept: "경제학과(21)",
        photo: "/images/history/organization/members/맹준성.png",
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
        photo: "/images/history/organization/members/정재훈.jpg",
      },
      {
        role: "차장",
        name: "이서현",
        dept: "산업공학과(23)",
        photo: "/images/history/organization/members/이서현.jpg",
      },
    ],
    desc: "다양한 앱·웹 기반의 소통 채널 운영 및 데이터베이스 시스템 개발",
    members: [
      "치토, 대기중",
    ],
  },
  {
    title: "미디어홍보국",
    roles: [
      {
        role: "국장",
        name: "고명범",
        dept: "건축학과(22)",
        photo: "/images/history/organization/members/고명범.jpg",
      },
      {
        role: "차장",
        name: "김시은",
        dept: "디지털미디어학과(23)",
        photo: "/images/history/organization/members/김시은.jpg",
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
        dept: "소프트웨어학과(20)",
        photo: "/images/history/organization/members/hyesung.png",
      },
      {
        role: "차장",
        name: "이상민",
        dept: "교통시스템공학과(21)",
        photo: "/images/history/organization/members/이상민.jpg",
      },
      {
        role: "차장",
        name: "이진솔",
        dept: "산업공학과(23)",
        photo: "/images/history/organization/members/이진솔.jpg",
      },
    ],
    desc: "국 연계 사업 연결 및 조정",
    members: [
      "치토, 대기중",       
    ],
  },
];

const sectionId = (index) => `org-section-${index}`;

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
      className="org-avatar"
      src={imgSrc || fallback}
      alt={alt}
      onError={() => setImgSrc(fallback)}
      loading="lazy"
    />
  );
};

/** 하나의 구역 (회장단 or 각 국): 왼쪽에 설명, 오른쪽에 사람들 */
function GroupSection({ id, title, roles = [], desc, members, isLead }) {
  return (
    <section
      id={id}
      className={`org-section ${isLead ? "org-section--lead" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="org-section__head">
        <h2 className="org-section__title" id={`${id}-title`}>{title}</h2>
        {desc && <p className="org-section__desc">{desc}</p>}
      </div>

      <ul className="org-people">
        {roles.map((r, i) => (
          <li className="org-person" key={i}>
            <div className="org-person__photo">
              <Avatar src={r.photo} alt={`${title} ${r.role} ${r.name || ""}`} />
            </div>
            <div className="org-person__role">{r.role}</div>
            <div className="org-person__name">{r.name}</div>
            <div className="org-person__dept">{r.dept}</div>
          </li>
        ))}
      </ul>

      {Array.isArray(members) && members.length > 0 && (
        <div className="org-members">
          <div className="org-members__title">국원</div>
          <ul className="org-members__list">
            {members.map((m, i) => (
              <li key={i} className="org-members__item">{m}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

const Organization = () => {
  const [activeId, setActiveId] = useState(sectionId(0));
  const navRef = useRef(null);

  // 스크롤 위치에 맞춰 바로가기 칩의 현재 위치 표시
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    allDivisions.forEach((_, index) => {
      const el = document.getElementById(sectionId(index));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 모바일: 현재 칩이 가로 스크롤 영역 안에 보이도록
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const chip = nav.querySelector(`[data-target="${activeId}"]`);
    if (!chip || typeof nav.scrollTo !== "function") return;
    nav.scrollTo({
      left: chip.offsetLeft - (nav.clientWidth - chip.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="context">
      <div className="contextTitle">조직도</div>
      <hr className="titleSeparator" />

      <nav className="org-nav" aria-label="부서 바로가기">
        <div className="org-nav__scroll" ref={navRef}>
          {allDivisions.map((division, index) => {
            const id = sectionId(index);
            const isActive = activeId === id;
            return (
              <button
                key={id}
                type="button"
                data-target={id}
                className={`ui-chip org-nav__chip ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => handleNavClick(id)}
              >
                {division.title}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="org-sections">
        {allDivisions.map((division, index) => (
          <GroupSection
            key={index}
            id={sectionId(index)}
            title={division.title}
            roles={division.roles}
            desc={division.desc}
            members={division.members}
            isLead={index === 0}
          />
        ))}
      </div>

      <div className="introduction-note org-note">
        <p>제45대 총학생회 AU:SUM 조직도 임시 반영 중입니다.</p>
        <p>세부 직책 및 국원 정보는 추후 업데이트됩니다.</p>
        <a href="/introduction/history" target="_blank" rel="noopener noreferrer">
          역대 학생회 소개 바로가기
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

export default Organization;
