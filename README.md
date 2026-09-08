# 이희본 포트폴리오

React + Vite 기반 원페이지 포트폴리오 사이트. GSAP과 Three.js로 스크롤 연출과
3D 배경 효과를 구현했다.

- 배포: [Vercel](https://vercel.com) — `main` 브랜치에 push하면 자동 배포된다.

## 기술 스택

- React 19 / Vite
- Tailwind CSS v4
- GSAP (ScrollTrigger, ScrambleTextPlugin)
- Three.js (히어로 배경의 물결치는 큐브 효과)

## 시작하기

```bash
npm install
npm run dev       # 개발 서버 실행 (http://localhost:5173)
npm run build     # 프로덕션 빌드 (dist/)
npm run preview   # 빌드 결과 미리보기
npm run lint      # oxlint 검사
```

## 구조

- `src/sections/` — 데스크톱 섹션 컴포넌트
- `src/sections/mobile/` — 모바일 전용 섹션 컴포넌트 (데스크톱과 별도 트리로 항상 함께 마운트되고, `xl` 브레이크포인트로 표시만 전환된다)
- `src/content/portfolio.js` — 텍스트·이미지 등 콘텐츠 데이터
- `src/lib/design.js` — 피그마 좌표를 반응형 CSS 값으로 바꾸는 헬퍼(`box`, `du`)
- `src/components/WavyCubes.jsx` — 히어로 배경 3D 효과

## 할 일 (2026-09-10)

- [ ] 네비게이션 상단 높이 조금 높이기
- [ ] 히어로 헤더 높이 살짝 줄이기
- [ ] 프로젝트 스크롤 이미지를 썸네일로 변경
- [ ] 모바일 버전 전체 검토
- [ ] iKEA 썸네일 피그마에서 새로 제작
- [ ] 프로젝트 부연설명 가독성 있게 디자인 다시 구상 + 줄바꿈 확인
- [ ] 마우스 포인터: 링크 있는 곳/없는 곳 구분되게 변경
- [ ] 이메일 보내기 버튼 문구 수정
- [ ] 메인 헤더(히어로) 하단에 저작권 표기 추가
