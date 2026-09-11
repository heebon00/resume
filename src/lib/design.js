/**
 * 시안 좌표 → CSS 값 변환.
 *
 * 레이아웃은 "1920 캔버스 비율 축소" 방식이라 디자인 1px = var(--u) 이다.
 * 고정 값은 Tailwind 클래스(w-144 · pt-25 …)로 쓰지만, 배열/데이터에서 나오는
 * 좌표는 클래스명을 정적으로 만들 수 없어 Tailwind 가 유틸리티를 생성하지 못한다.
 * 그런 좌표만 이 헬퍼로 인라인 style 을 만든다.
 */

/** 디자인 px 숫자를 화면 폭에 비례하는 길이로 바꾼다. */
export const du = (n) => `calc(${n} * var(--u))`;

/**
 * MY SKILLS 카드 행이 시안 높이(244)보다 커져야 하는 만큼(px) — [1행, 2행].
 * 글자에 16px 바닥이 걸리면서 좁은 화면에서는 카드만 줄고 글자는 안 줄어
 * 도넛 줄이 카드 밖으로 넘쳤다. Skills.jsx 가 행마다 카드 내용을 실측해
 * :root 에 단다. 행마다 설명 줄 수가 달라 따로 잰다.
 */
export const SKILLS_EXTRA = ["var(--skills-extra-1, 0px)", "var(--skills-extra-2, 0px)"];

/** du(n) 에 MY SKILLS 1 ~ k 행이 늘어난 높이를 더한 길이 — 그 아래 좌표를 함께 내릴 때 쓴다. */
export const duSkills = (n, k) =>
  `calc(${[`${n} * var(--u)`, ...SKILLS_EXTRA.slice(0, k)].join(" + ")})`;

/** 절대 배치용 style 객체. 값이 없는 항목은 넣지 않는다. */
export function box({ left, top, right, bottom, width, height }) {
  const style = {};
  if (left !== undefined) style.left = du(left);
  if (top !== undefined) style.top = du(top);
  if (right !== undefined) style.right = du(right);
  if (bottom !== undefined) style.bottom = du(bottom);
  if (width !== undefined) style.width = du(width);
  if (height !== undefined) style.height = du(height);
  return style;
}
