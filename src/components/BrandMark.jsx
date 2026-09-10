import { useEffect, useState } from "react";
import { onIntroDone } from "../lib/intro";

/**
 * 로고 — "HEEBON" 글자 위아래에 점선이 한 줄씩 붙은 표식.
 *
 * 데스크톱 GNB(DesktopNav)와 모바일 헤더(MobileHeader)가 함께 쓴다.
 * 원래는 DesktopNav 안에만 있었고 모바일은 파비콘 이미지를 쓰고 있었는데,
 * 두 화면의 로고가 서로 다르다는 요청으로 여기로 꺼내 공용으로 만들었다.
 * 크기 차이는 className 으로 들어오는 안쪽 여백뿐이고, 글자·점의 크기는
 * 두 화면이 같다(아래 참조).
 *
 * [이미지가 아니라 DOM 요소로 다시 그린 이유]
 * 참고한 로고("HEEBON" 위아래 점선, 직접 확인)를 이미지 그대로 쓰면 점이
 * 낱개 요소가 아니라서 "가운데부터 하나씩 퍼지며 나타나는" 효과(요청)를 걸
 * 수 없다. 그래서 이미지를 참고만 하고 점을 실제 요소로 다시 만들었다.
 * 색은 이미지의 크림슨(#D4183D, --color-tag-crimson), 뒤 배경(#505050)도
 * 이미지에서 스포이트로 딴 값이다(index.css 의 brand-mark-bg).
 *
 * [글자·점 크기에 --u 를 쓰지 않는 이유]
 * 이 표식은 시안 캔버스에 있는 요소가 아니라 화면 어디서나 같은 크기로
 * 보여야 하는 표식이다. --u 를 쓰면 데스크톱(1920 기준)과 모바일(390 기준)
 * 에서 배율이 달라진다. 그래서 index.css 에서 px 로 못 박았다.
 *
 * [애니메이션을 마운트 직후에 걸지 않는 이유]
 * 이 컴포넌트는 인트로 로딩 화면(IntroLoader)이 화면을 덮고 있는 동안에도
 * 이미 마운트돼 있다. 마운트 즉시 애니메이션을 걸면 로딩 화면 뒤에서 다
 * 끝나버려서, 로딩이 걷힌 뒤에는 언제나 "이미 완성된" 정지 상태만 보인다
 * (요청으로 발견). 그래서 히어로(useIntroReveal)와 같은 방식으로 lib/intro.js
 * 의 INTRO_DONE 신호를 받은 뒤에야 brand-mark-ready 를 붙인다.
 */

// 로고 위아래에 붙는 점선 한 줄 — 가운데 점이 가장 먼저, 바깥쪽으로
// 갈수록 늦게 나타난다(요청). 지연 시간을 가운데로부터의 거리에 정비례로
// 주는 것만으로 이 순서가 나온다 — 별도 타임라인·JS 라이브러리 없이
// CSS 애니메이션(brand-dot-in, index.css 참조)의 delay 만으로 처리한다.
const DOT_COUNT = 22;
const DOT_STEP = 0.025; // 점 하나당 지연 차이(초)

function BrandDots() {
  const mid = (DOT_COUNT - 1) / 2;
  return (
    <span className="brand-dots flex w-full justify-between" aria-hidden="true">
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <span
          key={i}
          className="brand-dot"
          style={{ animationDelay: `${Math.abs(i - mid) * DOT_STEP}s` }}
        />
      ))}
    </span>
  );
}

/**
 * @param className 안쪽 여백만 바꾼다. 데스크톱은 기본값, 모바일은 헤더 바
 *                  높이에 맞춰 더 좁게 넘긴다.
 *
 * 좌우 여백은 요청으로 24 -> 14 로 줄였다. 글자 양옆이 허전해 보인다는
 * 것인데, 점선이 상자 폭에 맞춰 늘어나므로(justify-between) 여백을 줄이면
 * 점선도 함께 좁아져 표식이 글자에 붙어 보인다. 위아래 여백은 그대로다.
 */
export default function BrandMark({ className = "px-14 py-16" }) {
  const [ready, setReady] = useState(false);
  useEffect(() => onIntroDone(() => setReady(true)), []);

  return (
    <span
      className={`brand-mark-bg inline-flex flex-col items-center gap-4 ${className}${
        ready ? " brand-mark-ready" : ""
      }`}
    >
      <BrandDots />
      <span className="brand-mark-text font-condensed font-extrabold tracking-wide uppercase">
        Heebon
      </span>
      <BrandDots />
    </span>
  );
}
