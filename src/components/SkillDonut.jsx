import { DONUT_TRACK } from "../lib/donuts";

/**
 * MY SKILLS 숙련도 도넛 — 트랙(시안에서 내보낸 white 10% 링) 위에 진행 호를 그린다.
 *
 * 진행 호는 시안 SVG 를 그대로 쓰지 않고 같은 형상을 그린다. 시안에서 실측한 값:
 *   바깥 반지름 32 / 안쪽 23.04 → 선 두께 8.96, 중심선 반지름 27.52
 *   끝 모양 둥근 캡, 색 #D83840, 12시 방향에서 시계 방향으로 진행
 * 이렇게 해야 화면에 들어올 때 0 에서 목표치까지 채워지는 애니메이션을 줄 수 있다.
 * (내보낸 호 SVG 는 고정 이미지라 채움 표현이 불가능하다)
 */

const RADIUS = 27.52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 172.92

export default function SkillDonut({ percent, size = 64, fontSize = 16 }) {
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <span
      className="relative block shrink-0"
      data-reveal
      style={{
        width: `calc(${size} * var(--u))`,
        height: `calc(${size} * var(--u))`,
      }}
    >
      <img
        src={DONUT_TRACK}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 size-full"
      />
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          className="donut-arc"
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="#D83840"
          strokeWidth="8.96"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={{
            "--arc-length": CIRCUMFERENCE,
            "--arc-offset": offset,
          }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-sans font-bold text-white"
        style={{ fontSize: `calc(${fontSize} * var(--u))` }}
      >
        {percent}%
      </span>
    </span>
  );
}
