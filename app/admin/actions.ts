"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAnonClient, createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/supabase/env";
import { getUser, isAdmin } from "@/lib/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { LEVELS, MESSAGE_STATUSES, MODES, ORDER_STATUSES, PHONE_PATTERN, STUDENT_GROUPS } from "@/lib/labels";
import type { FormState } from "@/app/auth/actions";

/** Every admin action checks the role again; row-level security checks it a third time in the database. */
async function adminClient() {
  const user = await getUser();
  if (!isAdmin(user)) redirect("/");
  return createClient();
}

export async function setOrderStatus(form: FormData) {
  const status = String(form.get("status"));
  if (!(status in ORDER_STATUSES)) return;
  const supabase = await adminClient();
  await supabase.from("orders").update({ status }).eq("id", String(form.get("id")));
  revalidatePath("/admin", "layout");
}

export async function setMessageStatus(form: FormData) {
  const status = String(form.get("status"));
  if (!(status in MESSAGE_STATUSES)) return;
  const supabase = await adminClient();
  await supabase.from("messages").update({ status }).eq("id", String(form.get("id")));
  revalidatePath("/admin/messages");
}

export async function setCourseVisible(form: FormData) {
  const supabase = await adminClient();
  await supabase.from("courses").update({ visible: form.get("visible") === "true" }).eq("id", String(form.get("id")));
  revalidatePath("/admin/courses");
  revalidatePath("/");
}

export async function saveCourse(_: FormState, form: FormData): Promise<FormState> {
  const id = String(form.get("id") ?? "");
  const values = {
    name: String(form.get("name") ?? "").trim().slice(0, 120),
    level: String(form.get("level") ?? ""),
    mode: String(form.get("mode") ?? ""),
    description: String(form.get("description") ?? "").trim().slice(0, 1000),
  };
  const fieldErrors: Record<string, string> = {};
  if (!values.name) fieldErrors.name = "اكتبي اسم الكورس.";
  if (!(LEVELS as readonly string[]).includes(values.level)) fieldErrors.level = "اختاري المستوى.";
  if (!(values.mode in MODES)) fieldErrors.mode = "اختاري نظام الدراسة.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const supabase = await adminClient();
  // New courses start hidden (GLOSSARY.md); the column default takes care of it.
  const { error } = id
    ? await supabase.from("courses").update(values).eq("id", id)
    : await supabase.from("courses").insert(values);
  if (error) return { error: "ما قدرناش نحفظ الكورس، جرّبي تاني.", values };

  revalidatePath("/admin/courses");
  revalidatePath("/");
  redirect("/admin/courses?saved=1");
}

type FunctionResult = { ok?: boolean; code?: string; error?: string };

/** Calls the invite-student Edge Function with the admin's own session (it refuses anyone else). */
async function callInvite(body: Record<string, string>): Promise<FunctionResult> {
  const supabase = await adminClient();
  const { data, error } = await supabase.functions.invoke<FunctionResult>("invite-student", { body });
  if (!error) return data ?? { ok: true };
  // Non-2xx answers carry the function's JSON in error.context.
  const context = (error as { context?: Response }).context;
  try {
    return (await context?.json()) as FunctionResult;
  } catch {
    return { code: "error", error: error.message };
  }
}

const INVITE_ERRORS: Record<string, string> = {
  exists: "الإيميل ده عليه حساب بالفعل، فما اتبعتش حاجة. دوري عليه في قايمة الطلبة.",
  not_invited: "الطالب ده مش في حالة «دعوة لسه ما اتقبلتش»، فما اتبعتش دعوة.",
  rate_limited: "استني دقيقة وجرّبي تاني.",
  bad_email: "الإيميل ده مش صحيح.",
  bad_details: "اتأكدي من الاسم ورقم الواتساب وفئة الطالب.",
  forbidden: "الحساب ده مش أدمن.",
};

export async function inviteStudent(_: FormState, form: FormData): Promise<FormState> {
  const values = {
    email: String(form.get("email") ?? "").trim().toLowerCase(),
    full_name: String(form.get("full_name") ?? "").trim().slice(0, 100),
    whatsapp: String(form.get("whatsapp") ?? "").trim(),
    student_group: String(form.get("student_group") ?? ""),
  };
  const fieldErrors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) fieldErrors.email = "اكتبي إيميل صحيح.";
  if (!values.full_name) fieldErrors.full_name = "اكتبي اسم الطالب.";
  if (!PHONE_PATTERN.test(values.whatsapp)) fieldErrors.whatsapp = "اكتبي رقم واتساب صحيح، زي 01xxxxxxxxx.";
  if (!(values.student_group in STUDENT_GROUPS)) fieldErrors.student_group = "اختاري فئة الطالب.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const result = await callInvite({ mode: "invite", ...values });
  if (!result.ok) return { error: INVITE_ERRORS[result.code ?? ""] ?? "ما قدرناش نبعت الدعوة، جرّبي تاني بعد شوية.", values };
  revalidatePath("/admin/students");
  return { done: true, email: values.email };
}

/** "Send password reset link", "Resend confirmation email" and "Invite again" on a student's page. */
export async function sendStudentEmail(_: FormState, form: FormData): Promise<FormState> {
  const kind = String(form.get("kind"));
  const email = String(form.get("email") ?? "");
  await adminClient();

  if (kind === "reinvite") {
    const result = await callInvite({ mode: "reinvite", email });
    return result.ok ? { done: true } : { error: INVITE_ERRORS[result.code ?? ""] ?? "ما اتبعتش، جرّبي تاني بعد شوية." };
  }

  // Same requests a student could make themselves, so the publishable key is enough (SPEC-2.md 2.9).
  const anon = createAnonClient();
  const { error } =
    kind === "reset"
      ? await anon.auth.resetPasswordForEmail(email, { redirectTo: `${SITE_URL}/account/password` })
      : await anon.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${SITE_URL}/account` } });
  return error ? { error: authErrorMessage(error) } : { done: true };
}
