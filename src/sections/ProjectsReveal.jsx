import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/SectionHeading";
import MobileSectionHeading from "./mobile/MobileSectionHeading";
import { PROJECTS } from "../content/portfolio";

gsap.registerPlugin(ScrollTrigger);

/**
 * MY PROJECTS 도입부 — 스크롤로 다음 프로젝트가 나타나는 핀 연출.
 *
 * 참고: treethemes.com/elementor/brandberry/brave 메인 화면(요청) — 화면을
 *   한 자리에 고정해 두고, 스크롤 한 번마다 다음 프로젝트의 이미지·텍스트가
 *   교차 전환되며 나타난다.
 *
 * 이전 버전(각 프로젝트가 자기 몫의 220vh 를 따로 차지하고, 그 구간을
 * 스크롤하는 동안 마스크가 서서히 열리는 방식)은 스크롤 4번 = 화면 4번
 * 넘기기라 느리고 장황했다. 지금은 전체를 한 화면(100vh)에 고정하고,
 * 그 위에서 스크롤 진행도만큼 "현재 프로젝트 인덱스"만 넘긴다 —
 * ScrollTrigger 의 pin + snap 으로 화면을 붙박고, 인덱스가 바뀔 때만
 * 이전 프로젝트를 끄고 다음 프로젝트를 켠다(교차 전환).
 *
 * 마스크 서클(OnScrollFilter, tympanus.net/Development/OnScrollFilter,
 * 소스 직접 확인 2026-09-02)은 그대로 남겨 "열리는" 인상을 준다 — 다만
 * 이제는 자기 스크롤 위치가 아니라 "지금 이 프로젝트 차례인가"에 반응한다.
 *
 * 내용은 content/portfolio.js 의 PROJECTS.cards 를 그대로 쓴다(카드와 같은 정보·이미지).
 *
 * 데스크톱 캔버스와 모바일 캔버스에 한 벌씩 놓이므로(둘 중 하나는 항상
 * display:none 이다) variant 로 구분한다.
 *   - 마스크·필터 id 가 문서 안에서 겹치지 않게 접두어를 붙인다
 *   - 자기 캔버스가 화면에 보이는 폭에서만 ScrollTrigger 를 건다
 * 크기·여백은 index.css 의 `.pfr-*` 가 두 캔버스 각각의 --u 로 처리한다.
 *
 * 움직임 줄이기 설정에서는 애초에 이 useEffect 가 돌지 않으므로(mm.add 조건에
 * no-preference 를 건다), index.css 가 핀·절대배치를 풀어 카드를 세로로
 * 나란히, 전부 열린 모습으로 보여준다.
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

/**
 * afterLead — 들머리 제목("— MY projects") 바로 다음, 첫 컷 앞에 끼워 넣을 것.
 * 요청으로 이미지 갤러리가 여기 들어간다(App.jsx / MobilePage.jsx 참조).
 */
export default function ProjectsReveal({ variant = "desktop", afterLead = null }) {
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
        const track = root.querySelector("[data-pfr-track]");
        const items = [...root.querySelectorAll("[data-pfr-item]")];
        const count = items.length;
        if (!track || count < 1) return undefined;

        // 프로젝트마다 손댈 부분을 미리 모아 둔다 — 인덱스가 바뀔 때마다
        // querySelector 를 새로 하지 않는다.
        const parts = items.map((item) => {
          const mask = item.querySelector("[data-pfr-mask]");
          return {
            el: item,
            mask,
            // 최종 반지름은 마크업의 기본값(= 다 열린 상태)에서 읽는다.
            rEnd: mask.getAttribute("r"),
            image: item.querySelector("[data-pfr-image]"),
            up: item.querySelector("[data-pfr-up]"),
            down: item.querySelector("[data-pfr-down]"),
            desc: item.querySelector("[data-pfr-desc]"),
            buttons: item.querySelector("[data-pfr-buttons]"),
          };
        });

        // 시작은 전부 닫힌 채로 숨겨 둔다 — enter() 가 자기 차례에 연다.
        for (const part of parts) {
          gsap.set(part.el, { autoAlpha: 0 });
          gsap.set(part.mask, { attr: { r: 0 } });
        }

        let activeIndex = -1;
        let activeTween = null;

        // 마스크가 열리며(가장자리는 SVG 필터가 일렁이게 만든다) 이미지가
        // 살짝 커지고 밝아지고, 제목 두 줄이 위·아래 제자리로 벌어진 뒤
        // 설명·버튼이 뒤따라 올라온다 — 순서는 이전 버전과 같다. 원본 데모는
        // 밝기 130% 인데, 옅은 색이 깔린 시안(YouTube Music 목업의 분홍
        // 그라데이션)이 끝에서 하얗게 날아가서 요청으로 110% 로 낮췄다.
        function enter(part) {
          gsap.set(part.el, { autoAlpha: 1 });
          activeTween?.kill();
          activeTween = gsap
            .timeline({ defaults: { ease: "power2.out" } })
            .fromTo(
              part.mask,
              { attr: { r: 0 } },
              { attr: { r: part.rEnd }, duration: 0.75, ease: "none" },
              0,
            )
            .fromTo(
              part.image,
              {
                transformOrigin: "50% 50%",
                scale: 1,
                filter: "brightness(100%)",
              },
              { scale: 1.12, filter: "brightness(110%)", duration: 0.9 },
              0,
            )
            .fromTo(
              part.up,
              { yPercent: 120, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.6 },
              0.05,
            )
            .fromTo(
              part.down,
              { yPercent: -120, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.6 },
              0.05,
            )
            .fromTo(
              part.desc,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3 },
              0.35,
            )
            .fromTo(
              part.buttons,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3 },
              0.45,
            );
        }

        // 자리를 넘겨준 프로젝트는 빠르게 사라지고, 다시 차례가 오면 처음부터
        // 열리도록 마스크를 도로 닫아 둔다.
        function leave(part) {
          gsap.to(part.el, {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power1.out",
            onComplete: () => gsap.set(part.mask, { attr: { r: 0 } }),
          });
        }

        function goTo(index) {
          if (index === activeIndex) return;
          if (activeIndex >= 0) leave(parts[activeIndex]);
          enter(parts[index]);
          activeIndex = index;
        }

        goTo(0);

        const trigger = ScrollTrigger.create({
          trigger: track,
          start: "top top",
          // 프로젝트 하나당 화면 높이(100vh)만큼 스크롤한다.
          end: () => `+=${count * window.innerHeight}`,
          pin: true,
          anticipatePin: 1,
          // 스크롤을 멈추면 가장 가까운 프로젝트 자리로 붙는다(다음 프로젝트가
          // "딱" 넘어오는 느낌).
          snap: count > 1 ? 1 / (count - 1) : undefined,
          onUpdate(self) {
            goTo(Math.min(count - 1, Math.floor(self.progress * count)));
          },
        });

        return () => {
          trigger.kill();
          activeTween?.kill();
        };
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

      {afterLead}

      {/* 핀 트랙 — ScrollTrigger 가 이 통째를 화면에 고정해 두고, 스크롤
          진행도만큼 안의 카드(pfr-item)를 한 장씩 넘긴다. */}
      <div className="pfr-track" data-pfr-track>
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

                <div className="pfr-copy z-10">
                  <p className="pfr-desc" data-pfr-desc>
                    {card.descriptionLines.join("\n")}
                  </p>

                  {/* 카드(ProjectCard)와 같은 버튼 2개 — "10. Swipe Fill
                      Transitions"의 Wipe Left(~/Downloads/80button) 스타일. */}
                  <div className="pfr-buttons" data-pfr-buttons>
                    {(card.buttons ?? PROJECTS.buttons).map((label, idx) => {
                      const href = card.links?.[idx];
                      if (href) {
                        return (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pfr-swipe no-underline cursor-pointer"
                          >
                            {label}
                          </a>
                        );
                      }
                      return (
                        <span key={label} className="pfr-swipe">
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
