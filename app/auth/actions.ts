"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/supabase/env";
import { safeNext, getUser } from "@/lib/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { PHONE_PATTERN, STUDENT_GROUPS } from "@/lib/labels";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  done?: boolean;
  /** Sign-in refused because the email isn't confirmed yet: offer to resend the link. */
  unconfirmed?: boolean;
  email?: string;
  values?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

/** Checks name, WhatsApp and student group (sign-up, first visit, account page). */
function profileErrors(form: FormData) {
  const errors: Record<string, string> = {};
  if (!text(form, "full_name")) errors.full_name = "من فضلكم اكتبوا الاسم.";
  if (!text(form, "whatsapp")) errors.whatsapp = "من فضلكم اكتبوا رقم الواتساب.";
  else if (!PHONE_PATTERN.test(text(form, "whatsapp"))) errors.whatsapp = "من فضلكم اكتبوا رقم واتساب صحيح، زي 01xxxxxxxxx.";
  if (!(text(form, "student_group") in STUDENT_GROUPS)) errors.student_group = "من فضلكم اختاروا فئة الطالب.";
  return errors;
}

function profileValues(form: FormData) {
  return {
    full_name: text(form, "full_name").slice(0, 100),
    whatsapp: text(form, "whatsapp"),
    student_group: text(form, "student_group"),
  };
}

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email");
  const next = safeNext(text(form, "next"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: String(form.get("password") ?? "") });
  if (error) {
    return { error: authErrorMessage(error), email, values: { email }, unconfirmed: error.code === "email_not_confirmed" };
  }
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signInWithGoogle(form: FormData) {
  const next = safeNext(text(form, "next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${SITE_URL}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect(`/login?error=google&next=${encodeURIComponent(next)}`);
  redirect(data.url);
}

export async function signUp(_: FormState, form: FormData): Promise<FormState> {
  const values = profileValues(form);
  const email = text(form, "email");
  const password = String(form.get("password") ?? "");
  const next = safeNext(text(form, "next"));

  const fieldErrors = profileErrors(form);
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "من فضلكم اكتبوا إيميل صحيح.";
  if (password.length < 8) fieldErrors.password = "الباسورد لازم يبقى 8 حروف أو أرقام على الأقل.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values: { ...values, email } };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Read by the handle_new_user trigger, which creates the profile.
      data: values,
      emailRedirectTo: `${SITE_URL}${next}`,
    },
  });
  if (error) return { error: authErrorMessage(error), values: { ...values, email } };
  return { done: true, email };
}

export async function resendConfirmation(_: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email");
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${SITE_URL}/account` } });
  if (error) return { error: authErrorMessage(error), email };
  return { done: true, email };
}

export async function requestPasswordReset(_: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email");
  if (!EMAIL_PATTERN.test(email)) return { fieldErrors: { email: "من فضلكم اكتبوا إيميل صحيح." }, values: { email } };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${SITE_URL}/account/password` });
  if (error) return { error: authErrorMessage(error), values: { email } };
  // Same answer whether or not the email has an account, so nobody can probe for accounts.
  return { done: true, email };
}

export async function updatePassword(_: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { fieldErrors: { password: "الباسورد لازم يبقى 8 حروف أو أرقام على الأقل." } };
  if (password !== String(form.get("confirm") ?? "")) return { fieldErrors: { confirm: "الباسوردين مش زي بعض." } };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error) };
  redirect("/account?password=1");
}

/** First visit after Google sign-up (or any account missing details), and the account page's details form. */
export async function saveProfile(_: FormState, form: FormData): Promise<FormState> {
  const values = profileValues(form);
  const fieldErrors = profileErrors(form);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const user = await getUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(values).eq("id", user.id);
  if (error) return { error: "ما قدرناش نحفظ البيانات، جرّبوا تاني.", values };

  const next = text(form, "next");
  revalidatePath("/account");
  if (next) redirect(safeNext(next));
  return { done: true, values };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
