import SkillCard from "../components/SkillCard";
import { SKILLS } from "../content/portfolio";
import { box } from "../lib/design";

/**
 * MY SKILLS — 피그마 20:1472 (섹션 x=86, y=6139)
 *   섹션      캔버스 left -11, top 4961, 1971.2 x 905, 배경 #1E1E1F
 *             (시안 6139 에서 1178 올렸다 — 갤러리 이동 572 + 요청으로 MY DESIGN
 *              목업 아래 빈 자리를 줄인 606. MY DESIGN 상자 아래 140 에 붙는다)
 *   25:4 헤더 left 104.188, top 6279, 1740.82 x 65, 가운데 정렬, 세로 gap 8
 *             제목 40px Bold 흰색 leading 33.92 / 부제 16px rgba(255,254,254,0.7) leading 22.99
 *   25:6 그리드 left 104.188, top 6392, 1740.82 x 512
 *             row-1 (top 6392) 카드 4장 · row-2 (top 6660) 카드 3장, 가로 gap 24, 높이 244
 * 카드 내용은 src/content/portfolio.js 를 쓰고, 숙련도 도넛은 SkillDonut 이 그린다.
 */

const ROWS = [
  { top: 5214, cards: SKILLS.cards.slice(0, 4) },
  { top: 5482, cards: SKILLS.cards.slice(4) },
];

export default function Skills() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!SKILLS.cards.length) return null;

  return (
    <section id="skills" aria-label="MY SKILLS">
      <div
        className="absolute bg-skills-bg"
        style={box({ left: -11, top: 4961, width: 1971.2, height: 905 })}
      />

      <div
        className="absolute flex flex-col items-center gap-8 text-center"
        data-reveal
        style={box({ left: 104.188, top: 5101, width: 1740.824, height: 65 })}
      >
        <h2 className="w-full font-sans text-heading leading-[calc(33.92*var(--u))] font-bold text-white">
          {SKILLS.heading}
        </h2>
        <p className="w-full font-sans text-body leading-desc text-skills-sub">
          {SKILLS.subtitle}
        </p>
      </div>

      {ROWS.map((row) => (
        <div
          key={row.top}
          className="absolute flex gap-24"
          data-reveal
          style={box({
            left: 104.188,
            top: row.top,
            width: 1740.824,
            height: 244,
          })}
        >
          {row.cards.map((card) => (
            <SkillCard
              key={card.id}
              logo={card.logo}
              mark={
                card.markLabel ? (
                  <span className="flex size-40 items-center justify-center overflow-hidden rounded-mark bg-gradient-to-r from-[#300] to-[#ff9a00]">
                    <span className="font-mark text-[calc(18*var(--u))] font-black text-white">
                      {card.markLabel}
                    </span>
                  </span>
                ) : null
              }
              name={card.name}
              description={card.description}
              percent={card.percent}
              proficiencyLabel={SKILLS.proficiencyLabel}
              levelLabel={SKILLS.levelLabel}
            />
          ))}
        </div>
      ))}
    </section>
  );
}
