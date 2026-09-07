import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import MobileSectionHeading from "./MobileSectionHeading";
import { PROJECTS } from "../../content/portfolio";

/**
 * 모바일 MY PROJECTS — 데스크톱 시안(20:1247)의 카드 4장을 세로로 쌓았다.
 * 카드 안에서도 썸네일이 위, 제목·설명·버튼이 아래로 오도록 1단 구성이다.
 * 시안에 이동 대상이 없어 버튼은 링크 없이 시각적으로만 둔다.
 */
export default function MobileProjects() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!PROJECTS.cards.length) return null;

  return (
    <section
      data-reveal id={mobileId("projects")} className="px-20 pb-60">
      <MobileSectionHeading>{PROJECTS.heading}</MobileSectionHeading>

      <ul className="mt-24 flex flex-col gap-40">
        {PROJECTS.cards.map((card) => (
          <li key={card.id}>
            <div className="h-220 w-124 overflow-hidden bg-paper-alt">
              <SafeImage src={card.src} alt={card.alt} className="size-full" />
            </div>

            <h3 className="mt-16 font-sans text-[calc(20*var(--u))] leading-[calc(26*var(--u))] text-black uppercase">
              {card.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>

            <p className="mt-10 font-sans text-[calc(13.5*var(--u))] leading-desc font-medium text-muted">
              {card.descriptionLines.filter(Boolean).map((line) => (
                <span key={line} className="block">
                  {line.trim()}
                </span>
              ))}
            </p>

            {/* 버튼은 개수가 카드마다 다르다(기획서·깃허브·사이트 …).
                두 개를 박아 두지 않고 목록을 그대로 돈다. 폭은 flex-1 로 나눠 갖는다.
                마지막 하나만 라임으로 강조하고 나머지는 흰 테두리로 둔다. */}
            <div className="mt-14 flex gap-11">
              {(card.buttons ?? PROJECTS.buttons).map((label, idx, all) => {
                const href = card.links?.[idx];
                const last = idx === all.length - 1;
                const shape =
                  "flex h-38 flex-1 items-center justify-center rounded-button font-sans text-[calc(14*var(--u))] leading-body";
                const tone = last
                  ? "bg-accent-lime text-black"
                  : "border border-base-black bg-white text-base-black";

                return href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${shape} ${tone} no-underline`}
                  >
                    {label}
                  </a>
                ) : (
                  <span key={label} className={`${shape} ${tone}`}>
                    {label}
                  </span>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
