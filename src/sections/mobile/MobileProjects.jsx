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
            {/* 썸네일 — 좌우가 잘린다는 요청으로 두 가지를 바꿨다.
                (1) 상자를 세로형(124x220)에서 화면 폭 전체의 가로형으로 바꿨다.
                    카드 이미지는 전부 가로형 목업(2133x1080 · 1555x1080 등)이라
                    세로 상자에 넣으면 가운데 3분의 1만 남고 양옆이 잘려 나갔다.
                (2) object-cover(넘치는 만큼 잘라내기) 대신 object-contain 을
                    쓴다. 이러면 비율이 서로 다른 이미지들도 아무것도 잘리지
                    않고 상자 안에 통째로 들어간다. 남는 자리는 상자 바탕색
                    (bg-paper-alt)으로 채워져 카드마다 높이가 들쭉날쭉하지 않다. */}
            <div className="aspect-[16/9] w-full overflow-hidden bg-paper-alt">
              <SafeImage
                src={card.src}
                alt={card.alt}
                className="size-full"
                imgClassName="block size-full object-contain"
              />
            </div>

            <h3 className="mt-16 font-sans text-[calc(20*var(--u))] leading-[calc(26*var(--u))] text-ink uppercase">
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
                두 개를 박아 두지 않고 목록을 그대로 돈다.
                마지막 하나만 라임으로 강조하고 나머지는 흰 테두리로 둔다.

                폭은 원래 flex-1 로 한 줄을 꽉 채워 나눠 가졌는데, 그러면 버튼이
                둘뿐인 카드(첫 프로젝트)의 버튼만 유난히 넓어져 다른 카드와
                따로 놀았다. 지금은 글자 크기만큼만 차지하고 가운데로 모인다
                (요청). 개수가 달라도 버튼 크기는 모든 카드에서 같다. */}
            <div className="mt-14 flex flex-wrap justify-center gap-11">
              {(card.buttons ?? PROJECTS.buttons).map((label, idx, all) => {
                const href = card.links?.[idx];
                const last = idx === all.length - 1;
                const shape =
                  "flex h-38 items-center justify-center rounded-button px-16 font-sans text-[calc(14*var(--u))] leading-body";
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
