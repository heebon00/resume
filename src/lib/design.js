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
