// The admin's "Add student" and "Invite again" buttons (SPEC-2.md 2.8, docs/adr/0007).
// Creating an account for someone else needs the secret key, which only exists here on Supabase.
// The caller must be signed in with app_metadata.role = 'admin'; everyone else is refused.
import { adminClient, json, SITE_URL } from "../_shared/admin-client.ts";

const GROUPS = ["experimental", "private", "international", "adult"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({});
  if (req.method !== "POST") return json({ code: "method" }, 405);

  const db = adminClient();
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  const { data: caller } = token ? await db.auth.getUser(token) : { data: { user: null } };
  if (caller?.user?.app_metadata?.role !== "admin") {
    return json({ code: "forbidden", error: "Only the admin can invite students." }, 403);
  }

  const body = await req.json().catch(() => ({}));
  const mode = body.mode === "reinvite" ? "reinvite" : "invite";
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ code: "bad_email" }, 400);

  const { data: status, error: statusError } = await db.rpc("account_status_for_email", { p_email: email });
  if (statusError) return json({ code: "error", error: statusError.message }, 500);

  if (mode === "invite" && status !== "none") return json({ code: "exists", status }, 409);
  if (mode === "reinvite" && status !== "invited") return json({ code: "not_invited", status }, 409);

  let data: Record<string, string> | undefined;
  if (mode === "invite") {
    const fullName = String(body.full_name ?? "").trim().slice(0, 100);
    const whatsapp = String(body.whatsapp ?? "").trim();
    const group = String(body.student_group ?? "");
    if (!fullName || !/^\+?[0-9 ]{8,20}$/.test(whatsapp) || !GROUPS.includes(group)) {
      return json({ code: "bad_details" }, 400);
    }
    // Read by the handle_new_user trigger, which fills in the student's profile.
    data = { full_name: fullName, whatsapp, student_group: group };
  }

  const { error } = await db.auth.admin.inviteUserByEmail(email, {
    data,
    redirectTo: `${SITE_URL}/auth/confirm?next=/account/password`,
  });
  if (error) {
    const rateLimited = error.status === 429 || /rate|seconds/i.test(error.message);
    return json({ code: rateLimited ? "rate_limited" : "error", error: error.message }, rateLimited ? 429 : 500);
  }
  return json({ ok: true });
});
