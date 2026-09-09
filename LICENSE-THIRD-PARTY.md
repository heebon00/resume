# 제3자 저작물 고지 (Third-Party Notices)

이 사이트는 아래 외부 저작물을 사용한다. 모두 상업적 사용이 허용된 라이선스이며,
각 라이선스가 요구하는 저작권 고지를 남기기 위해 이 문서를 둔다.

---

## 1. 코드

### Codrops — On Scroll Filter
- 출처: https://tympanus.net/Development/OnScrollFilter/
- 라이선스: **MIT** (https://tympanus.net/codrops/licensing/)
- 사용 위치: `src/index.css` (MY PROJECTS 스크롤 연출), `src/sections/ProjectsReveal.jsx`
- 사용 방식: 데모 소스를 참고해 GSAP 기반으로 재구성

### Codrops — Sliced Dual Image Layout
- 출처: https://tympanus.net/Development/SlicedDualImageLayout/
- 라이선스: **MIT** (https://tympanus.net/codrops/licensing/)
- 사용 위치: `src/components/SlicedText.jsx`
- 사용 방식: 글자 슬라이스 글리치 연출을 참고해 재구현

### CodePen — 80 Awesome Buttons UI/UX Collection 중 "Cyberpunk Glitch"
- 라이선스: **MIT** — CodePen 의 공개 Pen 은 자동으로 MIT 가 적용된다
  (https://blog.codepen.io/documentation/licensing/)
- 사용 위치: `src/index.css` 의 `.btn-cyber`
- 사용 방식: 원본 CSS 를 옮긴 뒤 색상 2곳과 테두리만 이 사이트 값으로 바꿈

### 3d-wave-grid — Wavy Cubes (franky-adl)
- 출처: https://github.com/franky-adl/3d-wave-grid
  (라이브 데모: https://projects.arkon.digital/threejs/wavy-cubes/)
- 라이선스: **MIT** — Copyright (c) 2026 franky-adl
- 사용 위치: `src/components/WavyCubes.jsx`
  — 메인 헤더(히어로) 배경 그래픽. 데스크톱·모바일이 같은 컴포넌트를 쓴다.
- 사용 방식: Three.js + GLSL 원본 소스를 확인해 한 컴포넌트로 옮겼다.
  원본이 Stage·Camera·Renderer·MouseTrail 여러 클래스로 나뉜 것을 필요한
  만큼만 합쳤고, 디버그 GUI · Stats 패널 · 후처리 비네트는 뺐다.
  파동·조명·그림자 값은 원본 그대로이며, 색만 이 사이트 값(크림슨 #D4183D)으로 바꿨다.

---

## 2. 폰트

전부 **SIL Open Font License 1.1 (OFL)** 이며 상업적 사용·수정·재배포가 허용된다.
(폰트 자체를 판매하거나 라이선스를 바꾸는 것만 금지된다)

| 폰트 | 파일 위치 |
|---|---|
| Pretendard | `public/fonts/pretendard/` |
| Paperlogy (페이퍼로지) | `public/fonts/paperlogy/` |
| Big Shoulders Display | `public/fonts/google/` |
| Big Shoulders Stencil Display | `public/fonts/google/` |
| Geist | `public/fonts/google/` |
| Inter | `public/fonts/google/` |
| Pinyon Script | `public/fonts/google/` |
| VT323 | `public/fonts/google/` |

---

## 3. npm 의존성

`package.json` 에 명시된 패키지를 따른다 — React(MIT), GSAP(표준 "No Charge" 라이선스),
Tailwind CSS(MIT), Vite(MIT), oxlint(MIT) 등. 각 패키지의 라이선스 전문은
`node_modules/<패키지>/LICENSE` 에 있다.

---

## 4. 상표 · 제3자 브랜드 자산

MY PROJECTS 의 **iKEA Website Redesign** 과 **YouTube Music Redesign** 은
**비공식 학습용 컨셉 리디자인**이다.

- 해당 기업이 의뢰하거나 승인한 작업이 아니다
- IKEA · YouTube Music 의 상표, 제품 사진, 앨범 아트를 포함한 모든 브랜드 자산의
  권리는 각 권리자에게 있다
- MY SKILLS 의 도구 아이콘(Adobe After Effects · Photoshop · Premiere Pro,
  Figma, GitHub)은 사용 도구를 표시할 목적으로만 쓰였으며,
  각 상표의 권리는 해당 기업에 있다
- GitHub 마크는 GitHub 의 공식 아이콘 저장소(primer/octicons 의
  `icons/mark-github-16.svg`)에서 받았다. 모양(path)은 원본 그대로이고, 다른
  도구 로고 타일과 톤을 맞추려고 검정 바탕에 흰색으로 얹었다 — GitHub 가이드가
  허용하는 흑/백 단색 사용 범위 안이다.
  파일 위치는 `src/assets/images/skill-github.svg` 다.
  GitHub · Octocat 은 GitHub, Inc. 의 상표이며, 여기서는 사용 도구를 나타내는
  용도로만 쓴다

---

## 5. 이 사이트의 저작물

위에 적지 않은 나머지(레이아웃 구현 코드, 한국어 문구, 본인 사진, 프로젝트 결과물)는
이희본(heebon LEE)의 저작물이다.

레이아웃 구성은 기존 웹 디자인을 참고했으며, 코드는 React + Tailwind CSS 로 전부
새로 구현했다.
