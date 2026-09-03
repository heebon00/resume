import { mobileId } from "../../lib/sectionIds";
import MobileSectionHeading from "./MobileSectionHeading";
import { EXPERIENCE } from "../../content/portfolio";

/**
 * 모바일 MY WORK EXPERIENCE — 데스크톱 시안(20:1094)의 4행을 좁은 폭에 맞춰
 * "순번 + 연도"를 윗줄, 내용을 아랫줄로 나눠 쌓았다.
 */
export default function MobileExperience() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!EXPERIENCE.rows.length) return null;

  return (
    <section
      data-reveal id={mobileId("experience")} className="px-20 pb-60">
      <MobileSectionHeading>{EXPERIENCE.heading}</MobileSectionHeading>

      <div className="mt-20 border-b border-black pt-7 pb-5">
        <p className="font-sans text-[calc(15.5*var(--u))] leading-label tracking-wide font-medium text-black uppercase">
          {EXPERIENCE.subheading}
        </p>
      </div>

      <ol className="mt-4">
        {EXPERIENCE.rows.map((row) => (
          <li key={row.id} className="border-b border-black-8 pt-16 pb-12">
            <div className="flex items-baseline justify-between">
              <span className="font-sans text-label leading-body text-black opacity-[0.762]">
                {row.index}
              </span>
              <span className="font-sans text-[calc(13*var(--u))] leading-year tracking-wider font-medium text-black uppercase opacity-[0.55]">
                {row.year}
              </span>
            </div>
            <p className="mt-4 font-sans text-[calc(15.5*var(--u))] leading-desc font-medium text-black opacity-[0.563]">
              {row.title}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
