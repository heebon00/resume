import TagPill from "../components/TagPill";
import { KEYWORD_ROWS } from "../content/portfolio";
import { box, du } from "../lib/design";

/**
 * 키워드 마퀴 — 피그마 20:1670 "Skills Marquee" (섹션 x=25, y=4218)
 *   20:1671 div.ld-container  캔버스 left -72, top 4298, 2144 x 333.39
 *   각 줄(20:1673 / 20:1701 / 20:1735)의 뷰포트는 left -15 부터 1950 폭이라
 *   캔버스 기준 left -87, 높이 96.13, overflow clip. 줄 간격 111.13.
 *   태그 위치는 flickity 슬라이더 오프셋(줄마다 -176.09 / -1795.95 / -132.01)을
 *   반영해 계산한 뷰포트 기준 좌표다.
 *
 * [흐름 애니메이션]
 * 시안의 flickity 마퀴처럼 왼쪽으로 계속 흐른다. 태그 묶음을 두 벌 이어 붙이고
 * 한 주기(period)만큼 밀면 두 번째 벌이 첫 번째 벌 자리에 정확히 들어와 끊김이 없다.
 *   period = (마지막 태그 오른쪽 끝 - 첫 태그 왼쪽 끝) + 줄 간격 39
 *   속도    = 80 디자인 px/초 (줄마다 길이가 달라 소요 시간은 다르지만 속도는 같다)
 *   방향    = 1·3번째 줄은 왼쪽, 2번째 줄은 오른쪽
 * 외부 라이브러리 없이 CSS 애니메이션만 쓴다. prefers-reduced-motion 이면 멈춘다.
 */

// 태그 배치 좌표·크기(뷰포트 기준) — 문구는 content/portfolio.js 를 쓴다.
const FILL_CLASS = { crimson: "bg-tag-crimson", lime: "bg-tag-lime" };

const PLACEMENT = [
  [
    { left: -156.59, size: 74.9, textWidth: 370.63 },
    { left: 352.16, size: 73.7, textWidth: 594.72 },
    {
      left: 1112.27,
      size: 76.4,
      textWidth: 361.03,
      textClassName: "text-white",
    },
    { left: 1616.74, size: 73.1, textWidth: 701.23 },
  ],
  [
    { left: -240.17, size: 75.8, textWidth: 288.45 },
    { left: 173.55, size: 73.1, textWidth: 341.75 },
    { left: 668.13, size: 76.2, textWidth: 348.97 },
    { left: 1151.47, size: 73.1, textWidth: 341.75 },
    { left: 1645.99, size: 76.4, textWidth: 368.86 },
  ],
  [
    { left: -112.51, size: 75.8, textWidth: 360.64 },
    { left: 390.58, size: 73.7, textWidth: 483.22 },
    {
      left: 1032.72,
      size: 73.1,
      textWidth: 549.95,
      textLeft: 41.36,
      textClassName: "text-gray-50",
    },
    { left: 1743.09, size: 73.4, textWidth: 467.23 },
  ],
];

const ROW_TOPS = [0, 111.13, 222.26];

const PILL_PADDING = 76.8; // px 38.4 좌우
const CELL_GAP = 39; // 시안 flickity 셀 간격 (508.75-469.84 등에서 일정하게 확인)
const SPEED = 80; // 디자인 px / 초

const ROWS = KEYWORD_ROWS.map((row, r) => {
  const items = row.map((tag, i) => ({
    ...tag,
    ...PLACEMENT[r][i],
    fillClassName: tag.fill ? FILL_CLASS[tag.fill] : undefined,
  }));

  const starts = items.map((item) => item.left);
  const ends = items.map(
    (item) => item.left + PILL_PADDING + item.textWidth,
  );
  const period = Math.max(...ends) - Math.min(...starts) + CELL_GAP;

  return {
    id: `row-${r + 1}`,
    top: ROW_TOPS[r],
    // 홀수 줄(1·3)은 왼쪽, 짝수 줄(2)은 오른쪽으로 흐른다.
    direction: r % 2 === 1 ? "right" : "left",
    items,
    period,
    duration: period / SPEED,
  };
});

export default function Marquee() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!ROWS.some((row) => row.items.length)) return null;

  return (
    <section id="keywords" aria-label="작업 키워드">
      {ROWS.map((row) => (
        <div
          key={row.id}
          className="absolute overflow-hidden"
          data-reveal
          style={box({
            left: -87,
            top: 4298 + row.top,
            width: 1950,
            height: 96.13,
          })}
        >
          <div
            className="marquee-track absolute inset-0"
            data-direction={row.direction}
            style={{
              "--marquee-period": du(row.period),
              "--marquee-duration": `${row.duration}s`,
            }}
          >
            {/* 같은 묶음을 두 벌 이어 붙여 끊김 없이 순환시킨다 */}
            {[0, 1].map((copy) =>
              row.items.map((item, i) => (
                <span
                  key={`${copy}-${item.label}-${i}`}
                  className="absolute"
                  aria-hidden={copy === 1 ? "true" : undefined}
                  style={{
                    left: du(item.left + copy * row.period),
                    top: du(2),
                  }}
                >
                  <TagPill
                    size={item.size}
                    textWidth={item.textWidth}
                    textLeft={item.textLeft}
                    fillClassName={item.fillClassName}
                    textClassName={item.textClassName}
                  >
                    {item.label}
                  </TagPill>
                </span>
              )),
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
