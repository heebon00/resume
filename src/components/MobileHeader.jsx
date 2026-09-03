import brandLogo from "../assets/icons/logo-brand.svg";
import { mobileHref } from "../lib/sectionIds";

/**
 * 모바일 헤더 바 — 피그마 20:2492 (390 x 66.23, 모바일 시안 전용)
 *   20:2493 바   배경 #F6F6F6, px 20, 좌우 양끝 정렬
 *   20:2494 로고 py 22, SVG 49.324 x 22.254
 *   20:2502 햄버거 버튼  pt 25.61 pb 25.62, 막대 묶음 20 x 15
 *           막대 1·3 = 20 x 2, 막대 2 = 16 x 2(가운데 정렬), 막대 간격 4.25
 * 로고에는 시안에 이동 대상이 없어 링크를 걸지 않고, 페이지 맨 위로만 이동시킨다.
 */
export default function MobileHeader({ open, onToggle, menuId }) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-header xl:hidden">
      <div className="mx-auto flex w-390 items-start justify-between px-20">
        <a
          href={mobileHref("hero")}
          className="flex items-center py-22"
          aria-label="맨 위로"
        >
          <img
            src={brandLogo}
            alt="이희본 포트폴리오"
            loading="eager"
            className="block"
            style={{
              width: "calc(49.324 * var(--u))",
              height: "calc(22.254 * var(--u))",
            }}
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
