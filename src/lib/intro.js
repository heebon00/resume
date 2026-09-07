/**
 * 인트로 연출의 공유 값 — 로딩 화면(components/IntroLoader.jsx)과
 * 히어로(sections/Hero.jsx)가 이것으로만 이어져 있다.
 *
 * 값은 참고 사이트(tympanus.net/Development/IntroTrailEffect)의 것을 그대로 쓴다.
 */

/** 로딩이 끝났다(또는 건너뛴다)는 신호. window 에서 받는다. */
export const INTRO_DONE = "intro:done";

/**
 * 글자 하나가 들어오는 모습 — tympanus.net/Development/FancyLetterAnimation 의
 * inAnimation 값(translateY -30 → 0, 900ms, easeOutElastic / opacity 500ms)을 옮겼다.
 * anime.js 의 elasticity 600 은 gsap 에서 elastic.out 의 진폭·주기로 바꿔 잡는다.
 */
export const LETTER_IN = {
  y: -30,
  duration: 0.9,
  ease: "elastic.out(1, 0.6)",
};

/** 글자 사이 시차 — 데모의 delay 40(ms). */
export const LETTER_STAGGER = 0.04;

/** 라벨·사진처럼 글자가 아닌 것들이 뒤따라 떠오르는 값. */
export const FADE_IN = { duration: 0.8, ease: "power3.out" };

/**
 * 로딩 화면이 이 시간(ms)을 넘기면 진행률과 상관없이 걷는다.
 *
 * 처음 만들 때 "문서의 모든 이미지"를 기다리게 했다가 화면이 영영 안 걷혔다.
 * 이 사이트 이미지는 대부분 loading="lazy" 라서, 스크롤이 막힌 상태에서는
 * 받아지지 않아 진행률이 100% 에 닿을 수 없었기 때문이다.
 * 그래서 (1) 첫 화면 이미지만 기다리고 (2) 그래도 안 되면 여기서 끊는다.
 */
export const INTRO_TIMEOUT = 4000;

/**
 * 글자 테두리 세 겹 — 데모의 effect 2 · 4 색 그대로.
 *
 * 데모는 얇은 것부터 쌓아 굵은 것이 앞을 덮지만, 그러면 색이 하나만 보인다.
 * 그래서 굵은 것을 뒤에 깔아 세 색이 동심원처럼 다 보이게 뒤집어 쌓는다.
 *
 * 데모 굵기는 10 / 4 / 1 인데 그건 알파벳 한 줄 획 기준이다. 한글은 획이 촘촘해
 * 그대로 쓰면 속공간이 메워져 뭉갠다. 비율은 지키고 크기만 이 값으로 줄인다.
 */
export const STROKE_SCALE = 0.3;
const w = (n) => n * STROKE_SCALE;

/** 초록 카피(좋아하는 일은 / 애정을,)가 쓰는 색. */
export const LAYERS_EFFECT_2 = [
  { color: "var(--color-letter2-back)", width: w(10) },
  { color: "var(--color-letter2-mid)", width: w(4) },
  { color: "var(--color-letter2-front)", width: w(1) },
];

/** 빨강 카피(맡은 임무는 / 책임감을)가 쓰는 색. */
export const LAYERS_EFFECT_4 = [
  { color: "var(--color-letter4-back)", width: w(10) },
  { color: "var(--color-letter4-mid)", width: w(4) },
  { color: "var(--color-letter4-front)", width: w(1) },
];
