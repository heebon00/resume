import HeaderParticles from "../components/HeaderParticles";
import { BANNER } from "../content/portfolio";
import { box } from "../lib/design";

/**
 * 이름 배너 — 피그마 110:2 "Header" (1920 x 186, 배경 #050505)
 *   Services Section(20:985, y=913) 안의 (97, 129) → 캔버스 (0, 1042).
 *   히어로가 154 + 888 = 1042 에서 끝나므로 바로 아래에 딱 붙는다.
 *
 *   110:3 "MY NAME IS HEEBON"
 *     Pretendard Light 64px / 자간 16px / 가운데 정렬
 *     글자는 투명, 가로 그라디언트를 background-clip: text 로 입힌다(.name-gradient)
 *     text-shadow 0 0 15px rgba(217,115,31,0.08)
 *
 * 배경에는 파티클 커서를 깐다(HeaderParticles). 마우스를 따라오고, 멈추면
 * 스스로 궤도를 돌며, 클릭하면 색이 바뀐다.
 */
export default function NameBanner() {
  return (
    <section
      aria-label={BANNER.text}
      className="absolute left-0 overflow-hidden bg-banner"
      style={box({ top: 1042, width: 1920, height: 186 })}
    >
      <HeaderParticles />
      <p className="absolute inset-0 flex items-center justify-center text-center font-sans text-[calc(64*var(--u))] leading-normal font-light whitespace-nowrap">
        {/* 그라디언트는 글자 상자(874px) 기준이라, 배너 폭이 아니라
            글자 폭에 맞춰야 시안과 같은 색 배열이 나온다. */}
        <span
          className="name-gradient"
          style={{
            letterSpacing: "calc(16 * var(--u))",
            // 자간은 마지막 글자 뒤에도 붙는다 — 그만큼 빼야 글자가 정확히 가운데 온다
            marginRight: "calc(-16 * var(--u))",
            textShadow: "0 0 calc(15 * var(--u)) rgba(217, 115, 31, 0.08)",
          }}
        >
          {BANNER.text}
        </span>
      </p>
    </section>
  );
}
