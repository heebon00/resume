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
 * 두 가지 모드가 있다.
 *   1. `[data-intro-group]` 로 묶인 구간이 있으면(히어로의 초록 줄 · 빨강 줄) —
 *      한 구간이 3D로 펴지며 나타나 잠깐 머물다, 그 자리에서 다음 구간과
 *      자리를 바꾼다(먼저 것이 접혀 사라지고 다음 것이 그 자리에서 펴진다).
 *      두 구간은 CSS 로 같은 칸에 겹쳐 놓는다(Hero.jsx `[grid-area:1/1]`) —
 *      그래야 "그 자리에" 나타난다. 마지막 구간까지 갔다가 (요청으로) 3초
 *      머문 뒤 다시 첫 구간으로 돌아가며 무한히 반복한다.
 *      `[data-intro-fade]` 는 구간 안에 있으면 그 줄에 실려 같이 나오고
 *      (부모가 접혀 있으니 따로 숨길 필요가 없다), 구간 밖에 있는 것
 *      (라벨 · 사진)은 처음 한 번만 나오고 반복과 무관하게 계속 남는다 —
 *      그래서 반복 구간(loop)은 라벨·사진과 별도 타임라인으로 둔다.
 *   2. 묶인 구간이 없으면 — `[data-letter]` 글자 하나하나가 탄성을 받아
 *      떨어지고, `[data-intro-fade]` 가 뒤이어 옅게 떠오른다(예전 방식).
 *
 * 숨기는 일도 여기(JS)에서만 한다. CSS 로 숨겨 두면 스크립트가 실패했을 때
 * 카피가 영영 안 보이기 때문이다.
 */
export default function useIntroReveal(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const groups = scope.querySelectorAll("[data-intro-group]");
    const rest = scope.querySelectorAll("[data-intro-fade]");

    let buildTimeline;

    if (groups.length > 0) {
      const flipLines = scope.querySelectorAll("[data-flip-line]");
      const ungrouped = [...rest].filter((el) => !el.closest("[data-intro-group]"));

      gsap.set(flipLines, {
        transformPerspective: 800,
        transformOrigin: "50% 100%",
        rotationX: -90,
        opacity: 0,
      });
      gsap.set(ungrouped, { opacity: 0, y: 20 });

      // 구간 사이에 머무는 시간과, 마지막 구간에서 한 바퀴 돌기 전에
      // 머무는 시간(요청: 3초)은 다르다.
      const GROUP_HOLD = 1.2;
      const LOOP_HOLD = 3;

      // 접힌 채 숨어 있다가(-90) 펴지며 나타난다 — 반복할 때마다 매번 이
      // 각도에서 다시 시작해야 방향이 한결같다, 그래서 set 으로 못박아 둔다.
      const enter = (lines) =>
        gsap
          .timeline()
          .set(lines, { rotationX: -90, opacity: 0 })
          .to(lines, { rotationX: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.15 });
      const EXIT_VARS = { rotationX: 90, opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.1 };

      buildTimeline = () => {
        const master = gsap.timeline();
        const firstLines = groups[0].querySelectorAll("[data-flip-line]");

        // 첫 구간 등장 + 라벨·사진 — 반복 없이 한 번만.
        master
          .add(enter(firstLines), 0)
          .to(ungrouped, { ...FADE_IN, opacity: 1, y: 0, stagger: 0.06 }, "-=0.5");

        // 구간이 순서대로 자리를 바꾸며 무한 반복한다. 마지막 구간에서
        // 첫 구간으로 돌아가는 지점만 LOOP_HOLD(3초)를 쓴다.
        const loop = gsap.timeline({ repeat: -1 });
        for (let step = 1; step <= groups.length; step += 1) {
          const from = groups[(step - 1) % groups.length].querySelectorAll("[data-flip-line]");
          const to = groups[step % groups.length].querySelectorAll("[data-flip-line]");
          const hold = step === groups.length ? LOOP_HOLD : GROUP_HOLD;

          loop.to(from, EXIT_VARS, `+=${hold}`).add(enter(to), "+=0.1");
        }

        master.add(loop);
        return master;
      };
    } else {
      const letters = scope.querySelectorAll("[data-letter]");

      gsap.set(letters, { opacity: 0 });
      gsap.set(rest, { opacity: 0, y: 20 });

      buildTimeline = () =>
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
    }

    let played = false;
    let timeline;
    const play = () => {
      if (played) return;
      played = true;
      timeline = buildTimeline();
    };

    // 이미 신호가 지나갔으면 그 자리에서 바로 보여준다(lib/intro.js 주석 참조).
    const stop = onIntroDone(play);

    // 마지막 안전장치 — 어떤 이유로든 신호가 오지 않아도 글자는 반드시 나온다.
    const guard = setTimeout(play, REVEAL_FAILSAFE);

    return () => {
      stop();
      clearTimeout(guard);
      // 무한 반복(loop mode)이라 언마운트될 때 확실히 끊어 준다.
      timeline?.kill();
    };
  }, [scopeRef]);
}
