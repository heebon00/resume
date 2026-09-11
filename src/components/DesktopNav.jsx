import { useCallback, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { makeScramblePool } from "../lib/scramble";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";

/**
 * 데스크톱 GNB — 화면 맨 위에 항상 붙어 있는 전역 내비게이션.
 *
 * [디자인 근거에 대한 메모]
 * 시안에는 데스크톱 GNB 가 없다(모바일 시안 20:2492 의 헤더 바만 있다).
 * 요청으로 새로 만들되 없던 스타일을 지어내지 않고, 모바일 헤더 바의 규격을
 * 그대로 가져왔다 — 배경 #F6F6F6, 상하 여백 22.
 * 좌우 여백 75 는 히어로 상단 라벨(CREATIVE, 캔버스 left 75)에 맞춘 값이다.
 * 왼쪽 로고는 한 번 뺐다가, 요청으로 새 로고를 대신 넣었다. 그 로고는
 * 모바일 헤더와 함께 쓰므로 components/BrandMark.jsx 로 따로 나가 있다
 * (만든 방식·애니메이션 시점에 대한 설명도 그 파일에 있다).
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

/**
 * ScrambleTextPlugin 은 마우스를 처음 올리는 순간에 받는다.
 *
 * 전에는 이 파일 맨 위에서 정적으로 불러 첫 화면 번들에 함께 묶였다. 그런데
 * 이 플러그인이 하는 일은 GNB 항목에 마우스를 올렸을 때 글자를 뒤섞는 것뿐이라,
 * 첫 화면을 그리는 데는 필요가 없다. 마우스가 없는 기기(모바일·터치)에서는
 * 끝까지 한 번도 안 받는다.
 *
 * 약속을 변수에 담아 두므로 몇 번을 올려도 내려받기는 한 번뿐이다.
 */
let scramblePlugin = null;

function loadScramblePlugin() {
  scramblePlugin ??= import("gsap/ScrambleTextPlugin").then(
    ({ ScrambleTextPlugin }) => gsap.registerPlugin(ScrambleTextPlugin),
  );
  return scramblePlugin;
}

async function scrambleIn(event) {
  // currentTarget 은 이 함수가 한 번 반환되면 null 이 된다 — await 앞에서 꺼내 둔다.
  const el = event.currentTarget;
  const text = el.textContent;

  await loadScramblePlugin();

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

export default function DesktopNav() {
  const headerRef = useRef(null);

  // 바 높이를 :root 의 --gnb-h 로 알린다 — 고정 바에 가리면 안 되는 자리
  // (MY PROJECTS 컷의 위 여백, index.css .pfr)가 이 값을 쓴다. 바 높이는 로고
  // (BrandMark) 크기로 정해져서, 식으로 적어 두면 로고를 고칠 때마다 어긋난다.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    const root = document.documentElement;

    const update = () => {
      // 1280 미만에서는 바가 숨어 높이가 0 이다 — 값을 지워 CSS 기본값(0px)을 쓰게 한다.
      const height = header.getBoundingClientRect().height;
      if (height) root.style.setProperty("--gnb-h", `${height}px`);
      else root.style.removeProperty("--gnb-h");
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);

    return () => {
      observer.disconnect();
      root.style.removeProperty("--gnb-h");
    };
  }, []);

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
    <header
      ref={headerRef}
      className="fixed top-0 right-0 left-0 z-50 hidden bg-header xl:block"
    >
      <div className="flex w-full items-center justify-between px-75">
        <a
          href="#hero"
          onClick={(event) => scrollToSection(event, "#hero")}
          aria-label="HEEBON — 맨 위로"
          className="flex items-center py-16"
        >
          <BrandMark />
        </a>

        {/* 오른쪽 — 메뉴와 다크 모드 토글. 토글은 메뉴 끝에 붙인다(요청). */}
        <div className="flex items-center gap-32">
          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-40">
              {ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => scrollToSection(event, item.href)}
                    onMouseEnter={scrambleIn}
                    className="gnb-link block py-22 font-sans text-body leading-body font-medium tracking-wide text-ink uppercase"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle className="size-24" />
        </div>
      </div>
    </header>
  );
}
