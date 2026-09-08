import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import "./styles/fonts.css";
import "./index.css";
import App from "./App.jsx";

// 탭이 잠깐 백그라운드로 밀리거나(다른 탭 전환, 창 최소화) 렌더링이 버벅이면,
// GSAP 기본값(lagSmoothing)은 그 지연을 "부드럽게" 따라잡으려 시간을 압축한다 —
// 그 동안은 실제로 몇 초가 지나도 화면상 애니메이션은 슬로모션으로 보인다.
// 인트로 로딩 화면(IntroLoader)처럼 "다 됐으면 바로 걷혀야" 하는 연출에는
// 이 지연이 곧 "안 걷히는 것처럼" 보이는 버그가 되므로, 앱 전체에서 꺼 둔다.
gsap.ticker.lagSmoothing(0);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
