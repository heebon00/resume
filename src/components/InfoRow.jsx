/**
 * ABOUT ME 정보 표의 한 행 — 라벨(대문자) + 값 + 하단 구분선.
 * 피그마: 20:1037 (17.4px / Pretendard Regular / leading 32.4px / border-bottom 1px #b9b9b9
 *                 / pt 16.24px pb 16.64px / 값은 라벨 기준 149.61px 지점)
 */
export default function InfoRow({ label, value }) {
  // 위아래 여백은 시안이 16.24 / 16.64 였는데, 행이 늘면서 정보표가 담긴
  // 상자를 넘쳐 위 구분선과 겹쳤다(AboutMe.jsx 주석 참조).
  // 12 / 12 로 조여 한 행마다 8.9 씩, 여섯 행에서 53 을 줄인다.
  return (
    <div className="w-full border-b border-line pt-12 pb-12">
      <div className="flex font-sans text-table leading-table text-ink">
        <span className="w-[calc(149.61*var(--u))] shrink-0 uppercase">
          {label}
        </span>
        {/* pre-line — 값에 
 이 있으면 그 자리에서 줄을 나눈다(요청).
            줄바꿈이 없는 행은 지금까지와 똑같이 그려진다. */}
        <span className="whitespace-pre-line">{value}</span>
      </div>
    </div>
  );
}
