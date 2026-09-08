import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 물결치는 큐브 격자 — franky-adl/3d-wave-grid(github.com/franky-adl/3d-wave-grid,
 * arkon.digital 의 라이브 데모) 소스를 그대로 확인하고 옮겼다(55.md 후속 요청).
 * 원본은 Three.js 씬 하나를 여러 클래스(Stage·Camera·Renderer·MouseTrail)로
 * 쪼갠 프로젝트라, 이 파일에서는 우리 프로젝트에 필요한 만큼만(디버그 GUI ·
 * Stats 패널 · 후처리 비네트는 제외) 한 컴포넌트로 옮겼다.
 *
 * 핵심 원리(원본 그대로):
 *   1. 40x40, 폭 0.8 · 높이 3 짜리 가늘고 긴 기둥을 간격 0.01 로 거의 붙여
 *      깐다 — InstancedMesh 하나로 1600개를 그린다.
 *   2. 마우스가 지나간 자리를 "궤적"으로 기록한다(최근 128개, 나이·좌표를
 *      DataTexture 하나에 실어 정점 셰이더로 넘긴다).
 *   3. 정점 셰이더가 각 기둥마다 모든 궤적점까지의 거리를 보고, 궤적점에서
 *      바깥으로 퍼져나가는 가우시안 파동(경과 시간 × 파속 = 파면 위치)을
 *      계산해 기둥 윗부분(y>0)을 그만큼 밀어 올린다. 여러 파동이 겹치면
 *      더해지지 않고 가중평균 — 그래야 무질서하게 안 튄다.
 *   4. 밀려 올라간 높이를 0~1로 정규화해 색을 입힌다 — 대기 상태(높이 0)는
 *      원본 그대로 흰색이고, 높이가 올라간 만큼만 사이트 팔레트 두 색
 *      (#D4183D 크림슨 → #EFFF58 라임, 요청)이 섞여 배어 나온다. 그래서
 *      안 움직이는 칸은 흰색, 마우스가 지나간 자리만 물든다. 예전엔
 *      HSL(hue)로 무지개 전체를 훑었는데, 지정된 두 색만 쓰도록 RGB
 *      mix() 로 바꿨다(아래 COLOR_A·COLOR_B 정의와 셰이더 참조).
 *   5. 마우스가 3초 넘게 안 움직이면 1.5초마다 임의의 자리에 궤적점을
 *      찍어 화면이 계속 살아있게 한다 — 마우스가 없는 모바일 터치·데스크톱
 *      무동작 상태에서도 파도가 저절로 인다.
 *   6. 카메라는 원본처럼 (0, 12, 0)에서 거의 수직으로 내려다보되, 마우스
 *      위치에 따라 아주 살짝(±14°/±22°) 기운다.
 *
 * [한 번 잘못 옮겼던 부분] 그림자가 칸마다 또렷한 검은 줄로 딱딱하게 져서
 * (요청) 한때 그림자 맵을 통째로 껐었는데, 원인은 shadow.radius(그림자
 * 가장자리를 퍼뜨리는 값)를 빼먹은 것이었다. 이제 원본 그대로 radius=6 을
 * 넣어 되살렸다 — 조명·그림자 값 전부 원본과 같다(아래 조명 설정 참조).
 * 대기 상태에서도 격자 굴곡이 은은하게 남는 건 이 그림자 덕분이다.
 *
 * 데스크톱·모바일 히어로가 항상 같이 마운트돼 있어, 안 보이는 쪽(다른
 * 브레이크포인트라 크기가 0)은 그 프레임의 렌더를 건너뛴다. 모션을 줄이도록
 * 설정한 경우 캔버스 자체를 만들지 않는다.
 */

const MAX_TRAIL = 128;
const GRID_SIZE = 40;
const CUBE_WIDTH = 0.8;
const CUBE_HEIGHT = 3;
const GAP = 0.01;
const BOUNDS = GRID_SIZE * (CUBE_WIDTH + GAP);

const WAVE = {
  amplitude: 0.4,
  speed: 6.0,
  frequency: 1.2,
  width: 3.0,
  jitter: 0.2,
  maxHeight: 0.4,
  fadeTime: 2.0,
  trailSpacing: 0.1,
};

// 색상 — 요청으로 사이트 팔레트의 두 색(#D4183D 크림슨 · #EFFF58 라임)만
// 쓰도록 바꿨다. 예전엔 무지개(마젠타→주황)를 HSL 로 훑었는데, 이제는
// 이 두 RGB 색 사이만 섞는다(아래 fragment 셰이더 mix() 참조) — 파도
// 높이(t)에 따라 크림슨에서 라임으로 번진다. 대기 상태(t=0)는 원본
// MeshPhongMaterial(white) 그대로 흰색 바탕을 지킨다("기본 배경은
// 흰색이어야 한다"는 요청).
const COLOR_A = [212 / 255, 24 / 255, 61 / 255]; // #D4183D
const COLOR_B = [239 / 255, 255 / 255, 88 / 255]; // #EFFF58
const BG_COLOR = new THREE.Color(0xffffff);

/** 원본 Stage.js 의 onBeforeCompile 셰이더 주입을 그대로 옮긴 것. */
function overrideVertexShader(vertexShader) {
  return vertexShader
    .replace(
      "#include <common>",
      `#include <common>
      varying float vHeight;
      attribute vec2 aOffset;
      uniform sampler2D uTrailTexture;
      uniform int       uTrailCount;
      uniform float     uWaveSpeed;
      uniform float     uWaveFreq;
      uniform float     uWaveWidth;
      uniform float     uFadeTime;
      uniform float     uAmplitude;
      uniform float     uJitter;
      uniform float     uMaxHeight;

      vec2 hash2( vec2 p ) {
        p = vec2(
          dot( p, vec2( 127.1, 311.7 ) ),
          dot( p, vec2( 269.5, 183.3 ) )
        );
        return fract( sin( p ) * 43758.5453123 ) - 0.5;
      }`,
    )
    .replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>

      vHeight = 0.0;

      if ( position.y > 0.0 ) {
        vec2 jitter  = hash2( aOffset ) * uJitter;
        vec2 worldXZ = aOffset + jitter;
        float waveHeight  = 0.0;
        float totalWeight = 0.0;

        for ( int i = 0; i < uTrailCount; i++ ) {
          vec4 td = texture2D(
            uTrailTexture,
            vec2( ( float(i) + 0.5 ) / 128.0, 0.5 )
          );
          float dist      = length( worldXZ - td.rg );
          float wavefront = uWaveSpeed * td.b;
          float relDist   = dist - wavefront;

          float window = exp( -( relDist * relDist ) / ( uWaveWidth * uWaveWidth ) );
          float fade   = exp( -td.b / uFadeTime );
          float atten  = 1.0 / ( 1.0 + dist * 0.1 );
          float weight = fade * window * atten * td.a;

          waveHeight  += weight * cos( uWaveFreq * relDist );
          totalWeight += weight;
        }

        waveHeight /= max( totalWeight, 1.0 );

        float displacement = clamp( waveHeight * uAmplitude, -uMaxHeight, uMaxHeight );
        transformed.y += displacement;
        vHeight = displacement;
      }`,
    );
}

export default function WavyCubes({ className, style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0x808080);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = BG_COLOR.clone().multiplyScalar(0.5);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    const RADIUS = 12;
    const ALPHA_RANGE = Math.PI * 0.03;
    const BETA_RANGE = Math.PI * 0.05;

    function positionCamera(mx, my) {
      const alpha = my * ALPHA_RANGE;
      const beta = mx * BETA_RANGE;
      camera.position.set(
        -RADIUS * Math.cos(alpha) * Math.sin(beta),
        RADIUS * Math.cos(alpha) * Math.cos(beta),
        RADIUS * Math.sin(alpha),
      );
      camera.up.set(0, 0, -1);
      camera.lookAt(0, 0, 0);
    }
    positionCamera(0, 0);

    // 원본 그대로. 처음 포팅할 때 shadow.radius(부드러운 그림자 반경)를
    // 빼먹어서 그림자가 칸마다 또렷한 검은 줄로 딱딱하게 졌었다(요청으로
    // 발견) — radius=6 을 넣으니 원본처럼 그림자가 넓게 퍼져 거의 안
    // 보일 만큼 부드러워지고, 대기 상태에서도 격자 굴곡이 은은하게 남는다.
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 4.0);
    key.position.set(-20, 10, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 6;
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 60;
    key.shadow.camera.left = -22;
    key.shadow.camera.right = 22;
    key.shadow.camera.top = 22;
    key.shadow.camera.bottom = -22;
    key.shadow.bias = 0.0001;
    scene.add(key);
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(10, 5, -3);
    scene.add(fillLight);

    // --- 격자 ---------------------------------------------------------------
    const count = GRID_SIZE * GRID_SIZE;
    const geometry = new THREE.BoxGeometry(CUBE_WIDTH, CUBE_HEIGHT, CUBE_WIDTH);
    const offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2);
    geometry.setAttribute("aOffset", offsetAttribute);

    // --- 마우스 궤적 텍스처 ---------------------------------------------------
    const trail = [];
    let lastPoint = null;
    let timeSinceLastMove = 0;
    let randomPointTimer = 0;
    let isPlacingRandomPoints = true;

    const trailData = new Float32Array(MAX_TRAIL * 4);
    const trailTexture = new THREE.DataTexture(trailData, MAX_TRAIL, 1, THREE.RGBAFormat, THREE.FloatType);
    trailTexture.needsUpdate = true;
    const trailUniforms = {
      uTrailTexture: { value: trailTexture },
      uTrailCount: { value: 0 },
      uFadeTime: { value: WAVE.fadeTime },
    };

    function addRandomPoint() {
      const x = (Math.random() * 0.5 - 0.25) * BOUNDS;
      const z = (Math.random() * 0.5 - 0.25) * BOUNDS;
      const distDelta = 0.8 + Math.random() * 0.2;
      if (trail.length >= MAX_TRAIL) trail.shift();
      trail.push({ x, z, age: 0, distDelta });
    }

    const rayPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(BOUNDS, BOUNDS),
      new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }),
    );
    rayPlane.rotation.x = -Math.PI / 2;
    rayPlane.updateMatrixWorld(true);
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const mouseNorm = new THREE.Vector2(0, 0);
    const lerpedMouse = new THREE.Vector2(0, 0);

    function handlePointerMove(e) {
      const rect = mount.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // 카메라 살짝 기울이는 데 쓸 -1~1 정규화 좌표(원본 Camera.js 참고).
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      pointerNdc.copy(mouseNorm);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObject(rayPlane);
      if (hits.length === 0) return;

      const { x, z } = hits[0].point;
      let distDelta = 0;
      if (lastPoint) {
        const dx = x - lastPoint.x;
        const dz = z - lastPoint.z;
        distDelta = Math.sqrt(dx * dx + dz * dz);
        if (distDelta < WAVE.trailSpacing) return;
      }
      if (trail.length >= MAX_TRAIL) trail.shift();
      trail.push({ x, z, age: 0, distDelta });
      lastPoint = { x, z };

      timeSinceLastMove = 0;
      isPlacingRandomPoints = false;
      randomPointTimer = 0;
    }
    window.addEventListener("pointermove", handlePointerMove);

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTrailTexture = trailUniforms.uTrailTexture;
      shader.uniforms.uTrailCount = trailUniforms.uTrailCount;
      shader.uniforms.uFadeTime = trailUniforms.uFadeTime;
      shader.uniforms.uWaveSpeed = { value: WAVE.speed };
      shader.uniforms.uWaveFreq = { value: WAVE.frequency };
      shader.uniforms.uWaveWidth = { value: WAVE.width };
      shader.uniforms.uAmplitude = { value: WAVE.amplitude };
      shader.uniforms.uJitter = { value: WAVE.jitter };
      shader.uniforms.uMaxHeight = { value: WAVE.maxHeight };
      shader.uniforms.uColorA = { value: COLOR_A };
      shader.uniforms.uColorB = { value: COLOR_B };
      shader.vertexShader = overrideVertexShader(shader.vertexShader);
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying float vHeight;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uMaxHeight;`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          float t = clamp( vHeight / uMaxHeight, 0.0, 1.0 );
          // 기본(대기, t=0)은 흰색으로 두고, 파도로 밀려 올라간 만큼(t)만
          // uColorA(#D4183D)에서 uColorB(#EFFF58)로 섞인 색이 배어 나온다
          // — 그래서 안 움직이는 칸은 흰색 그대로, 파도가 지나간 자리만 물든다.
          // uColorA 가 포인트 컬러라는 요청으로, 둘을 반씩 섞지 않고 pow()
          // 로 편향을 준다 — 낮거나 중간 높이 파도는 거의 uColorA(크림슨)만
          // 보이고, 아주 높이 튄 파도의 꼭대기에서만 uColorB(라임)가 살짝
          // 비친다.
          float colorMix = pow( t, 2.4 );
          vec3 waveColor = mix( uColorA, uColorB, colorMix );
          diffuseColor.rgb = mix( vec3( 1.0 ), waveColor, t );`,
        );
    };

    // 그림자용 깊이 패스에도 같은 파도 변위를 먹여야, 튀어오른 기둥의
    // 그림자가 변위 전 자리에서 지는 어긋남이 없다(원본 그대로).
    const depthMaterial = new THREE.MeshDepthMaterial();
    depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTrailTexture = trailUniforms.uTrailTexture;
      shader.uniforms.uTrailCount = trailUniforms.uTrailCount;
      shader.uniforms.uFadeTime = trailUniforms.uFadeTime;
      shader.uniforms.uWaveSpeed = { value: WAVE.speed };
      shader.uniforms.uWaveFreq = { value: WAVE.frequency };
      shader.uniforms.uWaveWidth = { value: WAVE.width };
      shader.uniforms.uAmplitude = { value: WAVE.amplitude };
      shader.uniforms.uJitter = { value: WAVE.jitter };
      shader.uniforms.uMaxHeight = { value: WAVE.maxHeight };
      shader.vertexShader = overrideVertexShader(shader.vertexShader);
    };

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.customDepthMaterial = depthMaterial;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    const spacing = CUBE_WIDTH + GAP;
    const gridOffset = ((GRID_SIZE - 1) * spacing) / 2;
    let idx = 0;
    for (let i = 0; i < GRID_SIZE; i += 1) {
      for (let j = 0; j < GRID_SIZE; j += 1) {
        const x = i * spacing - gridOffset;
        const z = j * spacing - gridOffset;
        dummy.position.set(x, 0, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
        offsetAttribute.setXY(idx, x, z);
        idx += 1;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    offsetAttribute.needsUpdate = true;

    function resize() {
      const { width, height } = mount.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let lastTime = performance.now();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const { width, height } = mount.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      // 카메라를 마우스 쪽으로 부드럽게 기울인다.
      lerpedMouse.x += (mouseNorm.x - lerpedMouse.x) * 0.04;
      lerpedMouse.y += (mouseNorm.y - lerpedMouse.y) * 0.04;
      positionCamera(lerpedMouse.x, lerpedMouse.y);

      // 궤적점 나이를 먹이고, 오래된 건 지운다.
      const expiry = WAVE.fadeTime * 4;
      for (let i = trail.length - 1; i >= 0; i -= 1) {
        trail[i].age += delta;
        if (trail[i].age > expiry) trail.splice(i, 1);
      }

      // 마우스가 안 움직인 지 3초가 넘으면 1.5초마다 임의의 파동을 낸다.
      timeSinceLastMove += delta;
      if (timeSinceLastMove >= 3 && !isPlacingRandomPoints) {
        isPlacingRandomPoints = true;
        randomPointTimer = 0;
      }
      if (isPlacingRandomPoints) {
        randomPointTimer += delta;
        if (randomPointTimer >= 1.5) {
          addRandomPoint();
          randomPointTimer = 0;
        }
      }

      const trailCount = Math.min(trail.length, MAX_TRAIL);
      if (trailCount > 0 || trailUniforms.uTrailCount.value > 0) {
        for (let i = 0; i < trailCount; i += 1) {
          const t = i * 4;
          trailData[t] = trail[i].x;
          trailData[t + 1] = trail[i].z;
          trailData[t + 2] = trail[i].age;
          trailData[t + 3] = trail[i].distDelta;
        }
        trailTexture.needsUpdate = true;
        trailUniforms.uTrailCount.value = trailCount;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      geometry.dispose();
      material.dispose();
      depthMaterial.dispose();
      trailTexture.dispose();
      rayPlane.geometry.dispose();
      rayPlane.material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} style={style} />;
}
