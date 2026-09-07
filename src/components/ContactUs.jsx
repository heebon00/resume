import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_vn90mig";
const TEMPLATE_ID = "template_g2gie6l";
const PUBLIC_KEY = "Y5XuRsa-hEXGt1Gic";

export default function ContactUs() {
  const form = useRef(null);
  const [status, setStatus] = useState("idle");

  async function sendEmail(event) {
    event.preventDefault();
    setStatus("sending");

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      });
      form.current.reset();
      setStatus("success");
    } catch (error) {
      console.error("EmailJS send failed", error);
      setStatus("error");
    }
  }

  return (
    <section className="contact-form-section" id="send-message">
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
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "보내는 중..." : "메시지 보내기"}
          </button>
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