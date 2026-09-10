import { Suspense, lazy, useCallback, useState } from "react";
import IntroLoader from "./components/IntroLoader";
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
import ProjectsReveal from "./sections/ProjectsReveal";
import Skills from "./sections/Skills";
import MobilePage from "./sections/mobile/MobilePage";
import { du } from "./lib/design";
import useScrollReveal from "./lib/useScrollReveal";

// 연락 폼은 페이지 맨 아래에 있고 @emailjs/browser 와 reCAPTCHA 를 끌고 온다.
// 첫 화면을 그리는 데는 필요가 없어 따로 떼어 둔다 — 내려받기는 곧바로
// 시작되지만(첫 렌더에서 import 가 걸린다) 첫 화면 번들에는 들어가지 않는다.
// data-reveal 을 쓰지 않는 섹션이라 늦게 붙어도 등장 연출과 얽히지 않는다.
const ContactUs = lazy(() => import("./components/ContactUs"));


const MENU_ID = "mobile-menu";

// 데스크톱 캔버스 높이(피그마 Main Content 20:971)
// 갤러리 이동(354) + 제목~카드(218) + MY DESIGN 아래(606) 를 줄인 값에서,
// 푸터 높이(586.1 -> 250)와 MY SKILLS 높이(905 -> 785)를 줄인 만큼 뺐다.
// 이 값은 푸터 바닥(top 5947 + 높이)과 같아야 아래에 빈 자리가 안 남는다.
const CANVAS_H = 6077;
// 캔버스를 자르는 선. 위쪽 마지막 요소는 MY WORK EXPERIENCE(1968+557=2525),
// 아래쪽 첫 요소는 MY PROJECTS 제목(2773.36) 이라 그 사이는 비어 있다.
// 경력 표 바로 아래에서 자른다 — 더 내려 잡으면 연출 제목 앞에 빈 칸이 크게 생긴다.
const SPLIT_Y = 2560;

// 창 2 의 시작점. MY PROJECTS 2x2 카드 그리드가 원래 있던 자리(2773~3616)는
// 그 그리드를 지우면서(요청 — 안 쓰기로 했다) 통째로 빈 캔버스가 됐다.
// 창 2 를 그 빈 구간 뒤에서 시작하게 해서, 스크롤 연출 다음에 여백만 크게
// 남는 것을 막는다. 3616 은 카드가 있던 자리의 끝으로, 다음 섹션(Marquee,
// 3726)까지 110 의 여백이 남는다 — 그리드가 있던 때와 같은 값이다.
const WINDOW2_START = 3616;

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
      {/* 인트로 로딩 화면 — 다 받으면 걷히며 히어로 등장 신호를 보낸다. */}
      <IntroLoader />
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

          {/* MY PROJECTS 도입부 — 화면마다 마스크가 열리는 스크롤 연출.
              이미지 갤러리는 요청으로 그 들머리 제목("— MY projects") 다음,
              첫 컷 앞에 넣는다. 캔버스 절대 좌표가 아니라 흐름 요소다. */}
          <ProjectsReveal variant="desktop" afterLead={<Gallery />} />

          {/* 창 2 — 캔버스 WINDOW2_START ~ 끝. 안쪽 래퍼를 끌어올려 좌표계를
              유지한다(위 WINDOW2_START 주석 참조). */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: du(CANVAS_H - WINDOW2_START) }}
          >
            <div
              className="absolute inset-x-0"
              style={{ top: du(-WINDOW2_START), height: du(CANVAS_H) }}
            >
              <Marquee />
              <MyDesign />
              <Skills />
              <Footer />
            </div>
          </div>
        </div>
      </main>
      <Suspense fallback={null}>
        <ContactUs />
      </Suspense>
    </>
  );
}
