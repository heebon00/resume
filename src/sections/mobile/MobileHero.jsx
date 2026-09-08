import { useRef } from "react";
import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import SlicedText from "../../components/SlicedText";
import WavyCubes from "../../components/WavyCubes";
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

  return (
    <section
      ref={root}
      data-reveal
      id={mobileId("hero")}
      className="relative overflow-hidden pb-40"
    >
      <div className="hero-fill relative">
        <WavyCubes className="hero-scene" />

        <div className="hero-knockout px-20 pt-86 pb-24">
          <div className="flex items-center justify-between">
            <SlicedText
              as="span"
              data-intro-fade
              className="font-sans text-[calc(14*var(--u))] font-extrabold text-ink uppercase"
            >
              {HERO.labelLeft}
            </SlicedText>
            <SlicedText
              as="span"
              data-intro-fade
              className="font-condensed text-[calc(14*var(--u))] leading-nav font-extrabold text-ink uppercase"
            >
              {HERO.labelRight}
            </SlicedText>
          </div>

          {/* "좋아하는 일은 200% 애정을" 이 나와 잠깐 머문 뒤, 같은 자리에서
              "맡은 임무는 300% 책임감" 으로 바뀐다 — grid 로 h1·p 를 같은 칸에
              겹쳐야 "그 자리에서" 바뀐다(요청, lib/useIntroReveal.js 참조). */}
          <div className="mt-32 grid">
            <h1
              data-intro-group="1"
              className="col-start-1 row-start-1 font-display text-[calc(52*var(--u))] leading-display font-extrabold"
            >
              <span className="block" data-flip-line>
                <Letters text={HERO.greenLines[0]} />
              </span>
              <span className="mt-8 flex items-center gap-12" data-flip-line>
                <span className="hero-tag-frame inline-flex shrink-0 -rotate-[2.69deg] items-center px-12 py-6">
                  <span className="hero-copy-letters font-stencil text-[calc(36*var(--u))] leading-none font-extrabold">
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
              <span className="mt-8 flex items-center gap-12" data-flip-line>
                <span className="hero-tag-frame inline-flex shrink-0 -rotate-[2.69deg] items-center px-12 py-6">
                  <span className="hero-copy-letters font-stencil text-[calc(36*var(--u))] leading-none font-extrabold">
                    {HERO.redTag}
                  </span>
                </span>
                <Letters text={HERO.redLines[1]} />
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 사진은 판 밖에 둔다. */}
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
    </section>
  );
}
