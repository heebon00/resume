import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import { SKILLS } from "../../content/portfolio";
import SkillDonut from "../../components/SkillDonut";

/**
 * 모바일 MY SKILLS — 데스크톱 시안(20:1472)의 카드 7장.
 * 처음엔 1열로 쌓았는데 세로로 너무 길어서(카드 7장 = 약 1700u) 요청으로
 * 2열 그리드로 바꿨다. 행이 7 -> 4 로 줄어 길이가 40% 가까이 짧아진다.
 * 카드 폭이 절반(약 169u)이 되면서 안쪽이 넘쳐서, 여백·아이콘·글자·도넛을
 * 한 단계씩 줄였다 — 특히 "도넛 + Proficiency/Advanced" 가로줄이 예전
 * 크기(52 + 12 + 라벨)로는 카드 안쪽 폭을 넘었다.
 * 카드 안쪽 구성(아이콘 → 이름·설명 → 도넛 + 라벨)과 색은 시안 값 그대로다.
 * 마지막 7번째 카드는 한 칸만 차지해 왼쪽에 홀로 놓인다.
 */
export default function MobileSkills() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!SKILLS.cards.length) return null;

  return (
    <section
      data-reveal id={mobileId("skills")} className="bg-skills-bg px-20 pt-60 pb-60">
      <div className="text-center">
        <h2 className="font-sans text-[calc(24*var(--u))] leading-[calc(33.92*var(--u))] font-bold text-white">
          {SKILLS.heading}
        </h2>
        <p className="mt-8 font-sans text-[calc(14*var(--u))] leading-desc text-skills-sub">
          {SKILLS.subtitle}
        </p>
      </div>

      <ul className="mt-24 grid grid-cols-2 gap-12">
        {SKILLS.cards.map((card) => (
          <li
            key={card.id}
            className="flex flex-col items-start gap-10 rounded-card border border-card-border bg-card p-14"
          >
            <span className="flex size-40 items-center justify-center rounded-card bg-card-icon">
              {card.markLabel ? (
                <span className="flex size-28 items-center justify-center overflow-hidden rounded-mark bg-gradient-to-r from-[#300] to-[#ff9a00] font-mark text-[calc(13*var(--u))] font-black text-white">
                  {card.markLabel}
                </span>
              ) : (
                <SafeImage
                  src={card.logo}
                  alt={`${card.name} 로고`}
                  className="size-28 rounded-mark"
                />
              )}
            </span>

            <div className="flex w-full flex-col gap-6">
              <p className="font-sans text-[calc(14*var(--u))] font-bold text-white">
                {card.name}
              </p>
              <p className="font-sans text-[calc(12*var(--u))] leading-[calc(17*var(--u))] text-card-text">
                {card.description}
              </p>
            </div>

            <div className="flex w-full items-center gap-8">
              <SkillDonut percent={card.percent} size={44} fontSize={11} />
              <span className="flex flex-1 flex-col gap-2 font-sans text-[calc(11.5*var(--u))]">
                <span className="text-card-text">
                  {SKILLS.proficiencyLabel}
                </span>
                <span className="text-card-text-dim">{SKILLS.levelLabel}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
