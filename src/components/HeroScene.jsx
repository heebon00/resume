import { Suspense, lazy, useEffect, useState } from "react";
import { onIntroDone } from "../lib/intro";

/**
 * 히어로 배경(WavyCubes)을 "나중에" 불러오는 껍데기.
 *
 * 데스크톱·모바일 히어로가 둘 다 이 컴포넌트를 쓴다. 안에 든 그림은
 * components/WavyCubes.jsx 그대로이고 이 파일은 불러오는 시점만 바꾼다 —
 * 화면에 보이는 결과는 같다.
 *
 * [왜 나눴나]
 * WavyCubes 는 Three.js 를 통째로 끌고 온다. 그런데 정적 import 로 두면 그게
 * 첫 화면 번들(main-*.js) 안에 함께 묶여, 브라우저가 그 덩어리를 다 해석할
 * 때까지 화면이 멈춘다. 2026-09-10 검사에서 이 번들 하나가 감속된 모바일
 * 기준으로 메인 스레드를 13.3초 잡았다(docs/web-check-2026-09-10.md 4장).
 * lazy() 로 떼어내면 Three.js 가 별도 파일로 빠지고, 첫 화면은 그것을 기다리지
 * 않는다.
 *
 * [왜 인트로가 끝난 뒤에 붙이나]
 * 떼어내기만 하면 파일만 나뉠 뿐 곧바로 받아서 해석하기 시작한다 — 첫 화면을
 * 그리는 일과 여전히 경쟁한다. 로딩 화면이 걷히는 신호(lib/intro.js 의
 * INTRO_DONE)를 기다렸다가 붙이면, 첫 화면이 다 그려진 뒤에 Three.js 일이
 * 시작된다. 사용자가 히어로를 처음 보는 순간이 곧 로딩 화면이 걷히는 순간이라,
 * 큐브는 그 직후에 들어온다.
 *
 * [모션 줄이기 설정]
 * 그 경우 WavyCubes 는 원래도 캔버스를 만들지 않았지만, 여기서 아예 붙이지
 * 않으면 Three.js 파일 자체를 받지 않는다.
 *
 * [큐브가 오기 전 화면]
 * fallback 은 null 이다. 그동안 히어로는 .hero-fill 의 바탕색(--color-paper-alt)
 * 으로 남는다. 큐브의 대기 상태도 밝은 격자라 색 차이가 크지 않지만, 느린
 * 회선에서는 밋밋한 바탕이 잠깐 보였다가 격자가 들어오는 것이 보일 수 있다.
 */
const WavyCubes = lazy(() => import("./WavyCubes"));

export default function HeroScene({ className, style }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return onIntroDone(() => setShow(true));
  }, []);

  if (!show) return null;

  return (
    <Suspense fallback={null}>
      <WavyCubes className={className} style={style} />
    </Suspense>
  );
}
