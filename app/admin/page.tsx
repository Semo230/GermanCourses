import { createClient } from "@/lib/supabase/server";
import { waNumber, WhatsAppIcon } from "@/app/_components/whatsapp";
import { SubmitButton } from "@/app/auth/forms";
import {
  formatDateTime,
  MODES,
  ORDER_STATUSES,
  STUDENT_GROUPS,
  type Mode,
  type OrderStatus,
  type StudentGroup,
} from "@/lib/labels";
import { setOrderStatus } from "./actions";
import { FilterLink } from "./filter-link";

type Order = {
  id: string;
  full_name: string;
  whatsapp: string;
  note: string;
  status: OrderStatus;
  email_status: "pending" | "sent" | "failed";
  created_at: string;
  courses: { name: string; level: string; mode: Mode } | null;
  profiles: { student_group: StudentGroup | null } | null;
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = status && status in ORDER_STATUSES ? (status as OrderStatus) : null;

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, full_name, whatsapp, note, status, email_status, created_at, courses(name, level, mode), profiles(student_group)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter) query = query.eq("status", filter);
  const { data, error } = await query;
  const orders = (data ?? []) as unknown as Order[];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-brand">طلبات الحجز</h2>
        <nav aria-label="فلترة حسب الحالة" className="flex flex-wrap gap-2">
          <FilterLink href="/admin" active={!filter}>الكل</FilterLink>
          {Object.entries(ORDER_STATUSES).map(([key, s]) => (
            <FilterLink key={key} href={`/admin?status=${key}`} active={filter === key}>{s.label}</FilterLink>
          ))}
        </nav>
      </div>

      {error && <p className="form-status error">ما قدرناش نجيب الطلبات. حدّثي الصفحة.</p>}
      {!error && orders.length === 0 && (
        <p className="card mt-5 text-center text-muted">{filter ? "مفيش طلبات بالحالة دي." : "لسه مفيش طلبات حجز."}</p>
      )}

      <ul className="mt-5 grid gap-4">
        {orders.map((order) => (
          <li key={order.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xl font-extrabold">{order.full_name}</p>
                <p className="text-muted">
                  {order.profiles?.student_group ? STUDENT_GROUPS[order.profiles.student_group] : "—"} ·{" "}
                  {formatDateTime(order.created_at)}
                </p>
              </div>
              <span className={`badge ${ORDER_STATUSES[order.status].tone}`}>{ORDER_STATUSES[order.status].label}</span>
            </div>

            <p className="mt-3">
              <strong>الكورس:</strong> {order.courses?.name} <bdi>{order.courses?.level}</bdi>
              {order.courses && <span className="text-muted"> ({MODES[order.courses.mode]})</span>}
            </p>
            {order.note && (
              <p className="mt-1 [overflow-wrap:anywhere]"><strong>ملاحظة:</strong> {order.note}</p>
            )}
            {order.email_status === "failed" && (
              <p className="mt-2"><span className="badge progress">الإيميل ما اتبعتش</span></p>
            )}

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <a
                className="wa-btn !px-5 !py-2 !text-base"
                href={`https://wa.me/${waNumber(order.whatsapp)}`}
                target="_blank"
                rel="noopener"
              >
                <WhatsAppIcon />
                <bdi dir="ltr">{order.whatsapp}</bdi>
              </a>
              <form action={setOrderStatus} className="flex items-end gap-2">
                <input type="hidden" name="id" value={order.id} />
                <div className="field !mb-0">
                  <label htmlFor={`status-${order.id}`} className="text-[0.95rem]">تغيير الحالة</label>
                  <select id={`status-${order.id}`} name="status" defaultValue={order.status}>
                    {Object.entries(ORDER_STATUSES).map(([key, s]) => (
                      <option key={key} value={key}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <SubmitButton className="ghost-btn !py-2.5" pending="…">حفظ</SubmitButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
