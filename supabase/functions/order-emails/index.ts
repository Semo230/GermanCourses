// Sends the two booking emails from Frau Asmaa's Gmail (SPEC-2.md 2.6, docs/adr/0006).
// Called by the on_order_created trigger with a shared secret from Vault, never by browsers.
//
// Secrets (Edge Functions > Secrets): GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAIL, SITE_URL.
// The Gmail app password lives only there.
import nodemailer from "npm:nodemailer@6.10.1";
import { adminClient, json, SITE_URL } from "../_shared/admin-client.ts";

const GROUPS: Record<string, string> = {
  experimental: "مدرسة تجريبية",
  private: "مدرسة خاصة",
  international: "مدرسة دولية",
  adult: "متعلم كبير",
};

const MODES: Record<string, string> = { in_person: "حضوري", online: "أونلاين", both: "حضوري وأونلاين" };

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

function page(body: string) {
  return `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;font-size:16px;line-height:1.8;color:#3a2a1f;background:#f5ecdd;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px;border-top:6px solid #8b1a1a">${body}
  <p style="margin-top:24px;color:#6e5a4a;font-size:14px" dir="ltr">Deutsch mit Asmaa Abd ElHamid</p></div></div>`;
}

Deno.serve(async (req) => {
  const db = adminClient();
  const secret = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const { data: secretOk } = secret ? await db.rpc("order_emails_secret_ok", { p_secret: secret }) : { data: false };
  if (!secretOk) return json({ error: "unauthorized" }, 401);

  const { order_id } = await req.json().catch(() => ({}));
  if (typeof order_id !== "string") return json({ error: "order_id missing" }, 400);

  const { data: order, error } = await db
    .from("orders")
    .select("id, student_id, full_name, whatsapp, note, email_status, courses(name, level, mode), profiles(student_group)")
    .eq("id", order_id)
    .single();
  if (error || !order) return json({ error: "order not found" }, 404);
  if (order.email_status === "sent") return json({ ok: true, skipped: "already sent" });

  const course = order.courses as unknown as { name: string; level: string; mode: string };
  const group = (order.profiles as unknown as { student_group: string | null } | null)?.student_group;
  const { data: userData } = await db.auth.admin.getUserById(order.student_id);
  const studentEmail = userData?.user?.email;

  const gmailUser = Deno.env.get("GMAIL_USER");
  const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");
  const adminEmail = Deno.env.get("ADMIN_EMAIL") ?? gmailUser;

  try {
    if (!gmailUser || !gmailPassword || !adminEmail) throw new Error("Gmail secrets are not set.");

    // Port 465: Supabase blocks outgoing 25 and 587 from Edge Functions.
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPassword },
    });
    const from = `"Deutsch mit Asmaa" <${gmailUser}>`;
    const name = escapeHtml(order.full_name);
    const courseLine = `${escapeHtml(course.name)} (${course.level}، ${MODES[course.mode] ?? course.mode})`;

    await transport.sendMail({
      from,
      to: adminEmail,
      subject: `طلب حجز جديد: ${order.full_name} – ${course.name}`,
      html: page(`<h2 style="color:#8b1a1a;margin:0 0 12px">طلب حجز جديد</h2>
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>واتساب:</strong> <span dir="ltr">${escapeHtml(order.whatsapp)}</span></p>
        <p><strong>فئة الطالب:</strong> ${group ? GROUPS[group] : "—"}</p>
        <p><strong>الكورس:</strong> ${courseLine}</p>
        <p><strong>ملاحظة:</strong> ${order.note ? escapeHtml(order.note) : "—"}</p>
        <p style="margin-top:20px"><a href="${SITE_URL}/admin" style="background:#8b1a1a;color:#fff;padding:10px 24px;border-radius:999px;text-decoration:none;font-weight:bold">افتحي لوحة التحكم</a></p>`),
    });

    if (studentEmail) {
      await transport.sendMail({
        from,
        to: studentEmail,
        subject: "وصلنا طلب الحجز بتاعكم – Deutsch mit Asmaa",
        html: page(`<h2 style="color:#8b1a1a;margin:0 0 12px">وصلنا طلب الحجز بتاعكم</h2>
          <p>أهلاً ${name}،</p>
          <p>وصلنا طلب حجز كورس ${courseLine}. <span dir="ltr">Frau Asmaa</span> هتتواصل معاكم على واتساب على الرقم <span dir="ltr">${escapeHtml(order.whatsapp)}</span> عشان تتفقوا على التفاصيل.</p>
          <p>تقدروا تتابعوا حالة الطلب من <a href="${SITE_URL}/account" style="color:#8b1a1a;font-weight:bold">حسابكم على الموقع</a>.</p>`),
      });
    }

    await db.from("orders").update({ email_status: "sent", email_error: null }).eq("id", order.id);
    return json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("order-emails:", message);
    await db.from("orders").update({ email_status: "failed", email_error: message.slice(0, 500) }).eq("id", order.id);
    return json({ ok: false, error: message }, 500);
  }
});
