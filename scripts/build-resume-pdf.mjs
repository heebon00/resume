/**
 * 이력서 PDF 만들기 —  npm run resume:pdf
 *
 * 왜 필요한가: 이력서 페이지(resume.html)의 "PDF 다운로드" 버튼은 미리 만들어
 * 둔 public/resume.pdf 를 그대로 내려준다. 채용 담당자에게 인쇄 대화상자를
 * 열게 하지 않으려고 그렇게 뒀다. 그래서 이력서 내용을 고치면 이 스크립트로
 * PDF 를 다시 뽑아야 한다. 안 그러면 화면과 받는 파일이 어긋난다.
 *
 * 하는 일: 빌드 결과(dist/)를 임시 서버로 띄우고 → 크롬을 화면 없이 실행해
 * 그 페이지를 인쇄해 → public/resume.pdf 로 저장한다.
 * 종이 규격(A4)·여백·인쇄용 색은 src/styles/resume.css 의 @page / @media print
 * 가 정하므로 여기서는 건드리지 않는다.
 *
 * 먼저 `npm run build` 가 실행돼 있어야 한다(package.json 의 resume:pdf 가
 * 빌드까지 함께 돌린다).
 */
import { execFile as execFileCb } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { preview } from "vite";

const execFile = promisify(execFileCb);

const root = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const outFile = path.join(root, "public", "resume.pdf");

/** 설치된 크롬을 찾는다. 못 찾으면 CHROME_PATH 로 직접 알려줄 수 있다. */
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA &&
      path.join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].filter(Boolean);

  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    throw new Error(
      "크롬을 찾지 못했습니다. CHROME_PATH 환경변수에 chrome 실행 파일 경로를 지정해 주세요.",
    );
  }
  return found;
}

const server = await preview({
  root,
  // strictPort 를 켜지 않는다 — 그 포트가 이미 쓰이고 있으면 다음 빈 포트로
  // 옮겨 간다. 실제 주소는 아래 resolvedUrls 에서 받아 쓴다.
  preview: { port: 4183, strictPort: false, open: false },
});

let code = 1;
try {
  const url = `${server.resolvedUrls.local[0].replace(/\/$/, "")}/resume.html`;
  // 전용 프로필로 띄운다. 이걸 빼면 이미 열려 있는 크롬 창에 작업이 넘어가
  // 버려서, 여기서 실행한 프로세스는 PDF 를 쓰지 않은 채 매달린다.
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "resume-pdf-"));

  try {
    // 반드시 비동기로 기다린다. execFileSync 를 쓰면 이벤트 루프가 멈춰서
    // 바로 위에서 띄운 미리보기 서버(같은 프로세스다)가 크롬의 요청에 응답을
    // 못 하고, 크롬은 페이지를 영원히 기다리다 죽는다.
    await execFile(
      findChrome(),
      [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        `--user-data-dir=${profile}`,
        "--no-pdf-header-footer",
        // 서체·이미지를 다 받을 때까지 기다린다. 없으면 빈 칸으로 찍힐 수 있다.
        "--virtual-time-budget=10000",
        `--print-to-pdf=${outFile}`,
        url,
      ],
      { timeout: 120_000 },
    );
  } finally {
    fs.rmSync(profile, { recursive: true, force: true });
  }

  const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
  console.log(`이력서 PDF 저장: public/resume.pdf (${kb}KB)`);
  console.log("dist/ 에 반영하려면 npm run build 를 다시 실행하세요.");
  code = 0;
} catch (error) {
  console.error("이력서 PDF 를 만들지 못했습니다.");
  console.error(error);
} finally {
  await server.close();
  // vite 미리보기 서버가 이벤트 루프를 붙들고 있어 그냥 두면 끝나지 않는다.
  // 실패를 0 으로 덮지 않도록 위에서 정한 code 를 그대로 넘긴다.
  process.exit(code);
}
