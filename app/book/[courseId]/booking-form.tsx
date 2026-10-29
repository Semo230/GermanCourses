"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormMessage, SubmitButton, TextField } from "@/app/auth/forms";
import { createOrder } from "./actions";

export function BookingForm({ courseId, fullName, whatsapp }: { courseId: string; fullName: string; whatsapp: string }) {
  const [state, action] = useActionState(createOrder, {});

  if (state.done) {
    return (
      <div className="text-center" role="status">
        <h2 className="text-2xl font-extrabold text-brand">وصلنا طلب الحجز</h2>
        <p className="mt-3 text-lg">
          <bdi translate="no">Frau Asmaa</bdi> هتتواصل معاكم على واتساب عشان تتفقوا على التفاصيل.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/account" className="main-btn">تابعوا حجوزاتكم</Link>
          <Link href="/" className="ghost-btn">الصفحة الرئيسية</Link>
        </div>
      </div>
    );
  }

  const noteError = state.fieldErrors?.note;
  return (
    <form action={action} noValidate>
      <input type="hidden" name="course_id" value={courseId} />
      <TextField name="full_name" label="الاسم" state={state} autoComplete="name" maxLength={100} defaultValue={fullName} />
      <TextField
        name="whatsapp"
        label="رقم الواتساب"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={20}
        placeholder="01xxxxxxxxx"
        hint="Frau Asmaa هتكلّمكم على الرقم ده."
        state={state}
        defaultValue={whatsapp}
      />
      <div className="field">
        <label htmlFor="note">ملاحظة (اختياري)</label>
        <textarea
          id="note"
          name="note"
          maxLength={1000}
          placeholder="مثلاً: المواعيد اللي تناسبكم، أو أي سؤال."
          defaultValue={state.values?.note}
          aria-describedby="note-error"
        />
        <p id="note-error" className="field-error" hidden={!noteError}>{noteError}</p>
      </div>
      <SubmitButton pending="جارٍ إرسال الطلب…">ابعتوا طلب الحجز</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
