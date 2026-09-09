import { useEffect, useState } from "react";
import {
  followSystemTheme,
  getTheme,
  onThemeChange,
  toggleTheme,
} from "../lib/theme";

/**
 * 다크 모드 토글 — 해/달 아이콘 하나로 두 테마를 오간다.
 *
 * 첫 테마는 index.html 의 인라인 스크립트가 이미 정해 뒀으므로, 여기서는
 * 그 값을 읽어 아이콘만 맞춘다(마운트 뒤에 다시 정하면 화면이 번쩍인다).
 * 사용자가 고른 적이 없으면 PC 설정 변화를 그대로 따라간다(followSystemTheme).
 *
 * 아이콘은 상표가 없는 단순 도형이라 직접 그렸다 — 해는 원 + 광선 8개,
 * 달은 원 두 개를 겹쳐 깎은 초승달이다. 색은 currentColor 라 놓이는 자리의
 * 글자색을 그대로 따른다.
 */
export default function ThemeToggle({ className = "" }) {
  const [theme, setThemeState] = useState(getTheme);

  useEffect(() => {
    // 첫 값은 useState(getTheme) 가 이미 읽었다 — 여기서 또 넣으면 불필요한
    // 렌더가 한 번 더 돈다(oxlint set-state-in-effect).
    const stopWatching = onThemeChange(setThemeState);
    const stopFollowing = followSystemTheme();
    return () => {
      stopWatching();
      stopFollowing();
    };
  }, []);

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={dark}
      aria-label={dark ? "밝은 모드로 바꾸기" : "어두운 모드로 바꾸기"}
      title={dark ? "밝은 모드" : "어두운 모드"}
      className={`inline-flex items-center justify-center text-ink transition-opacity hover:opacity-60 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="block size-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dark ? (
          /* 달 — 어두운 모드일 때는 "지금 어둡다"를 보여준다 */
          <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.2 8.2 0 1 0 20 14.2Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
          </>
        )}
      </svg>
    </button>
  );
}
