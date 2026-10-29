import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { GoogleButton, OrDivider } from "@/app/_components/google-button";
import { LoginForm } from "@/app/auth/forms";
import { getUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "تسجيل الدخول | Deutsch mit Asmaa", robots: { index: false } };

const ERRORS: Record<string, string> = {
  link: "الرابط ده مش شغال أو انتهت صلاحيته. سجّلوا دخول، أو اطلبوا رابط جديد من «نسيت الباسورد».",
  google: "ما قدرناش نكمّل بحساب Google. جرّبوا تاني.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next: rawNext, error } = await searchParams;
  const next = safeNext(rawNext);
  if (await getUser()) redirect(next);

  return (
    <>
      <InnerHero title="تسجيل الدخول">
        <p>سجّلوا دخول عشان تحجزوا كورس، وتعملوا اختبار المستوى، وتتابعوا حجوزاتكم.</p>
      </InnerHero>
      <main className="container pt-10">
        <div className="form-card">
          {error && ERRORS[error] && (
            <p className="form-status error mt-0 mb-5" role="alert">{ERRORS[error]}</p>
          )}
          <GoogleButton next={next} label="الدخول بحساب Google" />
          <OrDivider />
          <LoginForm next={next} />
          <p className="mt-6 text-center">
            لسه ما عندكوش حساب؟{" "}
            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-bold text-brand underline">
              اعملوا حساب جديد
            </Link>
          </p>
        </div>
      </main>
      <SiteEnd />
    </>
  );
}
