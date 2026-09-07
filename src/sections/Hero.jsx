import { useRef } from "react";
import SlicedText from "../components/SlicedText";
import SafeImage from "../components/SafeImage";
import { HERO, IMAGES } from "../content/portfolio";
import { box, du } from "../lib/design";
import useIntroReveal from "../lib/useIntroReveal";

/**
 * 히어로 — 피그마 76:195 "co" (1920 x 888), 캔버스 top 154
 *
 * [2026-09-07 개편 — 시안에서 벗어난 구간]
 * 요청으로 tympanus.net/Tutorials/AnimatedTextFills/index19 를 따랐다(55.md).
 * 글자 내용은 하나도 바꾸지 않고 배치·색만 옮겼다.
 *
 * 화면은 세 겹이다.
 *   1. .hero-fill  — 뒤에 깔린 커다란 색 원들. 2.5초마다 색이 돈다.
 *   2. .hero-knockout — 검은 판 + 흰 글자. mix-blend-mode: darken 이라
 *      판은 검게 남고 글자 자리에만 뒤의 색이 비쳐 흐른다.
 *      카피 · 좌우 라벨 · 200%/300% 태그가 모두 이 판 안에 있어 같이 채워진다.
 *   3. 인물 사진 — 판 위에 얹어 블렌드에서 빼낸다(색이 섞이면 안 되니까).
 * 원리와 수치는 index.css 의 .hero-fill 주석 참조.
 *
 * 배치는 앞서 잡아 둔 것을 그대로 쓴다 — 카피를 가운데 쌓고 그 아래 사진,
 * 200% · 300% 태그는 각각 "애정을," 과 "책임감을" 앞에 붙는다(모바일과 같은 배치).
 * 원래 시안 배치(사진 가운데 · 흰 배경 · 초록/빨강 카피)는 git 이력에 남아 있다.
 *
 * [등장 연출]
 * 글자 하나하나가 위에서 탄성을 받아 떨어진다. 로딩 화면이 끝나며 보내는
 * INTRO_DONE 신호를 받아 시작한다 — lib/useIntroReveal.js.
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
 * 200% · 300% 태그 — 카피 줄 앞에 붙는다("애정을," 앞 200% / "책임감을" 앞 300%).
 * 넉아웃 판 안이라 테두리·글자를 흰색으로 두면 카피와 똑같이 색이 채워진다.
 *
 * 시안의 안쪽 여백(px 31 · py 26)과 줄 높이(--leading-tag 47)를 그대로 쓰면
 * 글자가 상자를 뚫고 나온다 — 상자와 글자는 TAG_SCALE 로 줄었는데 --leading-tag 는
 * 고정값이라 같이 줄지 않기 때문이다. 그래서 줄 높이를 1 로 두고 가운데 정렬해
 * 상자 안에 맞춘다. 여백은 좌우로만 조금 남긴다.
 */
function Tag({ label, width, height, fontSize, tilt }) {
  return (
    <span
      data-intro-fade
      className="inline-block shrink-0"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span
        className="flex items-center justify-center border-white"
        style={{
          width: s(width),
          height: s(height),
          borderWidth: s(3),
          borderStyle: "solid",
          paddingInline: s(12),
        }}
      >
        <span
          className="font-stencil font-extrabold whitespace-nowrap text-white uppercase"
          style={{ fontSize: s(fontSize), lineHeight: 1 }}
        >
          {label}
        </span>
      </span>
    </span>
  );
}

/** 글자 단위로 쪼갠다 — 등장 연출이 글자 하나씩 잡을 수 있도록. */
function Letters({ text }) {
  return (
    <span className="block">
      {/* 읽히는 건 이 한 벌뿐이다. 쪼갠 글자는 전부 장식으로 둔다. */}
      <span className="sr-only">{text}</span>
      {[...text].map((char, i) => (
        <span
          key={i}
          data-letter
          aria-hidden="true"
          className="inline-block whitespace-pre"
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef(null);
  useIntroReveal(root);

  return (
    <section
      ref={root}
      id="hero"
      className="absolute top-154 left-0 h-888 w-1920 overflow-hidden"
    >
      {/* 1 · 2겹 — 색 원과 그 위의 넉아웃 판 */}
      <div className="hero-fill absolute inset-0">
        <div className="hero-knockout absolute inset-0">
          {/* 폰트를 21→24로 키우면서 상자가 좁아 SlicedText 조각(clip-path 가 상자
              폭 기준 %)이 글자 일부를 잘라먹었다 — 요청대로 안쪽으로 당기고
              상자도 넉넉하게 키웠다. */}
          <SlicedText
            data-intro-fade
            className="absolute top-51 left-75 h-30 w-125 font-sans text-nav font-extrabold text-white uppercase"
          >
            {HERO.labelLeft}
          </SlicedText>

          <SlicedText
            data-intro-fade
            className="absolute top-54 left-1705 h-30 w-150 font-sans text-nav leading-nav font-extrabold text-white uppercase"
          >
            {HERO.labelRight}
          </SlicedText>

          {/* 카피 — 가운데로 쌓는다. 줄간격 0.9 는 참고 사이트 값이다. */}
          <h1
            className="absolute left-0 w-1920 text-center font-display leading-[0.9] font-extrabold text-white"
            style={box({ top: 110 })}
          >
            <span className="block text-display-sm">
              <Letters text={HERO.greenLines[0]} />
            </span>

            {/* 98:135 200% — "애정을," 앞 */}
            <span className="flex items-center justify-center gap-30 text-display-sm">
              <Tag
                label={HERO.greenTag}
                width={213.849}
                height={97.91}
                fontSize={78}
                tilt={-2.69}
              />
              <Letters text={HERO.greenLines[1]} />
            </span>

            <span className="block text-display">
              <Letters text={HERO.redLines[0]} />
            </span>

            {/* 98:120 300% — "책임감을" 앞. 기울기는 요청으로 200%(-2.69)와 통일 */}
            <span className="flex items-center justify-center gap-30 text-display">
              <Tag
                label={HERO.redTag}
                width={250.833}
                height={100.529}
                fontSize={88}
                tilt={-2.69}
              />
              <Letters text={HERO.redLines[1]} />
            </span>
          </h1>

        </div>
      </div>

      {/* 3겹 — 인물 사진. 판 위에 얹어 블렌드에서 빼낸다. */}
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
    </section>
  );
}
