import SafeImage from "../components/SafeImage";
import { du } from "../lib/design";
import { GALLERY } from "../content/portfolio";

/**
 * 이미지 갤러리 — 피그마 20:1207 (섹션 y=2886, 클리핑 박스 2020 x 558.8)
 *   시안에서는 슬롯 2·4·5 에 크기가 제각각인 이미지가 멈춰 있었지만(20:1225 /
 *   29:1273 / 29:1274), 요청에 따라 장미 온실 컷의 1/3 크기로 모두 통일하고
 *   왼쪽으로 끊임없이 흐르는 띠로 바꿨다.
 *
 * [흐름 애니메이션]
 * 키워드 마퀴와 같은 방식이다. 한 묶음을 화면 폭보다 길어질 만큼 반복하고,
 * 그 전체를 두 벌 이어 붙인 뒤 -50% 만큼 밀면 두 번째 벌이 첫 번째 벌 자리에
 * 정확히 들어와 이음매가 보이지 않는다.
 * 컷 사이 간격은 요청으로 없앴다(모바일 MobileGallery 도 같다) — 컷들이
 * 서로 맞붙어 한 줄 띠처럼 흐른다. 간격이 없으니 마지막 컷 뒤에 간격 하나를
 * padding 으로 더 주던 보정도 필요 없다(간격이 있을 때는 그게 없으면 전체 폭이
 * 한 벌의 정확히 두 배가 안 돼 이음매가 어긋났다).
 * prefers-reduced-motion 이면 멈춘다(index.css 의 .marquee-track).
 */

// 요청 — 세 컷을 프로젝트 목업으로 바꾸면서 크기를 하나로 통일한다.
// 예전에는 장미 온실 컷(376x670)의 1/3 인 세로 상자였는데, 목업은 셋 다
// 가로형이라 그대로 넣으면 가운데 세로 띠만 보인다. 높이는 띠 높이(BAND_H)
// 계산이 그대로 맞도록 예전 값을 지키고, 폭만 2배로 늘려 2:1 상자로 쓴다.
// 원본 비율은 AI Video 2.04 · iKEA 1.98 · YouTube Music 1.44 로, 앞의 둘은
// 거의 안 잘리고 YouTube Music 만 위아래가 조금 잘린다(가운데 기준, 글자와
// 휴대폰은 가운데라 남는다).
const ITEM_H = 670 / 3;
const ITEM_W = ITEM_H * 2;

const SPEED = 80; // 디자인 px / 초 — 키워드 마퀴와 같은 속도
const VIEW_W = 1920;

// 시안 띠(20:1207)는 높이 558.8 이고 그 안에서 이미지가 세로 가운데였다.
// 요청으로 자리를 MY WORK EXPERIENCE 바로 아래(스크롤 연출 앞)로 옮기면서
// 캔버스 절대 좌표를 버리고 흐름 요소가 됐다 — 위아래 여백은 시안 띠에서
// 이미지를 뺀 값의 절반씩으로 그대로 가져온다.
const BAND_H = 558.8;
const BAND_PAD = (BAND_H - ITEM_H) / 2;
// 위쪽만 따로 — 바로 위 "— MY projects" 제목과의 간격을 줄여 달라는 요청.
// 아래쪽은 첫 컷(전체 화면)과 붙지 않게 시안 값 그대로 둔다.
const PAD_TOP = 76;

// 셋 다 같은 2:1 상자에 가운데 기준으로 잘라 넣는다 — 컷마다 다른 초점을
// 주던 OBJECT_CLASS 는 크기가 통일되면서 필요 없어졌다.
const ITEMS = GALLERY;

// 한 묶음이 화면 폭보다 짧으면 그만큼 반복해야 빈자리가 생기지 않는다.
const SET_W = ITEMS.length * ITEM_W;
const REPEAT = SET_W > 0 ? Math.ceil(VIEW_W / SET_W) : 1;
const LOOP_W = SET_W * REPEAT; // 한 주기(= 트랙 폭의 절반)

export default function Gallery() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!ITEMS.length) return null;

  return (
    <section
      id="gallery"
      aria-label="작업 이미지 갤러리"
      className="relative w-full"
      style={{ paddingTop: du(PAD_TOP), paddingBottom: du(BAND_PAD) }}
    >
      <div
        className="relative w-full overflow-hidden"
        data-reveal
        style={{ height: du(ITEM_H) }}
      >
        <div
          className="marquee-track flex w-max items-center"
          style={{
            "--marquee-period": "50%",
            "--marquee-duration": `${(LOOP_W / SPEED).toFixed(2)}s`,
          }}
        >
          {/* 같은 묶음을 두 벌 이어 붙여 끊김 없이 순환시킨다 */}
          {Array.from({ length: REPEAT * 2 }, (_, copy) =>
            ITEMS.map((item) => (
              <div
                key={`${copy}-${item.id}`}
                className="relative shrink-0 overflow-hidden"
                aria-hidden={copy >= REPEAT ? "true" : undefined}
                style={{ width: du(ITEM_W), height: du(ITEM_H) }}
              >
                <SafeImage
                  src={item.src}
                  alt={copy >= REPEAT ? "" : item.alt}
                  className="absolute inset-0 size-full"
                  imgClassName="block size-full object-cover"
                />
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
