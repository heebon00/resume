/**
 * 모바일 헤더 바 — 피그마 20:2492 (390 x 66.23, 모바일 시안 전용)
 *   20:2493 바   배경 #F6F6F6, px 20, 좌우 양끝 정렬
 *   20:2494 로고 자리 — 시안 로고 대신 본인 파비콘(public/favicon.png)을 넣었다.
 *           정사각이라 36 x 36, 상하 여백 15 로 바 높이 66 을 유지한다.
 *   20:2502 햄버거 버튼  pt 25.61 pb 25.62, 막대 묶음 20 x 15
 *           막대 1·3 = 20 x 2, 막대 2 = 16 x 2(가운데 정렬), 막대 간격 4.25
 */
import { mobileHref } from "../lib/sectionIds";

export default function MobileHeader({ open, onToggle, menuId }) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-header xl:hidden">
      <div className="mx-auto flex w-390 items-start justify-between px-20">
        <a
          href={mobileHref("hero")}
          className="flex items-center py-15"
          aria-label="맨 위로"
        >
          <img
            src="/favicon.png"
            alt="이희본 포트폴리오"
            width="36"
            height="36"
            loading="eager"
            className="block size-36"
          />
        </a>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          className="flex items-center justify-end pt-[calc(25.61*var(--u))] pb-[calc(25.62*var(--u))]"
        >
          <span className="flex h-15 w-20 flex-col items-center justify-between">
            <span className="block h-2 w-20 rounded-pill bg-black" />
            <span className="block h-2 w-16 rounded-pill bg-black" />
            <span className="block h-2 w-20 rounded-pill bg-black" />
          </span>
        </button>
      </div>
    </header>
  );
}
