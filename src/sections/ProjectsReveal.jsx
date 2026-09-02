import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/SectionHeading";
import MobileSectionHeading from "./mobile/MobileSectionHeading";
import { PROJECTS } from "../content/portfolio";

gsap.registerPlugin(ScrollTrigger);

/**
 * MY PROJECTS 도입부 — 스크롤로 열리는 마스크 연출.
 *
 * 참고: tympanus.net/Development/OnScrollFilter (소스 직접 확인 2026-09-02)
 *   원리 = SVG 마스크(원)의 r 을 스크롤에 맞춰 0 → 최종값으로 키우고,
 *          그 원에 feTurbulence + feDisplacementMap 을 걸어 가장자리를 일렁이게 한다.
 *   데모는 gsap + Flip + ScrollTrigger + Lenis 를 쓰지만 여기서는
 *   gsap + ScrollTrigger 만 쓴다(Flip = 제목 이동용, Lenis = 관성 스크롤용, 둘 다 선택).
 *
 * 내용은 content/portfolio.js 의 PROJECTS.cards 를 그대로 쓴다(카드와 같은 정보·이미지).
 *
 * 스크립트가 없거나 실패해도 내용이 사라지지 않도록, 마크업의 기본 상태를
 * "다 열린 모습"(r = MASK_R_END)으로 두고 GSAP 이 fromTo 로 0 에서 시작시킨다.
 *
 * 데스크톱 캔버스와 모바일 캔버스에 한 벌씩 놓이므로(둘 중 하나는 항상
 * display:none 이다) variant 로 구분한다.
 *   - 마스크·필터 id 가 문서 안에서 겹치지 않게 접두어를 붙인다
 *   - 자기 캔버스가 화면에 보이는 폭에서만 ScrollTrigger 를 건다
 * 크기·여백은 index.css 의 `.pfr-*` 가 두 캔버스 각각의 --u 로 처리한다.
 *
 * 맨 앞에는 "— MY projects" 제목 칸을 한 번 더 둔다. 경력 다음에 곧바로
 * 전체 화면 컷이 시작되면 갑작스러워서, 들어가는 자리를 알려 주는 몫이다.
 */

// 기본 프레임 — 갤러리 이미지가 세로형이라 5:7 뷰박스에 잘라 넣는다.
// 카드가 reveal.frame 을 주면(가로형 시안 등) 그 비율을 대신 쓴다.
const FRAME = { w: 1000, h: 1400 };

// 마스크 원이 프레임 모서리까지 덮으려면 대각선의 절반보다 커야 한다.
const maskEnd = ({ w, h }) => Math.ceil((Math.hypot(w, h) / 2) * 1.03);

// 캔버스별 적용 폭 — 1280(80rem)이 데스크톱/모바일 경계다(index.css 와 같은 값).
const MEDIA = {
  desktop: "(min-width: 80rem)",
  mobile: "(width < 80rem)",
};

export default function ProjectsReveal({ variant = "desktop" }) {
  const rootRef = useRef(null);
  const [failed, setFailed] = useState({});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();

    // 자기 캔버스가 실제로 보이는 폭에서만, 그리고 움직임 줄이기가 아닐 때만
    // 연출을 건다(반대쪽 캔버스는 display:none 이라 측정이 무의미하다).
    mm.add(
      `${MEDIA[variant]} and (prefers-reduced-motion: no-preference)`,
      () => {
        const items = root.querySelectorAll("[data-pfr-item]");

        for (const item of items) {
          const mask = item.querySelector("[data-pfr-mask]");
          const image = item.querySelector("[data-pfr-image]");
          const up = item.querySelector("[data-pfr-up]");
          const down = item.querySelector("[data-pfr-down]");
          const desc = item.querySelector("[data-pfr-desc]");
          const buttons = item.querySelector("[data-pfr-buttons]");

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: item,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          });

          // 마스크가 열린다 — 가장자리는 노이즈 필터가 일렁이게 만든다.
          // 최종 반지름은 마크업의 기본값(= 다 열린 상태)에서 읽는다.
          const rEnd = mask.getAttribute("r");

          tl.fromTo(
            mask,
            { attr: { r: 0 } },
            { attr: { r: rEnd }, duration: 0.75 },
            0,
          )
            // 이미지는 살짝 커지며 밝아진다(데모와 같은 값).
            .fromTo(
              image,
              { transformOrigin: "50% 50%", scale: 1, filter: "brightness(100%)" },
              { scale: 1.12, filter: "brightness(130%)", duration: 1 },
              0,
            )
            // 제목 두 줄은 가운데에서 위·아래 제자리로 벌어진다.
            .fromTo(
              up,
              { yPercent: 120, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.6 },
              0,
            )
            .fromTo(
              down,
              { yPercent: -120, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.6 },
              0,
            )
            // 설명은 마스크가 거의 다 열린 뒤에 올라온다.
            .fromTo(
              desc,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.25 },
              0.7,
            )
            // 버튼은 요청으로 미리 나와 있지 않게, 설명 다음에 올라온다.
            .fromTo(
              buttons,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.25 },
              0.85,
            );
        }
      },
    );

    return () => mm.revert();
  }, [variant]);

  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!PROJECTS.cards.length) return null;

  const total = String(PROJECTS.cards.length).padStart(2, "0");

  return (
    <section
      ref={rootRef}
      className="pfr"
      aria-label={`${PROJECTS.heading} 미리보기`}
    >
      {/* 들머리 — 연출이 시작되는 자리를 알려 주는 제목 칸.
          다른 섹션과 달리 data-reveal 을 붙이지 않는다. 등장 처리가 걸리지 않으면
          opacity 0 인 채로 빈칸만 남아 제목이 아예 안 보이기 때문이다. */}
      <div className="pfr-lead" id={`projects-intro-${variant}`}>
        {variant === "mobile" ? (
          <MobileSectionHeading>{PROJECTS.heading}</MobileSectionHeading>
        ) : (
          <SectionHeading>{PROJECTS.heading}</SectionHeading>
        )}
      </div>

      {PROJECTS.cards.map((card, index) => {
        const maskId = `pfr-${variant}-mask-${card.id}`;
        const filterId = `pfr-${variant}-filter-${card.id}`;

        // 연출 전용 이미지가 있으면 그것을, 없으면 카드 썸네일을 쓴다.
        const shot = card.reveal ?? { src: card.src, alt: card.alt };
        const frame = shot.frame ?? FRAME;
        const wide = frame.w > frame.h;

        return (
          <article key={card.id} className="pfr-item" data-pfr-item>
            <div className="pfr-stage">
              <p className="pfr-index">
                {String(index + 1).padStart(2, "0")} / {total}
              </p>

              {/* 오류 — 이미지를 못 받아오면 자리표시 위에 대체 텍스트를 보여준다. */}
              {failed[card.id] ? (
                <p className="pfr-fallback">{shot.alt}</p>
              ) : (
                <svg
                  className={`pfr-svg${wide ? " pfr-svg--wide" : ""}`}
                  viewBox={`0 0 ${frame.w} ${frame.h}`}
                  style={{ "--pfr-frame": `${frame.w} / ${frame.h}` }}
                  aria-hidden="true"
                >
                  <defs>
                    <filter id={filterId}>
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.03"
                        numOctaves="3"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="50"
                        xChannelSelector="R"
                        yChannelSelector="G"
                      />
                    </filter>
                    <mask id={maskId}>
                      <circle
                        data-pfr-mask
                        cx="50%"
                        cy="50%"
                        r={maskEnd(frame)}
                        fill="white"
                        style={{ filter: `url(#${filterId})` }}
                      />
                    </mask>
                  </defs>
                  <image
                    data-pfr-image
                    href={shot.src}
                    width={frame.w}
                    height={frame.h}
                    preserveAspectRatio="xMidYMid slice"
                    mask={`url(#${maskId})`}
                    onError={() =>
                      setFailed((prev) => ({ ...prev, [card.id]: true }))
                    }
                  />
                </svg>
              )}

              <h3 className="pfr-title">
                <span className="pfr-line pfr-line--up">
                  <span data-pfr-up>{card.titleLines[0]}</span>
                </span>
                <span className="pfr-line pfr-line--down">
                  <span data-pfr-down>{card.titleLines[1]}</span>
                </span>
              </h3>

              <div className="pfr-copy">
                <p className="pfr-desc" data-pfr-desc>
                  {card.descriptionLines.join("\n")}
                </p>

                {/* 카드(ProjectCard)와 같은 버튼 2개 — "10. Swipe Fill
                    Transitions"의 Wipe Left(~/Downloads/80button) 스타일. */}
                <div className="pfr-buttons" data-pfr-buttons>
                  {(card.buttons ?? PROJECTS.buttons).map((label) => (
                    <span key={label} className="pfr-swipe">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
