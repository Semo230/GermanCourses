import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { GoogleButton, OrDivider } from "@/app/_components/google-button";
import { SignupForm } from "@/app/auth/forms";
import { getUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "حساب جديد | Deutsch mit Asmaa", robots: { index: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getUser()) redirect(next);

  return (
    <>
      <InnerHero title="اعملوا حساب جديد">
        <p>بالحساب تقدروا تحجزوا كورس، وتعملوا اختبار المستوى، وتتابعوا حجوزاتكم ونتايجكم.</p>
      </InnerHero>
      <main className="container pt-10">
        <div className="form-card">
          <GoogleButton next={next} label="التسجيل بحساب Google" />
          <OrDivider />
          <SignupForm next={next} />
          <p className="mt-6 text-center">
            عندكم حساب بالفعل؟{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-brand underline">
              سجّلوا دخول
            </Link>
          </p>
        </div>
      </main>
      <SiteEnd />
    </>
  );
}
