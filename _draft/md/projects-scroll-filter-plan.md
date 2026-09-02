# MY PROJECTS 스크롤 필터 연출 — 사전 분석 & 결정 항목

작성일 2026-09-02 · 대상: `src/sections/Projects.jsx` 앞 구간
요청 원문: `33.md`

---

## 1. 결론 (요약)

**가능하다.** 다만 "새 화면 하나가 다 스크롤된 뒤 지금의 MY projects 가 나온다"는 요구는
**페이지에 스크롤 길이를 추가**해야 하므로, 지금의 "고정 높이 캔버스 1장(h-7711)" 구조를
**2장으로 쪼개는 구조 변경**이 필요하다. 좌표를 다시 계산하지 않고도 쪼갤 수 있는 방법이 있다(§4-A).

---

## 2. 참고 데모 해부 (확인된 사실)

출처: https://tympanus.net/Development/OnScrollFilter/ — HTML·JS·CSS 직접 다운로드해 확인 (확인일 2026-09-02)

**로드하는 스크립트 (index.html 확인)**
```
js/gsap.min.js · js/Flip.min.js · js/ScrollTrigger.min.js · js/lenis.min.js · js/index.js(module)
```

**마크업 구조 (`.content-wrap` 1개 = 1화면)**
- `.content > .title-wrap > span.title--up / span.title--down` : 큰 제목 2줄
- `.content--layout > svg.content__img` + `p.content__text`
- svg 안에 `<filter>`(feTurbulence + feDisplacementMap [+ feMorphology]) → `<mask>`(circle r=0 또는 path d) → `<image mask="url(#…)">`
- 마스크 요소에 `data-value-final` 로 최종 값(원이면 r=820 등, path 면 최종 d)을 적어둠

**동작 (`js/item.js` 확인)**
1. `Flip.getState()` 로 제목 2줄의 현재 위치를 저장
2. 제목 2줄을 두 번째 `.content` 안으로 **DOM 이동**(레이아웃 변경)
3. `Flip.from(...)` 으로 "화면 중앙 큰 제목 → 이미지 옆 자리"로 이동하는 트윈 생성
4. 같은 타임라인에 마스크 `r`(또는 `d`) 0 → 최종값, 이미지 `scale 1→1.2`·`brightness 100%→150%` 추가
5. `ScrollTrigger.create({ start:'clamp(top bottom-=10%)', end:'+=40%', scrub:true })` 로 스크롤에 물림
6. `index.js` 는 Lenis(lerp 0.1, smoothWheel) 로 부드러운 스크롤 + `lenis.on('scroll', ScrollTrigger.update)`

**핵심**: 효과의 정체는 "SVG 마스크(원/곡선)를 노이즈 필터로 일렁이게 만들면서 스크롤에 맞춰 열어주는 것"이다.
GSAP Flip 은 제목 이동용, Lenis 는 부드러운 스크롤용 — **둘 다 필수는 아니다**.

**라이선스**: GSAP 은 2025-04 Webflow 인수 후 Flip·ScrollTrigger 포함 전 플러그인 무료(상업적 이용 포함).
npm 최신 `gsap@3.15.0`, `lenis@1.3.26` (npm registry 확인, 2026-09-02)

---

## 3. 현재 코드가 거는 제약 (직접 확인)

| 확인 항목 | 값 | 영향 |
|---|---|---|
| 데스크톱 레이아웃 | `<main class="relative h-7711 overflow-hidden">` 안에 **모든 섹션이 절대 좌표** (`src/App.jsx`) | 중간에 흐름(flow) 요소를 끼워 넣을 수 없음 |
| 좌표 단위 | 디자인 1px = `var(--u)` = 화면폭/1920 (`src/index.css`, `src/lib/design.js`) | 새 화면도 같은 단위로 맞춰야 비율이 안 깨짐 |
| 외부 라이브러리 | **없음** — App.jsx 주석에 "외부 라이브러리는 쓰지 않는다" 명시 | GSAP/Lenis 도입은 기존 원칙을 바꾸는 결정 |
| 기존 스크롤 훅 | `useScrollProgress`(요소 진행도 0→1), `useScrollReveal`(등장) — 둘 다 `prefers-reduced-motion` 처리 있음 | 자체 구현 시 재사용 가능 |
| MY PROJECTS 좌표 | 제목 y=2773.36 / 갤러리 밴드 y=2886~3556 / 카드 y=3408~4188 | 갤러리가 제목과 카드 사이를 가로지름 |
| 그 앞 섹션 끝 | Experience = y 1968 + 557 = **2525** | y 2525~2773 사이에 그려진 요소 없음 → **깨끗한 분할선 존재** |
| 소스 이미지 | `ai-video-creator-1` = `gallery-greenhouse.webp` (`src/content/portfolio.js`) | 새 화면 이미지로 그대로 재사용 가능 |

새 화면에 쓸 정보(`PROJECTS.cards[0]`, 확인됨):
```
제목 : AI Video Creator / Editor & Director
설명 : 2026 _ SOLO PROJECT
       작업 기간: 2주 (26.06.22~26.07.01)
       주요기술: Google Flow, PREMIERE PRO, AFTER EFFECTS
       기획의도: 26MSI in 대전 홍보영상
이미지: gallery-greenhouse.webp
```

---

## 4. 구현 방식 선택지

### A안 (권장) — 캔버스 2분할 + 사이에 새 화면 삽입
```
<main>
  ├ 창1 : height 2770u, overflow-hidden   ← 안쪽에 h-7711 캔버스(offset 0)
  │        NameBanner / Hero / AboutMe / Experience
  ├ 새 화면 : 일반 흐름, 자체 스크롤 길이(예: 250~300vh)   ← 스크롤 필터 연출
  └ 창2 : height (7711-2770)u, overflow-hidden ← 안쪽 캔버스를 top:-2770u 로 밀어 올림
           BackgroundPattern / Gallery / Projects / Marquee / MyDesign / Skills / Footer
</main>
```
- **각 섹션의 좌표는 한 글자도 안 고친다** (안쪽 래퍼가 좌표계를 유지)
- 진짜 "한 화면 다 스크롤 → 다음으로 MY projects" 순서가 나옴
- 리스크: 캔버스 분할선(2770) 위아래로 걸치는 요소가 생기면 잘림 → 현재는 없음(위 표에서 확인)

### B안 — 추가 스크롤 없이 기존 여백 안에서만
- 제목(2773)과 갤러리(2886) 사이 구간에서 마스크가 열리는 연출만 넣음
- 구조 변경 0, 리스크 0 / 대신 "한 화면을 다 스크롤" 하는 느낌은 안 나옴

### C안 — 새 화면을 페이지 맨 위(히어로 다음)나 맨 아래에 배치
- 구조 변경은 A안과 동일한 난이도인데 요청한 순서와 다름 → 비권장

## 5. 기술 스택 선택지

| | 도입 | 얻는 것 | 잃는 것 |
|---|---|---|---|
| **1** | gsap + ScrollTrigger + Flip + Lenis (데모와 동일) | 데모와 100% 같은 움직임, 제목 Flip 이동, 부드러운 관성 스크롤 | 번들 +약 100KB, "외부 라이브러리 없음" 원칙 폐기, Lenis 가 페이지 전체 스크롤을 가로챔(기존 IntersectionObserver 연출과 상호작용 검증 필요) |
| **2** | gsap + ScrollTrigger 만 (Flip·Lenis 제외) | 마스크 열림·이미지 스케일·밝기 = 데모 핵심 그대로 | 제목의 "중앙→옆자리" 이동은 CSS transform 으로 근사 |
| **3** | 라이브러리 0 — 기존 `useScrollProgress` + SVG 마스크 직접 제어 | 원칙 유지, 번들 증가 없음, reduced-motion 처리 이미 있음 | 직접 구현량 증가, 이징·정밀도는 GSAP 대비 손이 더 감 |

feTurbulence·feDisplacementMap 노이즈 필터 자체는 **셋 다 동일**(순수 SVG, 라이브러리 무관).

---

## 6. 결정이 필요한 항목 (미확정 — 임의로 정하지 않음)

1. 구조: A안 / B안
2. 기술: 1 / 2 / 3
3. 범위: 새 화면을 **AI Video Creator 1개만** 만들지, **프로젝트 4개 각각**(4화면 연속)으로 만들지
4. 마스크 모양: 원형 확장(데모 1번) / 물결 path(데모 3번)
5. 모바일(<1280, `MobileProjects.jsx`)에도 적용할지, 데스크톱 전용으로 둘지

---

## 7. 결정 후 작업 순서(예정)

1. (A안이면) `App.jsx` 데스크톱 캔버스를 창1/창2 로 분할 — 화면이 지금과 100% 동일한지 먼저 확인
2. 새 섹션 컴포넌트 추가 (마크업 + SVG 필터/마스크, 정지 상태로 먼저)
3. 스크롤 구동 연결 (선택한 기술)
4. `prefers-reduced-motion` 대응 — 애니메이션 없이 완성 상태로 표시
5. 이미지 로드 실패·데이터 없음 처리 (`SafeImage` 규칙 준수)

## 8. 완료 기준(예정)

- 스크롤을 내리면 새 화면에서 제목·이미지가 노이즈 마스크로 열리고, 다 열린 뒤 계속 내리면 지금의 MY projects(제목→갤러리→카드 4장)가 **기존과 동일한 모습**으로 나온다
- 창1/창2 분할 전후로 다른 모든 섹션의 화면 위치가 픽셀 단위로 동일하다
- 움직임 줄이기 설정에서는 애니메이션 없이 최종 상태가 보인다

---

## 9. 확정된 결정 (2026-09-02)

| 항목 | 결정 |
|---|---|
| 기술 | **gsap 3.15.0 + ScrollTrigger** (Flip·Lenis 미사용) — `npm install gsap` 완료 |
| 범위 | **프로젝트 4개 전부** — 화면 4개 연속 |
| 마스크 | **원형 확장** — feTurbulence(0.03, 3) + feDisplacementMap(scale 50) |
| 구조 | **A안(캔버스 2분할)** — 4화면을 넣으려면 스크롤 길이 추가가 필수라 B안은 성립하지 않음 (질문 미응답분, 이 전제로 진행) |
| 모바일 | **데스크톱 + 모바일 둘 다 적용** (2026-09-02 추가 요청) |

## 10. 구현 결과

**추가**
- `src/sections/ProjectsReveal.jsx` — 4화면 마스크 연출 섹션
- `src/index.css` 하단 `.pfr-*` 스타일 블록
- `package.json` 의존성에 `gsap@3.15.0`

**변경**
- `src/App.jsx` — 데스크톱 `<main>` 을 창1(0~2770) / ProjectsReveal / 창2(2770~7711) 로 분할.
  창2 안쪽 래퍼를 `top: -2770u` 로 끌어올려 **기존 섹션 좌표는 전부 그대로 유지**.

**연출 타임라인** (화면당 220vh, 실제 구동 구간 120vh · scrub)
| 대상 | 0% → 100% |
|---|---|
| 마스크 원 `r` | 0 → 880 (0 ~ 75% 구간) |
| 이미지 | scale 1 → 1.12, brightness 100% → 130% |
| 제목 윗줄/아랫줄 | 아래/위에서 각각 밀려 올라오며 opacity 0 → 1 (0 ~ 60%) |
| 설명 | 70% 지점부터 y 24 → 0, opacity 0 → 1 |

**안전장치**
- 마크업 기본값이 "다 열린 상태"(r=880) — JS 실패 시에도 내용이 사라지지 않음
- `prefers-reduced-motion: reduce` → 연출 제거 + 화면당 220vh 높이도 접음(정적 나열)
- 이미지 로드 실패 시 자리표시 + 대체 텍스트(`card.alt`)
- 마스크·필터 id 는 카드 id 로 유일하게 생성

**검증 상태**
- `npm run lint` 통과 / `npm run build` 통과 (2026-09-02)
- **브라우저 육안 확인은 못 함** — Claude 브라우저 확장이 연결되지 않아 스크린샷을 찍지 못했다. 실제 화면 확인 필요.

## 11. 모바일 적용 (2026-09-02 추가)

모바일 캔버스는 절대좌표가 아닌 일반 흐름이라 `MobilePage.jsx` 의 `<MobileGallery/>` 와
`<MobileProjects/>` 사이에 컴포넌트를 끼워 넣는 것으로 끝난다. 다만 세 가지를 손봤다.

1. **`ProjectsReveal` 에 `variant` prop 추가** (`"desktop"` / `"mobile"`)
   - 두 캔버스에 한 벌씩 놓이므로 마스크·필터 id 에 접두어를 붙여 문서 안에서 겹치지 않게 했다
     (`pfr-mobile-mask-…` / `pfr-desktop-mask-…`). id 가 겹치면 `url(#…)` 이 엉뚱한 쪽을 가리킨다.
   - ScrollTrigger 를 자기 캔버스가 실제로 보이는 폭에서만 건다
     (데스크톱 `(min-width: 80rem)` / 모바일 `(width < 80rem)`). 반대쪽은 `display:none` 이라 측정이 무의미하다.
2. **`MobilePage` 의 `overflow-hidden` → `overflow-x-clip`**
   `overflow:hidden` 은 스크롤 컨테이너를 만들어 안쪽 `position:sticky` 를 무력화한다.
   `overflow-x: clip` 은 컨테이너를 만들지 않아 가로 클리핑은 유지하면서 sticky 가 살아난다.
   (기존 동작 중 바뀌는 부분 — 세로 방향 클리핑이 사라진다. 모바일에서 세로로 넘치는 요소는 없어 보이나 실제 화면 확인 필요.)
3. **모바일 전용 크기값** (`index.css` 의 `@media (width < 80rem)` 블록)
   화면당 200vh, 이미지 높이 `min(52vh, 420u)`, 제목 `min(6.5vh, 46u)`,
   좌우 거터 20u, 설명은 좁은 폭이라 `pre` 대신 `pre-wrap` 으로 접는다.

검증: `npm run lint` / `npm run build` 통과. 브라우저 육안 확인은 여전히 못 했다(확장 미연결).
