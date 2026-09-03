/**
 * 섹션 앵커 id — 모바일 쪽 접두사.
 *
 * App 은 데스크톱과 모바일 레이아웃을 둘 다 렌더링하고 CSS(`xl:hidden` /
 * `hidden xl:block`)로만 한쪽을 숨긴다. 즉 둘 다 항상 DOM 에 있다.
 * 두 트리가 같은 id 를 쓰면 문서 안에 중복 id 가 생기고(HTML 표준 위반),
 * `#projects` 같은 앵커와 `getElementById` 는 화면에 보이는 쪽이 아니라
 * 언제나 문서에서 먼저 나오는 모바일 쪽을 집는다.
 *
 * 그래서 모바일 트리에만 접두사를 붙인다. 데스크톱 id 는 밖에 공개된
 * 앵커(`.../#projects`)라 바꾸지 않는다.
 *
 * 모바일 UI(MobileHeader·MobileMenu)는 `xl:hidden` 이라 모바일 화면에서만
 * 보이므로, 링크도 이 함수로 만든 모바일 id 를 가리킨다.
 */
export const MOBILE_ID_PREFIX = "m-";

export const mobileId = (name) => `${MOBILE_ID_PREFIX}${name}`;

export const mobileHref = (name) => `#${mobileId(name)}`;
