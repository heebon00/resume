/**
 * 인트로 연출의 공유 값 — 로딩 화면(components/IntroLoader.jsx)과
 * 히어로(sections/Hero.jsx)가 이것으로만 이어져 있다.
 *
 * 값은 참고 사이트(tympanus.net/Development/IntroTrailEffect)의 것을 그대로 쓴다.
 */

/** 로딩이 끝났다(또는 건너뛴다)는 신호. window 에서 받는다. */
export const INTRO_DONE = "intro:done";

/**
 * 신호가 이미 지나갔는지 기억한다.
 *
 * 로딩 화면(App 의 <IntroLoader />)이 히어로가 든 <main> 보다 앞에 있어서,
 * 화면을 건너뛸 때는 히어로가 수신 등록을 마치기 전에 신호가 날아간다.
 * 그러면 글자가 숨은 채로 영영 남는다 — 실제로 그렇게 사라졌었다.
 * 그래서 이벤트만 쓰지 않고 "이미 끝났음"을 여기에 남긴다.
 */
let passed = false;

/** 로딩이 끝났음을 알린다. */
export function markIntroDone() {
  passed = true;
  window.dispatchEvent(new Event(INTRO_DONE));
}

/**
 * 끝나면 콜백을 부른다. 이미 끝났으면 그 자리에서 바로 부른다.
 * 정리 함수를 돌려주므로 그대로 useEffect 에서 반환하면 된다.
 */
export function onIntroDone(callback) {
  if (passed) {
    callback();
    return () => {};
  }
  window.addEventListener(INTRO_DONE, callback, { once: true });
  return () => window.removeEventListener(INTRO_DONE, callback);
}

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
 * 신호가 끝내 오지 않아도 글자는 나와야 한다. 이 시간(ms)이 지나면 그냥 보여준다.
 * 로딩 화면의 자체 제한(INTRO_TIMEOUT)보다 넉넉하게 잡는다.
 */
export const REVEAL_FAILSAFE = 6000;
