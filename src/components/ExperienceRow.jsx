/**
 * MY WORK EXPERIENCE 목록의 한 행 — 순번 · 내용 · 연도(우측 정렬).
 * 피그마: 20:1118 (행 border-bottom 1px rgba(0,0,0,0.08) / pt 25px pb 6.96px / left 30 right 0)
 *   순번 20:1119~20:1125  시안 폭 200,  칼럼 pt 7.13 + 1  12px  Regular leading 24   opacity 0.762
 *   내용 20:1126~20:1132  폭 640,  칼럼 pt 13.12     14.7px Medium  leading 20.4 opacity 0.563
 *   연도 20:1133~20:1139  폭 300 (행 안 x=840),  칼럼 pt 20.04 + 4 14px Medium leading 16.8
 *        시안 opacity 는 0.332 지만 배경 대비가 2.29:1 로 읽기 어려워 0.55 로 올렸다
 *        (대비 4.52:1, WCAG AA 통과). 시안과 의도적으로 다른 유일한 값이다.
 *                          tracking 1.54px, 우측 정렬, uppercase
 * 칼럼마다 시작 높이가 달라 계단식으로 어긋나는 것이 시안 그대로다.
 *
 * 순번 칼럼 폭은 시안 그대로 200 을 쓰다가 요청으로 줄였다(40) — content/
 * portfolio.js 의 EXPERIENCE.rows 는 전부 index:"" 라 실제로는 빈 칸이었고,
 * 그 200 만큼 제목이 왼쪽에서 밀려나 있었다("왼쪽이 너무 치우쳤다"는 요청).
 * 순번을 나중에 다시 쓸 수도 있어 칼럼 자체는 남기고 폭만 줄였다.
 *
 * [오른쪽 여백이 컸던 이유] 세 칼럼(40+640+300=980)의 합이 행 폭(1264,
 * Experience.jsx 의 w-1264)보다 작아서, 기본 flex(justify 지정 없음)로는
 * 세 칼럼이 왼쪽부터 채워지고 남는 폭(1264-980=284)이 연도 뒤에 그대로
 * 빈 공간으로 남았다 — 즉 연도가 "오른쪽 끝에 붙어 있다"는 처음 짐작과
 * 달리 실제로는 행 중간쯤(980 지점)에서 끝나 있었다. 왼쪽 순번 칸을
 * 줄이고 나니 그 오른쪽 여백만 두드러져 보였다(요청으로 확인: "오른쪽
 * 텍스트 다음에 여백이 남는다"). 그래서 연도에 ml-auto 를 줘서 정말로
 * 행 오른쪽 끝까지 밀어붙이되, 행에도 순번 칸과 같은 폭(pr-40)만큼
 * 오른쪽 여백을 둬서 좌우가 같은 폭(40)으로 맞도록 했다. */
export default function ExperienceRow({
  index,
  title,
  year,
  className = "",
  style,
}) {
  return (
    <div
      className={`flex items-start border-b border-black-8 pt-25 pr-40 pb-[calc(6.96*var(--u))] ${className}`}
      style={style}
    >
      <span className="mt-[calc(8.13*var(--u))] w-40 shrink-0 font-sans text-label leading-body text-black opacity-[0.762]">
        {index}
      </span>
      <span className="mt-[calc(13.12*var(--u))] w-640 shrink-0 font-sans text-exp leading-exp font-medium text-black opacity-[0.563]">
        {title}
      </span>
      <span className="mt-[calc(24.04*var(--u))] ml-auto w-300 text-right font-sans text-body-sm leading-year font-medium tracking-wider text-black uppercase opacity-[0.55]">
        {year}
      </span>
    </div>
  );
}
