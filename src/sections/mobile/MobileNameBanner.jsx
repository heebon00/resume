import HeaderParticles from "../../components/HeaderParticles";
import { BANNER } from "../../content/portfolio";

/**
 * 모바일 이름 배너 — 데스크톱과 같은 구성(검정 띠 + 그라디언트 글자 + 파티클).
 * 시안 글자(64px / 자간 16)를 390 폭에 그대로 쓰면 넘치므로 22px / 자간 5 로 줄였다.
 * 시안처럼 히어로 바로 아래에 붙는다.
 */
export default function MobileNameBanner() {
  return (
    <section
      aria-label={BANNER.text}
      className="relative h-90 overflow-hidden bg-banner"
    >
      <HeaderParticles />
      <p className="absolute inset-0 flex items-center justify-center px-20 text-center font-sans text-[calc(22*var(--u))] leading-normal font-light whitespace-nowrap">
        {/* 그라디언트는 글자 폭 기준(데스크톱 배너와 같은 이유) */}
        <span
          className="name-gradient"
          style={{
            letterSpacing: "calc(5 * var(--u))",
            marginRight: "calc(-5 * var(--u))",
            textShadow: "0 0 calc(8 * var(--u)) rgba(217, 115, 31, 0.08)",
          }}
        >
          {BANNER.text}
        </span>
      </p>
    </section>
  );
}
