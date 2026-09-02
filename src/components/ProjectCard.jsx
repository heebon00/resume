import SafeImage from "./SafeImage";
import { box, du } from "../lib/design";

/**
 * MY PROJECTS 카드 — 썸네일 · 제목(2줄) · 설명 · 버튼 2개.
 * 시안(20:1252 / 20:1266 / 20:1274 / 20:1282)은 네 카드가 서로 다른 좌표·글자
 * 크기를 쓰므로, 위치를 props 로 받아 div.row 좌표계에 절대 배치한다.
 *   제목  31px Pretendard Regular, leading 31px, uppercase, 검정
 *   설명  카드 1·2 = 16px Medium #353535 / 카드 3·4 = 13.3px Regular #4b4b4b
 *   버튼  164 x 40, radius 30px, gap 11px (20:1290 / 29:65 / 29:70 · 카드1은 20:1259)
 *         outline = 흰 배경 + #24292E 테두리·글자 / solid = #BF0 배경 + 검은 글자
 *         두 번째 버튼 문구는 카드마다 다르다(영상보기 / 사이트보기).
 * 설명·제목 묶음에만 opacity 0.776 이 걸려 있고 썸네일은 원본 그대로다(시안 20:1253).
 * 디자인에 이동 대상(href)이 없으므로 버튼은 링크 없이 시각적으로만 구현한다.
 */
export default function ProjectCard({
  image,
  title,
  description,
  descriptionImage,
  buttons,
  buttonLabels,
}) {
  return (
    <>
      {image && (
        <SafeImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="absolute"
          data-cursor="explore"
          style={{ left: du(image.left), top: du(image.top) }}
          imgClassName={`block size-full object-cover ${image.objectClassName ?? ""}`}
        />
      )}

      <h3
        className="absolute font-sans text-title whitespace-nowrap text-black uppercase opacity-[0.776]"
        style={{ ...box(title), lineHeight: du(31) }}
      >
        {title.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>

      {description && (
        <p
          className={`absolute font-sans leading-desc whitespace-pre opacity-[0.776] ${description.className}`}
          style={box(description)}
        >
          {description.lines.join("\n")}
        </p>
      )}

      {descriptionImage && (
        <SafeImage
          src={descriptionImage.src}
          alt={descriptionImage.alt}
          width={descriptionImage.width}
          height={descriptionImage.height}
          className="absolute"
          style={{ left: du(descriptionImage.left), top: du(descriptionImage.top) }}
          imgClassName="block size-full rounded-sm object-cover"
        />
      )}

      <div className="absolute flex gap-11" style={box(buttons)}>
        <span className="flex h-40 w-164 items-center justify-center rounded-button border border-base-black bg-white font-sans text-body leading-body text-base-black">
          <span className="glitch-btn" data-text={buttonLabels[0]}>
            {buttonLabels[0]}
          </span>
        </span>
        <span className="flex h-40 w-164 items-center justify-center rounded-button bg-accent-lime font-sans text-body leading-body text-black">
          {buttonLabels[1]}
        </span>
      </div>
    </>
  );
}
