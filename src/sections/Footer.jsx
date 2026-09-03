import { FOOTER } from "../content/portfolio";
import { box, du } from "../lib/design";
import footerLines from "../assets/icons/pattern-footer-lines.svg";

/**
 * 푸터 — 피그마 20:1594 (섹션 x=173, y=7125) → 캔버스 left 76, top 7125, 1976 x 586.1
 *   20:1595 bg-1.svg clip  가로 막대 481 x 16 (푸터 기준 747.5 / 285.05)
 *                          내보낸 SVG 를 -54 만큼 올려 잘라 쓴다(시안의 클리핑과 동일).
 *   20:1609 형광 블록 #EFFF58  좌측 0, 639.98 x 586.1
 *     20:1616 세로 텍스트 48 x 257.1 (푸터 기준 515.18 / 150.01)
 *             "Contact" 19px / 나머지 14px, leading 24, 우측 정렬
 *   20:1622 연락처 블록  푸터 기준 34.99 / 133, 990 x 297.5
 *     20:1623 "Please contact me"  18px / leading 27
 *     20:1631 이름·전화·메일        16px / leading 24
 *     20:1644 소셜 링크 3개         15px / leading 22.5, 세로 gap 8
 * 소셜 링크는 시안에 이동 대상이 없어 링크 없이 텍스트로만 둔다.
 */

/** 90도 돌아간 세로 텍스트 한 줄. */
function VerticalLine({ width, size, right, top, children }) {
  return (
    <div
      className="absolute flex -translate-y-1/2 items-center justify-center"
      style={{
        right: du(right),
        top: du(top),
        height: du(width),
        width: du(24),
      }}
    >
      <div className="rotate-90">
        <p
          className="text-right leading-body text-black"
          style={{ width: du(width), fontSize: du(size) }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="absolute"
      data-reveal
      style={box({ left: 76, top: 7125, width: 1976, height: 586.1 })}
    >
      {/* 20:1595 가로 막대 */}
      <div
        className="absolute overflow-hidden"
        style={box({ left: 747.5, top: 285.05, width: 481, height: 16 })}
      >
        <img
          src={footerLines}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute left-0 max-w-none"
          style={{ top: du(-54), width: du(481), height: du(6579) }}
        />
      </div>

      {/* 제3자 저작물 크레딧 — 시안에 없는 요소다. 형광 블록(0~640 x 0~586) 안에서
          세로 텍스트가 끝나는 y=407 아래의 빈자리에 놓았다. 오른쪽은 장식 이미지가
          x=748 부터 시작하므로 폭을 560 으로 끊어 겹치지 않게 했다.
          z-10 은 뒤에 오는 형광 블록(같은 absolute 형제)에 가려지지 않게 하려는 것이다. */}
      {FOOTER.credits && (
        <p
          className="absolute z-10 text-[calc(11*var(--u))] leading-[calc(16*var(--u))] text-black opacity-60"
          style={box({ left: 50, top: 430, width: 560 })}
        >
          {FOOTER.credits}
        </p>
      )}

      {/* 20:1609 형광 블록 */}
      <div
        className="absolute bg-footer"
        style={box({ left: 0, top: 0, width: 639.98, height: 586.1 })}
      >
        <div
          className="absolute"
          style={box({ left: 515.18, top: 150.01, width: 48, height: 257.1 })}
        >
          <div className="size-full rotate-180">
            <div className="relative size-full">
              <VerticalLine width={72.109} size={19} right={-1} top={43.41}>
                {FOOTER.verticalTitle}
              </VerticalLine>
              <VerticalLine width={164.197} size={14} right={3} top={157.6}>
                {FOOTER.verticalLines[1]}
              </VerticalLine>
              <div className="absolute top-0 left-0 flex w-24 flex-col items-end pr-3">
                <div
                  className="flex w-24 items-center justify-center"
                  style={{ height: du(233) }}
                >
                  <div className="rotate-90">
                    <p className="text-right text-body-sm leading-body whitespace-nowrap text-black">
                      {FOOTER.verticalLines[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 20:1622 연락처 블록 */}
      <div
        className="absolute"
        style={box({ left: 34.99, top: 133, width: 990, height: 297.5 })}
      >
        <p
          className="absolute pb-9 text-[calc(18*var(--u))] leading-[calc(27*var(--u))] text-black"
          style={box({ left: 15, top: 0, width: 465 })}
        >
          {FOOTER.lead}
        </p>

        <div
          className="absolute"
          style={box({ left: 15, top: 113, width: 382.5 })}
        >
          <p className="pb-16 text-body leading-body text-black uppercase">
            {FOOTER.name}
          </p>
          {FOOTER.phone && (
            <p className="text-body leading-body text-black">{FOOTER.phone}</p>
          )}
          {FOOTER.email && (
            <p className="text-body leading-body whitespace-nowrap text-black uppercase">
              {FOOTER.email}
            </p>
          )}
        </div>

        <ul
          hidden={FOOTER.socials.length === 0}
          className="absolute flex flex-col gap-8 pt-32"
          style={box({ left: 592.5, top: 113, width: 300 })}
        >
          {FOOTER.socials.map((label) => (
            <li
              key={label}
              className="text-[calc(15*var(--u))] leading-[calc(22.5*var(--u))] text-black"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
