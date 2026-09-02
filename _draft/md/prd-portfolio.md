# 제품 요구사항 정의서(PRD) — 피그마 to code

## 0. 디자인 원본

* 피그마 URL: https://www.figma.com/design/TY7Dc9eSZNeWVZqdj50YYR/%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4?node-id=20-186
* 대상 노드: `20:186` (섹션 "Architecture Pro") / 데스크톱 `20:970` (1920) · 모바일 `32:1275` (390)
* 구현 목표: 제공된 디자인과 100% 동일하게 구현

## 1. 서비스 개요 (디자인 기반 자동 추출 · 추정 포함)

* 서비스명: **이희본 포트폴리오** — 디자인에서 확인(ABOUT ME 테이블 NAME = "이희본", 파일명 "포트폴리오")
* 목적(추정): 디자이너/영상 편집자 개인의 소개·경력·프로젝트·스킬을 한 페이지로 보여주는 온라인 포트폴리오
* 대상(추정): 채용 담당자, 협업·외주 문의자
* 핵심 시나리오(추정): 히어로 진입 → ABOUT ME로 인물 파악 → 경력 확인 → 갤러리·프로젝트로 결과물 확인 → 스킬 확인 → 푸터 연락처 확보

## 2. 구현 방식 및 기술 환경

* 구현 방식: **SPA** (페이지 1개 · 원페이지 스크롤)
* 프론트엔드: Vite + React 19 (JavaScript 전용, TypeScript 금지) + React Compiler
  * React Compiler 설치 (공식 문서 확인: 2026-09-01 / react.dev/learn/react-compiler/installation)
    * `npm install -D babel-plugin-react-compiler@latest`
    * Vite 6.0.0 이상 + `@vitejs/plugin-react` 사용 시 `npm install -D @rolldown/plugin-babel` 후 `vite.config.js`에 `babel({ presets: [reactCompilerPreset()] })` 등록
    * 안정판/RC 여부는 공식 문서에 명시되어 있지 않음 → **확인 안 됨**. 설치 시점에 공식 문서에서 재확인한다.
* 스타일링: Tailwind CSS v4 — `npm install tailwindcss @tailwindcss/vite`, `vite.config.js` 플러그인 등록, `src/index.css`에 `@import "tailwindcss";` (공식 문서 확인: 2026-08-26 / tailwindcss.com/docs/installation/using-vite)
* 빌드 도구: Vite 최신 안정 버전 (Node.js는 설치 시점 Vite 요구 버전 기준 — 확인일 기준 20.19+ 또는 22.12+)
* 라우팅: **없음** — 화면이 1개이므로 react-router-dom을 설치하지 않는다. 내비게이션은 앵커 이동으로 처리
* 라이브러리: **없음** — 정적 화면 구성으로 확정되어 애니메이션·캐로셀 근거가 사라졌으므로 GSAP·Swiper 모두 설치하지 않는다
* 데이터 저장: **없음 (정적 UI만)** — 모든 문구·이미지를 컴포넌트에 그대로 작성
* 배포 환경: **Vercel** — 저장소 연결 후 자동 배포(`npm run build` → `dist`)

## 3. 디자인 구현 사양

### 3-1. 디자인 토큰 — `src/index.css`의 `@theme` 블록에 정의 (임의 값 사용 금지)

디자인 변수에서 확인한 값:

* 색상
  * `#16171E` (Woodsmoke) — 기본 텍스트 / 다크 섹션 배경
  * `#4B4B4B` (Tundora) — 보조 텍스트
  * `#000000` / 투명도 변형 `#00000014`(8%), `#00000040`(25%)
  * `#FFFFFF` / 투명도 변형 `#FFFFFFB2`(70%)
  * `#F8F8F8` (Alabaster) — 페이지 배경
  * `#F2F2F2` (Concrete) — 카드·구분 배경
  * `#FFDA01` (School bus Yellow) / `#FFDA01E5`(90%) — 푸터 블록
  * `#24292E` (Base/Black), `#F9FAFB` (gray/50)
* 타이포: font-size 12 / 14 / 16 / 19 / 22 / 31, font-weight 400 / 500 / 700, line-height 15.6 / 16.8 / 18 / 20.4 / 22.5 / 22.99 / 24 / 27 / 30 / 32.4 / 33.92 / 36.96 / 63.8 / 76.8, letter-spacing -1.536 / 1.3 / 1.32 / 1.54
* 라운드: 8px, 3840px(pill·원형)
* 스트로크: 1px / 0.99px / 0.0547px

> 히어로의 레드·핑크 강조색 등 **변수로 등록되지 않은 색·크기**는 구현 단계에서 해당 노드에서 직접 추출해 토큰으로 추가한다. 값을 추측해서 채우지 않는다.

### 3-2. 공통 컴포넌트 (반복 인스턴스 → 코드 컴포넌트)

* `SectionHeading` — "— ABOUT ME" 형태의 대시 + 대문자 제목 (전 섹션 반복)
* `InfoRow` — 라벨/값 2열 + 하단 구분선 (ABOUT ME 테이블)
* `ExperienceRow` — 순번 · 내용 · 연도(우측 정렬) 행
* `ProjectCard` — 썸네일 + 제목 + 설명 + 버튼 2개
* `TagPill` — 키워드 태그 (외곽선형 / 채움형 2가지 상태)
* `SkillCard` — 툴 아이콘 + 툴명 + 설명 + 숙련도 표시
* `ImageCard` — 갤러리·MY DESIGN 공용 이미지 카드
* `MobileHeader` — 로고 + 햄버거 버튼 (390 전용)
* `MobileMenu` — 전체화면 오버레이 메뉴
* `Footer` — 옐로우 컨택트 블록

### 3-3. 에셋

* Figma에서 이미지 2x PNG/JPG export → **WebP 변환** 후 `src/assets/images/`
* 아이콘·로고는 SVG export → `src/assets/icons/`
* 파일명은 소문자 케밥케이스 (예: `hero-portrait.webp`, `icon-arrow.svg`)
* 디자인에 없는 이미지·아이콘은 만들지 않는다

### 3-4. 파일·폴더 구조 (구현 1단계에서 제안 후 진행)

```
src/
├── assets/
│   ├── images/
│   └── icons/
├── components/        # 공통 컴포넌트 (PascalCase.jsx)
├── sections/          # 페이지 섹션 컴포넌트
├── index.css          # Tailwind import + @theme 토큰
├── App.jsx
└── main.jsx
```

* React 컴포넌트 파일·함수명 = PascalCase, 그 외 JS 모듈·변수 = camelCase, 이미지·정적 파일 = kebab-case

## 4. 핵심 화면 및 기능 명세

화면은 **1개(원페이지)** 이며, 아래 섹션이 위에서 아래로 배치된다. 모든 문구·이미지는 디자인에 있는 것만 사용한다.

| # | 섹션 | 디자인에서 확인된 요소 |
|---|---|---|
| 1 | 히어로 | 좌상단 "CREATIVE" 라벨, 우상단 라벨, 카피 "좋아하는 일은 200% 애정을, / 맡은 임무는 300% 책임감을"(숫자에 박스·레드 강조), 인물 누끼 이미지, 하단 흑백 해안 배경 + `creative` 스크립트 타이틀 |
| 2 | ABOUT ME | 대시 제목 "— ABOUT ME", 소개 4행("비전공자의 무기는 '편견 없는 흡수력'" 외), 프로필 사진, 화살표 장식, 정보 테이블 5행(NAME / BIRTH / CONTACT / CERTIFICATE / EDUCATION). 디자인상 값이 5행 모두 "이희본"으로 동일하게 표기되어 있으므로 **디자인 그대로 구현**하고, 실제 값 교체는 별도 확인 사항으로 남긴다 |
| 3 | MY WORK EXPERIENCE | 대시 제목, 경력 리스트 4행(순번 · 내용 · 연도 우측 정렬), 행 구분선 |
| 4 | 이미지 갤러리 | 가로로 이어지는 사진 스트립. **정적 배치** — 화면 밖으로 넘치는 부분은 디자인과 동일하게 잘림(overflow hidden) |
| 5 | MY PROJECTS | 대시 제목, 프로젝트 카드 4종(AI VIDEO CREATOR EDITOR & DIRECTOR / 네이버 웹사이트 리디자인 / YouTube Music 리디자인 등), 각 카드에 썸네일·설명·버튼 2개 |
| 6 | 키워드 마퀴 | 태그 3줄(BRANDING · GRAPHIC DESIGN · DESIGNER · VIDEO PRODUCTION · MOTION · UI DESIGN · RETOUCH · DIRECTOR · PRINT DESIGN · VIDEO EDITOR · ADVERTISING), 채움형 강조 태그 포함. **왼쪽으로 계속 흐르는 마퀴**(시안 flickity 동작), 좌우 넘침은 잘림 |
| 7 | MY DESIGN | 대시 제목, 좌측 목차형 텍스트, 우측 이미지 4컷 그리드 |
| 8 | 인물 3컷 | 상단 좌우 라벨 텍스트, 인물 사진 3컷 |
| 9 | MY SKILLS | 다크(#16171E 계열) 배경, 대시 제목 + 부제, 스킬 카드 6장 그리드(툴 아이콘 · 툴명 · 설명 · 숙련도 표시). 숙련도는 **디자인에 표시된 상태 그대로 정적 표시** |
| 10 | 푸터 | 형광 옐로우(#FFDA01) 블록, 연락처 텍스트, 세로 텍스트, 가로 라인 |
| 11 | 모바일 헤더 (390 전용) | 로고 + 햄버거 버튼 |

### 동작 (정적 구성 — 유일한 JS 동작)

* **모바일 햄버거 버튼** → 전체화면 오버레이 메뉴 열기/닫기 (React `useState` 로컬 상태). 메뉴 항목은 각 섹션으로 앵커 이동하고, 이동 후 자동으로 닫힌다
* **키워드 마퀴** — 태그 묶음을 두 벌 이어 붙이고 한 주기만큼 밀어 끊김 없이 왼쪽으로 순환시키는 CSS 애니메이션(데스크톱 80 디자인 px/초, 모바일 26·31·28초). 데스크톱은 시안의 절대 좌표를, 모바일은 한 줄 이어붙이기(-50%)를 쓴다.
* **스크롤 등장** — `data-reveal` 이 붙은 블록이 화면에 들어오면 살짝 올라오며 나타난다(IntersectionObserver 하나로 일괄 관찰). 숨김은 `.js-reveal` 이 붙었을 때만 걸려, 스크립트가 실패해도 내용이 사라지지 않는다.
* **커스텀 커서** — 7px 검정 점 + 35px 링(잔상)이 따라오고, `data-cursor="explore" | "drag"` 영역에서 86px 흰 원 + 라벨로 확장된다(시안 20:1763 / 20:1791). 마우스 기기에서만 켠다.
* **숙련도 게이지** — MY SKILLS 도넛이 화면에 들어오면 0 에서 목표치까지 채워진다. 진행 호는 시안 실측값(중심선 반지름 27.52, 두께 8.96, 둥근 캡, #D83840)으로 그린다.
* 애니메이션은 전부 CSS 로만 구현하며 외부 라이브러리를 쓰지 않는다. `prefers-reduced-motion` 이면 모두 멈추거나 최종 상태로 바로 표시한다.
* 그 외 요소는 정적이다.
* MY PROJECTS 카드 버튼: 디자인에 이동 대상이 없으므로 링크를 임의로 만들지 않고 시각적으로만 구현한다

### 상태 처리

* 로딩: 모든 이미지 `loading="lazy"` + `width`/`height` 지정 및 자리표시 배경색으로 레이아웃 이동(CLS) 방지
* 빈 데이터: 반복 목록(경력·프로젝트·스킬·태그)이 비면 해당 섹션을 렌더링하지 않는다(빈 껍데기 노출 금지)
* 오류: 이미지 로드 실패 시 `onError`로 자리표시 배경을 유지하고 `alt` 텍스트를 노출한다. 페이지 전체 오류 화면은 두지 않는다

## 5. 비기능 요구사항

* 반응형: 모바일 시안(390 이하)과 데스크톱 시안(1024 이상)은 디자인과 100% 일치. 그 사이 구간은 컨테이너 폭·타이포·간격이 화면 폭에 따라 유동적으로 늘어나도록 처리(Tailwind `lg` 기준 전환). 태블릿 전용 시안은 디자인에 없으므로 별도 레이아웃을 만들지 않는다
* 접근성: 시맨틱 태그(`header`/`main`/`section`/`footer`) · 모든 이미지 `alt` · 제목 계층(h1~h3) 유지 · 키보드 포커스 표시(focus-visible) · 햄버거 버튼 `aria-expanded`·`aria-label` · 디자인 색 대비 확인
* 성능: 이미지 WebP + lazy load · 미사용 패키지 없음 · Lighthouse 성능 90점 이상 목표(디자인 기반 추정 기준)
* 보안: 입력·인증·외부 통신이 없는 정적 사이트 · 외부 링크에 `rel="noopener noreferrer"` · HTTPS(Vercel 기본 제공)

## 6. 인공지능 작업 지시 순서

1. **파일 구조 제안** — 3-4의 구조를 각 파일 역할과 함께 제안하고 승인 후 진행
2. **프로젝트 생성** — `npm create vite@latest` (React + JavaScript 템플릿)
3. **Tailwind CSS v4 설치** — `npm install tailwindcss @tailwindcss/vite`, `vite.config.js` 플러그인 등록, `src/index.css`에 `@import "tailwindcss";`
4. **React Compiler 적용** — 공식 문서 재확인 후 `babel-plugin-react-compiler` + `@rolldown/plugin-babel` 설치 및 `vite.config.js` 등록
5. **디자인 토큰 정의** — `src/index.css`의 `@theme`에 3-1의 색·타이포·간격·라운드 등록
6. **에셋 준비** — Figma에서 이미지·아이콘 export → WebP 변환 → `src/assets/`에 케밥케이스로 정리
7. **공통 컴포넌트 구현** — SectionHeading, InfoRow, ExperienceRow, ProjectCard, TagPill, SkillCard, ImageCard (props로 변형 가능하게)
8. **섹션 조립 (데스크톱 1920 기준)** — 히어로 → ABOUT ME → WORK EXPERIENCE → 갤러리 → PROJECTS → 키워드 마퀴 → MY DESIGN → 인물 3컷 → MY SKILLS → 푸터
9. **모바일 헤더 + 오버레이 메뉴 구현** — 유일한 JS 동작(useState 토글, 앵커 이동)
10. **반응형 적용** — 390 시안 기준 모바일 레이아웃, `lg` 이상 데스크톱 레이아웃, 중간 구간 유동 처리
11. **상태 처리 적용** — lazy load / 자리표시 배경 / 빈 목록 섹션 미렌더 / 이미지 오류 대체
12. **접근성 적용** — 시맨틱·alt·포커스·aria 속성
13. **시각 검수** — 데스크톱·모바일 각각 디자인과 1:1 대조 후 차이 수정
14. **빌드·배포** — `npm run build` 확인 후 Vercel 배포

## 7. 절대 규칙 및 제한 사항

### 금지 사항

* 피그마에서 확인할 수 없는 텍스트·이미지 임의 생성 금지 (더미 문구·로렘 입숨·임의 링크 포함)
* 사용하지 않는 패키지 추가 금지
* **GSAP·Swiper를 포함한 모든 외부 UI·애니메이션 라이브러리 도입 금지** — 마퀴 흐름은 CSS 애니메이션만으로 구현한다
* TypeScript(.ts · .tsx · tsconfig) 생성 금지
* `tailwind.config.js` 생성 금지 (v4 CSS-first)
* react-router-dom 설치 금지 (화면 1개)
* 토큰 대신 임의의 색·크기 하드코딩 금지
* 임의의 비표준 폴더·명명 구조 금지

### 필수 규칙

* 제공된 피그마 디자인과 100% 일치하게 구현(레이아웃·간격·색·타이포·컴포넌트 상태 포함)
* 웹표준·일반 개발 관행에 따른 파일·폴더·명명 구조로 세팅
* 구현 전 파일 구조를 먼저 제안하고 각 파일의 역할을 설명한 뒤 진행
* 필요한 의존성만 설치
* 라이브러리·플러그인 버전은 설치 시점에 공식 문서로 재확인하고 확인일·URL을 남긴다
* 디자인에서 확인되지 않은 값은 추측하지 말고 사용자에게 확인한다

## 8. 완료 기준 (시각 일치 중심)

* [ ] 데스크톱 1920 폭에서 11개 섹션 전부가 디자인 시안과 시각적으로 일치한다 (순서·간격·색·타이포·이미지)
* [ ] 모바일 390 폭에서 모바일 시안과 시각적으로 일치하고, 헤더 로고·햄버거 버튼이 디자인 위치에 있다
* [ ] 390~1920 사이 임의의 폭에서 가로 스크롤이 발생하지 않고 레이아웃이 깨지지 않는다
* [ ] 햄버거 버튼을 누르면 전체화면 메뉴가 열리고, 항목을 누르면 해당 섹션으로 이동한 뒤 메뉴가 닫힌다
* [ ] 키워드 마퀴가 데스크톱·모바일 모두 왼쪽으로 끊김 없이 흐른다
* [ ] 스크롤 시 각 블록이 나타나고, MY SKILLS 도넛이 목표치까지 채워진다
* [ ] 마우스 기기에서 커스텀 커서가 따라오고 갤러리·MY DESIGN 에서 Drag, 프로젝트 썸네일에서 Explore 로 확장된다
* [ ] 모든 이미지에 `alt`가 있고, 키보드 Tab 이동 시 포커스가 눈에 보인다
* [ ] 이미지가 로드되지 않아도 레이아웃이 밀리지 않는다
* [ ] 설치된 패키지가 vite · react · tailwindcss · @tailwindcss/vite · React Compiler 관련 항목뿐이다 (GSAP · Swiper · router 없음)
* [ ] `npm run build`가 오류 없이 완료되고 Vercel 배포 URL에서 동일하게 보인다
