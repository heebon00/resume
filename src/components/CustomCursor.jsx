import { useEffect, useRef, useState } from "react";
import arrowLeft from "../assets/icons/cursor-arrow-a.svg";
import arrowRight from "../assets/icons/cursor-arrow-b.svg";

/**
 * 커스텀 커서 — 피그마 20:1763 "Custom Cursor" + 20:1791 "Cursor Dot"
 *   기본        7 x 7 검정 점 (20:1763 본체, radius 17.5)
 *   따라오는 링 35 x 35 (20:1791) — 점보다 늦게 따라와 잔상을 만든다
 *   확장 상태   86 x 86 원 (20:1765 / 20:1770, radius 55)
 *               "Explore" 13.9px · "Drag" 14px, leading 22.99, 검정 글자
 *               Drag 에는 24 x 24 화살표가 좌우로 붙고 간격 25
 *   테두리      1px rgba(255,255,255,0.5) (20:1785)
 * 시안에서는 확장 상태가 모두 opacity 0(호버 상태)으로 저장돼 있다.
 *
 * `data-cursor="explore" | "drag"` 가 붙은 요소 위에서 확장된다.
 * 마우스 기기에서만 동작하고 터치 기기에서는 아예 켜지 않는다.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [mode, setMode] = useState(null); // 'explore' | 'drag' | null

  // 마우스가 있는 기기에서만 켠다. 터치 기기에서는 렌더링 자체를 하지 않는다.
  const [active] = useState(
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  useEffect(() => {
    if (!active) return undefined;

    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let frame = 0;

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
      const hit = event.target.closest?.("[data-cursor]");
      setMode(hit ? hit.dataset.cursor : null);
    };

    const onLeave = () => setMode(null);

    // 링은 점을 조금 늦게 따라간다(시안의 잔상 표현).
    const tick = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true">
      <span ref={dotRef} className="cc-dot" />
      <span ref={ringRef} className="cc-ring" data-mode={mode ?? undefined}>
        <span className="cc-label">
          {mode === "drag" ? (
            <>
              <img src={arrowLeft} alt="" className="cc-arrow" />
              Drag
              <img src={arrowRight} alt="" className="cc-arrow" />
            </>
          ) : (
            "Explore"
          )}
        </span>
      </span>
    </div>
  );
}
