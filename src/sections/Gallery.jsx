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
 * 마지막 이미지 뒤에도 간격 하나를 padding 으로 더 줘야 전체 폭이
 * (한 벌 + 간격)의 정확히 두 배가 된다(없으면 간격 절반만큼 어긋난다).
 * prefers-reduced-motion 이면 멈춘다(index.css 의 .marquee-track).
 */

// 크기는 장미 온실 컷(376x670)의 1/3 로 모두 통일한다.
// 원본 비율이 다른 컷은 object-cover 로 잘라 맞춘다.
const ITEM_W = 376 / 3;
const ITEM_H = 670 / 3;
const OBJECT_CLASS = { "web-redesign": "object-top" };

const GAP = 43; // 시안 슬롯 간격(약 129)의 1/3
const SPEED = 80; // 디자인 px / 초 — 키워드 마퀴와 같은 속도
const VIEW_W = 1920;

// 시안 띠(20:1207)는 높이 558.8 이고 그 안에서 이미지가 세로 가운데였다.
// 요청으로 자리를 MY WORK EXPERIENCE 바로 아래(스크롤 연출 앞)로 옮기면서
// 캔버스 절대 좌표를 버리고 흐름 요소가 됐다 — 위아래 여백은 시안 띠에서
// 이미지를 뺀 값의 절반씩으로 그대로 가져온다.
const BAND_H = 558.8;
const BAND_PAD = (BAND_H - ITEM_H) / 2;

const ITEMS = GALLERY.map((item) => ({
  ...item,
  objectClassName: OBJECT_CLASS[item.id],
}));

// 한 묶음이 화면 폭보다 짧으면 그만큼 반복해야 빈자리가 생기지 않는다.
const SET_W = ITEMS.length * (ITEM_W + GAP);
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
      style={{ paddingBlock: du(BAND_PAD) }}
    >
      <div
        className="relative w-full overflow-hidden"
        data-reveal
        data-cursor="drag"
        style={{ height: du(ITEM_H) }}
      >
        <div
          className="marquee-track flex w-max items-center"
          style={{
            gap: du(GAP),
            paddingRight: du(GAP),
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
                  imgClassName={`block size-full object-cover ${item.objectClassName ?? ""}`}
                />
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
