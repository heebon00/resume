import { useEffect, useRef } from "react";

/**
 * 모바일 전체화면 오버레이 메뉴 — 이 페이지의 유일한 JS 동작.
 *
 * [디자인 근거에 대한 메모]
 * 모바일 시안(20:2492)에는 햄버거 버튼만 있고 열린 메뉴 화면은 없다.
 * 그래서 항목 문구는 새로 만들지 않고, 시안에 실제로 적혀 있는 섹션 제목을
 * 그대로 가져와 각 섹션 앵커로 연결했다. 열린 메뉴의 배경·타이포는
 * 헤더 바(#F6F6F6)와 본문 서체를 따른다.
 */

const ITEMS = [
  { href: "#about", label: "ABOUT ME" },
  { href: "#experience", label: "MY WORK EXPERIENCE" },
  { href: "#projects", label: "MY PROJECTS" },
  { href: "#design", label: "MY DESIGN" },
  { href: "#skills", label: "MY SKILLS" },
  { href: "#contact", label: "CONTACT" },
];

export default function MobileMenu({ open, onClose, menuId }) {
  const firstItemRef = useRef(null);

  // 메뉴를 열면 첫 항목으로 포커스를 옮긴다. 그러지 않으면 키보드 사용자가
  // 오버레이 뒤쪽을 계속 훑게 된다. (페이지 본문은 App 에서 inert 로 막는다)
  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  // 메뉴가 열려 있는 동안에는 뒤 페이지가 스크롤되지 않게 한다.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Esc 로도 닫는다.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <nav
      id={menuId}
      hidden={!open}
      aria-label="주요 메뉴"
      className="fixed inset-0 z-40 bg-header xl:hidden"
    >
      <div className="mx-auto flex h-full w-390 flex-col justify-center gap-24 px-20 pt-66">
        {ITEMS.map((item, i) => (
          <a
            key={item.href}
            ref={i === 0 ? firstItemRef : undefined}
            href={item.href}
            onClick={onClose}
            className="font-sans text-heading leading-heading font-bold tracking-heading text-black uppercase"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
