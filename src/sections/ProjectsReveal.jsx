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
 * ScrollTrigger 의 pin 으로 화면을 붙박고, 인덱스가 바뀔 때만 이전
 * 프로젝트를 끄고 다음 프로젝트를 켠다(교차 전환). snap 은 걸지 않는다 —
 * 스크롤을 멈춰도 GSAP 이 자리를 스스로 보정하며 화면이 저절로 더 넘어가는
 * 게 사용자에게는 "안 건드렸는데 넘어간다"로 보였다(요청으로 뺌).
 * 딱 스크롤한 만큼만 인덱스가 움직인다.
 *
 * [전환 방식 — 요청으로 원형 마스크(OnScrollFilter)를 걷어냈다]
 * 처음에는 마스크 서클이 열리는 연출이었는데, 참고 사이트 메인 화면과 똑같이
 * 해 달라는 요청을 받았다. 그 사이트 CSS(@keyframes bb3d-front/bb3d-back,
 * 소스 직접 확인)는 세로축(rotateX·아래에서 위로) 플립이었는데, 실제로 보이는
 * 텍스트는 아래가 아니라 양옆에서 생기고 사라진다는 재확인을 받아 축을
 * 가로(rotateY)로 바꿔 옮겼다 — 글자 하나하나가 Y축으로 접히듯 뒤집히며
 * 나타나고 사라진다. 왼쪽 줄(up)은 왼쪽에서, 오른쪽 줄(down)은 오른쪽에서
 * 들어오고, 나갈 때도 들어온 쪽으로 그대로 되접혀 빠진다("양옆에서 생기고
 * 사라진다"). 그래서:
 *   - 제목 두 줄의 글자를 한 자씩 <span data-pfr-char> 로 쪼개고, 각 글자를
 *     살짝 시차(stagger)를 두고 순서대로 뒤집는다 — 참고 사이트의
 *     --text-3d-rotate-delay 값과 같은 방식.
 *   - 썸네일은 위에서 살짝 내려오며(yPercent) 축소된 상태(scale 0.92)에서
 *     원래 크기로 커진다 — 마스크 없이 사각 프레임 그대로 드러난다.
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

// 기본 프레임 비율 — 갤러리 이미지가 세로형이라 5:7 로 잘라 넣는다.
// 카드가 reveal.frame 을 주면(가로형 시안 등) 그 비율을 대신 쓴다.
const FRAME = { w: 1000, h: 1400 };

// 캔버스별 적용 폭 — 1280(80rem)이 데스크톱/모바일 경계다(index.css 와 같은 값).
const MEDIA = {
  desktop: "(min-width: 80rem)",
  mobile: "(width < 80rem)",
};

// 제목을 한 글자씩 <span> 으로 쪼갠다 — 3D 플립을 글자 단위로 걸기 위함.
// 빈칸은 폭이 꺼지지 않도록 줄바꿈 없는 공백으로 바꾼다.
function splitChars(text) {
  return [...text].map((ch, i) => (
    <span className="pfr-char" data-pfr-char key={i}>
      {ch === " " ? " " : ch}
    </span>
  ));
}

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
        // querySelector 를 새로 하지 않는다. 제목 두 줄은 나오는/들어가는
        // 쪽(왼쪽·오른쪽)이 서로 반대라 글자 목록을 따로 모은다.
        const parts = items.map((item) => ({
          el: item,
          image: item.querySelector("[data-pfr-image]"),
          upChars: [...item.querySelectorAll("[data-pfr-up] [data-pfr-char]")],
          downChars: [
            ...item.querySelectorAll("[data-pfr-down] [data-pfr-char]"),
          ],
          desc: item.querySelector("[data-pfr-desc]"),
          buttons: item.querySelector("[data-pfr-buttons]"),
        }));

        // 시작은 전부 숨겨 둔다 — enter() 가 자기 차례에 연다.
        for (const part of parts) {
          gsap.set(part.el, { autoAlpha: 0 });
        }

        let activeIndex = -1;
        let activeTween = null;

        // 글자가 하나씩 시차를 두고 Y축으로 접히며 나타난다 — 왼쪽 줄(up)은
        // 왼쪽에서, 오른쪽 줄(down)은 오른쪽에서 온다("양옆에서 생기고
        // 사라진다", 요청 확인). 썸네일은 위에서 살짝 내려오며 커진다.
        // paused 로 만들어 둔다 — enter() 는 이걸 그대로 재생시키고, 첫
        // 컷은 아래 firstReveal 이 스크롤 진행도에 맞춰 이 타임라인의
        // progress() 를 직접 문지른다(scrub).
        function buildEnterTimeline(part) {
          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
          });

          tl.fromTo(
            part.image,
            { yPercent: -12, scale: 0.92, opacity: 0 },
            { yPercent: 0, scale: 1, opacity: 1, duration: 0.9 },
            0,
          );
          tl.fromTo(
            part.upChars,
            { rotateY: 80, xPercent: -70, opacity: 0 },
            {
              rotateY: 0,
              xPercent: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.025,
            },
            0.05,
          );
          tl.fromTo(
            part.downChars,
            { rotateY: -80, xPercent: 70, opacity: 0 },
            {
              rotateY: 0,
              xPercent: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.025,
            },
            0.05,
          );

          // 부연설명 — 스크램블 효과를 시도했다가(gabrielcontassot.com 참고)
          // 요청으로 뺐다. 다른 큰 텍스트(제목·버튼)와 같은 방식, 살짝
          // 아래에서 올라오며 옅게 나타나는 것으로 통일한다.
          tl.fromTo(
            part.desc,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 },
            0.4,
          );

          tl.fromTo(
            part.buttons,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 },
            0.5,
          );

          return tl;
        }

        function enter(part) {
          gsap.set(part.el, { autoAlpha: 1 });
          activeTween?.kill();
          activeTween = buildEnterTimeline(part).play();
        }

        // 자리를 넘겨준 프로젝트는 들어온 쪽으로 그대로 되접혀 빠진다
        // (up 은 왼쪽으로, down 은 오른쪽으로).
        function leave(part) {
          gsap
            .timeline({
              defaults: { ease: "power2.in" },
              onComplete: () => gsap.set(part.el, { autoAlpha: 0 }),
            })
            .to(
              part.upChars,
              { rotateY: 80, xPercent: -70, opacity: 0, duration: 0.3, stagger: 0.015 },
              0,
            )
            .to(
              part.downChars,
              { rotateY: -80, xPercent: 70, opacity: 0, duration: 0.3, stagger: 0.015 },
              0,
            )
            .to(part.image, { scale: 0.94, opacity: 0, duration: 0.3 }, 0)
            .to(part.desc, { opacity: 0, duration: 0.2 }, 0)
            .to(part.buttons, { opacity: 0, duration: 0.2 }, 0);
        }

        function goTo(index) {
          // 방어 — progress 가 0 미만/1 초과로 튀는 순간(레이아웃이 아직
          // 자리잡는 중일 때 등) index 가 범위를 벗어나면 parts[index] 가
          // undefined 라 여기서 조용히 죽는다. 그러면 activeIndex 가
          // 갱신되기 전에 멈춰서 화면 전체가 빈 채로 남는다 — 실제로 겪은
          // 버그라 범위를 여기서 한 번 더 못박는다.
          index = Math.max(0, Math.min(parts.length - 1, index));
          if (index === activeIndex) return;
          if (activeIndex >= 0) leave(parts[activeIndex]);
          enter(parts[index]);
          activeIndex = index;
        }

        // goTo(0) 을 마운트하자마자, 혹은 핀이 걸리자마자 부르지 않는다.
        // 전자는 사용자가 스크롤로 실제 들어오기도 전에 첫 컷이 이미 다
        // 열린 "정적인" 모습으로 기다리고 있게 되고, 후자는 트랙이 화면
        // 아래에서 올라오는 동안 안의 카드가 전부 숨은 채라 흰 배경만
        // 한참 보인다(둘 다 요청으로 확인된 문제).
        //
        // 첫 컷만은 고정 시간 애니메이션이 아니라 "이전 화면에서 스크롤
        // 내리는 동작 자체"에 반응해 열린다(요청) — 트랙이 화면 아래에서
        // 올라오기 시작하는 순간(top bottom)부터 화면 맨 위에 닿아 핀이
        // 걸리는 순간(top top)까지를 스크롤 진행도에 그대로 물려서
        // (scrub) buildEnterTimeline 을 문지른다. 빨리 내리면 빨리, 천천히
        // 내리면 천천히 열린다 — 나머지 컷의 "정해진 시간 동안 재생" 방식과
        // 다르다.
        const firstTl = buildEnterTimeline(parts[0]);
        gsap.set(parts[0].el, { autoAlpha: 1 });
        const firstReveal = ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => firstTl.progress(self.progress),
          // 핀이 걸리는 시점(=이 구간의 끝)에 다다르면 첫 컷은 이미 다
          // 열려 있는 상태다 — activeIndex 를 미리 0으로 못박아 둬서, 핀
          // 트리거의 onUpdate 가 다시 goTo(0) 을 불러 처음부터 재생하는
          // 일이 없게 한다(이미 열려 있는 걸 다시 접었다 펴는 게 됨).
          onLeave: () => {
            activeIndex = 0;
          },
        });

        const trigger = ScrollTrigger.create({
          trigger: track,
          start: "top top",
          // 프로젝트 하나당 화면 높이(100vh)만큼 스크롤한다.
          end: () => `+=${count * window.innerHeight}`,
          pin: true,
          anticipatePin: 1,
          // snap 을 걸었더니 스크롤을 멈추자마자 GSAP 이 스스로 다음/이전
          // 자리로 스크롤을 더 이어가서, 사용자가 손을 뗐는데도 화면이 저절로
          // 넘어가는 것처럼 보였다(요청으로 확인) — 자동 보정 없이 스크롤한
          // 만큼만 넘어가도록 뺐다.
          onUpdate(self) {
            if (!self.isActive) return;
            goTo(Math.floor(self.progress * count));
          },
        });

        return () => {
          firstReveal.kill();
          firstTl.kill();
          trigger.kill();
          activeTween?.kill();
        };
      },
    );

    return () => mm.revert();
  }, [variant]);

  // 요청으로 스크롤 컷의 4번째(ai-video-creator-2, 1번째와 같은 "AI Video
  // Creator" 항목) 를 뺐다 — 아래 2x2 카드(Projects.jsx)는 그대로 4개다.
  const cards = PROJECTS.cards.slice(0, 3);

  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!cards.length) return null;

  const total = String(cards.length).padStart(2, "0");

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
        {cards.map((card, index) => {
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
                  <div
                    className={`pfr-svg${wide ? " pfr-svg--wide" : ""}`}
                    style={{ "--pfr-frame": `${frame.w} / ${frame.h}` }}
                  >
                    <img
                      data-pfr-image
                      className="pfr-image"
                      src={shot.src}
                      alt={shot.alt}
                      onError={() =>
                        setFailed((prev) => ({ ...prev, [card.id]: true }))
                      }
                    />
                  </div>
                )}

                <h3 className="pfr-title">
                  <span className="pfr-line pfr-line--up">
                    <span data-pfr-up>{splitChars(card.titleLines[0])}</span>
                  </span>
                  <span className="pfr-line pfr-line--down">
                    <span data-pfr-down>
                      {splitChars(card.titleLines[1])}
                    </span>
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
