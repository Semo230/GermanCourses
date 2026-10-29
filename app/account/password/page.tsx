import type { Metadata } from "next";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { NewPasswordForm } from "@/app/auth/forms";
import { getProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "اختاروا باسورد | Deutsch mit Asmaa", robots: { index: false } };

/** Reached from an invite or a password-reset email (the link has already signed the student in). */
export default async function NewPasswordPage({ searchParams }: { searchParams: Promise<{ invited?: string }> }) {
  const invited = (await searchParams).invited === "1";
  const profile = await getProfile();
  const greeting = profile?.full_name ? `${profile.full_name}، ` : "";

  return (
    <>
      <InnerHero title={invited ? "أهلاً بيكم في Deutsch mit Asmaa" : "اختاروا باسورد جديد"}>
        <p>
          {invited
            ? `${greeting}Frau Asmaa عملت لكم حساب. اختاروا باسورد عشان تدخلوا بيه بعد كده.`
            : "اكتبوا الباسورد الجديد مرتين. محدش غيركم هيعرفه."}
        </p>
      </InnerHero>
      <main className="container pt-10">
        <div className="form-card">
          <NewPasswordForm />
        </div>
      </main>
      <SiteEnd />
    </>
  );
}
