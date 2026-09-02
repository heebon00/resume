import SafeImage from "../../components/SafeImage";
import { GALLERY } from "../../content/portfolio";
import { du } from "../../lib/design";

/**
 * 모바일 이미지 갤러리 — 데스크톱과 같이 왼쪽으로 끊임없이 흐르는 띠다.
 * 컷 크기는 장미 온실 컷 비율(376:670)로 모두 통일하고, 좁은 폭에 맞춰
 * 한 화면에 세 컷 남짓 보이도록 잡았다.
 *
 * 한 묶음을 화면 폭보다 길어질 만큼 반복하고 그 전체를 두 벌 이어 붙인 뒤
 * -50% 만큼 밀면 두 번째 벌이 첫 번째 벌 자리에 정확히 들어와 이음매가 없다.
 * 마지막 컷 뒤에도 간격 하나를 padding 으로 더 줘야 전체 폭이
 * (한 벌 + 간격)의 정확히 두 배가 된다.
 * 양옆 여백 없이 화면을 가로지르고, prefers-reduced-motion 이면 멈춘다.
 */

const ITEM_W = 125;
const ITEM_H = Math.round((125 * 670) / 376); // 장미 온실 컷 비율 유지 → 223
const GAP = 12;
const VIEW_W = 390; // 모바일 캔버스 폭
const DURATION = "22s";

const OBJECT_CLASS = { "web-redesign": "object-top" };

const SET_W = GALLERY.length * (ITEM_W + GAP);
const REPEAT = SET_W > 0 ? Math.ceil(VIEW_W / SET_W) : 1;

export default function MobileGallery() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!GALLERY.length) return null;

  return (
    <section
      data-reveal
      id="gallery"
      aria-label="작업 이미지 갤러리"
      className="overflow-hidden pb-60"
    >
      <div
        className="marquee-track flex w-max items-center"
        style={{
          gap: du(GAP),
          paddingRight: du(GAP),
          "--marquee-period": "50%",
          "--marquee-duration": DURATION,
        }}
      >
        {/* 같은 묶음을 두 벌 이어 붙여 끊김 없이 순환시킨다 */}
        {Array.from({ length: REPEAT * 2 }, (_, copy) =>
          GALLERY.map((item) => (
            <div
              key={`${copy}-${item.id}`}
              className="relative shrink-0 overflow-hidden bg-paper-alt"
              aria-hidden={copy >= REPEAT ? "true" : undefined}
              style={{ width: du(ITEM_W), height: du(ITEM_H) }}
            >
              <SafeImage
                src={item.src}
                alt={copy >= REPEAT ? "" : item.alt}
                className="absolute inset-0 size-full"
                imgClassName={`block size-full object-cover ${OBJECT_CLASS[item.id] ?? ""}`}
              />
            </div>
          )),
        )}
      </div>
    </section>
  );
}
