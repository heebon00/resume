import { mobileId } from "../../lib/sectionIds";
import { KEYWORD_ROWS } from "../../content/portfolio";

/**
 * 모바일 키워드 마퀴 — 데스크톱과 같이 왼쪽으로 계속 흐른다.
 * 좁은 폭이라 시안의 절대 좌표 대신 한 줄로 이어 붙이고, 같은 묶음을 두 벌 두어
 * -50% 만큼 밀어 끊김 없이 순환시킨다.
 * 오른쪽에 gap 하나만큼 padding 을 더 준다. 그래야 전체 폭이 (한 벌 + 간격)의
 * 정확히 두 배가 되어 -50% 가 딱 한 주기와 일치한다(없으면 간격 절반만큼 어긋난다).
 * 1·3번째 줄은 왼쪽, 2번째 줄은 오른쪽으로 흐른다.
 * 채움색은 시안 값 그대로 자주 #D4183D(흰 글자), 라임 #C9FD37(검은 글자) 를 쓴다.
 *
 * [알약 위아래가 잘리던 문제]
 * 알약 테두리를 box-shadow(0 0 0 1.5u)로 그리는데, 그림자는 요소 박스 "밖"으로
 * 나간다. 줄 상자는 가로로 흐르는 걸 가두려고 overflow:hidden 인데 높이가 알약과
 * 똑같아서, 위아래로 삐져나온 테두리가 그대로 잘렸다(요청으로 발견).
 * 데스크톱은 줄 높이가 96.13 이라 알약(약 40)보다 넉넉해서 이 문제가 없다.
 * 줄 상자에 위아래 여백 3 을 줘 테두리 자리를 비운다. 그만큼 줄 사이가
 * 벌어지므로 section 의 gap 을 8 -> 2 로 줄여 보이는 간격(3+2+3=8)을 지킨다.
 */
const FILL_CLASS = {
  crimson: "bg-tag-crimson text-white",
  lime: "bg-tag-lime text-black",
};

// 줄마다 소요 시간을 다르게 두어 세 줄이 한 덩어리처럼 움직이지 않게 한다.
const DURATIONS = ["26s", "31s", "28s"];

export default function MobileMarquee() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!KEYWORD_ROWS.flat().length) return null;

  return (
    <section
      data-reveal
      id={mobileId("keywords")}
      aria-label="작업 키워드"
      className="flex flex-col gap-2 pb-60"
    >
      {KEYWORD_ROWS.map((row, r) => (
        <div key={`row-${r + 1}`} className="overflow-hidden py-3">
          <div
            className="marquee-track flex w-max gap-8 pr-8"
            data-direction={r % 2 === 1 ? "right" : "left"}
            style={{
              "--marquee-period": "50%",
              "--marquee-duration": DURATIONS[r],
            }}
          >
            {[0, 1].map((copy) =>
              row.map((tag, i) => (
                <span
                  key={`${copy}-${tag.label}-${i}`}
                  aria-hidden={copy === 1 ? "true" : undefined}
                  className={`inline-flex shrink-0 items-center rounded-pill px-16 py-8 font-sans text-[calc(15*var(--u))] leading-none font-medium whitespace-nowrap uppercase shadow-[0_0_0_calc(1.5*var(--u))_var(--color-ring)] ${
                    tag.fill ? FILL_CLASS[tag.fill] : "text-ink"
                  }`}
                >
                  {tag.label}
                </span>
              )),
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
