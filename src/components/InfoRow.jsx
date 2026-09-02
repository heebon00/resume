/**
 * ABOUT ME 정보 표의 한 행 — 라벨(대문자) + 값 + 하단 구분선.
 * 피그마: 20:1037 (17.4px / Pretendard Regular / leading 32.4px / border-bottom 1px #b9b9b9
 *                 / pt 16.24px pb 16.64px / 값은 라벨 기준 149.61px 지점)
 */
export default function InfoRow({ label, value }) {
  return (
    <div className="w-full border-b border-line pt-[calc(16.24*var(--u))] pb-[calc(16.64*var(--u))]">
      <div className="flex font-sans text-table leading-table text-black">
        <span className="w-[calc(149.61*var(--u))] shrink-0 uppercase">
          {label}
        </span>
        <span>{value}</span>
      </div>
    </div>
  );
}
