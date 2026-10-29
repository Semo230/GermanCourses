import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/app/auth/forms";
import { MODES, type Mode } from "@/lib/labels";
import { setCourseVisible } from "../actions";

type Course = { id: string; name: string; level: string; mode: Mode; description: string; visible: boolean };

export default async function AdminCoursesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const saved = (await searchParams).saved === "1";
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, name, level, mode, description, visible")
    .order("level")
    .order("created_at");
  const courses = (data ?? []) as Course[];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-brand">الكورسات</h2>
        <Link href="/admin/courses/new" className="main-btn">إضافة كورس</Link>
      </div>
      {saved && <p className="form-status success" role="status">اتحفظ الكورس.</p>}

      {courses.length === 0 && (
        <p className="card mt-5 text-center text-muted">لسه مفيش كورسات. أضيفي أول كورس، وهيبدأ مخفي لحد ما تظهريه.</p>
      )}

      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <li key={course.id} className={"card flex flex-col " + (course.visible ? "" : "opacity-90 border-2 border-dashed border-beige-dark")}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-xl font-extrabold text-brand">
                {course.name} <bdi>{course.level}</bdi>
              </p>
              <span className={`badge ${course.visible ? "done" : ""}`}>{course.visible ? "ظاهر" : "مخفي"}</span>
            </div>
            <p className="font-bold text-muted">{MODES[course.mode]}</p>
            {course.description && <p className="mt-2">{course.description}</p>}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
              <form action={setCourseVisible}>
                <input type="hidden" name="id" value={course.id} />
                <input type="hidden" name="visible" value={String(!course.visible)} />
                <SubmitButton className={course.visible ? "ghost-btn" : "main-btn"} pending="…">
                  {course.visible ? "إخفاء" : "إظهار على الموقع"}
                </SubmitButton>
              </form>
              <Link href={`/admin/courses/${course.id}`} className="font-bold text-brand underline">تعديل</Link>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-muted">الكورسات ما بتتمسحش: الكورس اللي مش عايزاه يظهر، خبّيه.</p>
    </>
  );
}
