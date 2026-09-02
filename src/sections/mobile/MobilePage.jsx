import MobileAbout from "./MobileAbout";
import MobileDesign from "./MobileDesign";
import MobileExperience from "./MobileExperience";
import MobileFooter from "./MobileFooter";
import MobileGallery from "./MobileGallery";
import MobileHero from "./MobileHero";
import MobileMarquee from "./MobileMarquee";
import MobileNameBanner from "./MobileNameBanner";
import MobileProjects from "./MobileProjects";
import MobileSkills from "./MobileSkills";
import ProjectsReveal from "../ProjectsReveal";

/**
 * 모바일(1280 미만) 페이지.
 *
 * 피그마 모바일 아트보드(20:1794)는 테마 원본 영문 페이지라 데스크톱과 내용이
 * 전혀 다르다. 그래서 문구·이미지는 데스크톱 시안 것을 그대로 쓰고,
 * 배치만 모바일 시안의 관례를 따랐다 — PRD 표기 기준으로 "디자인 기반 추정"이다.
 *   캔버스 390 / 좌우 거터 20 / 섹션 세로 여백 60
 *   타이포  소제목 24 · leading 40.32 (20:1839)  본문 15.5 · leading 22.99 (20:1853)
 * 데스크톱과 달리 절대 좌표가 아니라 일반 문서 흐름으로 쌓는다.
 *
 * MY PROJECTS 앞에는 데스크톱과 같은 마스크 연출(ProjectsReveal)이 들어간다.
 * 자리도 데스크톱과 같게 맞춘다 — 경력 다음, 갤러리 앞이다
 * (데스크톱 캔버스: Experience → 연출 → MY projects 제목 → 갤러리 → 카드).
 * 그 안의 스테이지가 position:sticky 라 바깥 overflow 는 hidden 이 아니라
 * x축 clip 이어야 한다(overflow:hidden 은 스크롤 컨테이너를 만들어 sticky 를 죽인다).
 */
export default function MobilePage() {
  return (
    <main className="mx-auto w-390 overflow-x-clip bg-paper">
      <MobileHero />
      <MobileNameBanner />
      <MobileAbout />
      <MobileExperience />
      <ProjectsReveal variant="mobile" />
      <MobileGallery />
      <MobileProjects />
      <MobileMarquee />
      <MobileDesign />
      <MobileSkills />
      <MobileFooter />
    </main>
  );
}
