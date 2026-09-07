import { useRef } from "react";
import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import SlicedText from "../../components/SlicedText";
import { HERO, IMAGES } from "../../content/portfolio";
import useIntroReveal from "../../lib/useIntroReveal";

/**
 * 모바일 히어로 — 데스크톱 시안(76:195)의 문구·이미지를 1단으로 다시 쌓았다.
 * 배치는 모바일 시안 관례(거터 20 · 세로 스택)를 따른 "디자인 기반 추정"이다.
 * 글자 크기는 390 폭에서 가장 긴 줄("좋아하는 일은")이 한 줄에 들어가도록 산출했다.
 *
 * 글자 채움은 데스크톱과 같다(sections/Hero.jsx 와 index.css 의 .hero-fill 주석 참조) —
 * 뒤에 도는 색 원 위에 "검은 판 + 흰 글자"를 얹어 글자 자리에만 색이 흐른다.
 * 다만 여기서는 판이 흐름 안에 있어 글자 높이만큼만 차지한다. 사진은 그 뒤에
 * 이어지므로 블렌드에 휩쓸리지 않는다.
 */

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

export default function MobileHero() {
  const root = useRef(null);
  useIntroReveal(root);

  return (
    <section
      ref={root}
      data-reveal
      id={mobileId("hero")}
      className="relative overflow-hidden bg-black pb-40"
    >
      <div className="hero-fill relative">
        <div className="hero-knockout px-20 pt-86 pb-24">
          <div className="flex items-center justify-between">
            <SlicedText
              as="span"
              data-intro-fade
              className="font-sans text-[calc(14*var(--u))] font-extrabold text-white uppercase"
            >
              {HERO.labelLeft}
            </SlicedText>
            <SlicedText
              as="span"
              data-intro-fade
              className="font-condensed text-[calc(14*var(--u))] leading-nav font-extrabold text-white uppercase"
            >
              {HERO.labelRight}
            </SlicedText>
          </div>

          <h1 className="mt-32 font-display text-[calc(52*var(--u))] leading-display font-extrabold text-white">
            <Letters text={HERO.greenLines[0]} />
            <span className="mt-8 flex items-center gap-12">
              <span
                data-intro-fade
                className="inline-flex shrink-0 -rotate-[2.69deg] items-center border-[length:calc(2*var(--u))] border-white px-12 py-6"
              >
                <span className="font-stencil text-[calc(36*var(--u))] leading-none font-extrabold">
                  {HERO.greenTag}
                </span>
              </span>
              <Letters text={HERO.greenLines[1]} />
            </span>
          </h1>

          <p className="mt-28 font-display text-[calc(52*var(--u))] leading-display font-extrabold text-white">
            <Letters text={HERO.redLines[0]} />
            <span className="mt-8 flex items-center gap-12">
              <span
                data-intro-fade
                className="inline-flex shrink-0 -rotate-[2.69deg] items-center border-[length:calc(2*var(--u))] border-white px-12 py-6"
              >
                <span className="font-stencil text-[calc(36*var(--u))] leading-none font-extrabold">
                  {HERO.redTag}
                </span>
              </span>
              <Letters text={HERO.redLines[1]} />
            </span>
          </p>
        </div>
      </div>

      {/* 사진은 판 밖에 둔다 — 안에 두면 블렌드에 섞여 색이 뒤집힌다. */}
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
