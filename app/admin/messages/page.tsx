import { createClient } from "@/lib/supabase/server";
import { waNumber, WhatsAppIcon } from "@/app/_components/whatsapp";
import { SubmitButton } from "@/app/auth/forms";
import { formatDateTime, MESSAGE_STATUSES, type MessageStatus } from "@/lib/labels";
import { setMessageStatus } from "../actions";
import { FilterLink } from "../filter-link";

type Message = { id: number; name: string; phone: string; message: string; status: MessageStatus; created_at: string };

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = status && status in MESSAGE_STATUSES ? (status as MessageStatus) : null;

  const supabase = await createClient();
  let query = supabase
    .from("messages")
    .select("id, name, phone, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter) query = query.eq("status", filter);
  const { data, error } = await query;
  const messages = (data ?? []) as Message[];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-brand">رسايل «تواصل معنا»</h2>
        <nav aria-label="فلترة حسب الحالة" className="flex flex-wrap gap-2">
          <FilterLink href="/admin/messages" active={!filter}>الكل</FilterLink>
          {Object.entries(MESSAGE_STATUSES).map(([key, s]) => (
            <FilterLink key={key} href={`/admin/messages?status=${key}`} active={filter === key}>{s.label}</FilterLink>
          ))}
        </nav>
      </div>

      {error && <p className="form-status error">ما قدرناش نجيب الرسايل. حدّثي الصفحة.</p>}
      {!error && messages.length === 0 && (
        <p className="card mt-5 text-center text-muted">{filter ? "مفيش رسايل بالحالة دي." : "لسه مفيش رسايل."}</p>
      )}

      <ul className="mt-5 grid gap-4">
        {messages.map((m) => {
          const s = MESSAGE_STATUSES[m.status];
          const next: MessageStatus = m.status === "new" ? "replied" : "new";
          return (
            <li key={m.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xl font-extrabold">{m.name}</p>
                  <p className="text-muted">{formatDateTime(m.created_at)}</p>
                </div>
                <span className={`badge ${s.tone}`}>{s.label}</span>
              </div>
              <p className="mt-3 whitespace-pre-line [overflow-wrap:anywhere]">{m.message}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <a className="wa-btn !px-5 !py-2 !text-base" href={`https://wa.me/${waNumber(m.phone)}`} target="_blank" rel="noopener">
                  <WhatsAppIcon />
                  <bdi dir="ltr">{m.phone}</bdi>
                </a>
                <form action={setMessageStatus}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="status" value={next} />
                  <SubmitButton className={m.status === "new" ? "main-btn" : "ghost-btn"} pending="…">
                    {m.status === "new" ? "اتردّ عليها" : "رجّعيها جديدة"}
                  </SubmitButton>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
