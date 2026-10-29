"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormMessage, StudentGroupField, SubmitButton, TextField } from "@/app/auth/forms";
import { inviteStudent, sendStudentEmail } from "../actions";

export function InviteStudentForm() {
  const [state, action] = useActionState(inviteStudent, {});

  if (state.done) {
    return (
      <div className="form-card !mx-0 text-center" role="status">
        <h3 className="text-xl font-extrabold text-ok">اتبعتت الدعوة</h3>
        <p className="mt-2">
          وصل إيميل لـ <bdi dir="ltr" className="font-bold">{state.email}</bdi> فيه رابط يختار منه الباسورد بتاعه. الرابط
          بيشتغل 24 ساعة.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/admin/students" className="main-btn">قايمة الطلبة</Link>
          <Link href="/admin/students/new" className="ghost-btn">إضافة طالب تاني</Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="form-card !mx-0 max-w-[620px]">
      <TextField name="email" label="إيميل الطالب" type="email" autoComplete="off" dir="ltr" state={state} />
      <TextField name="full_name" label="الاسم" state={state} autoComplete="off" maxLength={100} />
      <TextField
        name="whatsapp"
        label="رقم الواتساب"
        type="tel"
        inputMode="tel"
        autoComplete="off"
        maxLength={20}
        placeholder="01xxxxxxxxx"
        state={state}
      />
      <StudentGroupField state={state} />
      <p className="mb-5 rounded-xl bg-beige p-4 text-muted">
        الطالب هيوصله إيميل دعوة، ويختار الباسورد بنفسه. محدش بيشوف الباسورد، ولا حتى إنتِ.
      </p>
      <SubmitButton pending="جارٍ إرسال الدعوة…">ابعتي الدعوة</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}

const SENT_TEXT = {
  reset: "اتبعت رابط تغيير الباسورد.",
  confirm: "اتبعت إيميل التأكيد تاني.",
  reinvite: "اتبعتت الدعوة تاني.",
};

/** One email button on a student's page; shows "sent" or why it wasn't. */
export function StudentEmailButton({ kind, email, label }: { kind: keyof typeof SENT_TEXT; email: string; label: string }) {
  const [state, action] = useActionState(sendStudentEmail, {});
  return (
    <form action={action}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="email" value={email} />
      <SubmitButton className="ghost-btn" pending="جارٍ الإرسال…">{label}</SubmitButton>
      {state.done && <p className="form-status success" role="status">{SENT_TEXT[kind]}</p>}
      <FormMessage state={state} />
    </form>
  );
}
