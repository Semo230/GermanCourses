import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { getUser } from "@/lib/auth";
import { Quiz } from "./quiz";
import "./quiz.css";

export const metadata: Metadata = {
  title: "اختبر مستواك في الألماني | Deutsch mit Asmaa",
  description: "اختبار سريع من 10 أسئلة يعرّفكم مستواكم في اللغة الألمانية (A1 أو A2) مع Deutsch mit Asmaa.",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/quiz",
    title: "اختبر مستواك في الألماني | Deutsch mit Asmaa",
    description: "10 أسئلة سريعة تعرّفكم مستواكم في الألماني: تبدأوا A1 ولا جاهزين لـ A2؟",
    images: [{ url: "/images/cover.jpg", width: 669, height: 458 }],
  },
};

export default async function QuizPage() {
  const user = await getUser();

  return (
    <div className="quiz-page">
      <InnerHero title="اختبر مستواك في الألماني">
        <p>10 أسئلة سريعة تعرّفكم تبدأوا منين: <bdi>A1</bdi> ولا <bdi>A2</bdi>؟</p>
      </InnerHero>

      <main className="container pt-10">
        {user ? (
          <Quiz />
        ) : (
          // SPEC-2.md 2.5: the quiz needs an account, so the score can be saved.
          <div className="card text-center">
            <h2 className="text-2xl font-extrabold text-brand">الاختبار محتاج حساب</h2>
            <p className="mx-auto mt-3 max-w-[480px] text-lg text-muted">
              اعملوا حساب مجاني في دقيقة، وهنحفظ نتيجتكم في حسابكم عشان تتابعوا مستواكم وتعرفوا تبدأوا منين.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link className="main-btn" href="/signup?next=/quiz">اعملوا حساب</Link>
              <Link className="ghost-btn" href="/login?next=/quiz">عندي حساب، سجّلوني</Link>
            </div>
            <p className="mt-6">
              <Link href="/lesson" className="font-bold text-brand underline">أو جرّبوا الدرس المجاني: الحروف والنطق</Link>
            </p>
          </div>
        )}
      </main>

      <SiteEnd />
    </div>
  );
}
