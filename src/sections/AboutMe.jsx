import { useCallback, useRef } from "react";
import InfoRow from "../components/InfoRow";
import SafeImage from "../components/SafeImage";
import SectionHeading from "../components/SectionHeading";
import { ABOUT, IMAGES } from "../content/portfolio";
import useScrollProgress from "../lib/useScrollProgress";
import decorArrow from "../assets/icons/decor-arrow.svg";

/**
 * ABOUT ME — 피그마의 조각들을 한 섹션으로 묶는다.
 *   20:985  Services Section  라벨 바 "About / 01" + 하단 실선
 *           (섹션 y=913, 바 left 360 / right 360 / top 386 / h 30 → 캔버스 left 263, top 1299)
 *   120:55 인물 사진             캔버스 left 139, top 1330, 869 x 551
 *   20:1590 figure.loaded 장식 화살표   캔버스 left 898, top 1581.5, 111.53 x 110.9
 *   20:1011 div.row  제목/소개/정보표  캔버스 left 953.5, top 1363, 818 x 552.56
 *
 * 캔버스 좌표 = 피그마 Sections Wrapper 좌표 - 97 (히어로 "co" 프레임의 x 오프셋).
 * 정보표 5행의 값이 시안에 모두 "이희본"으로 동일하게 적혀 있어 그대로 옮긴다.
 * 스톡 모델 사진(20:1669 등)은 요청대로 계속 빼둔 상태다.
 *
 * [스크롤 연동]
 * 화살표 꼬리(왼쪽 끝)를 축으로 삼아, 스크롤에 따라 화살표 끝이
 * "— ABOUT ME" 제목에서 아래 정보표까지 글줄을 훑어 내려간다.
 * 소개 4줄은 화살표가 그 줄을 지나는 순간에 하나씩 켜진다.
 * 스크롤이 끝나면 시안 그대로의 각도(0°)로 돌아온다.
 */

// 회전축 — 화살표 SVG 꼬리 끝의 위치(박스 기준 비율)와 캔버스 좌표
const PIVOT_ORIGIN = "1.4% 11.7%";
const PIVOT_X = 899.6;
const PIVOT_Y = 1594.5;

// 회전 0° 일 때 화살표 끝이 향하는 방향(수평 기준 아래쪽 각도)
const NATIVE_DEG = 41.6;

// 화살표가 훑는 글줄 — 텍스트 왼쪽 끝 x, 그리고 시작/끝 y
const TEXT_X = 1110.4;
const AIM_FROM = 1387.2; // "— ABOUT ME" 제목
const AIM_TO = 1781.7; // 정보표 아래쪽 (= 시안 각도 0°)

// 소개 4줄의 y — 화살표가 이 높이를 지날 때 한 줄씩 켜진다
const LINE_Y = [1423.3, 1447.3, 1471.3, 1495.3];
const LINE_STEPS = LINE_Y.map((y) => (y - AIM_FROM) / (AIM_TO - AIM_FROM));

// 스크롤 진행도 중 실제로 화살표가 움직이는 구간
// (0 = 블록이 화면 아래끝에 닿음, 1 = 화면 위로 완전히 빠져나감)
const WINDOW_FROM = 0.2;
const WINDOW_TO = 0.62;

const angleFor = (aimY) =>
  (Math.atan2(aimY - PIVOT_Y, TEXT_X - PIVOT_X) * 180) / Math.PI - NATIVE_DEG;

export default function AboutMe() {
  const blockRef = useRef(null);
  const arrowRef = useRef(null);
  const lineRefs = useRef([]);

  const onProgress = useCallback((p) => {
    const t = Math.min(
      1,
      Math.max(0, (p - WINDOW_FROM) / (WINDOW_TO - WINDOW_FROM)),
    );

    const arrow = arrowRef.current;
    if (arrow) {
      const angle = angleFor(AIM_FROM + (AIM_TO - AIM_FROM) * t);
      arrow.style.transform = `rotate(${angle.toFixed(2)}deg)`;
    }

    for (let i = 0; i < lineRefs.current.length; i += 1) {
      const line = lineRefs.current[i];
      if (!line) continue;
      if (t >= LINE_STEPS[i]) line.setAttribute("data-shown", "");
      else line.removeAttribute("data-shown");
    }
  }, []);

  useScrollProgress(blockRef, onProgress);

  return (
    <section id="about" aria-label="ABOUT ME">
      {/* 20:985 라벨 바 */}
      <div
        className="absolute top-1299 left-263 h-30 w-1424 border-b border-black"
        data-reveal
      >
        <div className="flex items-start justify-between pt-7 pb-5">
          <span className="font-sans text-[calc(11.8*var(--u))] leading-label tracking-wide font-medium text-black uppercase">
            {ABOUT.barLeft}
          </span>
          <span className="font-sans text-label leading-label tracking-wide font-medium text-black uppercase">
            {ABOUT.barRight}
          </span>
        </div>
      </div>

      {/* 120:55 인물 사진 */}
      <SafeImage
        src={IMAGES.aboutPortrait}
        alt={ABOUT.portraitAlt}
        width={869}
        height={551}
        className="absolute top-1330 left-139"
        data-reveal
      />

      {/* 20:1590 장식 화살표 — 회전 기준점을 왼쪽 끝에 둔다 */}
      <img
        ref={arrowRef}
        src={decorArrow}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ transformOrigin: PIVOT_ORIGIN }}
        className="absolute top-[calc(1581.5*var(--u))] left-898 h-[calc(110.9*var(--u))] w-[calc(111.53*var(--u))] will-change-transform"
      />

      {/* 20:1011 제목 · 소개 · 정보표 */}
      <div
        ref={blockRef}
        className="absolute top-1363 left-953.5 flex h-[calc(552.56*var(--u))] w-818 flex-col justify-center"
      >
        {/* 20:1019 컬럼 682.5 (pl 112.5 / pr 15) → 20:1020 555 (pl 44.391 / pr 38.844) */}
        <div className="flex w-682.5 flex-col pr-15 pl-112.5">
          <div className="flex flex-col pr-[calc(38.844*var(--u))] pl-[calc(44.391*var(--u))] pb-28">
            <div className="pt-3.5 pb-[calc(16.34*var(--u))]">
              <SectionHeading as="h2">{ABOUT.heading}</SectionHeading>
            </div>

            {ABOUT.introLines.length > 0 && (
              <div className="pb-36">
                {ABOUT.introLines.map((line, i) => (
                  <p
                    key={line}
                    ref={(node) => {
                      lineRefs.current[i] = node;
                    }}
                    className="intro-line font-sans text-body leading-body tracking-body whitespace-nowrap text-black"
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}

            {ABOUT.rows.map(({ label, value }) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
