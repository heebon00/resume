import { mobileId } from "../../lib/sectionIds";
import MobileSectionHeading from "./MobileSectionHeading";
import { EXPERIENCE } from "../../content/portfolio";

/**
 * 모바일 MY WORK EXPERIENCE — 데스크톱 시안(20:1094)의 4행을 좁은 폭에 맞춰
 * 두 줄로 나눠 쌓았다. 소속이 윗줄, "순번 + 연도"가 아랫줄이다.
 *
 * 처음에는 연도가 윗줄이었는데 요청으로 뒤집었다 — 가장 긴 소속("메가스터디
 * 잇츠 리얼 타임 스터디카페 (선임 서포터즈)")이 두 줄로 접히면서 윗줄의
 * 오른쪽 연도와 붙어 읽혀 어느 연도가 어느 소속인지 흐려졌다.
 */
export default function MobileExperience() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!EXPERIENCE.rows.length) return null;

  return (
    <section
      data-reveal id={mobileId("experience")} className="px-20 pb-60">
      <MobileSectionHeading>{EXPERIENCE.heading}</MobileSectionHeading>

      {/* 왼쪽은 부제, 오른쪽은 섹션 번호 — 위쪽 ABOUT 의 구분선 칸과 같은
          짜임이다(요청). 번호가 비면 그 자리는 아예 그리지 않는다. */}
      <div className="mt-20 flex items-center justify-between border-b border-ink pt-7 pb-5">
        <p className="font-sans text-[calc(15.5*var(--u))] leading-label tracking-wide font-medium text-ink uppercase">
          {EXPERIENCE.subheading}
        </p>
        {EXPERIENCE.barRight ? (
          <p className="font-sans text-[calc(15.5*var(--u))] leading-label tracking-wide font-medium text-ink uppercase">
            {EXPERIENCE.barRight}
          </p>
        ) : null}
      </div>

      <ol className="mt-4">
        {EXPERIENCE.rows.map((row) => (
          <li key={row.id} className="border-b border-ink-8 pt-16 pb-12">
            <p className="font-sans text-[calc(15.5*var(--u))] leading-desc font-medium text-ink opacity-[0.563]">
              {row.title}
            </p>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-sans text-label leading-body text-ink opacity-[0.762]">
                {row.index}
              </span>
              <span className="font-sans text-[calc(13*var(--u))] leading-year tracking-wider font-medium text-ink uppercase opacity-[0.55]">
                {row.year}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
