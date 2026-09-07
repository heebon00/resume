import { useRef } from "react";
import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import SlicedText from "../../components/SlicedText";
import StrokedText from "../../components/StrokedText";
import { HERO, IMAGES } from "../../content/portfolio";
import { LAYERS_EFFECT_2, LAYERS_EFFECT_4 } from "../../lib/intro";
import useIntroReveal from "../../lib/useIntroReveal";

/**
 * 모바일 히어로 — 데스크톱 시안(76:195)의 문구·이미지를 1단으로 다시 쌓았다.
 * 배치는 모바일 시안 관례(거터 20 · 세로 스택)를 따른 "디자인 기반 추정"이다.
 * 글자 크기는 390 폭에서 가장 긴 줄("좋아하는 일은")이 한 줄에 들어가도록 산출했다.
 *
 * 색·글자 표현·등장은 데스크톱 히어로와 같다(sections/Hero.jsx 의 메모 참조) —
 * 배경 #1c1c21, 카피는 테두리 세 겹, 글자마다 탄성을 받아 떨어진다.
 * 태그의 흰 채움은 어두운 배경이라 뺐다.
 */
export default function MobileHero() {
  const root = useRef(null);
  useIntroReveal(root);

  return (
    <section
      ref={root}
      data-reveal
      id={mobileId("hero")}
      className="relative overflow-hidden bg-hero-bg pt-86 pb-40"
    >
      <div className="px-20">
        <div className="flex items-center justify-between">
          <SlicedText
            as="span"
            data-intro-fade
            className="font-sans text-[calc(14*var(--u))] font-extrabold text-hero-label uppercase"
          >
            {HERO.labelLeft}
          </SlicedText>
          <SlicedText
            as="span"
            data-intro-fade
            className="font-condensed text-[calc(14*var(--u))] leading-nav font-extrabold text-hero-label uppercase"
          >
            {HERO.labelRight}
          </SlicedText>
        </div>

        <h1 className="mt-32 font-display text-[calc(52*var(--u))] leading-display font-extrabold">
          <StrokedText
            text={HERO.greenLines[0]}
            layers={LAYERS_EFFECT_2}
            className="block"
          />
          <span className="mt-8 flex items-center gap-12">
            <span
              data-intro-fade
              className="inline-flex -rotate-[2.69deg] items-center border-[length:calc(2*var(--u))] px-12 py-6"
              style={{ borderColor: "var(--color-letter2-front)" }}
            >
              <span
                className="font-stencil text-[calc(36*var(--u))] leading-none font-extrabold"
                style={{ color: "var(--color-letter2-front)" }}
              >
                {HERO.greenTag}
              </span>
            </span>
            <StrokedText text={HERO.greenLines[1]} layers={LAYERS_EFFECT_2} />
          </span>
        </h1>

        <p className="mt-28 font-display text-[calc(52*var(--u))] leading-display font-extrabold">
          <StrokedText
            text={HERO.redLines[0]}
            layers={LAYERS_EFFECT_4}
            className="block"
          />
          <span className="mt-8 flex items-center gap-12">
            <span
              data-intro-fade
              className="inline-flex rotate-[7.74deg] items-center border-[length:calc(2*var(--u))] px-12 py-6"
              style={{ borderColor: "var(--color-letter4-front)" }}
            >
              <span
                className="font-stencil text-[calc(36*var(--u))] leading-none font-extrabold"
                style={{ color: "var(--color-letter4-front)" }}
              >
                {HERO.redTag}
              </span>
            </span>
            <StrokedText text={HERO.redLines[1]} layers={LAYERS_EFFECT_4} />
          </span>
        </p>
      </div>

      <SafeImage
        src={IMAGES.portrait}
        alt={HERO.portraitAlt}
        width={390}
        height={264}
        priority
        data-intro-fade
        className="mt-24 w-full"
        imgClassName="block size-full object-cover object-top"
      />
    </section>
  );
}
