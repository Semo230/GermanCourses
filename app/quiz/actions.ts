"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { quizResultFor } from "@/lib/labels";
import { QUESTIONS } from "./questions";

/** Saves a finished quiz to the student's account (SPEC-2.md 2.5). The result is worked out here, not trusted from the browser. */
export async function saveQuizResult(score: number): Promise<{ ok: boolean }> {
  if (!Number.isInteger(score) || score < 0 || score > QUESTIONS.length) return { ok: false };
  const supabase = await createClient();
  const { error } = await supabase.from("quiz_results").insert({ score, result: quizResultFor(score) });
  if (error) {
    console.error("saveQuizResult:", error.message);
    return { ok: false };
  }
  revalidatePath("/account");
  return { ok: true };
}
