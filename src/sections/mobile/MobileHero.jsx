import { useRef } from "react";
import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import SlicedText from "../../components/SlicedText";
import HeroScene from "../../components/HeroScene";
import { HERO, IMAGES } from "../../content/portfolio";
import useIntroReveal from "../../lib/useIntroReveal";

/**
 * 모바일 히어로 — 데스크톱 시안(76:195)의 문구·이미지를 1단으로 다시 쌓았다.
 * 배치는 모바일 시안 관례(거터 20 · 세로 스택)를 따른 "디자인 기반 추정"이다.
 * 글자 크기는 390 폭에서 가장 긴 줄("좋아하는 일은")이 한 줄에 들어가도록 산출했다.
 *
 * 배경은 데스크톱과 같다(sections/Hero.jsx 와 index.css 의 .hero-fill 주석
 * 참조) — 물결치는 큐브 위에 진한 색 글자를 얹는다. 메인 카피(h1·p)만
 * .hero-copy-letters 로 색이 흐르는 그라디언트를 준다. 다만 여기서는 판이
 * 흐름 안에 있어 글자 높이만큼만 차지한다.
 */

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

export default function MobileHero() {
  const root = useRef(null);
  useIntroReveal(root);

  // 아래 section 에 pb-40 이 있었는데 뺐다 — 사진과 MY NAME 배너 사이에
  // 흰 띠가 보인다는 요청이다. 이제 사진 밑단이 곧 히어로의 끝이다.
  return (
    <section
      ref={root}
      data-reveal
      id={mobileId("hero")}
      className="relative overflow-hidden"
    >
      <div className="hero-fill relative">
        <HeroScene className="hero-scene" />

        <div className="hero-knockout px-20 pt-86 pb-24">
          {/* [라벨에 크기를 주지 않는 이유]
              SlicedText 는 글자를 "상자 폭" 기준 10등분해 조각내고, 각 조각을
              조각 폭의 ±50% 만큼 흔든다. 그래서 상자가 글자보다 넓으면 조각
              경계가 글자와 어긋나고 흔들림 폭도 커져 글자끼리 겹쳐 보인다
              (요청 — PORTFOLIO 는 font-condensed 라 글자가 더 좁아 특히 심했다).
              상자를 안 주면 내용 크기에 딱 맞아 조각이 글자 위에 1:1 로 얹힌다.
              데스크톱 라벨이 상자(w-125)를 명시한 건 절대배치라 어쩔 수 없어서고,
              거기서도 "상자가 좁으면 글자가 잘린다"는 같은 뿌리의 문제를 겪었다.

              leading-none 은 남긴다 — PORTFOLIO 에 있던 leading-nav(0.85)는 줄
              높이가 글자 크기(14)보다 작아 윗부분이 잘려 보였다(요청). 두 라벨
              모두 1 로 통일해 폰트가 달라도 줄 높이 기준이 같게 둔다. */}
          <div className="flex items-center justify-between">
            <SlicedText
              as="span"
              data-intro-fade
              className="font-sans text-[calc(14*var(--u))] leading-none font-extrabold text-ink uppercase"
            >
              {HERO.labelLeft}
            </SlicedText>
            <SlicedText
              as="span"
              data-intro-fade
              className="font-condensed text-[calc(14*var(--u))] leading-none font-extrabold text-ink uppercase"
            >
              {HERO.labelRight}
            </SlicedText>
          </div>

          {/* "좋아하는 일은 200% 애정을" 이 나와 잠깐 머문 뒤, 같은 자리에서
              "맡은 임무는 300% 책임감" 으로 바뀐다 — grid 로 h1·p 를 같은 칸에
              겹쳐야 "그 자리에서" 바뀐다(요청, lib/useIntroReveal.js 참조). */}
          {/* 요청으로 가운데 정렬. 둘째 줄은 flex 라 text-center 가 안 먹어서
              justify-center 를 따로 준다. */}
          <div className="mt-32 grid text-center">
            <h1
              data-intro-group="1"
              className="col-start-1 row-start-1 font-display text-[calc(52*var(--u))] leading-display font-extrabold"
            >
              <span className="block" data-flip-line>
                <Letters text={HERO.greenLines[0]} />
              </span>
              <span className="mt-8 flex items-center justify-center gap-12" data-flip-line>
                <span className="hero-tag-frame inline-flex shrink-0 -rotate-[2.69deg] items-center px-12 py-6">
                  <span className="hero-tag-letters font-stencil text-[calc(36*var(--u))] leading-none font-extrabold">
                    {HERO.greenTag}
                  </span>
                </span>
                <Letters text={HERO.greenLines[1]} />
              </span>
            </h1>

            <p
              data-intro-group="2"
              className="col-start-1 row-start-1 font-display text-[calc(52*var(--u))] leading-display font-extrabold"
            >
              <span className="block" data-flip-line>
                <Letters text={HERO.redLines[0]} />
              </span>
              <span className="mt-8 flex items-center justify-center gap-12" data-flip-line>
                <span className="hero-tag-frame inline-flex shrink-0 -rotate-[2.69deg] items-center px-12 py-6">
                  <span className="hero-tag-letters font-stencil text-[calc(36*var(--u))] leading-none font-extrabold">
                    {HERO.redTag}
                  </span>
                </span>
                <Letters text={HERO.redLines[1]} />
              </span>
            </p>
          </div>

          {/* 밑단 버튼 — 데스크톱 히어로(sections/Hero.jsx)에 있는 것과 같은
              버튼이고 같은 데이터(HERO.buttons)를 쓴다. 모바일에는 빠져 있어서
              이력서·깃허브로 갈 길이 아예 없었다(요청).
              데스크톱은 사진 오른쪽 바깥에 절대배치하지만 모바일은 1단 스택이라
              카피 바로 밑에 가운데로 놓는다. 간격도 데스크톱(24)보다 좁은 16 —
              390 폭에서 두 버튼이 한 줄에 들어가야 한다.
              href 가 비면 데스크톱과 같은 규칙으로 링크 없이 모양만 나온다. */}
          <div
            data-intro-fade
            className="mt-32 flex flex-wrap justify-center gap-16"
          >
            {HERO.buttons.map(({ label, href }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pfr-swipe hero-cta-m cursor-pointer no-underline"
                >
                  {label}
                </a>
              ) : (
                <span key={label} className="pfr-swipe hero-cta-m">
                  {label}
                </span>
              ),
            )}
          </div>
        </div>

        {/* 요청 — 사진도 헤더 그래픽(WavyCubes) 판 안에 넣는다. 예전에는 판
            밖에 있어서 사진 둘레가 흰 종이색이었고, 큐브 배경이 카피 영역에서
            끊겼다. 판 안으로 들어오면 카피와 사진 사이(mt-24)에도 큐브가
            이어져 보인다. */}
        <SafeImage
          src={IMAGES.portrait}
          alt={HERO.portraitAlt}
          width={390}
          height={264}
          priority
          data-intro-fade
          className="relative mt-24 w-full"
          imgClassName="block size-full object-cover object-top"
        />
      </div>

    </section>
  );
}
