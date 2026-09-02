import HeaderParticles from "../../components/HeaderParticles";
import SafeImage from "../../components/SafeImage";
import SlicedText from "../../components/SlicedText";
import { HERO, IMAGES } from "../../content/portfolio";

/**
 * 모바일 히어로 — 데스크톱 시안(76:195)의 문구·이미지를 1단으로 다시 쌓았다.
 * 배치는 모바일 시안 관례(거터 20 · 세로 스택)를 따른 "디자인 기반 추정"이다.
 * 글자 크기는 390 폭에서 가장 긴 줄("새로운 프로그램을…"이 아니라 "좋아하는 일은")이
 * 한 줄에 들어가도록 산출했다.
 */
export default function MobileHero() {
  return (
    <section
      data-reveal
      id="hero"
      className="relative overflow-hidden bg-white pt-86 pb-40"
    >
      {/* 파티클 — 글자·사진 뒤에 깔린다 */}
      <HeaderParticles blend="source-over" />

      <div className="px-20">
        <div className="flex items-center justify-between">
          <SlicedText
            as="span"
            className="font-sans text-[calc(14*var(--u))] font-extrabold text-accent-lime uppercase"
          >
            {HERO.labelLeft}
          </SlicedText>
          <SlicedText
            as="span"
            className="font-condensed text-[calc(14*var(--u))] leading-nav font-extrabold text-accent-red uppercase"
          >
            {HERO.labelRight}
          </SlicedText>
        </div>

        <h1 className="mt-32 font-display text-[calc(52*var(--u))] leading-display font-extrabold">
          <span className="block text-accent-lime">{HERO.greenLines[0]}</span>
          <span className="mt-8 flex items-center gap-12">
            <span className="inline-flex -rotate-[2.69deg] items-center border-[length:calc(2*var(--u))] border-accent-lime bg-white px-12 py-6">
              <span className="font-stencil text-[calc(36*var(--u))] leading-none font-extrabold text-accent-lime">
                {HERO.greenTag}
              </span>
            </span>
            <span className="text-accent-lime">{HERO.greenLines[1]}</span>
          </span>
        </h1>

        <p className="mt-28 font-display text-[calc(52*var(--u))] leading-display font-extrabold">
          <span className="block text-accent-red">{HERO.redLines[0]}</span>
          <span className="mt-8 flex items-center gap-12">
            <span className="inline-flex rotate-[7.74deg] items-center border-[length:calc(2*var(--u))] border-accent-red bg-white px-12 py-6">
              <span className="font-stencil text-[calc(36*var(--u))] leading-none font-extrabold text-accent-red">
                {HERO.redTag}
              </span>
            </span>
            <span className="text-accent-red">{HERO.redLines[1]}</span>
          </span>
        </p>
      </div>

      <SafeImage
        src={IMAGES.portrait}
        alt={HERO.portraitAlt}
        width={390}
        height={264}
        eager
        className="mt-24 w-full"
        imgClassName="block size-full object-cover object-top"
      />

    </section>
  );
}
