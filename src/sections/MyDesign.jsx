import { useState } from "react";
import SafeImage from "../components/SafeImage";
import { box, du } from "../lib/design";
import arrowLeft from "../assets/icons/icon-arrow-left.svg";
import arrowRight from "../assets/icons/icon-arrow-right.svg";
import arrowRightSm from "../assets/icons/icon-arrow-right-sm.svg";
import { DESIGN } from "../content/portfolio";

/**
 * MY DESIGN — 피그마 20:1295 "Projects Section" (섹션 y=4695.23)
 *   20:1296 div.ld-container  캔버스 left 390, top 4755.23, 1170 x 638
 *     20:1300 왼쪽 칼럼 390  제목 "— MY Design"(40px SemiBold, leading 33.92) +
 *                            필터 목록 5개 + "See more" 링크
 *     20:1331 오른쪽 칼럼 780  20:1332 div.carousel-items(1154, pl 50)
 *              카드 6장이 730 간격으로 이어지고, 화면 밖으로 나가는 부분은 잘린다.
 *              5·6번 카드는 시안에서 이미지 opacity 0 이라 렌더링하지 않는다.
 *              1번 카드에만 25% 검정 오버레이 + 세로 텍스트가 보인다(2~4번은 opacity 0).
 *     20:1427 좌우 화살표 버튼 50 x 50 (캔버스 left 845, top 5233.23)
 * 시안은 정적이지만, 요청으로 화살표를 눌러 카드를 한 장씩 넘길 수 있게 했다.
 * 카드 좌표는 그대로 두고 카드 묶음 전체를 STEP(=카드 간격) 만큼 밀어서 넘긴다.
 */

// 카드 배치·크롭 — 내용은 content/portfolio.js 를 쓴다.
const PLACEMENT = {
  "dubai-skyline": {
    left: 0,
    imgClassName: "h-full w-[106.38%] left-[-3.19%] top-0",
    overlay: true,
  },
  "dark-building": {
    left: 730,
    imgClassName: "h-[170%] w-full left-0 top-[-35%]",
  },
  "white-curve": {
    left: 1460,
    imgClassName: "h-[103.7%] w-full left-0 top-[-1.85%]",
  },
  resort: {
    left: 2190,
    imgClassName: "h-[168.15%] w-full left-0 top-[-34.07%]",
  },
};

const CARDS = DESIGN.cards.map((card) => ({ ...card, ...PLACEMENT[card.id] }));

// 카드 간격 — PLACEMENT 의 left 가 730 씩 늘어난다. 한 번 누르면 이만큼 민다.
const STEP = 730;

// 필터 목록의 글자 크기·밑줄 형태(20:1310 / 20:1313 …)
const FILTER_STYLE = [
  { size: 14.8, bar: true },
  { size: 15 },
  { size: 15, uppercase: true },
  { size: 15, uppercase: true },
  { size: 15 },
];

const FILTERS = DESIGN.filters.map((label, i) => ({
  label,
  ...FILTER_STYLE[i],
}));

/** 90도 돌아간 한 줄 — 카드 1의 세로 텍스트에 쓴다. */
function VerticalLine({ height, size, z, children }) {
  return (
    <div
      className="relative flex w-23 items-center justify-center"
      style={{ height: du(height), zIndex: z }}
    >
      <div className="rotate-90">
        <p
          className="leading-desc whitespace-nowrap text-white-70"
          style={{ fontSize: du(size) }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}

/** 90도 돌아간 제목 조각 — 카드 1의 "— / Modern Architecture". */
function VerticalTitle({ top, width, children }) {
  return (
    <div
      className="absolute flex -translate-y-1/2 items-center justify-center"
      style={{
        left: du(-3.04),
        top: du(top),
        height: du(width),
        width: du(37),
      }}
    >
      <div className="rotate-90">
        <p
          className="text-title-sm leading-[calc(36.96*var(--u))] text-white"
          style={{ width: du(width) }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}

export default function MyDesign() {
  // 현재 맨 앞에 보이는 카드 번호. 0 부터 CARDS.length - 1 까지.
  const [index, setIndex] = useState(0);
  const lastIndex = CARDS.length - 1;

  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!CARDS.length) return null;

  return (
    <section id="design" aria-label="MY DESIGN">
      <div
        className="absolute"
        data-reveal
        style={box({ left: 390, top: 4755.23, width: 1170, height: 638 })}
      >
        {/* 20:1300 왼쪽 칼럼 */}
        <div
          className="absolute flex flex-col px-15"
          style={box({ left: 0, top: 0, width: 390, height: 638 })}
        >
          <div className="flex flex-col gap-[calc(14.6*var(--u))] pt-3.5 pb-[calc(81.99*var(--u))]">
            <h2 className="pb-[calc(41.41*var(--u))] font-sans text-heading leading-[calc(33.92*var(--u))] font-semibold text-black">
              {DESIGN.heading}
            </h2>

            <div className="flex flex-col">
              <ul
                className="relative flex flex-col gap-[calc(23.7*var(--u))] pb-[calc(24.76*var(--u))]"
                style={{ width: du(87.5) }}
              >
                {FILTERS.map((filter, i) => (
                  <li
                    key={`${filter.label}-${i}`}
                    className="relative pb-[calc(0.98*var(--u))]"
                  >
                    <span
                      className={`block whitespace-nowrap text-black leading-desc ${
                        filter.bar ? "" : "underline decoration-solid"
                      } ${filter.uppercase ? "uppercase" : ""}`}
                      style={{ fontSize: du(filter.size) }}
                    >
                      {filter.label}
                    </span>
                    {filter.bar && (
                      <span
                        aria-hidden="true"
                        className="absolute right-0 left-0 block bg-ink"
                        style={{ height: du(1), bottom: du(2.25) }}
                      />
                    )}
                  </li>
                ))}
              </ul>

              <p className="flex items-center pb-7">
                <span
                  className="whitespace-nowrap text-black leading-desc"
                  style={{ fontSize: du(13.7) }}
                >
                  {DESIGN.moreLabel}
                </span>
                <span className="flex pl-8">
                  <img
                    src={arrowRightSm}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="block -scale-y-100"
                    style={{ width: du(14), height: du(14) }}
                  />
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 20:1332 카드 목록 — 오른쪽 칼럼(390) + pl 50 → 카드 시작 440(=컨테이너 455).
            보이는 창은 시안과 같은 455 ~ 1530 (캔버스 845 ~ 1920) 이고, 그 밖으로
            나가는 카드는 이 창에서 잘린다. 예전에는 App.jsx 의 overflow-hidden 이
            대신 잘라 줬지만, 카드를 왼쪽으로 밀면 왼쪽 칼럼(제목·필터)을 덮어
            버리므로 창을 따로 둔다. */}
        <div
          className="absolute overflow-hidden"
          style={box({ left: 455, top: 3, width: 1075, height: 525 })}
        >
          <div
            className="design-track absolute inset-0"
            style={{ transform: `translateX(${du(-STEP * index)})` }}
          >
            {CARDS.map((card) => (
              <div
                key={card.id}
                className="absolute overflow-hidden rounded-[calc(5*var(--u))]"
                data-cursor="drag"
                style={box({
                  left: card.left,
                  top: 0,
                  width: 700,
                  height: 525,
                })}
              >
                <SafeImage
                  src={card.src}
                  alt={card.alt}
                  className="absolute inset-0 size-full"
                  imgClassName={`absolute max-w-none object-cover ${card.imgClassName}`}
                />
                {card.overlay && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-black-25"
                    />
                    <div className="absolute top-0 left-0 flex h-525 w-700 items-start justify-end">
                      <div className="rotate-180">
                        <div className="flex h-525 items-start py-40 pr-40 pl-[calc(37.98*var(--u))]">
                          <div className="relative flex items-start pr-2">
                            <VerticalLine height={62} size={14} z={3}>
                              {DESIGN.cardLines[2]}
                            </VerticalLine>
                            <VerticalLine height={341} size={13.3} z={2}>
                              {DESIGN.cardLines[1]}
                            </VerticalLine>
                            <VerticalLine height={396} size={13.3} z={1}>
                              {DESIGN.cardLines[0]}
                            </VerticalLine>
                          </div>
                          <div
                            className="relative"
                            style={{ height: du(445), width: du(36.96) }}
                          >
                            <VerticalTitle top={6.09} width={19.182}>
                              —
                            </VerticalTitle>
                            <VerticalTitle top={127.34} width={203.155}>
                              {DESIGN.cardTitle}
                            </VerticalTitle>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 20:1427 좌우 화살표 — 시안의 왼쪽 화살표 opacity 0.5 는 "더 갈 곳이
            없는 상태" 로 옮겼다(맨 앞/맨 뒤에서 흐려지고 눌리지 않는다). */}
        <div
          className="absolute z-10 flex"
          style={box({ left: 455, top: 478 })}
        >
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            aria-label="이전 디자인 보기"
            className="flex size-50 cursor-pointer items-center justify-center bg-white drop-shadow-[0_calc(7*var(--u))_calc(14*var(--u))_rgba(0,0,0,0.12)] disabled:cursor-default disabled:opacity-[0.5]"
          >
            <img
              src={arrowLeft}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="block size-16"
            />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(lastIndex, i + 1))}
            disabled={index === lastIndex}
            aria-label="다음 디자인 보기"
            className="flex size-50 cursor-pointer items-center justify-center bg-white drop-shadow-[0_calc(7*var(--u))_calc(14*var(--u))_rgba(0,0,0,0.12)] disabled:cursor-default disabled:opacity-[0.5]"
          >
            <img
              src={arrowRight}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="block size-16"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
