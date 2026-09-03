import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import { DESIGN } from "../../content/portfolio";
import arrowRightSm from "../../assets/icons/icon-arrow-right-sm.svg";

/**
 * 모바일 MY DESIGN — 데스크톱 시안(20:1295)의 왼쪽 칼럼(제목·필터·See more)과
 * 카드 4장을 세로로 이어 붙였다. 카드 1의 세로 텍스트와 25% 오버레이도
 * 시안대로 유지하되, 좁은 폭에서는 가로쓰기로 카드 아래에 둔다.
 */
export default function MobileDesign() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!DESIGN.cards.length) return null;

  return (
    <section
      data-reveal id={mobileId("design")} className="px-20 pb-60">
      <h2 className="font-sans text-[calc(24*var(--u))] leading-[calc(40.32*var(--u))] font-semibold text-black">
        {DESIGN.heading}
      </h2>

      <ul className="mt-12 flex flex-wrap gap-x-16 gap-y-6">
        {DESIGN.filters.map((label, i) => (
          <li
            key={`${label}-${i}`}
            className={`font-sans text-[calc(15*var(--u))] leading-desc text-black ${
              i === 0 ? "border-b border-ink" : "underline decoration-solid"
            }`}
          >
            {label}
          </li>
        ))}
      </ul>

      <p className="mt-12 flex items-center">
        <span className="font-sans text-[calc(13.7*var(--u))] leading-desc text-black">
          {DESIGN.moreLabel}
        </span>
        <img
          src={arrowRightSm}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="ml-8 block size-14 -scale-y-100"
        />
      </p>

      <ul className="mt-24 flex flex-col gap-16">
        {DESIGN.cards.map((card, i) => (
          <li
            key={card.id}
            className="relative h-200 overflow-hidden rounded-[calc(5*var(--u))]"
          >
            <SafeImage src={card.src} alt={card.alt} className="size-full" />
            {i === 0 && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-black-25"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-20">
                  <p className="font-sans text-[calc(18*var(--u))] leading-[calc(26*var(--u))] text-white">
                    — {DESIGN.cardTitle}
                  </p>
                  <p className="mt-8 font-sans text-[calc(12*var(--u))] leading-[calc(18*var(--u))] text-white-70">
                    {DESIGN.cardLines.join(" ")}
                  </p>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
