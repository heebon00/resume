import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
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
