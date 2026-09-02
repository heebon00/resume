/**
 * 섹션 제목 — "— ABOUT ME" 형태의 대시 + 대문자 제목.
 * 피그마: 40px / Pretendard Bold / uppercase
 * leading 과 자간이 제목마다 달라 prop 으로 받는다.
 *   20:1023 — ABOUT ME            leading 15.6 / 자간 1.3
 *   20:1251 — MY projects         leading 15.6 / 자간 1.3
 *   20:1102 — MY Work Experience  leading 63.8 / 자간 없음
 * 시안(20:1102)에 whitespace-nowrap 이 걸려 있어 제목은 줄바꿈 없이 한 줄로 둔다.
 * "— MY Work Experience" 는 담긴 박스(512)보다 길지만 시안대로 넘쳐 흐른다.
 */
export default function SectionHeading({
  children,
  leading = "heading",
  tracking = "heading",
  className = "",
  as: Tag = "h2",
}) {
  const leadingClass =
    leading === "section" ? "leading-section" : "leading-heading";
  const trackingClass =
    tracking === "none" ? "tracking-normal" : "tracking-heading";

  return (
    <Tag
      className={`font-sans font-bold text-heading whitespace-nowrap text-black uppercase ${leadingClass} ${trackingClass} ${className}`}
    >
      — {children}
    </Tag>
  );
}
