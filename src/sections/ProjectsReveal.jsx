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
        const parts = items.map((item, index) => ({
          el: item,
          index,
          image: item.querySelector("[data-pfr-image]"),
          // 프레임(.pfr-svg, overflow:hidden) — 1번 카드는 요청으로 이
          // 박스 자체를 키웠다 줄인다(아래 buildEnterTimeline 참조). 안의
          // <img> 만 키우면 프레임 밖으로 나온 부분이 잘려서 "이미지 안에서
          // 확대"로 보인다 — 참고 사이트(treethemes brave 메인 사진)처럼
          // 사진 자체가 커 보이려면 프레임째로 키워야 한다.
          imageWrap: item.querySelector("[data-pfr-svg]"),
          upChars: [...item.querySelectorAll("[data-pfr-up] [data-pfr-char]")],
          downChars: [
            ...item.querySelectorAll("[data-pfr-down] [data-pfr-char]"),
          ],
          desc: item.querySelector("[data-pfr-desc]"),
          buttons: item.querySelector("[data-pfr-buttons]"),
        }));

        // 프레임째로 확대됐다 돌아오는 효과(아래 buildEnterTimeline 참조)를
        // 쓰는 카드 — 처음엔 1번만이었는데 요청으로 3번도 추가했다("이거
        // 너무 좋다"). 2번(iKEA)은 기존 그대로(단순 확대) 둔다.
        const ZOOM_FRAME_INDEXES = new Set([0, 2]);

        // 시작은 전부 숨겨 둔다 — enter() 가 자기 차례에 연다. 이미지·글자의
        // "닫힌" 모습(아래 buildEnterTimeline 의 fromTo 시작값과 같다)도
        // 여기서 한 번에 못박아 둔다 — 이유는 buildEnterTimeline 의
        // fromTo → to 전환 주석 참조(요청으로 발견한 "두 번째 이미지가
        // 튀는" 버그).
        for (const part of parts) {
          gsap.set(part.el, { autoAlpha: 0 });
          if (ZOOM_FRAME_INDEXES.has(part.index)) {
            // 프레임(imageWrap)이 스케일을 맡으므로 <img> 자신은 스케일
            // 없이 슬라이드·페이드만 가진다.
            gsap.set(part.image, { yPercent: -12, opacity: 0 });
            gsap.set(part.imageWrap, { scale: 0.92 });
          } else {
            gsap.set(part.image, { yPercent: -12, scale: 0.92, opacity: 0 });
          }
          gsap.set(part.upChars, { rotateY: 80, xPercent: -70, opacity: 0 });
          gsap.set(part.downChars, { rotateY: -80, xPercent: 70, opacity: 0 });
          gsap.set(part.desc, { y: 24, opacity: 0 });
          gsap.set(part.buttons, { y: 24, opacity: 0 });
        }

        let activeIndex = -1;

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

          // fromTo 였다가 to 로 바꿨다 — 이유(요청으로 찾은 버그):
          // fromTo 는 시작값을 강제로 못박아서, 직전 트윈이 자연스러운
          // 끝(leave 의 0.94/0, 혹은 다음 enter 의 1/1)까지 못 가고
          // 중간값에서 kill() 로 끊긴 채였다면(빠른 스크롤로 연달아
          // 지나칠 때 실제로 그랬다) 그 중간값에서 fromTo 의 고정
          // 시작값(scale 0.92 등)으로 "튕겨" 돌아간 뒤에야 다시 앞으로
          // 나아갔다 — 이게 "두 번째로 넘어갈 때 이미지가 튄다"던
          // 정체였다(계측: scale 이 0.9262 → 0.9124 → 0.9311 처럼 한
          // 프레임 역행했다 되돌아옴). to 는 "지금 값이 뭐든 거기서부터"
          // 목표로만 가므로 이런 역행이 없다. 대신 맨 처음(한 번도 연 적
          // 없는 최초 상태)의 시작 모습은 위 mount 시점 gsap.set 이
          // 대신 맡는다 — 여기 목표값과 그 set 값이 서로 짝이다.
          // 1·3번(AI Video Creator·YouTube Music, ZOOM_FRAME_INDEXES) 만
          // 요청으로 "이미지만 확대됐다 다시 돌아오는" 효과를 쓴다 — 참고:
          // treethemes brave 메인 사진처럼 사진 자체가 커 보여야 한다
          // (요청으로 정정 — 처음엔 <img> 만 키웠더니 프레임(.pfr-svg,
          // overflow:hidden)에 잘려 "이미지 안에서" 확대되는 걸로 보였다).
          // 그래서 스케일을 <img> 가 아니라 프레임(imageWrap)에 건다 —
          // 프레임째로 커지니 잘리지 않고 화면에서 실제로 사진이 커
          // 보인다. <img> 자신은 슬라이드·페이드(yPercent·opacity)만
          // 맡는다.
          // 처음 400%까지 키웠더니 너무 과했다(요청) — 참고 사이트의 실제
          // 폭은 은은한 정도라, 1.12배(12%)까지만 커졌다가(0~0.45) 원래
          // 크기로 돌아온다(0.45~0.95). 3번도 같은 효과가 좋다는 요청으로
          // 그대로 재사용한다. 2번(iKEA)은 기존 그대로(단순 확대).
          if (ZOOM_FRAME_INDEXES.has(part.index)) {
            tl.to(part.image, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, 0);
            tl.to(part.imageWrap, { scale: 1.12, duration: 0.45, ease: "power2.out" }, 0);
            tl.to(part.imageWrap, { scale: 1, duration: 0.5, ease: "power3.inOut" }, 0.45);
          } else {
            tl.to(part.image, { yPercent: 0, scale: 1, opacity: 1, duration: 0.9 }, 0);
          }
          tl.to(
            part.upChars,
            {
              rotateY: 0,
              xPercent: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.025,
            },
            0.05,
          );
          tl.to(
            part.downChars,
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
          tl.to(part.desc, { y: 0, opacity: 1, duration: 0.3 }, 0.4);

          tl.to(part.buttons, { y: 0, opacity: 1, duration: 0.3 }, 0.5);

          return tl;
        }

        // 빠르게 스크롤하면(예: 1번 → 2번 → 3번을 순식간에 지나칠 때)
        // 앞선 enter() 의 0.9초짜리 이미지 트윈이 채 안 끝났는데 곧바로
        // leave() 가 같은 이미지의 scale·opacity 를 다른 값으로 트윈하려
        // 든다 — 서로 다른 타임라인 인스턴스라 GSAP 이 자동으로 덮어쓰지
        // 않고 둘 다 매 프레임 값을 써서 이미지가 튀어 보였다(요청으로
        // 발견: "첫 번째에서 두 번째로 넘어갈 때 이미지가 튄다"). 그래서
        // part 마다 지금 돌고 있는 트윈을 기억해 두고, enter()·leave() 는
        // 항상 "이 part 를 마지막으로 건드린 트윈"부터 죽이고 시작한다 —
        // 어느 쪽이 먼저든 같은 part 에는 한 번에 트윈이 하나만 있다.
        function enter(part) {
          gsap.set(part.el, { autoAlpha: 1 });
          part.tween?.kill();
          part.tween = buildEnterTimeline(part).play();
        }

        // 자리를 넘겨준 프로젝트는 들어온 쪽으로 그대로 되접혀 빠진다
        // (up 은 왼쪽으로, down 은 오른쪽으로).
        function leave(part) {
          part.tween?.kill();
          part.tween = gsap
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
        // enter()/leave() 의 "part 마다 트윈 하나" 규칙에 이것도 포함시킨다
        // — 안 그러면 나중에 뒤로 스크롤해 0번으로 돌아왔을 때 enter(parts[0])
        // 가 이 firstTl 을 모르고 그냥 새 트윈을 얹어, 둘이 같은 이미지를
        // 동시에 건드리는 같은 문제가 재발한다.
        parts[0].tween = firstTl;
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
          for (const part of parts) part.tween?.kill();
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

          // 목업 왼쪽 패널 위에 버튼을 얹는 카드(요청) — 세 시안 모두 왼쪽에
          // 어두운 색 패널 + 흰 글자라 같은 방식이 그대로 통한다. 자리·폭·
          // 패널색은 시안마다 달라서 content/portfolio.js 의 panelButtons 에
          // 실측값으로 적어 두고, 여기서 CSS 변수로 넘긴다.
          // 데스크톱에서만 — 모바일 캔버스는 이미지가 화면 아래에 작게
          // 깔려서 얹을 자리가 없다.
          // 이미지를 못 받아오면 프레임 자체가 없으므로 원래 자리(설명 밑)로
          // 되돌린다 — 그래야 버튼이 통째로 사라지지 않는다.
          const panel =
            variant === "desktop" && !failed[card.id]
              ? shot.panelButtons
              : null;
          const onPanel = Boolean(panel);

          // 두 자리(설명 밑 / 목업 패널 위)가 같은 버튼을 쓴다 — 어디에
          // 놓든 링크·문구·스와이프 효과는 같고, 모양만 클래스로 갈린다.
          const buttonNodes = (card.buttons ?? PROJECTS.buttons).map(
            (label, idx) => {
              const href = card.links?.[idx];
              const className = `pfr-swipe${onPanel ? " pfr-swipe--panel" : ""}`;

              if (href) {
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${className} no-underline cursor-pointer`}
                  >
                    {label}
                  </a>
                );
              }
              return (
                <span key={label} className={className}>
                  {label}
                </span>
              );
            },
          );

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
                    data-pfr-svg
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

                    {onPanel && (
                      <div
                        className="pfr-buttons pfr-buttons--panel"
                        data-pfr-buttons
                        style={{
                          "--pfr-panel-left": panel.left,
                          "--pfr-panel-top": panel.top,
                          "--pfr-panel-ink": panel.ink,
                        }}
                      >
                        {buttonNodes}
                      </div>
                    )}
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
                  {/* 설명 — 요청(55.md 참고 이미지)으로 위아래 가로선을 두고
                      두 칸으로 나눠 표처럼 보여준다. 칸마다 굵은 소제목이
                      붙는다. descriptionGroups 가 없는 카드는 예전처럼 4줄을
                      그대로 흘린다. */}
                  {card.descriptionGroups ? (
                    <div className="pfr-desc pfr-desc--table" data-pfr-desc>
                      {card.descriptionGroups.map((group) => (
                        <div className="pfr-desc-col" key={group.label}>
                          <p className="pfr-desc-label">{group.label}</p>
                          {group.lines.map((line) => (
                            <p className="pfr-desc-line" key={line}>
                              {line}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="pfr-desc" data-pfr-desc>
                      {card.descriptionLines.join("\n")}
                    </p>
                  )}

                  {/* 카드(ProjectCard)와 같은 버튼 — "10. Swipe Fill
                      Transitions"의 Wipe Left(~/Downloads/80button) 스타일.
                      목업 패널 위로 옮긴 카드(onPanel)는 위 프레임 안에
                      이미 그렸으므로 여기서는 빼둔다 — data-pfr-buttons 가
                      한 카드에 둘이 되면 등장 애니메이션이 한쪽만 잡는다. */}
                  {!onPanel && (
                    <div className="pfr-buttons" data-pfr-buttons>
                      {buttonNodes}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
