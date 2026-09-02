/**
 * 모바일 섹션 제목 — "— ABOUT ME" 형태.
 * 크기·행간은 모바일 시안의 소제목 값(24px / leading 40.32, 20:1839)을 따른다.
 */
export default function MobileSectionHeading({ children, className = "" }) {
  return (
    <h2
      className={`font-sans text-[calc(24*var(--u))] leading-[calc(40.32*var(--u))] font-bold tracking-heading text-black uppercase ${className}`}
    >
      — {children}
    </h2>
  );
}
