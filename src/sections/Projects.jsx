import ProjectCard from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import { box } from "../lib/design";
import { PROJECTS } from "../content/portfolio";

/**
 * MY PROJECTS — 피그마 20:1247 "Process Section" (섹션 x=-4, y=3378)
 *   20:1249 div.row  캔버스 left 370, top 3408, 1246 x 780
 * 아래 카드 좌표는 모두 div.row 기준이다.
 *   제목은 20:1250 으로 분리돼 캔버스 (353.98, 2773.36) 에 따로 놓인다.
 *   카드 1 (20:1252, y 119.36)  썸네일 30.96 / 150.03, 제목 209.98 / 150.36,
 *                               설명 210 / 227, 버튼 201.73 / 361.36
 *   카드 2 (20:1266, y 111.36)  썸네일 655.98 / 141.36, 제목 832.98 / 142.36,
 *                               설명 832.98 / 221, 버튼 833 / 342 (29:65)
 *   카드 3 (20:1274, y 421.36)  썸네일 655 / 429 (29:1271), 제목 832.98 / 452.36,
 *                               설명 832.98 / 548.36, 버튼 828 / 654 (29:70)
 *   카드 4 (20:1282, y 437.36)  썸네일 28 / 452, 제목 210 / 468,
 *                               설명 210 / 564.36, 버튼 205.98 / 662.36 (20:1290)
 * 썸네일은 갤러리와 같은 원본 이미지를 그대로 재사용한다(시안에서 동일 파일).
 */

// 카드 배치 좌표(div.row 기준) — 내용은 content/portfolio.js 를 쓴다.
const PLACEMENT = {
  "ai-video-creator-1": {
    image: { left: 30.959, top: 150.03, width: 144, height: 256 },
    title: { left: 209.979, top: 150.36 },
    description: {
      left: 210,
      top: 227,
      className: "text-body font-medium text-muted",
    },
    buttons: { left: 201.729, top: 361.36 },
  },
  "ikea-website-redesign": {
    image: {
      left: 655.98,
      top: 141.36,
      width: 141,
      height: 259,
      objectClassName: "object-top",
    },
    title: { left: 832.98, top: 142.36 },
    description: {
      left: 832.98,
      top: 221,
      className: "text-body font-medium text-muted",
    },
    // 버튼 left — 요청으로 카드 3(같은 열, 같은 텍스트 left 832.98)과 동일하게
    // 맞췄다(원래는 833으로, 텍스트와 거의 어긋남 없이 붙어 있었음).
    // 버튼 top — 같은 줄(카드 1)과 높이가 안 맞아(342 vs 361.36) 버튼이 더 위에
    // 떠 보이던 문제를 요청으로 고쳤다. 카드 1과 동일하게 맞춤.
    buttons: { left: 828, top: 361.36 },
  },
  "youtube-music-redesign": {
    image: { left: 655, top: 429, width: 142, height: 284 },
    title: { left: 832.98, top: 452.36 },
    description: {
      left: 832.98,
      top: 548.36,
      // 요청으로 카드 1·2와 같은 설명 텍스트 스타일로 통일(원래는 13.3px 회색).
      className: "text-body font-medium text-muted",
    },
    // 버튼 top — 같은 줄(카드 4)과 높이가 안 맞아(654 vs 662.36) 버튼이 더 위에
    // 떠 보이던 문제를 요청으로 고쳤다. 카드 4와 동일하게 맞춤.
    buttons: { left: 828, top: 662.36 },
  },
  "ai-video-creator-2": {
    image: { left: 27.999, top: 452, width: 144, height: 256 },
    title: { left: 210, top: 468 },
    description: {
      left: 210,
      top: 564.36,
      // 요청으로 나머지 카드와 같은 설명 텍스트 스타일로 통일(원래는 13.3px 회색).
      className: "text-body font-medium text-muted",
    },
    buttons: { left: 205.98, top: 662.36 },
  },
};

const CARDS = PROJECTS.cards.map((card) => {
  const place = PLACEMENT[card.id];
  return {
    id: card.id,
    image: { ...place.image, src: card.src, alt: card.alt },
    title: { ...place.title, lines: card.titleLines },
    // 설명 자리 — descriptionImage 가 있으면 텍스트 대신 이미지를 그 자리에 넣는다.
    description: card.descriptionImage
      ? undefined
      : { ...place.description, lines: card.descriptionLines },
    descriptionImage: card.descriptionImage
      ? {
          left: place.description.left,
          top: place.description.top,
          ...card.descriptionImage,
        }
      : undefined,
    buttons: place.buttons,
    buttonLabels: card.buttons ?? PROJECTS.buttons,
    buttonLinks: card.links ?? [],
  };
});

export default function Projects() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!CARDS.length) return null;

  return (
    <section id="projects" aria-label="MY PROJECTS">
      {/* 20:1250 제목 — 시안에서 카드와 분리돼 Sections Wrapper 직계로 올라갔다.
          캔버스 (328 + 25.98, 2749 + 24.36) = (353.98, 2773.36) */}
      <div
        className="absolute flex flex-col justify-center"
        data-reveal
        style={box({ left: 353.98, top: 2773.36, width: 855, height: 63 })}
      >
        <SectionHeading as="h2">{PROJECTS.heading}</SectionHeading>
      </div>

      <div
        className="absolute"
        data-reveal
        style={box({ left: 370, top: 3408, width: 1246, height: 780 })}
      >
        {CARDS.map((card) => (
          <ProjectCard
            key={card.id}
            image={card.image}
            title={card.title}
            description={card.description}
            descriptionImage={card.descriptionImage}
            buttons={card.buttons}
            buttonLabels={card.buttonLabels}
            buttonLinks={card.buttonLinks}
          />
        ))}
      </div>
    </section>
  );
}
