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
 * 200% · 300% 태그는 각각 "애정을" 과 "책임감을" 앞에 붙는다(모바일과 같은 배치).
 * 원래 시안 배치(사진 가운데 · 흰 배경 · 초록/빨강 카피)는 git 이력에 남아 있다.
 *
 * [등장 연출 — 2026-09-07 추가, 요청으로 자리 교체 방식으로 수정]
 * 참고 사이트(treethemes brave, 55.md)처럼 "좋아하는 일은 200% 애정을" 이
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
const COPY_SCALE = 0.75; // 요청 — 작아 보인다고 해서 0.48 → 0.56 → 0.62 → 0.68 → 0.75 로 키웠다.
// 아래 text-[calc(... * 0.75)] 네 곳이 이 값과 같아야 한다 — Tailwind 임의값은
// 문자열이라 상수를 못 넣는다. 태그(TAG_SCALE)는 이 값에 딸려 같이 커진다.
const TAG_SCALE = 0.85 * COPY_SCALE; // 요청 — 카피만큼 커 보이게 0.6 → 0.85 로 올렸다.
const s = (n) => du(n * TAG_SCALE);

// 200% · 300% 태그는 시안(98:135 / 98:120)에서 서로 크기가 다르지만, 요청으로
// 200% 쪽 값 하나로 통일한다 — 카피가 오른쪽 정렬이라 큰 쪽(300%)이 윗줄보다
// 왼쪽으로 삐져나왔다("맡은 임무는" 242 에서 "책임감을" 185 를 빼면 태그와
// 간격에 쓸 수 있는 자리가 57 뿐인데 300% 태그만 73 이었다). 임의 수치를
// 새로 만들지 않는 관례대로, 시안에 이미 있는 200% 쪽 값을 그대로 쓴다.
// fontSize 만 78 → 92 로 키웠다(요청, "좀더 키워줘") — width·height(상자 자리)는
// 그대로 두고 글자만 키운다. 상자엔 테두리도 overflow:hidden 도 없어서
// (위 Tag 컴포넌트 참조) 글자가 상자보다 커져도 좌우로 고르게 넘칠 뿐 안
// 잘린다.
const TAG_BOX = { width: 213.849, height: 97.91, fontSize: 92 };

// 카피·사진·버튼이 들어가는 안쪽 상자 높이 — 시안 원래 값은 888(피그마
// 76:195). 요청으로 히어로 전체 높이를 살짝 줄인다. 안의 자리들이 전부
// 이 값 기준(퍼센트 또는 이 값에서 뺀 계산)이라 여기 하나만 줄이면
// 나머지가 그 비율로 따라 줄어든다. 아래 HERO_H·PHOTO.top·버튼 top 이
// 전부 이 값을 쓴다 — Tailwind 정적 클래스(h-888 등)로는 이 값을 동적으로
// 못 넣어서 그 자리는 box() 인라인 스타일로 바꿨다(아래 h1 감싸는 div 참조).
const CONTENT_H = 820;

// 사진 — 가운데, 원본 1099 x 744 의 가로세로비를 지킨다(요청으로 다시
// 중앙으로). 카피는 오른쪽으로 옮겼다(아래 h1 참조).
// 요청 — 캔버스(1920) 절반 너비, 가운데. 카피가 사진 위쪽 빈자리에 있어서
// (겹치면 안 되니, lib/design.js 참조) 폭을 키울 수 있는 한계는 카피 자리를
// 침범하기 직전까지다.
const PHOTO_W = 1020; // 요청 — 985 → 1050 까지 키웠다가 "아주 조금만" 줄여
// 달라는 요청으로 1020. 1050 은 카피(오른쪽 정렬)와 거의 맞닿는 한계였다.
// 위쪽 빈자리는 아래 EXTRA_HEIGHT 로 채운다.

// 요청 — "사진 위가 너무 비어 보인다"는 재확인을 받았다. 폭은 카피와
// 맞닿는 한계라 그대로 두고, 높이만 더 키워 사진 위쪽 빈자리를 줄인다.
// 이제부터는 원본 가로세로비를 그대로 지키지 않는다 — SafeImage 가
// object-cover · object-top 이라 늘어난 세로만큼 좌우를 더 파고들어
// 채운다(원본이 잘리지만 뭉개지진 않는다).
const EXTRA_HEIGHT = 130;
const PHOTO_HEIGHT = Math.round(PHOTO_W * (744 / 1099)) + EXTRA_HEIGHT;
const PHOTO = { top: CONTENT_H - PHOTO_HEIGHT, height: PHOTO_HEIGHT };
const PHOTO_LEFT = Math.round((1920 - PHOTO_W) / 2);

// 히어로 배경을 GNB 바 바로 밑(66 = 바 높이)까지 끌어올린다 — 원래는 154 에서
// 시작해서 바와 히어로 사이에 흰 띠 88 이 보였다(요청으로 없앴다).
// 늘어난 만큼은 배경(큐브)만 차지하고, 글자 층과 사진은 HERO_SHIFT 만큼
// 아래로 밀어 원래 캔버스 좌표(154 기준)를 그대로 지킨다 — 그래야 지금까지
// 맞춰 둔 카피·라벨·버튼 자리가 하나도 안 움직인다.
const HERO_TOP = 66;
const HERO_SHIFT = 154 - HERO_TOP; // 88
// CONTENT_H 를 줄인 만큼 아래 끝(NameBanner 가 이어 붙는 자리)도
// 앞당겨지므로 NameBanner.jsx 의 top 도 같은 값(HERO_TOP + HERO_H)으로
// 맞춰 둬야 한다.
const HERO_H = CONTENT_H + HERO_SHIFT; // 908 — 아래 끝은 974 로 줄었다(원래 1042).

/**
 * 200% · 300% 태그 — 카피 줄 앞에 붙는다("애정을" 앞 200% / "책임감을" 앞 300%).
 * 처음엔 카피와 같은 색이 흐르는 그라디언트(.hero-copy-letters)를 썼는데,
 * 요청으로 포인트 컬러 크림슨(#D4183D, --color-tag-crimson) 단색으로
 * 바꿨다 — 그래서 카피와는 다른 클래스(.hero-tag-letters, index.css)를 쓴다.
 * 테두리는 요청으로 없앴다 — 글자만 담는 자리표시 상자다.
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
        className="hero-tag-frame flex items-center justify-center"
        style={{
          width: s(width),
          height: s(height),
          paddingInline: s(12),
        }}
      >
        <span
          className="hero-tag-letters font-stencil font-extrabold whitespace-nowrap uppercase"
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
    // 자간은 요청으로 더 벌렸다(0.05em → 0.09em). 태그(200%/300%)는
    // 상자 폭이 고정이라 글자가 넘치므로 여기 글자 묶음에만 건다.
    <span className="hero-copy-letters block tracking-[0.09em]">
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
      // 짧은 화면 대응으로 --u 에 vh 상한을 걸어봤다가(요청) 되돌렸다 —
      // 이 히어로는 폭(1920u)만이 아니라 세로 끝(1042u)도 그 아래
      // NameBanner(box({top:1042}), 전역 --u 기준)와 딱 맞물리는 값이다.
      // 히어로만 vh 로 줄어들면 히어로 실제 바닥이 1042u 보다 위에서
      // 끝나버려 그 밑 NameBanner 와의 사이에 빈 틈이 생겼다(요청으로
      // 발견: "이미지 헤더와 그 아래 my name 텍스트 영역 간격"). 전역
      // --u 를 쓰는 다른 모든 섹션이 히어로의 고정 발판(1042u) 위에
      // 그대로 이어 붙는 구조라, 히어로 혼자 스케일을 바꾸면 그 이음매가
      // 깨진다 — 그래서 폭 기준 스케일로 되돌린다.
      className="absolute left-0 w-1920 overflow-hidden"
      style={box({ top: HERO_TOP, height: HERO_H })}
    >
      {/* 1 · 2겹 — 물결치는 큐브 배경과 그 위의 글자 층 */}
      <div className="hero-fill absolute inset-0">
        <WavyCubes className="hero-scene" />

        {/* 글자 층은 늘어나기 전 자리(154 ~ 1042)에 그대로 둔다 — 안쪽
            좌표(top-51 · top-1/2 · 밑단 버튼)가 전부 이 888 상자 기준이다. */}
        {/* 좌우 라벨 — 요청으로 CREATIVE 위 빈 자리를 없앴다. 아래 글자 층
            (원래 888 상자)이 아니라 섹션 기준으로 두고 GNB 바 바로 밑에 붙인다.
            20 은 두 라벨의 원래 간격차(51 : 54)를 그대로 지킨 값이다.
            폰트를 21→24로 키우면서 상자가 좁아 SlicedText 조각(clip-path 가 상자
            폭 기준 %)이 글자 일부를 잘라먹었다 — 요청대로 안쪽으로 당기고
            상자도 넉넉하게 키웠다.
            그 뒤 GNB 왼쪽에 로고 박스(DesktopNav BrandMark, 배경 있는
            점선+HEEBON)가 생기면서 바 높이가 HERO_TOP(66, GNB 옛 높이 가정값)
            보다 커졌다 — 실측하면 93u 정도. 라벨이 그 자리 그대로(20/23) 있으니
            커진 바 밑단에 위쪽이 가려 잘려 보인다는 요청(글자 잘림)으로,
            커진 만큼(93-66=27) 두 라벨 모두 아래로 민다(20→47, 23→50) —
            간격차 3 은 그대로 지킨다. */}
        <SlicedText
          data-intro-fade
          className="hero-knockout absolute top-47 left-75 h-30 w-125 font-sans text-nav font-extrabold text-ink uppercase"
        >
          {HERO.labelLeft}
        </SlicedText>

        <SlicedText
          data-intro-fade
          className="hero-knockout absolute top-50 left-1705 h-30 w-150 font-sans text-nav leading-nav font-extrabold text-ink uppercase"
        >
          {HERO.labelRight}
        </SlicedText>

        <div
          className="hero-knockout absolute inset-x-0 top-88"
          style={{ height: du(CONTENT_H) }}
        >
          {/* 카피 — 요청으로 레이아웃을 다시 짰다: 사진을 기점으로 카피는
              사진 왼쪽, 버튼은 사진 오른쪽 — 예전처럼 카피·버튼이 같이
              오른쪽에 있다가 사진과 겹치는 방식이 아니다. 그래서 위치를
              right → left 로 바꿨다.
              정렬은 text-right 그대로 둔다 — text-left 로 바꿔봤더니 두
              줄(짧은 "맡은 임무는" · 태그가 붙어 긴 "300% 책임감을")이
              왼쪽만 맞고 오른쪽 끝이 들쭉날쭉했다("왼쪽 텍스트를 오른쪽
              텍스트 끝나는 지점으로 맞춰 달라"는 요청) — text-right 을
              쓰면 박스 위치(left:150)는 그대로 왼쪽에 있으면서, 그 안의
              두 줄은 짧은 쪽이 안쪽으로 들어와 긴 쪽과 오른쪽 끝이
              맞는다. 아래 태그+글자 줄(flex)도 같은 이유로 justify-end.
              화면 세로 자리는 원래 정가운데(top-1/2 -translate-y-1/2)였는데
              "애매하다"는 요청으로 62% → "사진 머리 높이쯤으로" 85% →
              "조금만 더 위로" 100% → 115% 까지 올렸다.
              줄간격 1.05 는 그대로다. z-10 은 혹시 글줄이 길어
              사진 왼쪽 끝을 살짝 넘보더라도 가려지지 않게 남겨 둔 안전장치다.
              두 구간을 grid 로 같은 칸에 겹쳐 놓는다 — "좋아하는 일은
              200% 애정을" 이 사라진 자리에 "맡은 임무는 300% 책임감" 이
              나타나도록(요청, lib/useIntroReveal.js 참조). */}
          <h1
            className="absolute top-1/2 z-10 grid -translate-y-[115%] text-right font-display leading-[1.05] font-extrabold"
            style={box({ left: 150 })}
          >
            <span className="col-start-1 row-start-1" data-intro-group="1">
              <span className="block text-[calc(var(--text-display-sm)*0.75)]" data-flip-line>
                <Letters text={HERO.greenLines[0]} />
              </span>

              {/* 98:135 200% — "애정을" 앞. 태그와 글자 사이는 6 이다(요청으로
                  가깝게 붙였다). justify-end 로 위 h1 의 text-right 과 같은
                  방향으로 오른쪽 끝을 맞춘다(위 h1 주석 참조). */}
              <span
                className="flex items-center justify-end gap-6 text-[calc(var(--text-display-sm)*0.75)]"
                data-flip-line
              >
                <Tag label={HERO.greenTag} {...TAG_BOX} tilt={-2.69} />
                <Letters text={HERO.greenLines[1]} />
              </span>
            </span>

            <span className="col-start-1 row-start-1" data-intro-group="2">
              {/* 사진을 더 키우려고 카피 자리를 줄여야 했다(요청) — 시안 값
                  (--text-display)을 그대로 두고 이 줄에서만 3% 줄인다(임의
                  수치를 새로 만들지 않는 관례를 따른다, 위 TAG_SCALE 참조). */}
              <span
                className="block text-[calc(var(--text-display)*0.75)]"
                data-flip-line
              >
                <Letters text={HERO.redLines[0]} />
              </span>

              {/* 98:120 300% — "책임감을" 앞. 기울기(-2.69)와 크기(TAG_BOX)는
                  요청으로 200% 와 통일했다 */}
              <span
                className="flex items-center justify-end gap-6 text-[calc(var(--text-display)*0.75)]"
                data-flip-line
              >
                <Tag label={HERO.redTag} {...TAG_BOX} tilt={-2.69} />
                <Letters text={HERO.redLines[1]} />
              </span>
            </span>
          </h1>

          {/* 밑단 버튼(요청) — 스크롤 연출(ProjectsReveal)에 나오는 것과 같은
              .pfr-swipe 버튼이다(요청으로 사이버펑크 노란 버튼에서 바꿨다).
              간격은 .pfr-buttons 값(8) 그대로 쓰다가, "두 버튼 사이를 조금
              더 벌려 달라"는 요청을 두 번 받아 8 → 16 → 24 로 늘렸다.
              크기는 .hero-cta 로 키웠다(요청, index.css 참조).
              가로 자리 — 사진을 기점으로 카피는 왼쪽, 버튼은 오른쪽에
              두라는 요청으로 화면 오른쪽 가장자리 쪽(사진 오른쪽 바깥)으로
              옮겼다. 예전엔 사진 왼쪽 끝(PHOTO_LEFT)에 맞추던 값이었다.
              세로 자리 — 처음엔 "오른쪽 아래로" 라는 요청대로 히어로
              밑변에서 20 만 띄웠는데, "조금 더 위로" 라는 요청을 두 번
              받아 20 → 60 → 80 까지 올렸다(카피는 그대로 두고 버튼만).
              "조금만 내려 달라"는 요청으로 80 → 64 로 다시 살짝 낮췄다. */}
          <div
            data-intro-fade
            className="absolute z-10 flex gap-24"
            style={box({ right: 150, top: CONTENT_H - 64 - 56 })}
          >
            {HERO.buttons.map(({ label, href }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pfr-swipe hero-cta cursor-pointer no-underline"
                >
                  {label}
                </a>
              ) : (
                <span
                  key={label}
                  className="pfr-swipe hero-cta"
                >
                  {label}
                </span>
              ),
            )}
          </div>

        </div>
      </div>

      {/* 3겹 — 인물 사진. */}
      <div
        data-intro-fade
        className="absolute overflow-hidden"
        style={box({
          left: PHOTO_LEFT,
          top: PHOTO.top + HERO_SHIFT,
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
