import { useEffect } from "react";

/**
 * 대상 요소가 화면을 지나가는 정도를 0 → 1 로 알려준다.
 *   0 = 아직 화면 아래에 있음, 1 = 화면 위로 완전히 빠져나감
 *
 * 스크롤마다 React 를 다시 그리면 무거우므로 값은 콜백으로만 넘기고,
 * 콜백 안에서 DOM 을 직접 만지도록 했다(리렌더 없음).
 * 움직임 줄이기 설정이면 진행도를 1 로 한 번만 알려주고 끝낸다.
 */
export default function useScrollProgress(ref, onProgress) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onProgress(1);
      return undefined;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const span = vh + rect.height;
      const raw = span > 0 ? (vh - rect.top) / span : 0;
      onProgress(Math.min(1, Math.max(0, raw)));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, onProgress]);
}
