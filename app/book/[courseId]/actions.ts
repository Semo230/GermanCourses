"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { PHONE_PATTERN } from "@/lib/labels";
import type { FormState } from "@/app/auth/actions";

/** Saves a booking request. Status, email status and the student come from the database (SPEC-2.md 2.4). */
export async function createOrder(_: FormState, form: FormData): Promise<FormState> {
  const values = {
    course_id: String(form.get("course_id") ?? ""),
    full_name: String(form.get("full_name") ?? "").trim().slice(0, 100),
    whatsapp: String(form.get("whatsapp") ?? "").trim(),
    note: String(form.get("note") ?? "").trim().slice(0, 1000),
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.full_name) fieldErrors.full_name = "من فضلكم اكتبوا الاسم.";
  if (!PHONE_PATTERN.test(values.whatsapp)) fieldErrors.whatsapp = "من فضلكم اكتبوا رقم واتساب صحيح، زي 01xxxxxxxxx.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  if (!(await getUser())) return { error: "سجّلوا دخول الأول.", values };

  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert(values);
  if (error) {
    console.error("createOrder:", error.message);
    return { error: "ما قدرناش نحفظ الحجز. جرّبوا تاني أو ابعتوا لـ Frau Asmaa على واتساب.", values };
  }
  revalidatePath("/account");
  return { done: true };
}
