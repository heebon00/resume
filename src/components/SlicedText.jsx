import { useEffect, useRef } from "react";

/**
 * 조각난 글자 — Codrops "Sliced Dual Image Layout" 의 슬라이스 글리치를
 * 외부 라이브러리 없이 다시 구현한 것이다.
 * (원본은 dil.js + glitchFx.js + anime.js 를 쓰지만, 실제 연출에 필요한 건
 *  clip-path 로 자른 세로 조각과 조각마다 무작위로 어긋나는 가로 이동뿐이다)
 *
 * 원본에서 가져온 방식:
 *   - 같은 글자를 조각 수만큼 겹쳐 놓고 각 장을 clip-path: polygon 으로
 *     세로 띠 하나만 남게 자른다 (경계에 1px 여유를 줘 틈이 안 보이게 한다)
 *   - 조각마다 50~100ms 마다 새 위치로 튀고(glitchState),
 *     정해진 횟수를 채우면 제자리로 돌아온다(reset)
 *   - 튀는 폭은 조각 폭의 ±50% (원본 glitchStateValue 와 같은 범위)
 *
 * 원본과 다른 점:
 *   원본은 조각마다 시작 시점을 100~2500ms 로 흩뜨려 계속 지직거리지만,
 *   여기서는 "효과 → 2초 정지 → 다시 효과" 리듬을 요청받았으므로
 *   모든 조각이 같은 순간에 튀기 시작하고, 한 번 끝나면 HOLD 만큼 쉰다.
 *
 * 접근성 — 조각들은 같은 글자의 복제라 aria-hidden 으로 감춘다.
 * 읽히는 글자는 바닥에 깔린 원본 한 장뿐이다.
 * 스크립트가 없거나 움직임 줄이기 설정이면 원본만 그대로 보인다.
 */

const SLICES = 10; // 세로 조각 수
const BURST = 420; // 지직거리는 시간 (ms)
const HOLD = 2000; // 멈춰 있는 시간 (ms) — 요청값
const STATE_MIN = 50; // 조각이 한 자리에 머무는 시간 (원본 glitchState)
const STATE_MAX = 100;
const SHIFT = 0.5; // 조각 폭 대비 최대 이동량 (원본과 동일)

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 호출부가 absolute/fixed/sticky 를 넘겼으면 relative 를 붙이지 않는다.
// (붙이면 Tailwind 가 .absolute 를 먼저 내보내므로 relative 가 이겨 배치가 깨진다)
const POSITIONED = /(?:^|\s)(?:absolute|fixed|sticky)(?:\s|$)/;

export default function SlicedText({ children, className = "", as: Tag = "p" }) {
  const wrapRef = useRef(null);
  const sliceRefs = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    // 여기까지 왔다면 조각을 보여주고 원본은 자리만 잡게 한다.
    wrap.setAttribute("data-sliced", "");

    const slices = sliceRefs.current.filter(Boolean);
    const timers = new Set();
    let stopped = false;

    const later = (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        if (!stopped) fn();
      }, ms);
      timers.add(id);
      return id;
    };

    const resetAll = () => {
      for (const slice of slices) slice.style.transform = "translate3d(0,0,0)";
    };

    // 조각 하나가 BURST 동안 제 나름의 간격으로 계속 튀게 한다.
    const jitter = (slice, endsAt) => {
      if (performance.now() >= endsAt) return;
      const max = (slice.offsetWidth / SLICES) * SHIFT;
      const dx = randInt(-max, max);
      slice.style.transform = `translate3d(${dx}px,0,0)`;
      later(() => jitter(slice, endsAt), randInt(STATE_MIN, STATE_MAX));
    };

    const cycle = () => {
      const endsAt = performance.now() + BURST;
      for (const slice of slices) jitter(slice, endsAt);
      later(() => {
        resetAll();
        later(cycle, HOLD);
      }, BURST);
    };

    cycle();

    return () => {
      stopped = true;
      for (const id of timers) clearTimeout(id);
      timers.clear();
      resetAll();
      wrap.removeAttribute("data-sliced");
    };
  }, [children]);

  return (
    <Tag
      ref={wrapRef}
      className={`sliced-text inline-block whitespace-nowrap ${
        POSITIONED.test(className) ? "" : "relative"
      } ${className}`}
    >
      {/* 바닥에 깔리는 원본 — 상자 크기를 정하고 낭독기가 읽는 글자다 */}
      <span className="sliced-text__base">{children}</span>

      {Array.from({ length: SLICES }, (_, i) => (
        <span
          key={i}
          ref={(node) => {
            sliceRefs.current[i] = node;
          }}
          aria-hidden="true"
          className="sliced-text__slice"
          style={{
            clipPath: `polygon(calc(100%/${SLICES}*${i} - 1px) 0, calc(100%/${SLICES}*${i + 1} + 1px) 0, calc(100%/${SLICES}*${i + 1} + 1px) 100%, calc(100%/${SLICES}*${i} - 1px) 100%)`,
          }}
        >
          {children}
        </span>
      ))}
    </Tag>
  );
}
