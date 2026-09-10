import { mobileId } from "../../lib/sectionIds";
import SafeImage from "../../components/SafeImage";
import { GALLERY } from "../../content/portfolio";
import { du } from "../../lib/design";

/**
 * 모바일 이미지 갤러리 — 데스크톱과 같이 왼쪽으로 끊임없이 흐르는 띠다.
 * 컷 크기는 데스크톱(Gallery.jsx)과 같은 2:1 가로 상자로 통일한다 — 세 컷이
 * 전부 가로형 프로젝트 목업이라 예전 세로 비율(376:670)로는 가운데 세로 띠만
 * 보였다. 좁은 폭이라 한 화면에 한 컷 반 남짓 보인다.
 *
 * 한 묶음을 화면 폭보다 길어질 만큼 반복하고 그 전체를 두 벌 이어 붙인 뒤
 * -50% 만큼 밀면 두 번째 벌이 첫 번째 벌 자리에 정확히 들어와 이음매가 없다.
 * 마지막 컷 뒤에도 간격 하나를 padding 으로 더 줘야 전체 폭이
 * (한 벌 + 간격)의 정확히 두 배가 된다.
 * 양옆 여백 없이 화면을 가로지르고, prefers-reduced-motion 이면 멈춘다.
 */

const ITEM_H = 125;
const ITEM_W = ITEM_H * 2; // 데스크톱과 같은 2:1 상자
const VIEW_W = 390; // 모바일 캔버스 폭
const DURATION = "22s";

const SET_W = GALLERY.length * ITEM_W;
const REPEAT = SET_W > 0 ? Math.ceil(VIEW_W / SET_W) : 1;

export default function MobileGallery() {
  // 빈 데이터 — 목록이 비면 섹션 자체를 렌더링하지 않는다(빈 껍데기 노출 금지).
  if (!GALLERY.length) return null;

  return (
    <section
      data-reveal
      id={mobileId("gallery")}
      aria-label="작업 이미지 갤러리"
      className="overflow-hidden pb-60"
    >
      <div
        className="marquee-track flex w-max items-center"
        style={{
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
                imgClassName="block size-full object-cover"
              />
            </div>
          )),
        )}
      </div>
    </section>
  );
}
