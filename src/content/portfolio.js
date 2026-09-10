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
import ikeaMockup from "../assets/images/project-ikea-mockup.webp";
import youtubeMusicMockup from "../assets/images/project-youtube-music-mockup.png";
import aiVideoMockup from "../assets/images/project-ai-video-mockup.webp";
// 임시 목업 — MY DESIGN 카드에 들어갈 실제 이미지가 정해지기 전까지 쓰는 자리표시 이미지다.
// 확정되면 아래 4개 import 와 DESIGN.cards 의 src·alt 를 실제 이미지로 되돌린다.
import designMock01 from "../assets/images/design-mock-01.svg";
import designMock02 from "../assets/images/design-mock-02.svg";
import designMock03 from "../assets/images/design-mock-03.svg";
import designMock04 from "../assets/images/design-mock-04.svg";
import afterEffects from "../assets/images/skill-after-effects.webp";
import figmaLogo from "../assets/images/skill-figma.webp";
// GitHub 공식 마크 — primer/octicons 의 mark-github-16.svg 에서 path 를 가져와
// 검정 바탕 · 흰 마크로 얹었다(다른 로고 타일과 톤 통일).
import githubLogo from "../assets/images/skill-github.svg";
// AI CLI — 상표가 없는 도구라 터미널 프롬프트 기호(>_)를 직접 그렸다.
import aiCliLogo from "../assets/images/skill-ai-cli.svg";
import photoshop from "../assets/images/skill-photoshop.webp";
import premierePro from "../assets/images/skill-premiere-pro.webp";

// MY DESIGN 용 design-*.webp 넉 장은 2026-09-08 삭제됐다 — import 만 돼 있고
// 화면에서는 임시 목업(designMock01~04)을 쓰고 있어서 참조를 함께 걷어냈다.
// 새 이미지를 넣을 때 여기 다시 추가하면 된다. docs/08_16_47.md 참조.
// 갤러리 띠가 프로젝트 목업으로 바뀌면서 안 쓰이게 된 이미지 둘은 참조와
// 파일을 함께 지웠다(요청). greenhouse 는 AI Video 카드 썸네일이 아직 쓰므로
// import 는 남기되, IMAGES.greenhouse 로 꺼내 쓴 곳은 원래 없어서 여기서는 뺐다.
export const IMAGES = {
  aboutPortrait,
  portrait,
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
  // 쉼표는 요청으로 뺐다 — 아래 줄("책임감을")과 끝맺음을 맞춘다.
  greenLines: ["좋아하는 일은", "애정을"],
  // 시안(98:132)에는 첫 줄 뒤에 공백 12칸이 들어 있지만 여기서는 뺐다 —
  // 카피 h1 은 text-right 인데, Letters 가 글자를 inline-block whitespace-pre
  // 로 쪼개므로 그 공백이 폭 95u 짜리 빈 박스로 남아 두 구간의 오른쪽
  // 정렬선을 139.5u 어긋나게 만들었다. docs/08_13_10.md 참조.
  redLines: ["맡은 임무는", "책임감을"],
  greenTag: "200%",
  redTag: "300%",
  // 히어로 밑단 버튼(요청) — 스크롤 연출에 나오는 것과 같은 .pfr-swipe 버튼이다.
  // href 가 비면 ProjectCard 와 같은 규칙으로 링크 없이 모양만 나온다.
  buttons: [
    // 이력서는 같은 저장소의 두 번째 페이지다(resume.html · vite.config.js 참조).
    { label: "RESUME", href: "/resume.html" },
    { label: "GITHUB", href: "https://github.com/heebon00" },
  ],
  script: "creative",
  portraitAlt: "흰 셔츠를 입고 서 있는 인물",
};

/* --- ABOUT ME (20:985 / 20:1010) ---------------------------------------- */
export const ABOUT = {
  barLeft: "About",
  barRight: "01",
  heading: "ABOUT ME",
  portraitAlt: "img_heebon",
  introLines: [
    "비전공자의 무기는 '편견 없는 흡수력'",
    "코드의 흐름을 읽는 남다른 감각 ",
    "처음 다루는 프로그램도 능숙하게",
    "새로운 프로그램을 두려워하지 않는 빠른 손",
  ],
  rows: [
    { label: "name", value: "이희본" },
    { label: "Birth", value: "88.02.21" },
    { label: "Contact", value: "010.9272.6456" },
    { label: "Certificate", value: "컴퓨터활용능력2급,정보처리기사\n1종보통운전면허" },
    // 라벨은 InfoRow 가 CSS(uppercase)로 대문자로 그린다 — 다른 행과 같은 방식이라
    // 데이터는 원래 대소문자로 둔다(스크린리더·검색엔진에는 그대로 읽힌다).
    {
      label: "Course completion",
      // 값 칸(InfoRow / MobileAbout)이 whitespace-pre-line 이라 아래 줄바꿈
      // 문자가 그대로 줄 나눔이 된다.
      value: "MBC 아카데미 AI웹콘텐츠 (영상&코딩)\n개발·기획자 교육 수료",
      // 모바일 전용 값(요청) — 칸 폭이 1920 의 3분의 1도 안 돼서 위 줄바꿈
      // 자리("(영상&코딩)" 뒤)가 엉뚱해진다. 여기서는 한 문장으로 두고 칸
      // 폭에 맞춰 저절로 접히게 한다. mobileValue 가 있는 행만 이렇게 되고,
      // 없는 행은 위 value 의 줄바꿈을 모바일에서도 그대로 지킨다
      // (예: Certificate 의 "1종보통운전면허"는 줄을 내려야 한다).
      mobileValue: "MBC 아카데미 AI웹콘텐츠 (영상&코딩) 개발·기획자 교육 수료",
    },
    { label: "Education", value: "선린대학교 경찰행정학과 (졸업)" },
  ],
};

/* --- MY WORK EXPERIENCE (20:1094) --------------------------------------- */
export const EXPERIENCE = {
  heading: "MY Work Experience",
  subheading: "Work Experience",
  // 구분선 오른쪽 끝의 섹션 번호 — ABOUT 의 barLeft/barRight 와 같은 방식이다
  // (요청 "어바웃 칸처럼"). 비우면 그 자리는 렌더링하지 않는다.
  barRight: "02",
  rows: [
    { id: "exp-1", index: "", title: "경주시청 기획예산과(청년인턴)", year: "2009~2009" },
    { id: "exp-2", index: "", title: "국민연금(청년인턴)", year: "2011~2012" },
    { id: "exp-3", index: "", title: "재능교육 경주지국 (CS)", year: "2015~2016" },
    { id: "exp-4", index: "", title: "경주시청 (기간제)", year: "2017~2021" },
    { id: "exp-5", index: "", title: "메가스터디 잇츠 리얼 타임 스터디카페 (선임 서포터즈)", year: "2023~2025" },
  ],
};

/* --- 이미지 갤러리 (20:1207) -------------------------------------------- */
// 요청으로 세 컷을 프로젝트 목업 3종으로 바꿨다 — 아래 스크롤 연출에 나오는
// 것과 같은 이미지라, 흐르는 띠가 그 예고편처럼 읽힌다.
// 셋 다 가로형(2:1 언저리)이라 Gallery.jsx 의 상자도 가로로 바꿔 크기를
// 하나로 통일했다.
export const GALLERY = [
  {
    id: "ai-video",
    src: aiVideoMockup,
    alt: "AI Video Creator 목업 화면",
  },
  { id: "ikea", src: ikeaMockup, alt: "iKEA 리디자인 목업 화면" },
  {
    id: "youtube-music",
    src: youtubeMusicMockup,
    alt: "YouTube Music 리디자인 목업 화면",
  },
];

/* --- MY PROJECTS (20:1247) ---------------------------------------------- */
export const PROJECTS = {
  heading: "MY projects",
  // 카드에 buttons 가 있으면 그 값을 쓰고, 없으면 이 기본값을 쓴다.
  // links 는 buttons 와 같은 순서로 짝지어진다.
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
      // 스크롤 연출 전용 이미지 — iKEA·유튜브뮤직 카드와 같은 방식(요청).
      // 카드 썸네일(src)은 그대로 두고 연출 화면에서만 이걸 쓴다.
      reveal: {
        src: aiVideoMockup,
        alt: "AI Video Creator 맥 목업 화면",
        frame: { w: 2207, h: 1080 },
        // 목업 왼쪽 패널 실측 — 패널 0~39.74%, 글자 끝 y 55.93%, 패널색 #6F0F08.
        panelButtons: {
          // 요청으로 "패널 한가운데"가 아니라 "위 글자 블록의 한가운데"에
          // 맞춘다 — 글자가 x 200~711 이라 가운데가 455.5/2207 = 20.64% 다.
          // 거기서 버튼 폭 118u 의 절반을 뺀다.
          left: "calc(20.64% - 59 * var(--u))",
          // 글자 끝(55.93%)과 밑(100%)의 한가운데에서 묶음 높이의 절반을 뺀다.
          // 여기는 버튼이 둘이라 묶음이 28*2 + 6 = 62u -> 절반 31u.
          top: "calc(77.97% - 31 * var(--u))",
          ink: "#6f0f08",
        },
      },
      titleLines: ["AI Video Creator", "Editor & Director"],
      descriptionLines: [
        "2026 _ SOLO PROJECT",
        "작업 기간: 2주 (26.06.18~26.07.01)",
        "주요 기술: Google Flow, PREMIERE PRO, AFTER EFFECTS",
        "기획 의도: League of Legends 2026 MSI in 대전 홍보영상 ",
      ],
      // 스크롤 연출의 설명은 위 4줄을 두 칸으로 나눠 표처럼 보여준다
      // (요청 · 55.md 의 참고 이미지 — 위아래 가로선 + 2열 + 가운데 세로선).
      // 2x2 카드 그리드(Projects.jsx)는 위 descriptionLines 를 그대로 쓴다.
      descriptionGroups: [
        {
          label: "TYPE / TERM",
          lines: ["2026 _ SOLO PROJECT", "작업 기간: 2주 (26.06.18~26.07.01)"],
        },
        {
          label: "STACK / INTENT",
          lines: [
            "주요 기술: Google Flow, PREMIERE PRO, AFTER EFFECTS",
            "기획 의도: League of Legends 2026 MSI in 대전 홍보영상",
          ],
        },
      ],
    },
    {
      id: "ikea-website-redesign",
      // 요청으로 카드 썸네일도 스크롤 연출과 같은 새 목업으로 바꿨다.
      src: ikeaMockup,
      alt: "iKEA 웹사이트 리디자인 화면",
      // 스크롤 연출 전용 이미지 — 요청으로 새 목업(2133 x 1080 가로형)으로
      // 교체했다. 왼쪽 분홍 패널에 제목과 "사이트 보기" 버튼이 그림으로
      // 박혀 있는 시안이라, 실제 버튼 3개를 그 자리에 얹는다(panelButtons).
      // 카드 썸네일(src)은 시안 그대로 둔다.
      reveal: {
        src: ikeaMockup,
        alt: "iKEA 리디자인 시안 — 데스크톱 · 모바일 화면",
        frame: { w: 2133, h: 1080 },
        // 목업 갱신본 실측 — 패널 0~30.52%(색 #770A25)는 그대로인데 글자가
        // 위로 올라갔다: 끝나는 높이 58.0% -> 46.30%.
        panelButtons: {
          // AI Video 와 같이 "위 글자 블록의 한가운데"에 맞춘다 — 글자가
          // x 104~469 라 가운데가 286.5/2133 = 13.43% 다. 거기서 버튼 폭
          // 118u 의 절반을 뺀다.
          left: "calc(13.43% - 59 * var(--u))",
          // 글자 끝(46.30%)과 밑(100%)의 한가운데에서 묶음 높이의 절반을 뺀다.
          // 버튼 셋이라 묶음이 28*3 + 6*2 = 96u -> 절반 48u.
          top: "calc(73.15% - 48 * var(--u))",
          ink: "#770a25",
        },
      },
      titleLines: ["iKEA Website", "Redesign"],
      descriptionLines: [
        "2026 _ TEAM PROJECT",
        "작업 기간: 4주 (26.07.15~26.08.15)",
        "주요 기술:  Figma, HTML,  AI CLI, Tailwind CSS 등",
        "주 역할: 팀장, 기획, 디자인, 기술 구현, 기획서 발표",
      ],
      descriptionGroups: [
        {
          label: "TYPE / TERM",
          lines: ["2026 _ TEAM PROJECT", "작업 기간: 4주 (26.07.15~26.08.15)"],
        },
        {
          label: "STACK / ROLE",
          lines: [
            "주요 기술: Figma, HTML, AI CLI, Tailwind CSS 등",
            "주 역할: 팀장, 기획, 디자인, 기술 구현, 기획서 발표",
          ],
        },
      ],
      buttons: ["기획서보기", "깃허브보기", "사이트보기"],
      links: [
        "https://drive.google.com/file/d/15sw527-_DG9N2a7QjPQ7kDxKGT97i8DN/view?usp=sharing",
        "https://github.com/heebon00/Team_Synergos_esg",
        "https://heebon00.github.io/Team_Synergos_esg/",
      ],
    },
    {
      id: "youtube-music-redesign",
      // 요청으로 카드 썸네일도 스크롤 연출과 같은 새 목업(피그마 6:1229)으로
      // 바꿨다.
      src: youtubeMusicMockup,
      alt: "YouTube Music 리디자인 화면",
      // 스크롤 연출 전용 이미지 — 피그마 6:1229, iKEA와 같은 방식.
      // frame 은 원본 실제 크기(1555 x 1080)로 둔다 — 어림값 1200x800 이면
      // 비율이 안 맞아 cover 가 위아래를 4% 쯤 잘라낸다.
      reveal: {
        src: youtubeMusicMockup,
        alt: "YouTube Music 리디자인 시안 — 모바일 화면",
        frame: { w: 1555, h: 1080 },
        // 목업 왼쪽 패널 실측 — 패널 0~40.32%, 글자 끝 y 54.44%, 패널색 #460112.
        panelButtons: {
          left: "calc(20.16% - 59 * var(--u))", // 패널 가운데 40.32/2
          // 글자 끝 54.44% ~ 밑 100% 의 한가운데, 버튼 셋(절반 48u).
          top: "calc(77.22% - 48 * var(--u))",
          ink: "#460112",
        },
      },
      titleLines: ["YOU TUBE MUSIC", "Redesign"],
      descriptionLines: [
        "2026 _ SOLO PROJECT",
        "작업 기간: 2주 (26.08.18~26.08.27)",
        "주요 기술:  Figma, REACT,  AI CLI, Tailwind CSS,등",
        "기획 의도: 이용자 편리성을 극대화한 UX · UI 디자인 ",
      ],
      descriptionGroups: [
        {
          label: "TYPE / TERM",
          lines: ["2026 _ SOLO PROJECT", "작업 기간: 2주 (26.08.18~26.08.27)"],
        },
        {
          label: "STACK / INTENT",
          lines: [
            "주요 기술: Figma, REACT, AI CLI, Tailwind CSS 등",
            "기획 의도: 이용자 편리성을 극대화한 UX · UI 디자인",
          ],
        },
      ],
      buttons: ["기획서보기", "깃허브보기", "사이트보기"],
      links: [
        "https://www.figma.com/proto/u6TqUveQz3qthryUClDCPY/youtube-music?node-id=48-512&p=f&viewport=271%2C348%2C0.03&t=QYlt75s80T8WN0PJ-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=48%3A512&page-id=0%3A1",
        "https://github.com/heebon00/yt_music",
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
  filters: ["222222", "22222", "22"],
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
      // 요청으로 GIT -> GITHUB. 예전 그림은 어두운 배경의 "git ->" 워드마크라
      // 실제 깃허브 로고가 아니었고, 이름·설명도 Git(버전관리 도구) 기준이라
      // 로고와 어긋났다. 셋을 GitHub 기준으로 맞춘다.
      id: "github",
      name: "GITHUB",
      description: "Repositories • Pull requests • Collaboration",
      logo: githubLogo,
      percent: 92,
    },
    {
      id: "ai-cli",
      name: "AI CLI",
      description: "Prompt engineering • Automation • Agents",
      percent: 94,
      // 예전에는 그라디언트 사각형에 밑줄 한 글자(markLabel "_")만 넣었는데
      // 의미가 안 읽힌다는 요청으로, CLI 를 나타내는 보편적 기호인 터미널
      // 프롬프트(>_)를 직접 그려 넣었다. GitHub 타일과 같은 검정 바탕·흰 그림이다.
      // (그 전에는 AI CLI 와 무관한 Blender 3D 툴 로고가 붙어 있었다)
      logo: aiCliLogo,
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
  ],
};

/* --- 푸터 (20:1594) ------------------------------------------------------ */
export const FOOTER = {
  verticalTitle: "Contact",
  // 세로 텍스트 두 줄은 테마 데모에서 딸려온 영문이라 지웠다.
  // (문장이 중간에서 잘린 채 순서가 뒤집혀 있었고 "enquires" 오타도 있었다)
  // 비어 있으면 렌더링하지 않는다. 본인 문구를 넣으면 그대로 다시 보인다.
  //   [0] 아래쪽 줄, [1] 위쪽 줄 (데스크톱은 세로로 세워 그린다)
  verticalLines: [],
  lead: "Please contact me",
  name: "이희본 (heebon LEE)",
  // 비워 두면 그 줄은 화면에 안 나온다(Footer.jsx / MobileFooter.jsx).
  phone: "010.9272.6456",
  email: "Heebon21@Gmail.com",
  // 요청으로 비웠다 — 시안에서 딸려온 항목이고 이동 대상도 없었다.
  // 데스크톱·모바일 푸터 모두 비면 목록을 통째로 감춘다(hidden 처리).
  // 다시 넣으려면 문자열을 채우면 그대로 보인다.
  socials: [],
  // 제3자 저작물 고지 — 내역을 화면에 늘어놓는 대신 링크 한 줄만 둔다.
  // 실제 목록(코드·폰트·상표)은 저장소의 LICENSE-THIRD-PARTY.md 에 있고,
  // 저장소가 공개라 깃허브에서 그대로 읽힌다.
  credits: {
    label: "Third-party notices",
    href: "https://github.com/heebon00/resume/blob/main/LICENSE-THIRD-PARTY.md",
  },
};
