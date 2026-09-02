import { du } from "../lib/design";

/**
 * 키워드 마퀴의 태그 — 알약형 외곽선 태그 / 채움형 강조 태그.
 * 피그마: 20:1679(외곽선) · 20:1691(초록 채움) · 20:1732(빨강 채움) · 20:1753(초록 채움)
 *   pill  h 92.16, px 38.4, py 7.68, radius 3840, 외곽선 = 2px #1f1f1f 그림자링
 *   text  Pretendard Medium, leading 76.8, tracking -1.536, uppercase
 *         크기(73.1~76.4px)와 글자 상자 폭이 항목마다 달라 값으로 받는다.
 * 정적 구성이므로 흐름 애니메이션은 넣지 않는다.
 */
export default function TagPill({
  children,
  size,
  textWidth,
  textLeft = 0,
  fillClassName,
  textClassName = "text-black",
}) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-[calc(38.4*var(--u))] py-[calc(7.68*var(--u))] shadow-[0_0_0_calc(2*var(--u))_var(--color-ring)] ${fillClassName ?? ""}`}
      style={{ height: du(92.16) }}
    >
      <span
        className="relative block"
        style={{ width: du(textWidth), height: du(76.8) }}
      >
        <span
          className={`absolute top-0 block leading-marquee tracking-display whitespace-nowrap uppercase ${textClassName}`}
          style={{ fontSize: du(size), left: du(textLeft) }}
        >
          {children}
        </span>
      </span>
    </span>
  );
}
