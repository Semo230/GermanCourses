import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { ProfileForm, SubmitButton } from "@/app/auth/forms";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { requireStudent } from "@/lib/auth";
import { formatDate, MODES, ORDER_STATUSES, QUIZ_RESULTS, type Mode, type OrderStatus, type QuizResult } from "@/lib/labels";

export const metadata: Metadata = { title: "حسابي | Deutsch mit Asmaa", robots: { index: false } };

type Order = {
  id: string;
  status: OrderStatus;
  created_at: string;
  courses: { name: string; level: string; mode: Mode } | null;
};
type Result = { id: string; score: number; result: QuizResult; created_at: string };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  const { user, profile } = await requireStudent("/account");
  const passwordSaved = (await searchParams).password === "1";
  const supabase = await createClient();

  // Row-level security limits both lists to this student's own rows.
  const [{ data: orderRows }, { data: resultRows }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, created_at, courses(name, level, mode)")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("quiz_results")
      .select("id, score, result, created_at")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false }),
  ]);
  // Each booking has exactly one course (many-to-one), whatever the generic types say.
  const orders = (orderRows ?? []) as unknown as Order[];
  const results = (resultRows ?? []) as Result[];

  return (
    <>
      <InnerHero title="حسابي">
        {profile?.full_name && <p>أهلاً {profile.full_name}</p>}
      </InnerHero>

      <main className="container pt-10 grid gap-8 max-w-[720px]">
        {passwordSaved && (
          <p className="form-status success m-0" role="status">اتحفظ الباسورد. تقدروا تدخلوا بيه من هنا ورايح.</p>
        )}

        <section className="card" aria-labelledby="orders-title">
          <h2 id="orders-title" className="text-2xl font-extrabold text-brand">حجوزاتي</h2>
          {orders.length ? (
            <ul className="mt-4 grid gap-3">
              {orders.map((order) => {
                const status = ORDER_STATUSES[order.status];
                return (
                  <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-beige p-4">
                    <div>
                      <p className="font-bold">
                        {order.courses?.name} <bdi className="text-brand">{order.courses?.level}</bdi>
                      </p>
                      <p className="text-muted text-[0.95rem]">
                        {order.courses && MODES[order.courses.mode]} · {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span className={`badge ${status.tone}`}>{status.label}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-muted">
              لسه ما حجزتوش أي كورس. <Link href="/#courses" className="font-bold text-brand underline">شوفوا الكورسات</Link>
            </p>
          )}
          <p className="mt-4 text-muted text-[0.95rem]">
            عايزين تلغوا أو تغيّروا حجز؟ ابعتوا لـ <bdi translate="no">Frau Asmaa</bdi> على واتساب.
          </p>
        </section>

        <section className="card" aria-labelledby="quiz-title">
          <h2 id="quiz-title" className="text-2xl font-extrabold text-brand">نتايج اختبار المستوى</h2>
          {results.length ? (
            <ul className="mt-4 grid gap-3">
              {results.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-beige p-4">
                  <div>
                    <p className="font-bold">{QUIZ_RESULTS[r.result].title}</p>
                    <p className="text-muted text-[0.95rem]">{formatDate(r.created_at)}</p>
                  </div>
                  <span className="text-2xl font-extrabold text-brand tabular-nums" dir="ltr">
                    {r.score} <small className="text-base text-muted">/ 10</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted">لسه ما عملتوش اختبار المستوى.</p>
          )}
          <Link href="/quiz" className="ghost-btn mt-4">
            {results.length ? "أعيدوا الاختبار" : "اختبروا مستواكم"}
          </Link>
        </section>

        <section className="card" aria-labelledby="details-title">
          <h2 id="details-title" className="text-2xl font-extrabold text-brand">بياناتي</h2>
          <p className="mt-2 mb-5 text-muted">
            الإيميل: <bdi dir="ltr" className="font-bold text-ink">{user.email}</bdi>
          </p>
          <ProfileForm
            profile={{ full_name: profile.full_name, whatsapp: profile.whatsapp, student_group: profile.student_group }}
            submitLabel="حفظ التعديلات"
          />
        </section>

        <form action={signOut} className="text-center">
          <SubmitButton className="link-btn" pending="جارٍ الخروج…">تسجيل الخروج</SubmitButton>
        </form>
      </main>
      <SiteEnd />
    </>
  );
}
