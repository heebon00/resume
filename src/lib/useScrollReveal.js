import { useEffect } from "react";

/**
 * 스크롤 등장 — `data-reveal` 이 붙은 요소가 화면에 들어오면 `data-revealed` 를 단다.
 * 실제 연출(살짝 올라오며 나타나기, 숙련도 도넛 채우기)은 index.css 가 맡는다.
 *
 * 요소마다 ref 를 넘기지 않고 관찰자 하나로 한 번에 처리한다.
 * 숨김 상태는 `.js-reveal` 이 붙어 있을 때만 적용되므로, 스크립트가 실패하면
 * 아무것도 숨겨지지 않는다(내용이 사라지는 사고 방지).
 */
export default function useScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // 움직임을 줄이도록 설정한 사용자에게는 숨김 자체를 걸지 않는다.
    if (reduced.matches) return undefined;

    root.classList.add("js-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const targets = document.querySelectorAll("[data-reveal]");
    for (const target of targets) observer.observe(target);

    return () => {
      observer.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);
}
