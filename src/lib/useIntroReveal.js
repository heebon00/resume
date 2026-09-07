import { useEffect } from "react";
import gsap from "gsap";
import {
  FADE_IN,
  LETTER_IN,
  LETTER_STAGGER,
  REVEAL_FAILSAFE,
  onIntroDone,
} from "./intro";

/**
 * 히어로 등장 — 로딩 화면이 끝나며 보내는 INTRO_DONE 신호를 받아 시작한다.
 * 데스크톱·모바일 히어로가 같은 움직임을 쓰므로 여기 하나로 모았다.
 *
 * 넘긴 ref 안에서 `[data-letter]` 는 글자 하나씩 탄성을 받아 떨어지고,
 * `[data-intro-fade]` 는 뒤이어 옅게 떠오른다.
 *
 * 숨기는 일도 여기(JS)에서만 한다. CSS 로 숨겨 두면 스크립트가 실패했을 때
 * 카피가 영영 안 보이기 때문이다.
 */
export default function useIntroReveal(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const letters = scope.querySelectorAll("[data-letter]");
    const rest = scope.querySelectorAll("[data-intro-fade]");

    gsap.set(letters, { opacity: 0 });
    gsap.set(rest, { opacity: 0, y: 20 });

    let played = false;
    const play = () => {
      if (played) return;
      played = true;

      gsap
        .timeline()
        .to(letters, {
          ...LETTER_IN,
          y: 0,
          startAt: { y: LETTER_IN.y, opacity: 0 },
          opacity: 1,
          stagger: LETTER_STAGGER,
        })
        .to(rest, { ...FADE_IN, opacity: 1, y: 0, stagger: 0.06 }, "-=0.8");
    };

    // 이미 신호가 지나갔으면 그 자리에서 바로 보여준다(lib/intro.js 주석 참조).
    const stop = onIntroDone(play);

    // 마지막 안전장치 — 어떤 이유로든 신호가 오지 않아도 글자는 반드시 나온다.
    const guard = setTimeout(play, REVEAL_FAILSAFE);

    return () => {
      stop();
      clearTimeout(guard);
    };
  }, [scopeRef]);
}
