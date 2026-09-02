import { useState } from "react";

/**
 * 콘텐츠 이미지 공용 래퍼 — PRD 상태 처리를 한곳에서 담당한다.
 *   로딩  loading="lazy" + width/height 명시 + 자리표시 배경
 *         → 이미지가 늦게 와도 자리를 미리 잡아 레이아웃이 밀리지 않는다(CLS 방지)
 *   완료  자리표시 배경을 걷어낸다. 그러지 않으면 배경이 투명한 이미지(히어로 인물
 *         누끼 등) 뒤로 회색 사각형이 비쳐 시안과 달라진다.
 *   오류  이미지를 감추고 자리표시 배경 위에 alt 텍스트를 노출
 *
 * width/height 는 시안의 디자인 px 숫자를 그대로 넘긴다(예: 144). 실제 크기는
 * 유동 단위 --u 를 곱해 화면 폭에 비례한다. 크기를 클래스로 이미 정한 경우에는
 * 생략하고 className 으로 지정하면 된다.
 */
export default function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  imgClassName = "block size-full object-cover",
  style,
  eager = false,
  ...rest
}) {
  const [status, setStatus] = useState("loading");

  const boxStyle = { ...style };
  if (width !== undefined) boxStyle.width = `calc(${width} * var(--u))`;
  if (height !== undefined) boxStyle.height = `calc(${height} * var(--u))`;

  // 오류 메시지를 겹쳐 놓으려면 래퍼에 위치 기준이 있어야 해서 기본값은 relative 다.
  // 다만 Tailwind 는 .relative 를 .absolute 보다 뒤에 출력하므로, 호출부가 absolute
  // 나 fixed 를 넘겼는데 relative 를 같이 붙이면 relative 가 이겨 배치가 깨진다.
  // 그래서 호출부가 위치를 지정한 경우에는 relative 를 붙이지 않는다.
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);

  return (
    <span
      {...rest}
      className={`${positioned ? "" : "relative"} block overflow-hidden ${
        status === "loaded" ? "" : "bg-paper-alt"
      } ${className}`}
      style={boxStyle}
    >
      {status === "failed" ? (
        <span className="absolute inset-0 flex items-center justify-center p-8 text-center font-sans text-label leading-body text-ink-soft">
          {alt}
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("failed")}
          className={imgClassName}
        />
      )}
    </span>
  );
}
