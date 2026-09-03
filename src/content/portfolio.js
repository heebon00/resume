/**
 * 포트폴리오 콘텐츠 — 데스크톱(1920) 레이아웃과 모바일(390) 레이아웃이 함께 쓴다.
 *
 * 여기 있는 문구·이미지는 전부 데스크톱 시안에서 읽어온 것이며 새로 만든 것이 없다.
 * 배치 좌표는 레이아웃마다 다르므로 각 섹션 파일이 따로 가진다.
 *
 * 참고: 피그마 모바일 아트보드(20:1794)는 테마 원본 영문 페이지라 데스크톱과
 * 내용이 전혀 다르다. 그래서 모바일도 아래 데스크톱 콘텐츠를 그대로 쓰고,
 * 배치만 모바일 시안의 관례(1단 스택 · 거터 20 · 섹션 여백 60)를 따른다.
 */

import aboutPortrait from "../assets/images/about-portrait.webp";
import portrait from "../assets/images/hero-portrait.webp";
import greenhouse from "../assets/images/gallery-greenhouse.webp";
import musicApp from "../assets/images/gallery-music-app.webp";
import webRedesign from "../assets/images/gallery-web-redesign.webp";
import ikeaMockup from "../assets/images/project-ikea-mockup.webp";
import youtubeMusicMockup from "../assets/images/project-youtube-music-mockup.png";
import darkBuilding from "../assets/images/design-dark-building.webp";
import dubaiSkyline from "../assets/images/design-dubai-skyline.webp";
import resort from "../assets/images/design-resort.webp";
import whiteCurve from "../assets/images/design-white-curve.webp";
// 임시 목업 — MY DESIGN 카드에 들어갈 실제 이미지가 정해지기 전까지 쓰는 자리표시 이미지다.
// 확정되면 아래 4개 import 와 DESIGN.cards 의 src·alt 를 실제 이미지로 되돌린다.
import designMock01 from "../assets/images/design-mock-01.svg";
import designMock02 from "../assets/images/design-mock-02.svg";
import designMock03 from "../assets/images/design-mock-03.svg";
import designMock04 from "../assets/images/design-mock-04.svg";
import afterEffects from "../assets/images/skill-after-effects.webp";
import blender from "../assets/images/skill-blender.webp";
import figmaLogo from "../assets/images/skill-figma.webp";
import gitLogo from "../assets/images/skill-git.webp";
import photoshop from "../assets/images/skill-photoshop.webp";
import premierePro from "../assets/images/skill-premiere-pro.webp";

export const IMAGES = {
  aboutPortrait,
  portrait,
  greenhouse,
  musicApp,
  webRedesign,
  darkBuilding,
  dubaiSkyline,
  resort,
  whiteCurve,
};

/* --- 이름 배너 (110:2 Header, 1920 x 186) -------------------------------- */
export const BANNER = {
  text: "MY NAME IS HEEBON",
  // 시안 110:4 "WebGL based transitions on scroll" 은 프레임(186) 밖 y=248 에 있어
  // 피그마 렌더에서도 잘려 보이지 않는다. 그래서 화면에 넣지 않았다.
};

/* --- 히어로 (76:195) ---------------------------------------------------- */
export const HERO = {
  labelLeft: "Creative",
  labelRight: "PORTFOLIO",
  greenLines: ["좋아하는 일은", "애정을,"],
  // 첫 줄 뒤의 공백 12칸은 시안(98:132)에 실제로 들어 있는 값이다.
  // 가운데 정렬이라 이 공백이 글자를 왼쪽으로 당기며, 빼면 위치가 어긋난다.
  redLines: ["맡은 임무는            ", "책임감을"],
  greenTag: "200%",
  redTag: "300%",
  script: "creative",
  portraitAlt: "흰 셔츠를 입고 서 있는 인물",
};

/* --- ABOUT ME (20:985 / 20:1010) ---------------------------------------- */
export const ABOUT = {
  barLeft: "About",
  barRight: "01",
  heading: "ABOUT ME",
  portraitAlt: "아이패드를 들고 있는 이희본",
  introLines: [
    "비전공자의 무기는 '편견 없는 흡수력'",
    "코드의 흐름을 읽는 남다른 감각 ",
    "처음 다루는 프로그램도 능숙하게",
    "새로운 프로그램을 두려워하지 않는 빠른 손",
  ],
  rows: [
    { label: "name", value: "이희본" },
    { label: "Birth", value: "이희본" },
    { label: "Contact", value: "이희본" },
    { label: "Certificate", value: "이희본" },
    { label: "Education", value: "이희본" },
  ],
};

/* --- MY WORK EXPERIENCE (20:1094) --------------------------------------- */
export const EXPERIENCE = {
  heading: "MY Work Experience",
  subheading: "Work Experience",
  rows: [
    { id: "exp-1", index: "2x", title: "FTA Best Interactivity", year: "2021" },
    { id: "exp-2", index: "2x", title: "FTA Best Interactivity", year: "2021" },
    { id: "exp-3", index: "2x", title: "FTA Best Interactivity", year: "2021" },
    { id: "exp-4", index: "2x", title: "FTA Best Interactivity", year: "2021" },
  ],
};

/* --- 이미지 갤러리 (20:1207) -------------------------------------------- */
export const GALLERY = [
  {
    id: "greenhouse",
    src: greenhouse,
    alt: "유리 온실 안 붉은 꽃길을 걷는 사람",
  },
  { id: "music-app", src: musicApp, alt: "음악 스트리밍 앱 화면" },
  {
    id: "web-redesign",
    src: webRedesign,
    alt: "가구 쇼핑몰 웹사이트 리디자인 화면",
  },
];

/* --- MY PROJECTS (20:1247) ---------------------------------------------- */
export const PROJECTS = {
  heading: "MY projects",
  // buttons[1] 은 기본값이고, 카드에 buttons 가 있으면 그 값을 쓴다.
  buttons: ["기획서보기", "사이트보기"],
  cards: [
    {
      id: "ai-video-creator-1",
      buttons: ["기획서보기", "영상보기"],
      links: [
        "https://drive.google.com/file/d/1lOaXJQSm5BFnryZTViqTN7kZ4bjPCQTH/view?usp=sharing",
        "https://drive.google.com/file/d/1FREewdt85zi60U4JFw8Cmyz6jBn3MmJF/view?usp=sharing",
      ],
      src: greenhouse,
      alt: "AI로 제작한 영상 속 유리 온실 장면",
      titleLines: ["AI Video Creator", "Editor & Director"],
      descriptionLines: [
        "2026 _ SOLO PROJECT",
        "작업 기간: 2주 (26.06.22~26.07.01)",
        "주요기술: Google Flow, PREMIERE PRO,",
        "                 AFTER EFFECTS",
        "기획의도: 26MSI in 대전 홍보영상 ",
      ],
    },
    {
      id: "ikea-website-redesign",
      src: webRedesign,
      alt: "iKEA 웹사이트 리디자인 화면",
      // 스크롤 연출 전용 이미지 — 피그마 136:282 (1200 x 800 가로형).
      // 카드 썸네일(src)은 시안 그대로 두고 연출 화면에서만 이걸 쓴다.
      reveal: {
        src: ikeaMockup,
        alt: "iKEA 리디자인 시안 — 데스크톱 · 태블릿 · 모바일 화면",
        frame: { w: 1200, h: 800 },
      },
      titleLines: ["iKEA Website", "Redesign"],
      // 실제 기업 상표·제품 사진이 들어간 학습용 리디자인이라, 해당 기업이 승인한
      // 작업으로 오해되지 않도록 카드에 고지를 함께 띄운다.
      notice:
        "비공식 컨셉 리디자인입니다. IKEA 와 무관하며 상표·이미지의 권리는 IKEA 에 있습니다.",
      descriptionLines: [
        "2026 _ TEAM PROJECT",
        "작업 기간: 4주 (26.07.15~26.08.15)",
        "주요기술:  Figma, HTML,  AI CLI, Tailwind CSS,등",
        "주역할: 팀장, 기획, 디자인, 기술 구현, 기획서 발표",
      ],
      links: [
        "https://drive.google.com/file/d/15sw527-_DG9N2a7QjPQ7kDxKGT97i8DN/view?usp=sharing",
        "https://heebon00.github.io/Team_Synergos_esg/",
      ],
    },
    {
      id: "youtube-music-redesign",
      src: musicApp,
      alt: "YouTube Music 리디자인 화면",
      // 스크롤 연출 전용 이미지 — 피그마 139:361 (1200 x 800 가로형), iKEA와 같은 방식.
      reveal: {
        src: youtubeMusicMockup,
        alt: "YouTube Music 리디자인 시안 — 모바일 화면",
        frame: { w: 1200, h: 800 },
      },
      titleLines: ["YOU TUBE MUSIC", "Redesign"],
      // 위 iKEA 카드와 같은 이유. 목업 안에 앨범 아트도 함께 들어 있어 권리자를
      // 한 곳으로 뭉뚱그리지 않고 "각 권리자" 로 적었다.
      notice:
        "비공식 컨셉 리디자인입니다. YouTube Music 과 무관하며 상표·이미지·앨범 아트의 권리는 각 권리자에게 있습니다.",
      descriptionLines: [
        "2026 _ SOLO PROJECT  (26.08.18~26.08.27)",
        "작업 기간: 2주",
        "주요기술:  Figma, REACT,  AI CLI, Tailwind CSS,등",
        "기획의도: 이용자 편리성을 극대화한 UX · UI 디자인 ",
      ],
      links: [
        "https://www.figma.com/proto/u6TqUveQz3qthryUClDCPY/youtube-music?node-id=48-512&p=f&viewport=271%2C348%2C0.03&t=QYlt75s80T8WN0PJ-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=48%3A512&page-id=0%3A1",
        "https://heebon00.github.io/yt_music/",
      ],
    },
    {
      id: "ai-video-creator-2",
      buttons: ["기획서보기", "영상보기"],
      links: [],
      src: greenhouse,
      alt: "AI로 제작한 영상 속 유리 온실 장면",
      titleLines: ["AI Video Creator", "Editor & Director"],
      descriptionLines: ["2026 ", ""],
    },
  ],
};

/* --- 키워드 마퀴 (20:1670) ---------------------------------------------- */
export const KEYWORD_ROWS = [
  [
    { label: "Branding" },
    { label: "Graphic Design" },
    { label: "Designer", fill: "crimson" },
    { label: "Video Production" },
  ],
  [
    { label: "Motion" },
    { label: "UI Design", fill: "lime" },
    { label: "Retouch" },
    { label: "UI Design" },
    { label: "Designer", fill: "lime" },
  ],
  [
    { label: "Director" },
    { label: "Print Design" },
    { label: "Video Editor", fill: "crimson" },
    { label: "Advertising" },
  ],
];

/* --- MY DESIGN (20:1295) ------------------------------------------------ */
export const DESIGN = {
  heading: "— MY Design",
  filters: ["222222", "22222", "22", "222", "22"],
  moreLabel: "See more",
  // 카드 1 위에 얹히는 제목·설명. 원래 들어 있던 문구는 테마 데모에서 딸려온
  // 것이라 지웠다(제목 "Modern Architecture", 설명은 미우치아 프라다 인용문).
  // 둘 다 비어 있으면 검정 오버레이째로 렌더링하지 않는다 — 빈 글상자가 남지
  // 않게 하려는 것이다. 본인 문구를 넣으면 그대로 다시 보인다.
  //   cardTitle  한 줄 제목
  //   cardLines  설명 3줄. 데스크톱은 세로로 세워 [2], [1], [0] 순으로 읽힌다.
  cardTitle: "",
  cardLines: [],
  // id 는 MyDesign.jsx 의 PLACEMENT(카드 위치·크롭) 키라서 그대로 둔다.
  cards: [
    { id: "dubai-skyline", src: designMock01, alt: "임시 목업 이미지 1" },
    { id: "dark-building", src: designMock02, alt: "임시 목업 이미지 2" },
    { id: "white-curve", src: designMock03, alt: "임시 목업 이미지 3" },
    { id: "resort", src: designMock04, alt: "임시 목업 이미지 4" },
  ],
};

/* --- MY SKILLS (20:1472) ------------------------------------------------- */
export const SKILLS = {
  heading: "— MY SKILLS",
  subtitle: "Selected tools from MY SKILLS",
  proficiencyLabel: "Proficiency",
  levelLabel: "Advanced",
  cards: [
    {
      id: "figma",
      name: "FIGMA",
      description: "UI/UX • Prototyping • Design Systems",
      logo: figmaLogo,
      percent: 95,
    },
    {
      id: "photoshop",
      name: "PHOTOSHOP",
      description: "Retouching • Compositing • Visual assets",
      logo: photoshop,
      percent: 93,
    },
    {
      id: "illustrator",
      name: "ILLUSTRATOR",
      description: "Vector graphics • Logo design • Typography",
      percent: 92,
      // 25:136 — 이미지가 아니라 그라디언트 사각형 + "Ai" 글자로 그려져 있다.
      markLabel: "Ai",
    },
    {
      id: "premiere-pro",
      name: "PREMIERE PRO",
      description: "Editing • Color grading • Sequencing",
      logo: premierePro,
      percent: 90,
    },
    {
      id: "after-effects",
      name: "AFTER EFFECTS",
      description: "Motion graphics • Compositing • Animation",
      logo: afterEffects,
      percent: 91,
    },
    {
      id: "git",
      name: "GIT",
      description: "Version control • Branching • Merging",
      logo: gitLogo,
      percent: 89,
    },
    {
      id: "ai-cli",
      name: "AI CLI",
      description: "Prompt engineering • Automation • Agents",
      logo: blender,
      percent: 94,
    },
  ],
};

/* --- 푸터 (20:1594) ------------------------------------------------------ */
export const FOOTER = {
  verticalTitle: "Contact",
  verticalLines: [
    "and collaborations, and I’m excited to",
    " I’m available for enquires",
  ],
  lead: "Please contact me",
  name: "이희본 (heebon LEE)",
  // 공개 배포에서 검색엔진에 노출되지 않도록 실제 연락처를 빼둔 상태다.
  // 다시 넣으려면 아래 두 값을 채우면 화면에도 그대로 다시 나온다.
  //   phone: "010.9272.6456"  /  email: "Heebon21@Gmail.com"
  phone: "",
  email: "",
  socials: ["Facebook", "Linkedin", "Instagram"],
};
