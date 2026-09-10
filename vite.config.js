import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 페이지가 둘이다 — 포트폴리오 본체(index.html)와 이력서(resume.html).
  // 엔트리를 여기 적어두지 않으면 빌드가 index.html 만 내보내고 이력서는
  // dist/ 에서 통째로 빠진다(히어로의 RESUME 버튼이 404 를 낸다).
  // 이력서를 별도 엔트리로 두는 덕에 사이트의 자체 호스팅 서체
  // (src/styles/fonts.css)를 복사 없이 그대로 다시 쓴다.
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        resume: fileURLToPath(new URL('./resume.html', import.meta.url)),
      },
    },
  },
  plugins: [
    react(),
    // React Compiler (react.dev/learn/react-compiler/installation, 확인일 2026-09-01)
    // @vitejs/plugin-react 6.x 부터 인라인 babel 옵션이 제거되어 @rolldown/plugin-babel 을 사용한다.
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
})
