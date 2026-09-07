import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { INTRO_DONE, INTRO_TIMEOUT } from "../lib/intro";

/**
 * 인트로 로딩 화면 — 요청으로 tympanus.net/Development/IntroTrailEffect 의
 * 도입부를 옮겼다(55.md). 화면을 먹색으로 덮고 가운데에서 퍼센트가 올라가다가,
 * 다 받으면 위로 걷히며 히어로에 신호를 보낸다.
 *
 * 히어로와는 window 의 INTRO_DONE 이벤트로만 이어져 있다 — 서로를 직접 알지 않는다.
 * 이 화면을 건너뛰는 경우(재방문·모션 최소화)에도 같은 이벤트를 바로 쏘므로,
 * 히어로 쪽은 "언제 오든 이벤트가 오면 등장한다" 하나만 지키면 된다.
 *
 * [화면이 안 걷히는 사고를 막는 두 가지]
 *   1. 첫 화면에 실제로 필요한 이미지(loading="eager")만 기다린다.
 *      lazy 이미지는 스크롤이 막힌 동안 받아지지 않아 영영 안 끝난다.
 *   2. 그래도 안 끝나면 INTRO_TIMEOUT 에서 끊는다. 이 타이머는 gsap 이 아니라
 *      setTimeout 이라, 애니메이션 쪽이 통째로 실패해도 살아 있다.
 *
 * 한 세션에 한 번만 보여준다. 매번 보여주려면 SEEN 관련 세 줄만 빼면 된다.
 */
const SEEN = "intro-seen";

/** 첫 화면 이미지가 몇 장이나 준비됐는지 0~1 로 알려준다. */
function watchFirstScreenImages(onProgress) {
  const images = [...document.querySelectorAll('img[loading="eager"]')];
  if (!images.length) return onProgress(1);

  let done = 0;
  const step = () => onProgress(++done / images.length);

  for (const img of images) {
    if (img.complete) step();
    else {
      img.addEventListener("load", step, { once: true });
      // 깨진 이미지에 발이 묶이면 안 된다 — 실패도 "처리됨"으로 센다.
      img.addEventListener("error", step, { once: true });
    }
  }
}

export default function IntroLoader() {
  const root = useRef(null);
  const readout = useRef(null);

  // 재방문이거나 모션을 줄이는 설정이면 화면 자체를 만들지 않는다.
  const [skip] = useState(
    () =>
      sessionStorage.getItem(SEEN) === "1" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (skip) {
      window.dispatchEvent(new Event(INTRO_DONE));
      return undefined;
    }

    sessionStorage.setItem(SEEN, "1");

    // 실제 진행률은 뚝뚝 끊겨서 올라온다. 화면에 보이는 숫자는 매 프레임
    // 목표치를 조금씩 따라가게 해서 부드럽게 센다.
    // 다시 그리지 않도록 React 상태가 아니라 글자를 직접 갈아 끼운다.
    const state = { shown: 0, target: 0 };
    const roll = () => {
      state.shown += (state.target - state.shown) * 0.08;
      if (readout.current) {
        readout.current.textContent = `${Math.round(state.shown * 100)}%`;
      }
    };
    gsap.ticker.add(roll);

    let outro = null;
    let ended = false;

    const finish = () => {
      if (ended) return;
      ended = true;
      clearTimeout(guard);

      // 숫자가 100 에 닿는 걸 눈으로 보고 나서 걷는다.
      gsap.to(state, {
        shown: 1,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => gsap.ticker.remove(roll),
      });

      // 걷히는 동안 히어로가 등장하도록 신호를 먼저 보내 두 연출을 겹친다
      // (참고 사이트와 같은 순서).
      outro = gsap
        .timeline({ delay: 0.7 })
        .to(root.current, {
          yPercent: -100,
          duration: 1.1,
          ease: "power4.inOut",
          onStart: () => window.dispatchEvent(new Event(INTRO_DONE)),
        })
        .set(root.current, { display: "none" });
    };

    const guard = setTimeout(finish, INTRO_TIMEOUT);

    watchFirstScreenImages((ratio) => {
      state.target = ratio;
      if (ratio >= 1) finish();
    });

    return () => {
      clearTimeout(guard);
      gsap.ticker.remove(roll);
      outro?.kill();
    };
  }, [skip]);

  if (skip) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-100 grid place-items-center bg-hero-bg"
    >
      <span
        ref={readout}
        className="font-mono text-nav text-hero-title tabular-nums"
      >
        0%
      </span>
    </div>
  );
}
