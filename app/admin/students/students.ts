import { createClient } from "@/lib/supabase/server";
import type { AccountStatus, StudentGroup } from "@/lib/labels";

export type Student = {
  id: string;
  email: string;
  full_name: string;
  whatsapp: string;
  student_group: StudentGroup | null;
  created_at: string;
  providers: string[];
  account_status: AccountStatus;
  last_sign_in_at: string | null;
};

/** Students with their email, sign-in method and account status (public.admin_students(), admin only). */
export async function getStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_students");
  return { students: (data ?? []) as Student[], error };
}

export function signInMethods(providers: string[]) {
  return providers.map((p) => (p === "google" ? "Google" : "إيميل")).join(" + ");
}
