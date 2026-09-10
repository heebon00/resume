/**
 * 모바일 헤더 바 — 피그마 20:2492 (390 x 66.23, 모바일 시안 전용)
 *   20:2493 바   배경 #F6F6F6, px 20, 좌우 양끝 정렬
 *   20:2494 로고 자리 — 데스크톱 GNB 와 같은 BrandMark 를 쓴다(요청).
 *           예전에는 파비콘 이미지였다. 상하 여백 9 로 바 높이 67 을 맞춘다.
 *   20:2502 햄버거 버튼  pt 25.61 pb 25.62, 막대 묶음 20 x 15
 *           막대 1·3 = 20 x 2, 막대 2 = 16 x 2(가운데 정렬), 막대 간격 4.25
 */
import { mobileHref } from "../lib/sectionIds";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";

export default function MobileHeader({ open, onToggle, menuId }) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-header xl:hidden">
      <div className="mx-auto flex w-390 items-center justify-between px-20">
        <a
          href={mobileHref("hero")}
          className="flex items-center py-9"
          aria-label="HEEBON — 맨 위로"
        >
          {/* 데스크톱 GNB 와 같은 로고를 쓴다(요청). 예전에는 여기만 파비콘
              이미지(favicon-bon.png)였는데, 그건 모바일 시안 20:2494 의 로고
              자리를 임시로 채운 것이었고 데스크톱 로고는 나중에 따로 만들어져
              둘이 어긋나 있었다.
              글자·점 크기는 두 화면이 같고 안쪽 여백만 좁힌다 — 데스크톱 값
              (py-16)을 그대로 쓰면 표식만 61 이라 바 높이 66 을 넘는다. */}
          <BrandMark className="px-10 py-10" />
        </a>

        {/* 오른쪽 — 다크 모드 토글 + 햄버거.
            막대 색은 bg-black 이었는데 다크 모드에서 검은 바 위 검은 막대라
            안 보였다. 글자색을 따라가는 bg-ink 로 바꾼다. */}
        <div className="flex items-center gap-16">
          <ThemeToggle className="size-22" />

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            className="flex items-center justify-end"
          >
            <span className="flex h-15 w-20 flex-col items-center justify-between">
              <span className="block h-2 w-20 rounded-pill bg-ink" />
              <span className="block h-2 w-16 rounded-pill bg-ink" />
              <span className="block h-2 w-20 rounded-pill bg-ink" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
