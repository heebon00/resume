import SafeImage from "./SafeImage";
import SkillDonut from "./SkillDonut";

/**
 * MY SKILLS 카드 — 툴 아이콘 + 이름 + 설명 + 숙련도(도넛 + 라벨).
 * 피그마: 25:8(Figma) 외 6장, 카드 높이 244
 *   카드     bg #929292, border 1px #dfe1e5, radius 16px, padding 24, 세로 gap 16
 *   아이콘   56 x 56, radius 16, 배경 white 6% / 로고 40 x 40, radius 8
 *   이름     16px Pretendard Bold, 흰색
 *   설명     16px Pretendard Regular, black 88%
 *   숙련도   가로 gap 12 / 도넛 64 x 64 (SkillDonut — 화면에 들어오면 채워진다),
 *            가운데 퍼센트 16px Bold 흰색, 라벨 16px — 위 black 88% / 아래 black 52%
 */
export default function SkillCard({
  logo,
  logoAlt,
  mark,
  name,
  description,
  percent,
  proficiencyLabel,
  levelLabel,
}) {
  return (
    <div className="flex flex-1 flex-col items-start gap-16 rounded-card border border-card-border bg-card p-24">
      <div className="flex size-56 items-center justify-center rounded-card bg-card-icon">
        {mark ?? (
          <SafeImage
            src={logo}
            alt={logoAlt ?? `${name} 로고`}
            width={40}
            height={40}
            className="rounded-mark"
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-6 text-body">
        <p className="font-sans font-bold text-white">{name}</p>
        <p className="font-sans text-card-text">{description}</p>
      </div>

      <div className="flex w-full items-center gap-12">
        <SkillDonut percent={percent} />

        <div className="flex flex-1 flex-col gap-4 font-sans text-body">
          <p className="text-card-text">{proficiencyLabel}</p>
          <p className="text-card-text-dim">{levelLabel}</p>
        </div>
      </div>
    </div>
  );
}
