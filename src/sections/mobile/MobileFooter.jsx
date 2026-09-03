import { mobileId } from "../../lib/sectionIds";
import { FOOTER } from "../../content/portfolio";

/**
 * 모바일 푸터 — 데스크톱 시안(20:1594)의 형광 블록과 연락처를 1단으로 쌓았다.
 * 시안의 세로쓰기 문구는 좁은 폭에서 읽히지 않아 가로쓰기로 눕히고,
 * 형광 블록(#EFFF58)과 문구는 그대로 유지한다.
 */
export default function MobileFooter() {
  return (
    <footer
      data-reveal id={mobileId("contact")} className="pb-60">
      <div className="bg-footer px-20 pt-40 pb-40">
        <p className="font-sans text-[calc(19*var(--u))] leading-[calc(26*var(--u))] text-black">
          {FOOTER.verticalTitle}
        </p>
        {FOOTER.verticalLines.length > 0 && (
          <p className="mt-8 font-sans text-[calc(14*var(--u))] leading-desc text-black">
            {[...FOOTER.verticalLines].reverse().join("")}
          </p>
        )}
      </div>

      <div className="px-20 pt-32">
        <p className="font-sans text-[calc(18*var(--u))] leading-[calc(27*var(--u))] text-black">
          {FOOTER.lead}
        </p>

        <div className="mt-20">
          <p className="font-sans text-[calc(15.5*var(--u))] leading-body text-black uppercase">
            {FOOTER.name}
          </p>
          {FOOTER.phone && (
            <p className="mt-8 font-sans text-[calc(15.5*var(--u))] leading-body text-black">
              {FOOTER.phone}
            </p>
          )}
          {FOOTER.email && (
            <p className="font-sans text-[calc(15.5*var(--u))] leading-body text-black uppercase">
              {FOOTER.email}
            </p>
          )}
        </div>

        {FOOTER.credits && (
          <a
            href={FOOTER.credits.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-24 inline-block font-sans text-[calc(13*var(--u))] leading-body text-black underline decoration-from-font underline-offset-2 opacity-60"
          >
            {FOOTER.credits.label}
          </a>
        )}

        <ul
          className="mt-24 flex flex-col gap-8"
          hidden={FOOTER.socials.length === 0}
        >
          {FOOTER.socials.map((label) => (
            <li
              key={label}
              className="font-sans text-[calc(15*var(--u))] leading-[calc(22.5*var(--u))] text-black"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
