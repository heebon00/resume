import { useEffect, useRef } from "react";

/**
 * 헤더 배너의 파티클 커서 — 참고한 threejs-toys 의 particlesCursor 를
 * 외부 라이브러리 없이 canvas 2D 로 다시 구현한 것이다.
 * (원본은 GPGPU 로 26만 입자를 돌리지만, 여기서는 CPU 로 수천 개를 쓴다)
 *
 * 원본 설정을 그대로 옮긴 값:
 *   colors [0x00ff00, 0x0000ff] · color 0xff0000 · pointSize 5 · pointDecay 0.0025
 *   coordScale 0.5 · noiseIntensity 0.001 · noiseTimeCoef 0.0001
 *   sleepRadius 250 / sleepTimeCoef 0.001, 0.002  (마우스가 멈추면 도는 궤도)
 *   클릭하면 색 · coordScale · noiseIntensity · pointSize 를 무작위로 바꾼다
 *
 * 화면 밖이거나 탭이 가려지면 멈추고, prefers-reduced-motion 이면 아예 켜지 않는다.
 *
 * 색은 colors(기본색 2개) · hotColor(막 태어난 입자에 섞는 강조색) props 로 바꿀 수
 * 있다. 기본값은 원본 그대로(초록/파랑 + 빨강 강조)이고, 히어로(큰 헤더)만 요청받은
 * Adobe Color "Vaporwave" 팔레트(color.adobe.com, FFCFEA·FEFFBE·CBFFE6·AFE9FF·BFB9FF)
 * 값을 넘긴다 — 이름 배너(작은 헤더)는 그대로 둔다.
 */

const COUNT = 3000; // 입자 수 (원본 262144 → CPU 로 감당 가능한 수준)
const EMIT_PER_FRAME = 12;
const BASE_COLORS = [0x00ff00, 0x0000ff];
const SLEEP_RADIUS = 250;
const SLEEP_COEF_X = 0.001;
const SLEEP_COEF_Y = 0.002;

const rgb = (hex) => [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
const mix = (a, b, t) => a + (b - a) * t;

export default function HeaderParticles({
  className = "",
  // 어두운 배경은 "lighter"(빛이 더해지는 느낌), 밝은 배경은 "source-over".
  blend = "lighter",
  colors = BASE_COLORS,
  hotColor = 0xff0000,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    // 입자 상태 — 배열 하나씩 두고 인덱스로 돌려 쓴다(할당 없음).
    const px = new Float32Array(COUNT);
    const py = new Float32Array(COUNT);
    const vx = new Float32Array(COUNT);
    const vy = new Float32Array(COUNT);
    const life = new Float32Array(COUNT);
    const tint = new Float32Array(COUNT); // 0~1, 두 기본색 사이 위치
    let head = 0;

    const c0 = rgb(colors[0]);
    const c1 = rgb(colors[1]);
    let hot = rgb(hotColor);
    let coordScale = 0.5;
    let noiseIntensity = 0.001;
    let pointSize = 5;
    const pointDecay = 0.005; // 원본 0.0025 는 입자가 훨씬 많을 때의 값이다

    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lastMove = -Infinity;
    let running = false;
    let frame = 0;
    let start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // 값싼 흐름장 — 사인 몇 개를 겹쳐 소용돌이 비슷한 흐트러짐을 만든다.
    const flow = (x, y, time, out) => {
      const s = coordScale * 0.012;
      out[0] = Math.sin(y * s + time) + Math.cos(x * s * 0.7 - time * 1.3);
      out[1] = Math.cos(x * s - time * 0.9) + Math.sin(y * s * 1.4 + time * 1.1);
    };

    const drift = [0, 0];

    const step = (now, draw) => {
      const elapsed = now - start;
      const time = elapsed * 0.0001 * 10; // noiseTimeCoef

      // 마우스가 멈춰 있으면 리사주 궤도를 따라 스스로 떠돈다(원본 sleep 동작).
      const idle = now - lastMove > 500;
      const rx = Math.min(SLEEP_RADIUS, width * 0.35);
      const ry = Math.min(SLEEP_RADIUS, height * 0.35);
      const ex = idle
        ? width / 2 + Math.cos(elapsed * SLEEP_COEF_X) * rx
        : pointerX;
      const ey = idle
        ? height / 2 + Math.sin(elapsed * SLEEP_COEF_Y) * ry
        : pointerY;

      for (let k = 0; k < EMIT_PER_FRAME; k += 1) {
        const i = head % COUNT;
        head += 1;
        px[i] = ex + (Math.random() - 0.5) * 8;
        py[i] = ey + (Math.random() - 0.5) * 8;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 1.6;
        vx[i] = Math.cos(angle) * speed;
        vy[i] = Math.sin(angle) * speed;
        life[i] = 1;
        tint[i] = Math.random();
      }

      if (draw) {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = blend;
      }

      for (let i = 0; i < COUNT; i += 1) {
        if (life[i] <= 0) continue;
        flow(px[i], py[i], time, drift);
        vx[i] = (vx[i] + drift[0] * noiseIntensity * 140) * 0.985;
        vy[i] = (vy[i] + drift[1] * noiseIntensity * 140) * 0.985;
        px[i] += vx[i];
        py[i] += vy[i];
        life[i] -= pointDecay;

        const l = life[i];
        if (l <= 0 || !draw) continue;
        // 기본색(초록↔파랑) 위에, 갓 태어난 입자일수록 강조색을 섞는다.
        const heat = l * l * 0.7;
        const r = mix(mix(c0[0], c1[0], tint[i]), hot[0], heat);
        const g = mix(mix(c0[1], c1[1], tint[i]), hot[1], heat);
        const b = mix(mix(c0[2], c1[2], tint[i]), hot[2], heat);
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${l * 0.85})`;
        const size = pointSize * l;
        ctx.fillRect(px[i] - size / 2, py[i] - size / 2, size, size);
      }

      if (draw) ctx.globalCompositeOperation = "source-over";
    };

    // 예열 — 화면에 들어온 순간 이미 흐르고 있는 상태로 보이게 미리 돌려 둔다.
    const warmUp = () => {
      for (let i = 0; i < 220; i += 1) step(start + i * 16, false);
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      if (!running) return;
      step(now, true);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // 이 캔버스 밖이면 따라가지 않는다 → 잠시 뒤 유휴 궤도로 돌아간다.
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      pointerX = x;
      pointerY = y;
      lastMove = performance.now();
    };

    // 클릭하면 원본처럼 색과 파라미터를 무작위로 바꾼다.
    const onClick = () => {
      hot = rgb(Math.floor(Math.random() * 0xffffff));
      coordScale = 0.001 + Math.random() * 2;
      noiseIntensity = 0.0001 + Math.random() * 0.001;
      pointSize = 1 + Math.random() * 10;
    };

    resize();
    start = performance.now();
    warmUp();

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !document.hidden;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) running = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.parentElement?.addEventListener("click", onClick);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.parentElement?.removeEventListener("click", onClick);
    };
  }, [blend, colors, hotColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
    />
  );
}
