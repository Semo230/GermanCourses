"use client";

import { useEffect, useRef, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

const stickerSrc = (name: string) => `/images/stickers/sticker-${name}.webp`;

// Restart a CSS animation class even if it is already set.
function replay(el: HTMLElement, cls: string) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// Sticker mascot: each tap shows the next pose with its greeting.
const POSES = [
  { name: "wave", w: 300, say: "Hallo!" },
  { name: "wink", w: 266, say: "Los geht's!" },
  { name: "heart", w: 310, say: "Willkommen!" },
  { name: "thumbs-up", w: 302, say: "Super!" },
  { name: "celebrate", w: 316, say: "Prima!" },
];

export function Mascot() {
  const [pose, setPose] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const poseRef = useRef(0);

  useEffect(() => {
    // Fetch the other poses once the page has loaded, so taps swap instantly.
    const preload = () => POSES.slice(1).forEach((p) => { new Image().src = stickerSrc(p.name); });
    if (document.readyState === "complete") preload();
    else window.addEventListener("load", preload, { once: true });

    // A little wiggle invites the first tap.
    const timer = setTimeout(() => { if (poseRef.current === 0) buttonRef.current?.classList.add("nudge"); }, 3500);
    return () => clearTimeout(timer);
  }, []);

  function next() {
    const nextPose = (pose + 1) % POSES.length;
    poseRef.current = nextPose;
    setPose(nextPose);
    const button = buttonRef.current!;
    button.classList.remove("nudge");
    replay(button, "swap");
    replay(bubbleRef.current!, "again");
  }

  const current = POSES[pose];
  return (
    <button
      ref={buttonRef}
      className="mascot"
      type="button"
      aria-label="Frau Asmaa بتسلّم عليكم، دوسوا عشان تشوفوا حركة تانية"
      onClick={next}
    >
      <span ref={bubbleRef} className="mascot-bubble" aria-hidden="true" translate="no">
        {current.say}
      </span>
      <img
        className="mascot-img"
        src={stickerSrc(current.name)}
        width={current.w}
        height={400}
        alt=""
        fetchPriority="high"
        // Go back to floating once a bounce or wiggle has finished.
        onAnimationEnd={(event) => {
          if (event.animationName !== "float") buttonRef.current?.classList.remove("swap", "nudge");
        }}
      />
    </button>
  );
}

/** Section stickers pop up as they scroll into view. */
export function PeekObserver() {
  useEffect(() => {
    const peeks = document.querySelectorAll<HTMLElement>(".peek");
    if (!("IntersectionObserver" in window)) {
      peeks.forEach((peek) => peek.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    peeks.forEach((peek) => observer.observe(peek));
    return () => observer.disconnect();
  }, []);
  return null;
}

// Web3Forms: emails every message to the address the access key was created with.
// The access key is safe to keep in the page (it can only send to that address).
const WEB3FORMS_ACCESS_KEY = "39f7c21b-333b-45fc-abd3-fc481f5bd557";

type Field = "name" | "phone" | "message";
type Status = { text: string; type: "success" | "error" } | null;

async function saveToSupabase(data: Record<Field, string>) {
  // Sent with the publishable key only (no session), exactly as before: visitors may insert, never read.
  const response = await fetch(SUPABASE_URL + "/rest/v1/messages", {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      // Insert only - the table policy does not allow reading rows back.
      Prefer: "return=minimal",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Supabase: " + (await response.text()));
  }
}

async function sendEmail(data: Record<Field, string>) {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "رسالة جديدة من صفحة Deutsch mit Asmaa",
      from_name: "Deutsch mit Asmaa",
      "الاسم": data.name,
      "الموبايل": data.phone,
      "الرسالة": data.message,
    }),
  });
  const result = await response.json();
  if (!result.success) {
    throw new Error("Web3Forms: " + result.message);
  }
}

// Returns the error text for a field, or "" if it is valid.
function validateField(field: HTMLInputElement | HTMLTextAreaElement) {
  const value = field.value.trim();
  if (field.id === "name" && !value) return "من فضلكم اكتبوا الاسم.";
  if (field.id === "phone" && !value) return "من فضلكم اكتبوا رقم الموبايل.";
  if (field.id === "phone" && !field.checkValidity()) return "من فضلكم اكتبوا رقم موبايل صحيح.";
  if (field.id === "message" && !value) return "من فضلكم اكتبوا رسالتكم.";
  return "";
}

/** The "تواصل معنا" section: sticker, contact form, Supabase + Web3Forms. Unchanged behaviour. */
export function ContactFormSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const peekRef = useRef<HTMLImageElement>(null);
  const [errors, setErrors] = useState<Record<Field, string>>({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [cheering, setCheering] = useState(false);

  function fieldsOf(form: HTMLFormElement) {
    return (["name", "phone", "message"] as Field[]).map(
      (id) => form.elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement,
    );
  }

  // Clear a field's error as soon as the user fixes it.
  function onInput(event: React.FormEvent<HTMLFormElement>) {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement;
    const id = field.id as Field;
    if (errors[id]) setErrors((e) => ({ ...e, [id]: validateField(field) }));
  }

  // Called when the contact form is sent.
  function cheer() {
    setCheering(true);
    const peek = peekRef.current;
    if (peek) {
      peek.classList.add("in");
      replay(peek, "cheer");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current!;
    const fields = fieldsOf(form);

    const nextErrors = { name: "", phone: "", message: "" } as Record<Field, string>;
    let firstInvalid: HTMLElement | null = null;
    fields.forEach((field) => {
      const error = validateField(field);
      nextErrors[field.id as Field] = error;
      if (error && !firstInvalid) firstInvalid = field;
    });
    setErrors(nextErrors);
    if (firstInvalid) {
      setStatus(null);
      (firstInvalid as HTMLElement).focus();
      return;
    }

    const data = {
      name: fields[0].value.trim(),
      phone: fields[1].value.trim(),
      message: fields[2].value.trim(),
    };

    setSending(true);
    setStatus(null);

    // Save and email in parallel; the message has arrived if at least one succeeds.
    const results = await Promise.allSettled([saveToSupabase(data), sendEmail(data)]);
    results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .forEach((r) => console.error("Contact form:", r.reason));

    if (results.some((r) => r.status === "fulfilled")) {
      form.reset();
      setStatus({ text: "وصلتنا رسالتكم، وهنتواصل معاكم قريب.", type: "success" });
      cheer();
    } else {
      setStatus({ text: "حصلت مشكلة في الإرسال، حاولوا تاني أو تواصلوا معنا عبر واتساب.", type: "error" });
    }
    setSending(false);
  }

  const invalid = (id: Field) => (errors[id] ? "true" : "false");

  return (
    <section className="has-peek">
      <img
        ref={peekRef}
        id="form-peek"
        className="peek"
        src={stickerSrc(cheering ? "celebrate" : "confident")}
        width={cheering ? 316 : 294}
        height={400}
        alt=""
        loading="lazy"
      />
      <h2>تواصل معنا</h2>
      <div className="form-card">
        <form ref={formRef} id="contact-form" noValidate onSubmit={onSubmit} onInput={onInput}>
          <div className="field">
            <label htmlFor="name">الاسم <span className="req">*</span></label>
            <input id="name" name="name" type="text" autoComplete="name" maxLength={100} required
                   aria-describedby="name-error" aria-invalid={invalid("name")} />
            <p id="name-error" className="field-error" hidden={!errors.name}>{errors.name}</p>
          </div>
          <div className="field">
            <label htmlFor="phone">الموبايل <span className="req">*</span></label>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel"
                   pattern="\+?[0-9 ]{8,20}" maxLength={20} required placeholder="01xxxxxxxxx"
                   aria-describedby="phone-error" aria-invalid={invalid("phone")} />
            <p id="phone-error" className="field-error" hidden={!errors.phone}>{errors.phone}</p>
          </div>
          <div className="field">
            <label htmlFor="message">الرسالة <span className="req">*</span></label>
            <textarea id="message" name="message" maxLength={2000} required
                      placeholder="اكتبوا استفساركم هنا…" aria-describedby="message-error"
                      aria-invalid={invalid("message")} />
            <p id="message-error" className="field-error" hidden={!errors.message}>{errors.message}</p>
          </div>
          <button className="submit-btn" type="submit" disabled={sending}>
            {sending ? "جارٍ الإرسال…" : "إرسال"}
          </button>
          <div id="form-status" className={"form-status " + (status?.type ?? "")} role="status" hidden={!status}>
            {status?.text}
          </div>
        </form>
      </div>
    </section>
  );
}
