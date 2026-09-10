/**
 * 이력서 페이지(resume.html)의 유일한 스크립트.
 *
 * 이 페이지는 React 를 쓰지 않는다 — 읽기만 하는 한 장짜리 문서라 프레임워크가
 * 할 일이 없고, 채용 담당자가 여는 첫 화면이라 가볍게 두는 편이 낫다.
 * 그래서 테마 토글만 직접 붙인다. 상태를 다루는 규칙은 사이트 본체와 같은
 * src/lib/theme.js 를 그대로 쓴다(저장 키가 같아서 사이트에서 고른 테마가
 * 이 페이지에도 이어진다).
 */
import { followSystemTheme, toggleTheme } from "./theme.js";

const button = document.querySelector("[data-theme-toggle]");
if (button) button.addEventListener("click", toggleTheme);

// 사용자가 테마를 고른 적이 없을 때만 PC 설정을 따라간다.
followSystemTheme();
