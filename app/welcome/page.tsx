import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { ProfileForm } from "@/app/auth/forms";
import { getProfile, profileComplete, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "أهلاً بيكم | Deutsch mit Asmaa", robots: { index: false } };

/** First visit after signing up with Google: name, WhatsApp and student group. */
export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  const profile = await getProfile();
  if (profileComplete(profile)) redirect(next);

  return (
    <>
      <InnerHero title="أهلاً بيكم!">
        <p>فاضل بس اسمكم ورقم الواتساب وفئة الطالب، عشان Frau Asmaa تقدر تتواصل معاكم.</p>
      </InnerHero>
      <main className="container pt-10">
        <div className="form-card">
          <ProfileForm
            profile={{
              full_name: profile?.full_name ?? "",
              whatsapp: profile?.whatsapp ?? "",
              student_group: profile?.student_group ?? null,
            }}
            next={next}
            submitLabel="حفظ ومتابعة"
          />
        </div>
      </main>
      <SiteEnd />
    </>
  );
}
