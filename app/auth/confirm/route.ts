import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";

/**
 * Every link that signs someone in lands here:
 * - email links (confirm sign-up, invite, password reset) carry ?token_hash=&type= (see supabase/email-templates/)
 * - Google sign-in comes back with ?code=
 * Invites and resets go on to choose a password; accounts missing details go to /welcome.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const code = params.get("code");
  const next = safeNext(nextFrom(request), "/account");

  const supabase = await createClient();
  let ok = false;
  if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  if (!ok) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "link");
    return NextResponse.redirect(url);
  }

  let destination = next;
  if (type === "invite" || type === "recovery") {
    destination = "/account/password" + (type === "invite" ? "?invited=1" : "");
  } else {
    const { data: user } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, whatsapp, student_group")
      .eq("id", user.user?.id ?? "")
      .maybeSingle();
    const isAdmin = user.user?.app_metadata?.role === "admin";
    if (!isAdmin && !(profile?.full_name && profile.whatsapp && profile.student_group)) {
      destination = `/welcome?next=${encodeURIComponent(next)}`;
    }
  }
  return NextResponse.redirect(new URL(destination, request.url));
}

/** ?next=/path, or ?redirect_to=<full URL on this site> from the email templates' {{ .RedirectTo }}. */
function nextFrom(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  if (next) return next;
  const redirectTo = request.nextUrl.searchParams.get("redirect_to");
  if (!redirectTo) return null;
  try {
    const url = new URL(redirectTo);
    return url.origin === request.nextUrl.origin ? url.pathname + url.search : null;
  } catch {
    return null;
  }
}
