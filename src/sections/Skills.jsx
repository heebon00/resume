import { useLayoutEffect, useRef } from "react";
import SkillCard from "../components/SkillCard";
import { SKILLS } from "../content/portfolio";
import { SKILLS_EXTRA, box, du, duSkills } from "../lib/design";

/**
 * MY SKILLS — 피그마 20:1472 (섹션 x=86, y=6139)
 *   섹션      캔버스 left -11, top 4961, 1971.2 x 785, 배경 #1E1E1F
 *             (요청 — "너무 크다"는 말에 위아래 여백을 140 -> 80 으로 줄여
 *              높이 905 -> 785. 줄어든 120 만큼 Footer 와 CANVAS_H 도 올렸다)
 *             (시안 6139 에서 1178 올렸다 — 갤러리 이동 572 + 요청으로 MY DESIGN
 *              목업 아래 빈 자리를 줄인 606. MY DESIGN 상자 아래 140 에 붙는다)
 *   25:4 헤더 left 104.188, top 6279, 1740.82 x 65, 가운데 정렬, 세로 gap 8
 *             제목 40px Bold 흰색 leading 33.92 / 부제 16px rgba(255,254,254,0.7) leading 22.99
 *   25:6 그리드 left 104.188, top 6392, 1740.82 x 512
 *             row-1 (top 6392) 카드 4장 · row-2 (top 6660) 카드 3장, 가로 gap 24, 높이 244
 * 카드 내용은 src/content/portfolio.js 를 쓰고, 숙련도 도넛은 SkillDonut 이 그린다.
 *
 * 카드 높이 — 글자에 16px 바닥이 걸린 뒤로 1920 미만에서는 카드(244u)만 줄고
 * 글자는 안 줄어 도넛 줄이 카드 밖으로 넘쳤다(1440 에서 33px, 1280 에서 44px).
 * 1920 에서도 본문이 18px 로 커지면서 아래 여백 24 중 18 을 먹고 있었다.
 * 그래서 행마다 카드 내용을 실측해 모자란 만큼을 --skills-extra-1 / -2 로
 * :root 에 단다. 행은 자기 몫만큼 커지고, 2행은 1행 몫만큼, 섹션 배경 · 푸터 ·
 * 캔버스 높이는 두 행 몫을 더한 만큼 내려간다.
 */

const ROW_W = 1740.824;
const ROW_H = 244;

// 요청으로 섹션 위아래 여백을 140 -> 80 으로 줄이면서 두 행도 그만큼
// (60) 위로 당겼다. 행 간격 24 · 카드 높이 244 는 그대로다.
const ROWS = [
  { top: 5154, cards: SKILLS.cards.slice(0, 4) },
  { top: 5422, cards: SKILLS.cards.slice(4) },
];

/** 카드 안 내용이 실제로 차지하는 높이(px) — 카드 자체 높이와 무관하게 잰다. */
function contentHeight(card) {
  const last = card.lastElementChild;
  if (!last) return 0;
  const style = getComputedStyle(card);
  return (
    last.getBoundingClientRect().bottom -
    card.getBoundingClientRect().top +
    parseFloat(style.paddingBottom) +
    parseFloat(style.borderBottomWidth)
  );
}

export default function Skills() {
  const sectionRef = useRef(null);

  // 그리기 전에 재야 넘친 카드가 한 번 보였다가 늘어나는 깜빡임이 없다.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const root = document.documentElement;
    const rows = [...section.querySelectorAll("[data-skill-row]")];
    const names = rows.map((_, i) => `--skills-extra-${i + 1}`);
    const clear = () => names.forEach((name) => root.style.removeProperty(name));

    const measure = () => {
      const rowWidth = rows[0]?.getBoundingClientRect().width ?? 0;
      // 1280 미만 — 데스크톱 트리가 숨어 있어 잴 것이 없다.
      if (!rowWidth) {
        clear();
        return;
      }
      const base = ROW_H * (rowWidth / ROW_W); // 244u 를 px 로
      rows.forEach((row, i) => {
        const need = Math.max(...[...row.children].map(contentHeight));
        const extra = Math.max(0, Math.ceil(need - base));
        root.style.setProperty(names[i], `${extra}px`);
      });
    };

    measure();
    // 카드 안 요소만 지켜본다 — 카드는 행 높이를 따라 늘어나므로 카드 자체를
    // 지켜보면 늘릴 때마다 다시 재는 고리가 생긴다. 안 요소는 폭(창 크기)과
    // 글꼴 로딩에만 반응한다.
    const observer = new ResizeObserver(measure);
    for (const row of rows) {
      for (const card of row.children) {
        for (const child of card.children) observer.observe(child);
      }
    }

    return () => {
      observer.disconnect();
      clear();
    };
  }, []);

  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!SKILLS.cards.length) return null;

  return (
    <section ref={sectionRef} id="skills" aria-label="MY SKILLS">
      <div
        className="absolute bg-skills-bg"
        style={{
          ...box({ left: -11, top: 4961, width: 1971.2 }),
          height: duSkills(785, 2),
        }}
      />

      <div
        className="absolute flex flex-col items-center gap-8 text-center"
        data-reveal
        style={box({ left: 104.188, top: 5041, width: ROW_W, height: 65 })}
      >
        <h2 className="w-full font-sans text-heading leading-[calc(33.92*var(--u))] font-bold text-white">
          {SKILLS.heading}
        </h2>
        <p className="w-full font-sans text-body leading-desc text-skills-sub">
          {SKILLS.subtitle}
        </p>
      </div>

      {ROWS.map((row, i) => (
        <div
          key={row.top}
          className="absolute flex gap-24"
          data-reveal
          data-skill-row
          style={{
            left: du(104.188),
            // 위에 있는 행들이 늘어난 만큼 내려가고, 자기 몫만큼 커진다.
            top: duSkills(row.top, i),
            width: du(ROW_W),
            height: `calc(${ROW_H} * var(--u) + ${SKILLS_EXTRA[i]})`,
          }}
        >
          {row.cards.map((card) => (
            <SkillCard
              key={card.id}
              logo={card.logo}
              mark={
                card.markLabel ? (
                  <span className="flex size-40 items-center justify-center overflow-hidden rounded-mark bg-gradient-to-r from-[#300] to-[#ff9a00]">
                    <span className="font-mark text-[max(16px,calc(18*var(--u)))] font-black text-white">
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
