import { useCallback } from "react";

/**
 * 데스크톱 GNB — 화면 맨 위에 항상 붙어 있는 전역 내비게이션.
 *
 * [디자인 근거에 대한 메모]
 * 시안에는 데스크톱 GNB 가 없다(모바일 시안 20:2492 의 헤더 바만 있다).
 * 요청으로 새로 만들되 없던 스타일을 지어내지 않고, 모바일 헤더 바의 규격을
 * 그대로 가져왔다 — 배경 #F6F6F6, 상하 여백 22.
 * 좌우 여백 75 는 히어로 상단 라벨(CREATIVE, 캔버스 left 75)에 맞춘 값이다.
 * 왼쪽 로고는 본인 것이 아니라는 요청으로 뺐고, 항목만 오른쪽에 둔다.
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
 */
const ITEMS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#design", label: "Design" },
  { href: "#contact", label: "Contact" },
];

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
      <div className="flex w-full items-center justify-end px-75">
        <nav aria-label="주요 메뉴">
          <ul className="flex items-center gap-40">
            {ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => scrollToSection(event, item.href)}
                  data-cursor="explore"
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
