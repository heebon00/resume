import ExperienceRow from "../components/ExperienceRow";
import SectionHeading from "../components/SectionHeading";
import { EXPERIENCE } from "../content/portfolio";

/**
 * MY WORK EXPERIENCE — 피그마 20:1094 (섹션 y=1968)
 *   20:1095 div.ld-container  캔버스 left 328, top 1968, 1294 x 557
 *     20:1097 제목       top 48,  left 0, 폭 538.64, px 15
 *                        40px Bold / leading 63.8 / uppercase
 *     20:1104 라벨 바    top 94,  폭 1294, px 15 — 하단 실선 1px black(h 70)
 *                        라벨 "Work Experience" top 40, 16px Medium, tracking 1.32, leading 12
 *     20:1118/1140/1162/1184 경력 4행  top 164 / 248 / 319 / 402, left 30, 폭 1264
 *     20:1206 마감 실선  top 527, left 15, 폭 1264, h 30
 * 4행 모두 시안에 같은 내용("2x / FTA Best Interactivity / 2021")으로 적혀 있어 그대로 옮긴다.
 */

// 행 좌표만 여기서 관리하고 내용은 content/portfolio.js 를 쓴다.
const ROW_TOPS = [164, 248, 319, 402];

export default function Experience() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!EXPERIENCE.rows.length) return null;

  return (
    <section id="experience" aria-label="MY WORK EXPERIENCE">
      <div className="absolute top-1968 left-328 h-557 w-1294" data-reveal>
        {/* 20:1097 제목 */}
        <div className="absolute top-48 left-0 h-64 w-[calc(538.64*var(--u))] px-15">
          <SectionHeading as="h2" leading="section" tracking="none">
            {EXPERIENCE.heading}
          </SectionHeading>
        </div>

        {/* 20:1104 라벨 바 */}
        <div className="absolute top-94 right-0 left-0 px-15">
          <div className="h-70 border-b border-black">
            <p className="pt-40 font-sans text-body leading-label tracking-wide font-medium text-black uppercase">
              {EXPERIENCE.subheading}
            </p>
          </div>
        </div>

        {/* 20:1118 ~ 20:1184 경력 4행 */}
        {EXPERIENCE.rows.map((row, i) => (
          <ExperienceRow
            key={row.id}
            index={row.index}
            title={row.title}
            year={row.year}
            className="absolute left-30 w-1264"
            style={{ top: `calc(${ROW_TOPS[i]} * var(--u))` }}
          />
        ))}

        {/* 20:1206 마감 실선 */}
        <div className="absolute top-527 left-15 h-30 w-1264 border-b border-black" />
      </div>
    </section>
  );
}
