import { useCallback, useState } from "react";
import CustomCursor from "./components/CustomCursor";
import DesktopNav from "./components/DesktopNav";
import MobileHeader from "./components/MobileHeader";
import MobileMenu from "./components/MobileMenu";
import AboutMe from "./sections/AboutMe";
import Experience from "./sections/Experience";
import Footer from "./sections/Footer";
import Gallery from "./sections/Gallery";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import NameBanner from "./sections/NameBanner";
import MyDesign from "./sections/MyDesign";
import Projects from "./sections/Projects";
import ProjectsReveal from "./sections/ProjectsReveal";
import Skills from "./sections/Skills";
import MobilePage from "./sections/mobile/MobilePage";
import { du } from "./lib/design";
import useScrollReveal from "./lib/useScrollReveal";

const MENU_ID = "mobile-menu";

// 데스크톱 캔버스 높이(피그마 Main Content 20:971)
const CANVAS_H = 7711;
// 캔버스를 자르는 선. 위쪽 마지막 요소는 MY WORK EXPERIENCE(1968+557=2525),
// 아래쪽 첫 요소는 MY PROJECTS 제목(2773.36) 이라 그 사이는 비어 있다.
// 경력 표 바로 아래에서 자른다 — 더 내려 잡으면 연출 제목 앞에 빈 칸이 크게 생긴다.
const SPLIT_Y = 2560;

/**
 * 원페이지 포트폴리오.
 *
 * 시안(WordPress 테마 export)의 각 섹션이 서로 겹치는 절대 좌표로 배치돼 있어,
 * 페이지 전체를 하나의 캔버스로 두고 각 섹션을 그 위에 절대 배치한다.
 *   캔버스 높이 = 피그마 Main Content 20:971 (7711)
 *   캔버스 좌표 = Sections Wrapper 좌표 - 97 (히어로 "co" 프레임의 x 오프셋)
 * 폭은 --u 단위라 화면이 좁아져도 시안 비율 그대로 축소된다.
 *
 * 1280 미만은 모바일 캔버스(390), 이상은 데스크톱 캔버스를 쓴다.
 *
 * 캔버스는 MY PROJECTS 바로 앞(SPLIT_Y)에서 두 창으로 나뉘고, 그 사이에
 * 스크롤 연출 화면(ProjectsReveal)이 일반 흐름으로 들어간다. 각 창 안쪽 래퍼가
 * 원래 캔버스 좌표계를 그대로 유지하므로 섹션들의 좌표는 손대지 않는다.
 *
 * 화면 맨 위에는 GNB 를 둔다 — 1280 이상은 DesktopNav, 미만은 MobileHeader.
 *
 * JS 동작 — 모바일 오버레이 메뉴, 키워드 마퀴 흐름(CSS), 스크롤 등장,
 * 커스텀 커서, MY PROJECTS 도입부 마스크 연출(gsap + ScrollTrigger).
 */
export default function App() {
  useScrollReveal();

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // 메뉴가 열려 있으면 뒤 페이지를 inert 로 막아 키보드 포커스와
  // 보조기기 탐색이 오버레이 밖으로 새지 않게 한다.
  const behindMenu = menuOpen ? { inert: "" } : {};

  return (
    <>
      <CustomCursor />
      {/* 데스크톱 GNB — 모바일(1280 미만)에서는 아래 MobileHeader 가 대신 뜬다. */}
      <DesktopNav />
      <MobileHeader open={menuOpen} onToggle={toggleMenu} menuId={MENU_ID} />
      <MobileMenu open={menuOpen} onClose={closeMenu} menuId={MENU_ID} />

      {/* 두 레이아웃 트리가 항상 DOM 에 함께 있고 CSS 로만 한쪽이 숨는다.
          <main> 은 문서에 하나여야 하므로 landmark 는 여기 한 번만 둔다 —
          안쪽 두 래퍼는 div 다. 중복 id 를 피하는 방법은 lib/sectionIds.js 참조. */}
      <main {...behindMenu}>
        {/* 1280 미만 — 모바일 캔버스(390, 640px 상한 · 가운데 정렬). index.css 참조. */}
        <div className="xl:hidden">
          <MobilePage />
        </div>

        {/* 1280 이상 — 데스크톱 캔버스(1920 비율 축소) */}
        <div className="relative hidden w-full xl:block">
          {/* 창 1 — 캔버스 0 ~ SPLIT_Y */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: du(SPLIT_Y) }}
          >
            <div
              className="absolute inset-x-0 top-0"
              style={{ height: du(CANVAS_H) }}
            >
              <NameBanner />
              <Hero />
              <AboutMe />
              <Experience />
            </div>
          </div>

          {/* MY PROJECTS 도입부 — 화면마다 마스크가 열리는 스크롤 연출 */}
          <ProjectsReveal variant="desktop" />

          {/* 창 2 — 캔버스 SPLIT_Y ~ 끝. 안쪽 래퍼를 끌어올려 좌표계를 유지한다. */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: du(CANVAS_H - SPLIT_Y) }}
          >
            <div
              className="absolute inset-x-0"
              style={{ top: du(-SPLIT_Y), height: du(CANVAS_H) }}
            >
              <Gallery />
              <Projects />
              <Marquee />
              <MyDesign />
              <Skills />
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
