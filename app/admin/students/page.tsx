import Link from "next/link";
import { ACCOUNT_STATUSES, formatDate, STUDENT_GROUPS } from "@/lib/labels";
import { getStudents, signInMethods } from "./students";

export default async function AdminStudentsPage() {
  const { students, error } = await getStudents();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-brand">الطلبة ({students.length})</h2>
        <Link href="/admin/students/new" className="main-btn">إضافة طالب</Link>
      </div>

      {error && <p className="form-status error">ما قدرناش نجيب الطلبة. حدّثي الصفحة.</p>}
      {!error && students.length === 0 && (
        <p className="card mt-5 text-center text-muted">لسه محدش عمل حساب.</p>
      )}

      <ul className="mt-5 grid gap-3">
        {students.map((s) => {
          const status = ACCOUNT_STATUSES[s.account_status];
          return (
            <li key={s.id}>
              <Link
                href={`/admin/students/${s.id}`}
                className="card flex flex-wrap items-center justify-between gap-3 no-underline text-ink hover:outline-2 hover:outline-brand"
              >
                <div className="min-w-0">
                  <p className="text-lg font-extrabold">{s.full_name || "—"}</p>
                  <p className="text-muted [overflow-wrap:anywhere]">
                    <bdi dir="ltr">{s.email}</bdi> · <bdi dir="ltr">{s.whatsapp || "—"}</bdi>
                  </p>
                  <p className="text-muted text-[0.95rem]">
                    {s.student_group ? STUDENT_GROUPS[s.student_group] : "فئة الطالب لسه ما اتحددتش"} · بيدخل بـ{" "}
                    {signInMethods(s.providers)} · من {formatDate(s.created_at)}
                  </p>
                </div>
                <span className={`badge ${status.tone}`}>{status.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
