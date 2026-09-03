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

            <div className="mt-14 flex gap-11">
              {card.links?.[0] ? (
                <a
                  href={card.links[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-38 flex-1 items-center justify-center rounded-button border border-base-black bg-white font-sans text-[calc(14*var(--u))] leading-body text-base-black no-underline"
                >
                  {(card.buttons ?? PROJECTS.buttons)[0]}
                </a>
              ) : (
                <span className="flex h-38 flex-1 items-center justify-center rounded-button border border-base-black bg-white font-sans text-[calc(14*var(--u))] leading-body text-base-black">
                  {(card.buttons ?? PROJECTS.buttons)[0]}
                </span>
              )}
              {card.links?.[1] ? (
                <a
                  href={card.links[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-38 flex-1 items-center justify-center rounded-button bg-accent-lime font-sans text-[calc(14*var(--u))] leading-body text-black no-underline"
                >
                  {(card.buttons ?? PROJECTS.buttons)[1]}
                </a>
              ) : (
                <span className="flex h-38 flex-1 items-center justify-center rounded-button bg-accent-lime font-sans text-[calc(14*var(--u))] leading-body text-black">
                  {(card.buttons ?? PROJECTS.buttons)[1]}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
