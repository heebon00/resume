import { useCallback, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_vn90mig";
const TEMPLATE_ID = "template_g2gie6l";
const PUBLIC_KEY = "Y5XuRsa-hEXGt1Gic";

// reCAPTCHA v2 사이트키. 공개되는 값이라 저장소에 들어가도 된다.
// 짝이 되는 Secret Key 는 EmailJS 템플릿 Settings 에만 넣는다(코드에 두지 않는다).
const RECAPTCHA_SITE_KEY = "6LdSt60tAAAAANzMUAaBF10THBZUPl38yDl1LSLk";

// 이 템플릿은 EmailJS 쪽에서 reCAPTCHA V2 검증이 켜져 있다.
// 그래서 sendForm 이 아니라 send 를 쓴다 — sendForm 은 캡챠 토큰을 실어 보내지 못한다.
// (2026-09-07 확인: 토큰 없이 보내면 400 "reCAPTCHA: The g-recaptcha-response parameter not found")
const RECAPTCHA_SCRIPT_ID = "recaptcha-api";
const RECAPTCHA_ONLOAD = "onRecaptchaApiLoad";

export default function ContactUs() {
  const form = useRef(null);
  const section = useRef(null);
  const captchaBox = useRef(null);
  const widgetId = useRef(null);
  const [status, setStatus] = useState("idle");

  // 위젯 그리기. 스크립트가 준비된 뒤 한 번만 부른다.
  const renderCaptcha = useCallback(() => {
    if (widgetId.current !== null) return;
    if (!captchaBox.current || !window.grecaptcha?.render) return;

    widgetId.current = window.grecaptcha.render(captchaBox.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme: "dark", // 이 섹션 배경이 --color-ink 라서 어두운 위젯이 맞다.
    });
  }, []);

  // 구글 스크립트는 외부 자원이라 첫 화면에서 받지 않는다.
  // 이 섹션이 화면에 다가올 때 비로소 async 로 불러온다.
  // (index.html 주석 참고 — 외부 자원을 head 에 두었다가 첫 화면이 5.1초 걸린 적이 있다)
  useEffect(() => {
    const target = section.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        // 이미 로드돼 있으면(뒤로 가기 등) 바로 그린다.
        if (window.grecaptcha?.render) {
          renderCaptcha();
          return;
        }

        window[RECAPTCHA_ONLOAD] = renderCaptcha;

        if (document.getElementById(RECAPTCHA_SCRIPT_ID)) return;

        const script = document.createElement("script");
        script.id = RECAPTCHA_SCRIPT_ID;
        script.src =
          "https://www.google.com/recaptcha/api.js?render=explicit&hl=ko&onload=" +
          RECAPTCHA_ONLOAD;
        script.async = true;
        script.defer = true;
        document.head.append(script);
      },
      { rootMargin: "0px 0px 25% 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [renderCaptcha]);

  async function sendEmail(event) {
    event.preventDefault();

    // 위젯이 아직 안 그려졌으면 getResponse 가 예외를 던진다. 먼저 막는다.
    const ready = widgetId.current !== null && window.grecaptcha?.getResponse;
    const token = ready ? window.grecaptcha.getResponse(widgetId.current) : "";
    if (!token) {
      setStatus("captcha");
      return;
    }

    setStatus("sending");

    const values = Object.fromEntries(new FormData(form.current));

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { ...values, "g-recaptcha-response": token },
        { publicKey: PUBLIC_KEY },
      );
      form.current.reset();
      setStatus("success");
    } catch (error) {
      console.error("EmailJS send failed", error);
      setStatus("error");
    } finally {
      // 토큰은 한 번 쓰면 끝이다. 성공이든 실패든 위젯을 비워 다시 체크하게 한다.
      window.grecaptcha?.reset(widgetId.current);
    }
  }

  return (
    <section className="contact-form-section" id="send-message" ref={section}>
      <div className="contact-form-inner">
        <div className="contact-form-copy">
          <p className="contact-form-eyebrow">GET IN TOUCH</p>
          <h2>Let's make something meaningful.</h2>
          <p>
            프로젝트, 협업 또는 새로운 기회에 대해 이야기해 주세요. 확인하는 대로
            답변드리겠습니다.
          </p>
        </div>

        <form ref={form} className="contact-form" onSubmit={sendEmail}>
          <label>
            제목
            <input type="text" name="subject" required />
          </label>
          <label>
            이름
            <input type="text" name="name" required />
          </label>
          <label>
            이메일
            <input type="email" name="email" required />
          </label>
          <label className="contact-form-message">
            메시지
            <textarea name="message" rows="5" required />
          </label>
          <div className="contact-form-captcha" ref={captchaBox} />
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "보내는 중..." : "메시지 보내기"}
          </button>
          {status === "captcha" && (
            <p className="contact-form-status" role="alert">
              "로봇이 아닙니다"를 먼저 확인해 주세요.
            </p>
          )}
          {status === "success" && (
            <p className="contact-form-status" role="status">
              메시지가 전송되었습니다.
            </p>
          )}
          {status === "error" && (
            <p className="contact-form-status" role="alert">
              전송에 실패했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
