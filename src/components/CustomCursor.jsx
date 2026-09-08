import { useEffect, useRef, useState } from "react";

/**
 * 커스텀 커서 — 피그마 20:1763 "Custom Cursor" + 20:1791 "Cursor Dot"
 *   기본        7 x 7 검정 점 (20:1763 본체, radius 17.5)
 *   따라오는 링 35 x 35 (20:1791) — 점보다 늦게 따라와 잔상을 만든다
 *
 * [지운 것] 시안 20:1765 의 "Explore" 확장(링크·프로젝트 카드에서 뜨던 것)과
 * "Drag" 확장(갤러리·MY DESIGN 가로 스크롤에서 뜨던 것)은 요청으로 걷어냈다
 * — 86 원이 버튼과 글자를 통째로 덮었다. 이제 어디서나 점과 링만 따라간다.
 *
 * 마우스 기기에서만 동작하고 터치 기기에서는 아예 켜지 않는다.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

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
    };

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

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true">
      <span ref={dotRef} className="cc-dot" />
      <span ref={ringRef} className="cc-ring" />
    </div>
  );
}
