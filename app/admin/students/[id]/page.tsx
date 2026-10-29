import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { waNumber, WhatsAppIcon } from "@/app/_components/whatsapp";
import { ACCOUNT_STATUSES, formatDate, formatDateTime, ORDER_STATUSES, STUDENT_GROUPS, type OrderStatus } from "@/lib/labels";
import { getStudents, signInMethods } from "../students";
import { StudentEmailButton } from "../student-forms";

type Order = { id: string; status: OrderStatus; note: string; created_at: string; courses: { name: string; level: string } | null };

export default async function AdminStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { students } = await getStudents();
  const student = students.find((s) => s.id === id);
  if (!student) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, status, note, created_at, courses(name, level)")
    .eq("student_id", id)
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as unknown as Order[];
  const status = ACCOUNT_STATUSES[student.account_status];
  const hasPassword = student.providers.includes("email");

  return (
    <>
      <p className="mb-4">
        <Link href="/admin/students" className="font-bold text-brand underline">→ كل الطلبة</Link>
      </p>

      <section className="card">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-2xl font-extrabold text-brand">{student.full_name || "—"}</h2>
          <span className={`badge ${status.tone}`}>{status.label}</span>
        </div>
        <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
          <dt className="font-bold">الإيميل</dt>
          <dd className="[overflow-wrap:anywhere]"><bdi dir="ltr">{student.email}</bdi></dd>
          <dt className="font-bold">واتساب</dt>
          <dd><bdi dir="ltr">{student.whatsapp || "—"}</bdi></dd>
          <dt className="font-bold">فئة الطالب</dt>
          <dd>{student.student_group ? STUDENT_GROUPS[student.student_group] : "—"}</dd>
          <dt className="font-bold">بيدخل بـ</dt>
          <dd>{signInMethods(student.providers)}</dd>
          <dt className="font-bold">عمل الحساب</dt>
          <dd>{formatDate(student.created_at)}</dd>
        </dl>

        {student.whatsapp && (
          <a className="wa-btn mt-5 !px-5 !py-2 !text-base" href={`https://wa.me/${waNumber(student.whatsapp)}`} target="_blank" rel="noopener">
            <WhatsAppIcon />
            كلّميه على واتساب
          </a>
        )}

        {/* Only the buttons that apply to this account (SPEC-2.md 2.8). */}
        <div className="mt-5 grid gap-3 border-t-[1.5px] border-beige-dark pt-5">
          {student.account_status === "active" && hasPassword && (
            <StudentEmailButton kind="reset" email={student.email} label="ابعتي رابط تغيير الباسورد" />
          )}
          {student.account_status === "unconfirmed" && (
            <StudentEmailButton kind="confirm" email={student.email} label="ابعتي إيميل التأكيد تاني" />
          )}
          {student.account_status === "invited" && (
            <StudentEmailButton kind="reinvite" email={student.email} label="ابعتي الدعوة تاني" />
          )}
          {student.account_status === "active" && !hasPassword && (
            <p className="text-muted">الطالب ده بيدخل بحساب Google، فمالوش باسورد عندنا.</p>
          )}
          <p className="text-muted text-[0.95rem]">محدش بيشوف باسورد الطالب. لو نسيه، ابعتي له رابط تغيير الباسورد.</p>
        </div>
      </section>

      <section className="card mt-5">
        <h3 className="text-xl font-extrabold text-brand">طلبات الحجز</h3>
        {orders.length === 0 ? (
          <p className="mt-2 text-muted">مفيش طلبات حجز.</p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-beige p-4">
                <div>
                  <p className="font-bold">{o.courses?.name} <bdi className="text-brand">{o.courses?.level}</bdi></p>
                  <p className="text-muted text-[0.95rem]">{formatDateTime(o.created_at)}</p>
                  {o.note && <p className="mt-1 [overflow-wrap:anywhere]">{o.note}</p>}
                </div>
                <span className={`badge ${ORDER_STATUSES[o.status].tone}`}>{ORDER_STATUSES[o.status].label}</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin" className="mt-4 inline-block font-bold text-brand underline">غيّري الحالة من صفحة طلبات الحجز</Link>
      </section>
    </>
  );
}
