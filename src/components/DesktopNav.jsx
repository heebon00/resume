import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { onIntroDone } from "../lib/intro";
import { makeScramblePool } from "../lib/scramble";

gsap.registerPlugin(ScrambleTextPlugin);

/**
 * 데스크톱 GNB — 화면 맨 위에 항상 붙어 있는 전역 내비게이션.
 *
 * [디자인 근거에 대한 메모]
 * 시안에는 데스크톱 GNB 가 없다(모바일 시안 20:2492 의 헤더 바만 있다).
 * 요청으로 새로 만들되 없던 스타일을 지어내지 않고, 모바일 헤더 바의 규격을
 * 그대로 가져왔다 — 배경 #F6F6F6, 상하 여백 22.
 * 좌우 여백 75 는 히어로 상단 라벨(CREATIVE, 캔버스 left 75)에 맞춘 값이다.
 * 왼쪽 로고는 한 번 뺐다가, 요청으로 새 로고("HEEBON" 글자 위아래에 점선이
 * 있는 이미지, 직접 확인)를 대신 넣었다. 이미지 그대로 쓰면 점이 낱개
 * 요소가 아니라서 "가운데부터 하나씩 퍼지며 나타나는" 효과(요청)를 걸 수
 * 없다 — 그래서 이미지를 참고만 하고, 점을 실제 DOM 요소(BrandDots)로
 * 다시 만들었다. 각 점의 등장 지연을 가운데 점에서부터의 거리에 비례하게
 * 줘서(아래 BrandDots), 가운데→양옆 순서로 점이 채워진다. 색은 이미지의
 * 크림슨(#D4183D, --color-tag-crimson)을 그대로 썼다. 뒤 배경(#505050)도
 * 요청으로 이미지에서 스포이트로 따서 brand-mark-bg 에 그대로 넣었다
 * (index.css).
 *
 * [애니메이션이 "안 되는" 것처럼 보였던 이유]
 * 처음엔 마운트되자마자 CSS 애니메이션(brand-dot-in)이 바로 돌게 해뒀다.
 * 그런데 이 컴포넌트는 인트로 로딩 화면(IntroLoader)이 화면을 덮고 있는
 * 동안에도 이미 마운트돼 있어서, 0.35초짜리 애니메이션이 로딩 화면 뒤에서
 * 이미 다 끝나버린다 — 로딩이 걷히고 나면 언제나 "이미 완성된" 정지 상태만
 * 보였다(요청으로 발견). 그래서 히어로(useIntroReveal)와 같은 방식으로,
 * lib/intro.js 의 INTRO_DONE 신호를 받은 뒤에야 brand-mark-ready 클래스를
 * 붙여 애니메이션을 시작한다.
 *
 * 캔버스 0 ~ 154 구간은 비어 있어서(히어로가 154 에서 시작한다) 바가 히어로의
 * CREATIVE / PORTFOLIO 라벨을 가리지 않는다.
 *
 * 항목은 요청으로 짧은 5개다. MY SKILLS 는 뺐고, 모바일 오버레이 메뉴는
 * 기존 6개를 그대로 쓴다(MobileMenu.jsx).
 * 링크가 가리키는 id 는 데스크톱 트리 쪽 — 접두사 없는 이름이다(lib/sectionIds.js).
 *
 * [앵커가 그냥은 안 맞는 이유]
 * 데스크톱 섹션은 크기가 없는 <section> 안에 내용이 절대 배치돼 있어서,
 * 브라우저 기본 앵커 이동은 섹션이 아니라 그 섹션을 담은 캔버스 창의 시작점으로
 * 간다(예: #projects 는 카드보다 2300 쯤 위). 그래서 클릭을 가로채
 * 실제 내용 상자([data-reveal], 없으면 섹션 자신)로 스크롤한다.
 *
 * [마우스 올리면 글자가 섞였다 맞춰지는 효과 — 요청, gabrielcontassot.com 참고]
 * 그 사이트 소스(hoisted.*.js)를 직접 받아 확인했다 — GSAP ScrambleTextPlugin을
 * 써서, hover 할 때 글자를 "그 단어 자신의 글자들"만으로 뒤섞은 뒤(완전히
 * 무작위 알파벳이 아니라 원래 글자만 도니 더 차분해 보인다) 원래 글자로
 * 되맞춰진다(duration 1 · ease expo.out · revealDelay 0.1). makeScramblePool 이
 * 그 뒤섞는 글자 풀을 만든다(원본의 Kf 함수와 같은 방식 — 단어 길이의
 * 2배만큼, 그 단어 글자 중에서 무작위로 뽑는다).
 */
const ITEMS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#design", label: "Design" },
  { href: "#contact", label: "Contact" },
];

function scrambleIn(event) {
  const el = event.currentTarget;
  const text = el.textContent;
  gsap.to(el, {
    duration: 1,
    ease: "expo.out",
    scrambleText: {
      text,
      chars: makeScramblePool(text),
      revealDelay: 0.1,
      speed: 1,
    },
  });
}

// 로고 위아래에 붙는 점선 한 줄 — 가운데 점이 가장 먼저, 바깥쪽으로
// 갈수록 늦게 나타난다(요청). 지연 시간을 가운데로부터의 거리에 정비례로
// 주는 것만으로 이 순서가 나온다 — 별도 타임라인·JS 라이브러리 없이
// CSS 애니메이션(brand-dot-in, index.css 참조)의 delay 만으로 처리한다.
const DOT_COUNT = 22;
const DOT_STEP = 0.025; // 점 하나당 지연 차이(초)

function BrandDots() {
  const mid = (DOT_COUNT - 1) / 2;
  return (
    <span className="brand-dots flex w-full justify-between" aria-hidden="true">
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <span
          key={i}
          className="brand-dot"
          style={{ animationDelay: `${Math.abs(i - mid) * DOT_STEP}s` }}
        />
      ))}
    </span>
  );
}

function BrandMark() {
  // 로딩 화면이 끝난 뒤에야 점 애니메이션을 시작한다 — 이유는 위 파일
  // 상단 코멘트 참조.
  const [ready, setReady] = useState(false);
  useEffect(() => onIntroDone(() => setReady(true)), []);

  return (
    <span
      className={`brand-mark-bg inline-flex flex-col items-center gap-4 px-24 py-14${
        ready ? " brand-mark-ready" : ""
      }`}
    >
      <BrandDots />
      <span className="brand-mark-text font-condensed font-extrabold tracking-wide uppercase">
        Heebon
      </span>
      <BrandDots />
    </span>
  );
}

export default function DesktopNav() {
  const scrollToSection = useCallback((event, href) => {
    const section = document.getElementById(href.slice(1));
    // 대상이 없으면(모바일 트리만 있는 경우 등) 브라우저 기본 동작에 맡긴다.
    if (!section) return;

    event.preventDefault();

    const target = section.querySelector("[data-reveal]") ?? section;
    const bar = event.currentTarget.closest("header");
    // 고정 바에 가리지 않도록 바 높이 + 약간의 여유만큼 위로 띄운다.
    const offset = (bar?.offsetHeight ?? 0) + 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    // 주소창의 해시는 맞춰 두되, 브라우저가 다시 점프하지 않도록 replace 로 바꾼다.
    window.history.replaceState(null, "", href);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 hidden bg-header xl:block">
      <div className="flex w-full items-center justify-between px-75">
        <a
          href="#hero"
          onClick={(event) => scrollToSection(event, "#hero")}
          aria-label="맨 위로"
          className="flex items-center py-15"
        >
          <BrandMark />
        </a>

        <nav aria-label="주요 메뉴">
          <ul className="flex items-center gap-40">
            {ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => scrollToSection(event, item.href)}
                  onMouseEnter={scrambleIn}
                  className="gnb-link block py-22 font-sans text-body leading-body font-medium tracking-wide text-black uppercase"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
