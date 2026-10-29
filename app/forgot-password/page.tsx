import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { ForgotPasswordForm } from "@/app/auth/forms";

export const metadata: Metadata = { title: "نسيت الباسورد | Deutsch mit Asmaa", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <>
      <InnerHero title="نسيت الباسورد">
        <p>اكتبوا الإيميل اللي عملتوا بيه الحساب، وهنبعت لكم رابط تختاروا منه باسورد جديد.</p>
      </InnerHero>
      <main className="container pt-10">
        <div className="form-card">
          <ForgotPasswordForm />
          <p className="mt-6 text-center">
            <Link href="/login" className="font-bold text-brand underline">رجوع لتسجيل الدخول</Link>
          </p>
          <p className="mt-2 text-center text-muted text-[0.95rem]">
            لو عملتوا الحساب بـ Google، سجّلوا دخول بـ Google على طول من غير باسورد.
          </p>
        </div>
      </main>
      <SiteEnd />
    </>
  );
}
