# 아주총 홈페이지 디자인 규칙

총학생회 AU:SUM 홈페이지의 화면을 만들거나 고칠 때 따르는 규칙입니다.
토큰은 `variables.css`, 공용 컴포넌트는 `common.css`에 있습니다.

## 1. 원칙

1. **바탕은 흰색, 색은 "면"으로.** 본문 영역은 흰색(`--paper`)과 잉크색 글자. 구획은 1px 선(`--line`)과 여백으로 나눈다. 대신 기조색을 넓은 면으로 분명하게 쓴다.
2. **기조색을 쓰는 자리.**
   - 진한 틸 `--brand-teal-ink` : 주 버튼(`.ui-btn.is-primary`), 활성 칩·페이지 번호, 링크, 현재 메뉴. 흰 배경 위 글자는 `--brand-teal`이 아니라 `--brand-teal-ink`(대비 확보).
   - 옅은 워시 `--brand-wash` : 모든 페이지 상단에 깔렸다가 흰색으로 풀리는 배경(App.css `.content`), 띠 섹션(홈 바로가기), 표 머리, 호버된 행.
   - 기조 그라데이션 `--brand-gradient` : 헤더 맨 위 3px 줄, 제목 아래 마디, **상태를 말하는 곳**(진행률·재고 바 `.ui-meter`). 넓은 면(헤더 전체, 띠, 카드)에는 그라데이션을 깔지 않는다.
   - 홈에서 색 면은 "지금 총학" 띠 하나(단색 `--brand-teal-ink`). 헤더는 흰색을 유지한다 — 매 페이지 보이는 요소라 조용해야 한다.
   - 사진이 있는 곳은 사진이 주인공이다(홈 히어로는 화면 폭을 꽉 채운다). 글자를 올릴 때는 **중립색** 어두운 그라데이션을 글자 주변에만 옅게 깔고, 사진을 기조색으로 물들이지 않는다. 글자는 사진의 피사체를 가리지 않는 크기로.
3. **금지:** 카드마다 그라데이션 테두리/배경, 글로우 그림자, 유리(blur) 카드, 장식용 도형, `!important`, 무한 반복 애니메이션, 이모지 아이콘(아이콘은 `lucide-react`). 색은 넓은 면 몇 군데에 몰아 쓰고, 작은 요소마다 흩뿌리지 않는다.
4. **왼쪽 정렬이 기본.** 본문·제목·표 모두 왼쪽 정렬. 가운데 정렬은 빈 상태 문구 정도에만.
5. **모션은 짧게.** 호버 150ms, 열림/닫힘 200~300ms, `var(--ease)`. 호버로 움직이는 거리는 2px 이내. 높이 애니메이션은 `grid-template-rows: 0fr → 1fr`.
6. **모바일 우선 확인.** 360px 폭에서 가로 스크롤이 없어야 한다. 터치 대상 최소 44px. 입력창 글자 16px 이상(iOS 확대 방지). 넓은 표는 `.table-container`(가로 스크롤)로 감싸거나 모바일에서 카드형으로 바꾼다.

## 2. 페이지 뼈대

```jsx
<div className="context">            {/* 최대 1120px, 좌우 여백 포함. 넓게: "context is-wide" (1280px) */}
    <div className="contextTitle">페이지 제목</div>
    <hr className="titleSeparator" />
    <p className="page-lead">한두 문장 설명 (선택)</p>
    …본문…
</div>
```

헤더는 `position: sticky`라서 본문에 상단 여백 보정이 필요 없다. 브레드크럼은 App에서 자동으로 붙는다.

## 3. 공용 클래스 (common.css)

| 용도 | 클래스 |
| --- | --- |
| 버튼 | `.ui-btn` + `.is-primary`(진한 틸, 주 버튼) `.is-brand`(같은 색, 호환용) `.is-ghost` `.is-danger` `.is-small` |
| 입력 | `.ui-field`(label+입력 묶음) `.ui-input` `.ui-select` `.ui-textarea` |
| 카드 | `.ui-card` + `.is-interactive`(호버 시 테두리 틸 + 2px 상승) |
| 뱃지 | `.ui-badge` + `.is-brand` `.is-ok` `.is-warn` `.is-danger` |
| 필터 칩 | `.ui-chip` + `.is-active` |
| 진행률 | `<div class="ui-meter" style={{'--value':'63%'}}><span/></div>` |
| 표 | `.table-container > table.table`, 행 클릭은 `tr.clickable-row` |
| 상세글 | `.post-metadata` `.post-content` `.back-button` `.like-section` |
| 긴 글 | `.ui-prose` (최대 720px, 17px/1.8) |
| 상태 | `.ui-empty`(비어 있음) `.loading-text` `.ui-skeleton` |
| 페이지네이션 | `.pagination > button.pagination-button(.active)` |

페이지 전용 CSS는 그 페이지의 `styles.css`에만 쓰고, 공용 클래스 이름을 페이지 CSS에서 다시 정의하지 않는다.

## 4. 타이포

- 본문 `var(--font-sans)` = Pretendard. 영문 디스플레이(워드마크, ACENTIA 같은 고유명)만 `var(--font-display)` = Lexend.
- 페이지 제목 `--font-title`(800), 섹션 제목 20~24px(700), 본문 16~17px, 보조 13~14px(`--ink-3`).
- 숫자는 `font-variant-numeric: tabular-nums`.
- 한글 제목은 `letter-spacing: -0.02em` 안팎.

## 5. 모양

- 모서리: 입력·버튼 `--radius-normal`(10px), 카드 `--radius-large`(16px), 알약 `--radius-pill`.
- 그림자: 떠 있는 것(드롭다운·모달·호버된 카드)에만 `--shadow-medium` / `--shadow-pop`.
- 이미지: `object-fit: cover`, 카드 안에서는 모서리 12px, 비율은 `aspect-ratio`로 고정해 레이아웃 흔들림을 막는다.
- 간격: 4/8/16/24/32/48 토큰. 섹션 사이는 `clamp(40px, 6vw, 72px)`.

## 6. 문구

- 버튼은 눌렀을 때 일어나는 일을 그대로 쓴다: "검색", "글 작성", "목록으로".
- 빈 상태는 다음 행동을 알려준다: "아직 등록된 공지가 없습니다."
- 오류는 무엇이 잘못됐는지 말한다. 사과·감탄사 없이.
