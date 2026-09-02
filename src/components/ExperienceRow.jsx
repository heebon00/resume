/**
 * MY WORK EXPERIENCE 목록의 한 행 — 순번 · 내용 · 연도(우측 정렬).
 * 피그마: 20:1118 (행 border-bottom 1px rgba(0,0,0,0.08) / pt 25px pb 6.96px / left 30 right 0)
 *   순번 20:1119~20:1125  폭 200,  칼럼 pt 7.13 + 1  12px  Regular leading 24   opacity 0.762
 *   내용 20:1126~20:1132  폭 640,  칼럼 pt 13.12     14.7px Medium  leading 20.4 opacity 0.563
 *   연도 20:1133~20:1139  폭 300 (행 안 x=840),  칼럼 pt 20.04 + 4 14px Medium leading 16.8
 *        시안 opacity 는 0.332 지만 배경 대비가 2.29:1 로 읽기 어려워 0.55 로 올렸다
 *        (대비 4.52:1, WCAG AA 통과). 시안과 의도적으로 다른 유일한 값이다.
 *                          tracking 1.54px, 우측 정렬, uppercase
 * 칼럼마다 시작 높이가 달라 계단식으로 어긋나는 것이 시안 그대로다.
 */
export default function ExperienceRow({
  index,
  title,
  year,
  className = "",
  style,
}) {
  return (
    <div
      className={`flex items-start border-b border-black-8 pt-25 pb-[calc(6.96*var(--u))] ${className}`}
      style={style}
    >
      <span className="mt-[calc(8.13*var(--u))] w-200 shrink-0 font-sans text-label leading-body text-black opacity-[0.762]">
        {index}
      </span>
      <span className="mt-[calc(13.12*var(--u))] w-640 shrink-0 font-sans text-exp leading-exp font-medium text-black opacity-[0.563]">
        {title}
      </span>
      <span className="mt-[calc(24.04*var(--u))] w-300 text-right font-sans text-body-sm leading-year font-medium tracking-wider text-black uppercase opacity-[0.55]">
        {year}
      </span>
    </div>
  );
}
