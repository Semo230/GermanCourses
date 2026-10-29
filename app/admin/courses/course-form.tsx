"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormMessage, SubmitButton, TextField } from "@/app/auth/forms";
import { LEVELS, MODES } from "@/lib/labels";
import { saveCourse } from "../actions";

type Course = { id: string; name: string; level: string; mode: string; description: string };

export function CourseForm({ course }: { course?: Course }) {
  const [state, action] = useActionState(saveCourse, {});
  const v = { ...course, ...state.values };

  return (
    <form action={action} noValidate className="form-card !mx-0 max-w-[620px]">
      {course && <input type="hidden" name="id" value={course.id} />}
      <TextField name="name" label="اسم الكورس" state={state} maxLength={120} defaultValue={course?.name} />

      <fieldset className="field" aria-describedby="level-error">
        <legend>المستوى <span className="req">*</span></legend>
        <div className="flex gap-3" key={v.level}>
          {LEVELS.map((level) => (
            <label key={level} className="flex min-h-12 items-center gap-2 rounded-xl border-[1.5px] border-beige-dark bg-beige px-5 font-bold has-[:checked]:border-brand has-[:checked]:bg-white cursor-pointer">
              <input type="radio" name="level" value={level} defaultChecked={v.level === level} className="size-5 accent-brand" />
              <bdi>{level}</bdi>
            </label>
          ))}
        </div>
        <p id="level-error" className="field-error" hidden={!state.fieldErrors?.level}>{state.fieldErrors?.level}</p>
      </fieldset>

      <fieldset className="field" aria-describedby="mode-error">
        <legend>نظام الدراسة <span className="req">*</span></legend>
        <div className="flex flex-wrap gap-3" key={v.mode}>
          {Object.entries(MODES).map(([value, label]) => (
            <label key={value} className="flex min-h-12 items-center gap-2 rounded-xl border-[1.5px] border-beige-dark bg-beige px-5 font-bold has-[:checked]:border-brand has-[:checked]:bg-white cursor-pointer">
              <input type="radio" name="mode" value={value} defaultChecked={v.mode === value} className="size-5 accent-brand" />
              {label}
            </label>
          ))}
        </div>
        <p id="mode-error" className="field-error" hidden={!state.fieldErrors?.mode}>{state.fieldErrors?.mode}</p>
      </fieldset>

      <div className="field">
        <label htmlFor="description">وصف قصير</label>
        <textarea
          id="description"
          name="description"
          maxLength={1000}
          defaultValue={v.description}
          key={v.description}
          aria-describedby="description-hint"
        />
        <p id="description-hint" className="field-hint">من غير أسعار ولا مواعيد ولا عنوان: دول بيتقالوا على واتساب.</p>
      </div>

      {!course && (
        <p className="mb-5 rounded-xl bg-beige p-4 text-muted">
          الكورس الجديد بيبدأ <strong>مخفي</strong>. أظهريه من قايمة الكورسات لما يبقى جاهز.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton className="main-btn" pending="جارٍ الحفظ…">{course ? "حفظ التعديلات" : "إضافة الكورس"}</SubmitButton>
        <Link href="/admin/courses" className="font-bold text-brand underline">إلغاء</Link>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
