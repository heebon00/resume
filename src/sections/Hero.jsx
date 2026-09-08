import { useRef } from "react";
import SlicedText from "../components/SlicedText";
import SafeImage from "../components/SafeImage";
import WavyCubes from "../components/WavyCubes";
import { HERO, IMAGES } from "../content/portfolio";
import { box, du } from "../lib/design";
import useIntroReveal from "../lib/useIntroReveal";

/**
 * 히어로 — 피그마 76:195 "co" (1920 x 888), 캔버스 top 154
 *
 * [2026-09-07 개편 — 시안에서 벗어난 구간]
 * 요청으로 tympanus.net/Tutorials/AnimatedTextFills/index19 를 따랐다가(55.md),
 * 후속 요청으로 배경은 물결치는 큐브(arkon.digital wavy-cubes 참고, 실제
 * 3D/WebGL, WavyCubes 참고)로, 글자는 색이 흐르는 그라디언트로 바꿨다.
 * 글자 내용·배치는 하나도 안 바꿨다.
 *
 * 화면은 세 겹이다.
 *   1. .hero-fill  — 뒤에 깔린 물결치는 큐브 격자(실제 3D, WavyCubes 참고).
 *   2. .hero-knockout — 카피 · 좌우 라벨 · 200%/300% 태그가 든 글자 층.
 *      큐브 위에 진한 색으로 얹는다. 메인 카피의 글자만 .hero-copy-letters 로
 *      색이 흐르는 그라디언트를 준다.
 *   3. 인물 사진.
 * 원리와 수치는 index.css 의 .hero-fill 주석 참조.
 *
 * 배치는 앞서 잡아 둔 것을 그대로 쓴다 — 카피를 가운데, 그 아래 사진,
 * 200% · 300% 태그는 각각 "애정을," 과 "책임감을" 앞에 붙는다(모바일과 같은 배치).
 * 원래 시안 배치(사진 가운데 · 흰 배경 · 초록/빨강 카피)는 git 이력에 남아 있다.
 *
 * [등장 연출 — 2026-09-07 추가, 요청으로 자리 교체 방식으로 수정]
 * 참고 사이트(treethemes brave, 55.md)처럼 "좋아하는 일은 200% 애정을," 이
 * 3D로 접혔다 펴지며 나와 잠깐 머문 뒤, 그 자리에서 접혀 사라지고 같은
 * 자리에 "맡은 임무는 300% 책임감" 이 펴지며 나타난다. 두 구간은
 * data-intro-group="1"/"2" 로 묶고, grid 로 같은 칸에 겹쳐 둬야
 * "그 자리에서" 바뀐다 — 자세한 타이밍은 lib/useIntroReveal.js 참조.
 * 로딩 화면이 끝나며 보내는 INTRO_DONE 신호를 받아 시작한다.
 */

// 태그는 시안 크기 그대로면 사진 옆에서 너무 커서 줄여 붙인다.
// 시안 값(98:135 / 98:120)에 이 비율만 곱해 쓴다 — 임의 수치를 새로 만들지 않는다.
// COPY_SCALE 은 카피(제목) 쪽에 곱하는 배율과 맞춘 값이다 — 카피를 줄이면서
// 태그만 그대로 두면 카피 옆에서 태그가 상대적으로 커 보이기 때문이다.
const COPY_SCALE = 0.48; // 요청 — 카피를 더 내린 만큼 사진과 안 겹치게 더 줄였다.
const TAG_SCALE = 0.6 * COPY_SCALE;
const s = (n) => du(n * TAG_SCALE);

// 사진 — 가운데, 원본 1099 x 744 의 가로세로비를 지킨다(요청으로 다시
// 중앙으로). 카피는 오른쪽으로 옮겼다(아래 h1 참조).
// 요청 — 캔버스(1920) 절반 너비, 가운데. 카피가 사진 위쪽 빈자리에 있어서
// (겹치면 안 되니, lib/design.js 참조) 세로로 키울 수 있는 한계는 카피
// 자리를 침범하기 직전까지다 — 원본 가로세로비 그대로(안 잘리게) 키우면
// 딱 그 한계에 맞는다.
const PHOTO_W = 985; // 요청 — 사진 크기는 그대로 두고, 카피 쪽을 줄여 자리를 맞춘다.
const PHOTO_HEIGHT = Math.round(PHOTO_W * (744 / 1099));
const PHOTO = { top: 888 - PHOTO_HEIGHT, height: PHOTO_HEIGHT };
const PHOTO_LEFT = Math.round((1920 - PHOTO_W) / 2);

/**
 * 200% · 300% 태그 — 카피 줄 앞에 붙는다("애정을," 앞 200% / "책임감을" 앞 300%).
 * 글자는 카피와 똑같이 색이 흐르는 그라디언트(.hero-copy-letters)를 쓴다(요청).
 * 테두리만 배지처럼 구분되게 진한 색(--color-ink) 그대로 둔다.
 *
 * 시안의 안쪽 여백(px 31 · py 26)과 줄 높이(--leading-tag 47)를 그대로 쓰면
 * 글자가 상자를 뚫고 나온다 — 상자와 글자는 TAG_SCALE 로 줄었는데 --leading-tag 는
 * 고정값이라 같이 줄지 않기 때문이다. 그래서 줄 높이를 1 로 두고 가운데 정렬해
 * 상자 안에 맞춘다. 여백은 좌우로만 조금 남긴다.
 */
function Tag({ label, width, height, fontSize, tilt }) {
  return (
    <span
      className="inline-block shrink-0"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span
        className="flex items-center justify-center border-ink"
        style={{
          width: s(width),
          height: s(height),
          borderWidth: s(3),
          borderStyle: "solid",
          paddingInline: s(12),
        }}
      >
        <span
          className="hero-copy-letters font-stencil font-extrabold whitespace-nowrap uppercase"
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
    <span className="hero-copy-letters block">
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
      {/* 1 · 2겹 — 물결치는 큐브 배경과 그 위의 글자 층 */}
      <div className="hero-fill absolute inset-0">
        <WavyCubes className="hero-scene" />

        <div className="hero-knockout absolute inset-0">
          {/* 폰트를 21→24로 키우면서 상자가 좁아 SlicedText 조각(clip-path 가 상자
              폭 기준 %)이 글자 일부를 잘라먹었다 — 요청대로 안쪽으로 당기고
              상자도 넉넉하게 키웠다. */}
          <SlicedText
            data-intro-fade
            className="absolute top-51 left-75 h-30 w-125 font-sans text-nav font-extrabold text-ink uppercase"
          >
            {HERO.labelLeft}
          </SlicedText>

          <SlicedText
            data-intro-fade
            className="absolute top-54 left-1705 h-30 w-150 font-sans text-nav leading-nav font-extrabold text-ink uppercase"
          >
            {HERO.labelRight}
          </SlicedText>

          {/* 카피 — 사진은 가운데 아래쪽에 크게 두고(요청), 카피는 오른쪽
              가장자리에 붙여 화면 세로 한가운데에 둔다(요청, top-1/2 +
              -translate-y-1/2 — 두 구간의 높이가 달라도 가운데가 안 흔들린다).
              오른쪽 정렬은 그대로다. 줄간격 0.9 는 참고 사이트 값이다. 두 구간을 grid 로
              같은 칸에 겹쳐 놓는다 — "좋아하는 일은 200% 애정을," 이
              사라진 자리에 "맡은 임무는 300% 책임감" 이 나타나도록(요청,
              lib/useIntroReveal.js 참조). */}
          <h1
            className="absolute top-1/2 grid -translate-y-1/2 text-right font-display leading-[0.9] font-extrabold"
            style={box({ right: 75 })}
          >
            <span className="col-start-1 row-start-1" data-intro-group="1">
              <span className="block text-[calc(var(--text-display-sm)*0.48)]" data-flip-line>
                <Letters text={HERO.greenLines[0]} />
              </span>

              {/* 98:135 200% — "애정을," 앞 */}
              <span
                className="flex items-center justify-end gap-30 text-[calc(var(--text-display-sm)*0.48)]"
                data-flip-line
              >
                <Tag
                  label={HERO.greenTag}
                  width={213.849}
                  height={97.91}
                  fontSize={78}
                  tilt={-2.69}
                />
                <Letters text={HERO.greenLines[1]} />
              </span>
            </span>

            <span className="col-start-1 row-start-1" data-intro-group="2">
              {/* 사진을 더 키우려고 카피 자리를 줄여야 했다(요청) — 시안 값
                  (--text-display)을 그대로 두고 이 줄에서만 3% 줄인다(임의
                  수치를 새로 만들지 않는 관례를 따른다, 위 TAG_SCALE 참조). */}
              <span
                className="block text-[calc(var(--text-display)*0.48)]"
                data-flip-line
              >
                <Letters text={HERO.redLines[0]} />
              </span>

              {/* 98:120 300% — "책임감을" 앞. 기울기는 요청으로 200%(-2.69)와 통일 */}
              <span
                className="flex items-center justify-end gap-30 text-[calc(var(--text-display)*0.48)]"
                data-flip-line
              >
                <Tag
                  label={HERO.redTag}
                  width={250.833}
                  height={100.529}
                  fontSize={88}
                  tilt={-2.69}
                />
                <Letters text={HERO.redLines[1]} />
              </span>
            </span>
          </h1>

        </div>
      </div>

      {/* 3겹 — 인물 사진. */}
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
