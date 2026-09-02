import HeaderParticles from "../components/HeaderParticles";
import SlicedText from "../components/SlicedText";
import SafeImage from "../components/SafeImage";
import { HERO, IMAGES } from "../content/portfolio";
import { box, du } from "../lib/design";

/**
 * 히어로 — 피그마 76:195 "co" (1920 x 888), 캔버스 top 154
 *   76:197 blue-hero-block (bg #fff)
 *     66:174 인물 이미지     left 410 top 144  1099 x 744
 *            (박스 안에서 left -4.19% / w 100.05% 로 살짝 왼쪽으로 물린다)
 *     98:117 Creative 라벨   left 69   top 51  21px Pretendard ExtraBold #BF0
 *     98:118 PORTFOLIO 라벨  left 1728 top 54  21px Pretendard ExtraBold #E61E1A
 *     98:119 좋아하는 일은 / 애정을,  left 100 top 172  697 x 339
 *            100px Paperlogy 8 ExtraBold #BF0 / leading 1.11
 *     98:135 200% 태그       left 301 top 276  회전 -2.69deg · 테두리·글자·그림자 #BF0
 *     98:131 빨간 카피 래퍼   left 844 top 484  1624 x 404
 *            98:120 300% 태그  래퍼 기준 (595, 117) 264.145 x 141.191, 회전 -9.66deg
 *                   테두리·그림자는 #E61E1A(--color-accent-red) 그대로, 글자만 다르다.
 *            98:132 텍스트     래퍼 안 가운데, 폭 1011
 *                   "맡은 임무는" 과 "책임감을" 사이에 13px·leading 0.9 빈 줄 12개
 *   재확인(2026-09-03): 98:120/98:132 글자색은 #E61E1A 가 아니라 #F46E6E(더 옅은
 *   코랄) — --color-accent-coral 로 등록해 따로 쓴다. 라벨(98:118)과 테두리·
 *   그림자는 원래대로 #E61E1A 유지.
 * 해안 배경과 creative 스크립트는 시안에서 삭제돼 함께 뺐다.
 * 좌우 라벨(98:117 / 98:118)에는 조각 글리치를 넣었다 — SlicedText 참조.
 * 76:199 "image 18" 은 피그마에서 hidden 이라 렌더링하지 않는다.
 */

// 98:132 의 빈 줄 12개(13px × leading 0.9)를 높이로 환산한 값
const RED_GAP = 12 * 13 * 0.9;

// 파티클 색 — 요청받은 Adobe Color 팔레트 두 벌 + 히어로에 실제 쓰인 글자색
// 두 개(초록·빨강)를 이어 붙여 큰 헤더(히어로) 파티클이 전체를 훑고 지나가게
// 했다. 이름 배너는 원래 색 그대로 둔다.
//   "Vaporwave"(하늘색·라벤더·민트·핑크·연노랑) + "레트로"(보라·남색·청록·빨강·노랑)
//   + 히어로 글자색(--color-accent-lime #bbff00 · --color-accent-red #e61e1a)
const PARTICLE_COLORS = [
  0xffcfea, 0xfeffbe, 0xcbffe6, 0xafe9ff, 0xbfb9ff, // Vaporwave
  0x7c05f2, 0x15038c, 0x20ba96, 0xe51618, 0xffef61, // 레트로
  0xbbff00, 0xe61e1a, // 히어로 글자색(Creative·초록카피 / PORTFOLIO·빨강카피)
];
const PARTICLE_HOT = 0xffcfea;

export default function Hero() {
  return (
    <section
      id="hero"
      className="absolute top-154 left-0 h-888 w-1920 overflow-hidden"
    >
      <div className="absolute top-0 left-0 h-888 w-1920 bg-white">
        {/* 파티클 — 인물 사진·글자 뒤에 깔려 흰 배경 위에서만 보인다 */}
        <HeaderParticles
          blend="source-over"
          colors={PARTICLE_COLORS}
          hotColor={PARTICLE_HOT}
        />

        {/* 66:174 인물 이미지 */}
        <div className="absolute top-144 left-410 h-744 w-1099 overflow-hidden">
          <SafeImage
            src={IMAGES.portrait}
            alt={HERO.portraitAlt}
            eager
            className="absolute inset-0 size-full"
            imgClassName="absolute top-[0.05%] left-[-4.19%] h-full w-[100.05%] max-w-none object-cover"
          />
        </div>

        {/* 폰트를 21→24로 키우면서 상자가 좁아 SlicedText 조각(clip-path 가 상자
            폭 기준 %)이 글자 일부를 잘라먹었다 — 요청대로 안쪽으로 당기고
            상자도 넉넉하게 키웠다. */}
        <SlicedText className="absolute top-51 left-75 h-30 w-125 font-sans text-nav font-extrabold text-accent-lime uppercase">
          {HERO.labelLeft}
        </SlicedText>

        <SlicedText className="absolute top-54 left-1705 h-30 w-150 font-sans text-nav leading-nav font-extrabold text-accent-red uppercase">
          {HERO.labelRight}
        </SlicedText>

        <h1 className="absolute top-172 left-100 h-339 w-697 text-center font-display text-display-sm leading-[1.11] font-extrabold text-accent-lime">
          <span className="block">{HERO.greenLines[0]}</span>
          <span className="block">&#8203;</span>
          {/* 요청으로 왼쪽으로 당김 — 200% 태그 중심(448.5 was 텍스트 중심, 태그
              중심 410.1)만큼 옮겨 태그 아래 가운데로 보이게 한다. 수동 보정. */}
          <span
            className="block"
            style={{ transform: `translateX(${du(-38)})` }}
          >
            {HERO.greenLines[1]}
          </span>
        </h1>

        {/* 98:135 200% 태그 */}
        <div className="absolute top-276 left-301 flex h-[calc(107.851*var(--u))] w-[calc(218.213*var(--u))] items-center justify-center">
          <div className="rotate-[-2.69deg]">
            <div className="flex h-[calc(97.91*var(--u))] w-[calc(213.849*var(--u))] items-start border-[length:calc(3*var(--u))] border-accent-lime bg-white px-31 py-26 drop-shadow-[calc(4*var(--u))_calc(8*var(--u))_calc(8*var(--u))_var(--color-accent-lime)]">
              <span className="font-stencil text-tag-sm leading-tag font-extrabold whitespace-nowrap text-accent-lime uppercase">
                {HERO.greenTag}
              </span>
            </div>
          </div>
        </div>

        {/* 98:131 빨간 카피 래퍼 */}
        <div
          className="absolute flex flex-col items-center"
          style={box({ left: 844, top: 484, width: 1624, height: 404 })}
        >
          {/* 98:120 300% 태그 — 래퍼 기준 좌표. left 595 → 575(왼쪽으로 20),
              top 117 → 97 → 107(위로 20 갔다가 너무 많이 올라가서 10만 남기고
              다시 내림) 요청으로 당김(수동 보정, 시안 값 아님). */}
          <div
            className="absolute flex items-center justify-center"
            style={box({
              left: 575,
              top: 107,
              width: 264.145,
              height: 141.191,
            })}
          >
            <div className="rotate-[-9.66deg]">
              <div className="flex h-[calc(100.529*var(--u))] w-[calc(250.833*var(--u))] items-start border-[length:calc(3*var(--u))] border-accent-red bg-white px-34 py-29 drop-shadow-[calc(4*var(--u))_calc(8*var(--u))_calc(8*var(--u))_rgba(230,30,26,0.2)]">
                <span className="font-stencil text-tag leading-tag font-extrabold whitespace-nowrap text-accent-coral uppercase">
                  {HERO.redTag}
                </span>
              </div>
            </div>
          </div>

          <p className="w-1011 text-center font-display text-display font-extrabold whitespace-pre-wrap text-accent-coral">
            <span className="block leading-none">{HERO.redLines[0]}</span>
            <span className="block" style={{ height: du(RED_GAP) }} />
            {/* 요청으로 왼쪽으로 당김 — 300% 태그 중심(래퍼 기준 707.07, left 575
                로 당긴 뒤 값)이 이 텍스트 박스 중심(래퍼 기준 812)보다 105 왼쪽이라,
                "책임감을"도 같은 만큼 옮겨 태그 아래 가운데로 보이게 한다.
                시안 값이 아니라 수동 보정 — 태그를 옮기면 이 값도 같이 바꿔야 한다. */}
            <span
              className="block leading-[1.06]"
              style={{ transform: `translateX(${du(-105)})` }}
            >
              {HERO.redLines[1]}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
