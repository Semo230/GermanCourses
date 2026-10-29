import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { createClient } from "@/lib/supabase/server";
import { requireStudent } from "@/lib/auth";
import { MODES, type Mode } from "@/lib/labels";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = { title: "حجز كورس | Deutsch mit Asmaa", robots: { index: false } };

export default async function BookPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const { profile } = await requireStudent(`/book/${courseId}`);

  const supabase = await createClient();
  // Hidden courses aren't returned (row-level security), so they can't be booked.
  const { data: course } = /^[0-9a-f-]{36}$/i.test(courseId)
    ? await supabase.from("courses").select("id, name, level, mode, description").eq("id", courseId).eq("visible", true).maybeSingle()
    : { data: null };

  return (
    <>
      <InnerHero title="حجز كورس">
        <p>ده طلب حجز: مفيش دفع هنا. <bdi translate="no">Frau Asmaa</bdi> هتتواصل معاكم على واتساب بالتفاصيل.</p>
      </InnerHero>
      <main className="container pt-10">
        <div className="form-card">
          {course ? (
            <>
              <div className="mb-6 rounded-xl bg-beige p-4">
                <p className="text-xl font-extrabold text-brand">
                  {course.name} <bdi>{course.level}</bdi>
                </p>
                <p className="font-bold text-muted">{MODES[course.mode as Mode]}</p>
                {course.description && <p className="mt-2">{course.description}</p>}
              </div>
              <BookingForm courseId={course.id} fullName={profile.full_name} whatsapp={profile.whatsapp} />
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg">الكورس ده مش متاح للحجز دلوقتي.</p>
              <Link href="/#courses" className="main-btn mt-5">شوفوا الكورسات المتاحة</Link>
            </div>
          )}
        </div>
      </main>
      <SiteEnd />
    </>
  );
}
