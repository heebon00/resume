import { useEffect, useRef } from "react";
import gsap from "gsap";
import SlicedText from "../components/SlicedText";
import SafeImage from "../components/SafeImage";
import StrokedText from "../components/StrokedText";
import { HERO, IMAGES } from "../content/portfolio";
import { box, du } from "../lib/design";
import {
  FADE_IN,
  INTRO_DONE,
  LETTER_IN,
  LETTER_STAGGER,
} from "../lib/intro";

/**
 * 히어로 — 피그마 76:195 "co" (1920 x 888), 캔버스 top 154
 *
 * [2026-09-07 개편 — 시안에서 벗어난 구간]
 * 요청으로 tympanus.net/Development/FancyLetterAnimation 의 글자 표현을 따랐다(55.md).
 *   · 초록 카피(좋아하는 일은 / 애정을,) → 데모의 effect 2 색
 *   · 빨강 카피(맡은 임무는 / 책임감을) → 데모의 effect 4 색
 * 배치는 앞서 잡아 둔 것을 그대로 쓴다(카피 가운데 · 사진 아래).
 * 글자는 하나도 바꾸지 않고 배치·색만 옮겼다.
 *   · 배경을 먹색으로 깔고 카피를 가운데 쌓은 뒤, 그 아래 인물 사진을 둔다
 *     (참고 사이트의 세로 배분 32% / 15% / 35% / 18% 을 우리 상자에 맞춘 값)
 *   · 색은 참고 사이트 팔레트 그대로 — 배경 #1c1c21, 라벨 #fdf7b5
 *     (--color-hero-* · --color-letter* 로 등록. index.css 참조)
 *   · 200% · 300% 태그는 사진 양옆으로 빼고 크기를 줄였다. 어두운 배경이라
 *     흰 채움을 없애고 테두리·글자만 남긴다.
 * 원래 시안 배치(사진 가운데 · 흰 배경 · 초록/빨강 카피)는 git 이력에 남아 있다.

 */

// 태그는 시안 크기 그대로면 사진 옆에서 너무 커서 줄여 붙인다.
// 시안 값(98:135 / 98:120)에 이 비율만 곱해 쓴다 — 임의 수치를 새로 만들지 않는다.
const TAG_SCALE = 0.6;
const s = (n) => du(n * TAG_SCALE);

// 사진 — 원본 1099 x 744 의 가로세로비를 지키며 가운데에 놓는다.
const PHOTO = { top: 505, height: 355 };
const PHOTO_W = Math.round(PHOTO.height * (1099 / 744));
const PHOTO_LEFT = Math.round((1920 - PHOTO_W) / 2);


/**
 * 200% · 300% 태그 — 어두운 배경 위라 채움 없이 테두리와 글자만 남긴다.
 * 색은 각 카피가 쓰는 효과의 앞색을 그대로 따른다.
 */
function Tag({ label, color, left, top, width, height, padX, padY, fontSize, tilt }) {
  return (
    <div data-intro-fade className="absolute" style={box({ left, top })}>
      <div style={{ transform: `rotate(${tilt}deg)` }}>
        <div
          className="flex items-start"
          style={{
            width: s(width),
            height: s(height),
            borderWidth: s(3),
            borderStyle: "solid",
            borderColor: color,
            paddingInline: s(padX),
            paddingBlock: s(padY),
          }}
        >
          <span
            className="font-stencil leading-tag font-extrabold whitespace-nowrap uppercase"
            style={{ fontSize: s(fontSize), color }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

// 데모 effect 2 · 4 의 세 겹. 굵은 것부터 깔아야 세 색이 다 보인다(StrokedText 주석 참조).
//
// 데모 굵기는 10 / 4 / 1 인데, 그건 알파벳 한 줄 획 기준이다. 한글은 획이 촘촘해서
// 그대로 쓰면 속공간이 메워져 글자가 뭉갠다. 비율은 지키고 크기만 이 값으로 줄인다.
// 더 얇게/굵게는 이 숫자 하나만 바꾸면 된다.
const STROKE_SCALE = 0.3;
const w = (n) => n * STROKE_SCALE;

const LAYERS_2 = [
  { color: "var(--color-letter2-back)", width: w(10) },
  { color: "var(--color-letter2-mid)", width: w(4) },
  { color: "var(--color-letter2-front)", width: w(1) },
];
const LAYERS_4 = [
  { color: "var(--color-letter4-back)", width: w(10) },
  { color: "var(--color-letter4-mid)", width: w(4) },
  { color: "var(--color-letter4-front)", width: w(1) },
];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return undefined;

    const letters = scope.querySelectorAll("[data-letter]");
    const rest = scope.querySelectorAll("[data-intro-fade]");

    gsap.set(letters, { opacity: 0 });
    gsap.set(rest, { opacity: 0, y: 20 });

    const play = () => {
      gsap
        .timeline()
        .to(letters, {
          ...LETTER_IN,
          y: 0,
          startAt: { y: LETTER_IN.y, opacity: 0 },
          opacity: 1,
          stagger: LETTER_STAGGER,
        })
        .to(rest, { ...FADE_IN, opacity: 1, y: 0, stagger: 0.06 }, "-=0.8");
    };

    window.addEventListener(INTRO_DONE, play, { once: true });
    return () => window.removeEventListener(INTRO_DONE, play);
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      className="absolute top-154 left-0 h-888 w-1920 overflow-hidden"
    >
      <div className="absolute top-0 left-0 h-888 w-1920 bg-hero-bg">
        {/* 폰트를 21→24로 키우면서 상자가 좁아 SlicedText 조각(clip-path 가 상자
            폭 기준 %)이 글자 일부를 잘라먹었다 — 요청대로 안쪽으로 당기고
            상자도 넉넉하게 키웠다. */}
        <SlicedText
          data-intro-fade
          className="absolute top-51 left-75 h-30 w-125 font-sans text-nav font-extrabold text-hero-label uppercase">
          {HERO.labelLeft}
        </SlicedText>

        <SlicedText
          data-intro-fade
          className="absolute top-54 left-1705 h-30 w-150 font-sans text-nav leading-nav font-extrabold text-hero-label uppercase">
          {HERO.labelRight}
        </SlicedText>

        {/* 카피 — 참고 사이트처럼 가운데로 쌓는다. 줄간격 0.9 도 그쪽 값이다. */}
        <h1
          className="absolute left-0 w-1920 text-center font-display leading-[0.9] font-extrabold"
          style={box({ top: 110 })}
        >
          {[
            { text: HERO.greenLines[0], size: "text-display-sm", l: LAYERS_2 },
            { text: HERO.greenLines[1], size: "text-display-sm", l: LAYERS_2 },
            { text: HERO.redLines[0], size: "text-display", l: LAYERS_4 },
            { text: HERO.redLines[1], size: "text-display", l: LAYERS_4 },
          ].map((line, i) => (
            <StrokedText
              key={i}
              text={line.text}
              layers={line.l}
              className={`block ${line.size}`}
            />
          ))}
        </h1>

        {/* 66:174 인물 이미지 — 카피 아래 가운데 */}
        <div
          data-intro-fade
          className="absolute overflow-hidden"
          style={box({
            left: PHOTO_LEFT,
            top: PHOTO.top,
            width: PHOTO_W,
            height: PHOTO.height,
          })}
        >
          <SafeImage
            src={IMAGES.portrait}
            alt={HERO.portraitAlt}
            priority
            className="absolute inset-0 size-full"
            imgClassName="absolute inset-0 size-full max-w-none object-cover object-top"
          />
        </div>

        {/* 98:135 200% · 98:120 300% — 사진 양옆에 세로 가운데로 건다 */}
        <Tag
          label={HERO.greenTag}
          color="var(--color-letter2-front)"
          left={PHOTO_LEFT - 248}
          top={PHOTO.top + 148}
          width={213.849}
          height={97.91}
          padX={31}
          padY={26}
          fontSize={78}
          tilt={-2.69}
        />

        <Tag
          label={HERO.redTag}
          color="var(--color-letter4-front)"
          left={PHOTO_LEFT + PHOTO_W + 120}
          top={PHOTO.top + 148}
          width={250.833}
          height={100.529}
          padX={34}
          padY={29}
          fontSize={88}
          tilt={-9.66}
        />
      </div>
    </section>
  );
}
