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

### threejs-toys — particlesCursor (Kevin Levron)
- 출처: https://github.com/klevron/threejs-toys
- 라이선스: **ISC** (npm 패키지 메타데이터 기준)
- 사용 위치: `src/components/HeaderParticles.jsx`
- 사용 방식: 라이브러리를 가져다 쓰지 않고 canvas 2D 로 직접 재구현했으며,
  원본의 파라미터 값(색·pointSize·noise 계수 등)을 참고

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
  Blender, Figma, Git)은 사용 도구를 표시할 목적으로만 쓰였으며,
  각 상표의 권리는 해당 기업에 있다

---

## 5. 이 사이트의 저작물

위에 적지 않은 나머지(레이아웃 구현 코드, 한국어 문구, 본인 사진, 프로젝트 결과물)는
이희본(heebon LEE)의 저작물이다.

레이아웃 구성은 기존 웹 디자인을 참고했으며, 코드는 React + Tailwind CSS 로 전부
새로 구현했다.
