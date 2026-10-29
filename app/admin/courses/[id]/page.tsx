import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseForm } from "../course-form";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, name, level, mode, description")
    .eq("id", id)
    .maybeSingle();
  if (!course) notFound();

  return (
    <>
      <h2 className="mb-5 text-2xl font-extrabold text-brand">تعديل الكورس</h2>
      <CourseForm course={course} />
    </>
  );
}
