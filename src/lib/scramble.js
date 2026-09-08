/**
 * GSAP ScrambleTextPlugin 용 글자 풀 — 뒤섞을 때 완전 무작위 알파벳이 아니라
 * "그 텍스트 자신의 글자들"만으로 섞는다(원래 gabrielcontassot.com 의 hover
 * 효과를 따라 만든 값, DesktopNav.jsx 참고). 길이만큼(텍스트 길이의 2배)
 * 무작위로 뽑아 붙인다 — 완전 무작위 알파벳보다 차분해 보인다.
 *
 * DesktopNav(GNB hover)·ProjectsReveal(프로젝트 설명 등장) 둘 다 쓰는
 * 공용 헬퍼라 여기로 뺐다.
 */
export function makeScramblePool(text) {
  const chars = [...text];
  const length = chars.length * 2;
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}
