/**
 * 다크 모드 상태 — 한 곳에서만 다룬다.
 *
 * 첫 테마는 index.html 의 인라인 스크립트가 화면이 그려지기 전에 정해
 * <html data-theme> 에 붙여 둔다(그래야 밝은 화면이 번쩍이지 않는다).
 * 여기서는 그 값을 읽어 쓰고, 토글할 때 속성·저장소·구독자에게 알린다.
 *
 * 규칙:
 *   - 사용자가 한 번이라도 고르면 그 값이 PC 설정보다 우선한다(localStorage).
 *   - 고른 적이 없으면 PC 설정을 그대로 따르고, 설정이 바뀌면 즉시 따라간다.
 *   - localStorage 를 못 쓰는 환경에서도 토글은 그 세션 동안 동작한다.
 */
const KEY = "theme";
const listeners = new Set();

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 저장을 못 해도 화면 전환은 되게 둔다 */
  }
}

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function apply(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  for (const fn of listeners) fn(theme);
}

export function setTheme(theme) {
  write(KEY, theme);
  apply(theme);
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

/** 테마가 바뀔 때마다 부른다. 정리 함수를 돌려준다. */
export function onThemeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * 사용자가 고른 적이 없을 때만 PC 설정 변화를 따라간다.
 * (고른 값이 있으면 그게 우선이므로 무시한다)
 */
export function followSystemTheme() {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handle = (event) => {
    if (read(KEY)) return;
    apply(event.matches ? "dark" : "light");
  };
  mq.addEventListener("change", handle);
  return () => mq.removeEventListener("change", handle);
}
