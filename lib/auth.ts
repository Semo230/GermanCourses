import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { StudentGroup } from "@/lib/labels";

export type Profile = {
  id: string;
  full_name: string;
  whatsapp: string;
  student_group: StudentGroup | null;
};

/** The signed-in account, checked with the Auth server. Cached for one request. */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, whatsapp, student_group")
    .eq("id", user.id)
    .maybeSingle();
  return data as Profile | null;
});

export function isAdmin(user: User | null) {
  return user?.app_metadata?.role === "admin";
}

/** Name, WhatsApp and student group are all filled in (Google sign-ups fill them on the first visit). */
export function profileComplete(profile: Profile | null) {
  return Boolean(profile?.full_name && profile.whatsapp && profile.student_group);
}

/** Only lets internal paths through, so ?next= can't send anyone to another site. */
export function safeNext(next: string | null | undefined, fallback = "/account") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

/** For pages that need an account: sends signed-out visitors to sign in, and incomplete profiles to /welcome. */
export async function requireStudent(next: string) {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  const profile = await getProfile();
  if (!isAdmin(user) && !profileComplete(profile)) redirect(`/welcome?next=${encodeURIComponent(next)}`);
  return { user, profile: profile! };
}
