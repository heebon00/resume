import { du } from "../lib/design";

/**
 * 테두리 3겹 글자 — 요청으로 tympanus.net/Development/FancyLetterAnimation 의
 * 글자 모양을 옮겼다(55.md).
 *
 * [데모와 다른 점 · 왜 이렇게 했나]
 * 데모는 알파벳 한 글자를 "손으로 그린 한 줄 획"(SVG path)으로 갖고 있어서
 * 그 획을 3겹으로 겹치고 펜으로 긋듯 그린다. 한글은 그 획 데이터가 없다.
 * 그래서 글자는 웹폰트 그대로 두고, 속을 비운(색 투명) 글자를 세 벌 겹쳐
 * 테두리 굵기만 달리한다 — 색이 겹쳐 보이는 모습은 같아진다.
 * 펜으로 그어지는 드로잉은 빠졌다(획 길이를 알 수 없어서다).
 *
 * 글자 하나하나가 따로 움직여야 해서 글자 단위로 쪼개고, 각 글자 안에
 * 세 벌을 겹쳐 둔다. 움직임은 쓰는 쪽에서 `[data-letter]` 로 잡는다.
 *
 * 읽기는 통째로 한 번만 되게 한다 — 숨김 텍스트를 한 벌 두고,
 * 쪼갠 글자는 전부 보조기기에서 숨긴다.
 */
export default function StrokedText({ text, layers, className = "" }) {
  return (
    <span className={className}>
      {/* 읽히는 건 이 한 벌뿐이다. 쪼갠 글자는 전부 장식으로 둔다. */}
      <span className="sr-only">{text}</span>
      {[...text].map((char, i) => (
        <span
          key={i}
          data-letter
          aria-hidden="true"
          className="relative inline-block whitespace-pre"
        >
          {layers.map((layer, depth) => (
            <span
              key={depth}
              // 첫 벌이 글자 크기를 정하고, 나머지는 그 위에 포개진다.
              className={depth === 0 ? "block" : "absolute inset-0 block"}
              style={{
                color: "transparent",
                WebkitTextStrokeColor: layer.color,
                WebkitTextStrokeWidth: du(layer.width),
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
