import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import MobileSectionHeading from "./MobileSectionHeading";
import { ABOUT, IMAGES } from "../../content/portfolio";

/**
 * 모바일 ABOUT ME — 데스크톱 시안(20:985 / 20:1669 / 20:1010)의 내용을 1단으로 쌓았다.
 * 라벨 바 → 제목 → 소개 4줄 → 정보표 5행 순서다.
 * 시안 120:55 의 인물 사진(아이패드)을 제목 위에 둔다.
 */
export default function MobileAbout() {
  return (
    <section
      data-reveal id={mobileId("about")} className="px-20 pt-60 pb-60">
      <div className="flex items-center justify-between border-b border-black pt-7 pb-5">
        <span className="font-sans text-label leading-label tracking-wide font-medium text-black uppercase">
          {ABOUT.barLeft}
        </span>
        <span className="font-sans text-label leading-label tracking-wide font-medium text-black uppercase">
          {ABOUT.barRight}
        </span>
      </div>


      <SafeImage
        src={IMAGES.aboutPortrait}
        alt={ABOUT.portraitAlt}
        width={350}
        height={222}
        className="mt-24 w-full"
      />

      <MobileSectionHeading className="mt-24">
        {ABOUT.heading}
      </MobileSectionHeading>

      <div className="mt-16">
        {ABOUT.introLines.map((line, i) => (
          <p
            key={line}
            style={{ transitionDelay: `${i * 0.12}s` }}
            className="intro-line-m font-sans text-[calc(15.5*var(--u))] leading-desc tracking-body text-black"
          >
            {line}
          </p>
        ))}
      </div>

      <dl className="mt-28" hidden={ABOUT.rows.length === 0}>
        {ABOUT.rows.map(({ label, value }) => (
          <div key={label} className="flex border-b border-line pt-14 pb-14">
            <dt className="w-120 shrink-0 font-sans text-[calc(15.5*var(--u))] leading-desc text-black uppercase">
              {label}
            </dt>
            <dd className="font-sans text-[calc(15.5*var(--u))] leading-desc text-black">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
