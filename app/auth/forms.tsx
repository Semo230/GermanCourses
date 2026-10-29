"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { STUDENT_GROUPS } from "@/lib/labels";
import {
  requestPasswordReset,
  resendConfirmation,
  saveProfile,
  signIn,
  signUp,
  updatePassword,
  type FormState,
} from "./actions";

/** Submit button that disables itself and says so while the form is being sent. */
export function SubmitButton({ children, pending: pendingLabel = "لحظة…", className = "submit-btn" }: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Error or success line under a form, announced to screen readers. Takes focus after a failed submit. */
export function FormMessage({ state }: { state: FormState }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.error) ref.current?.focus();
  }, [state]);
  if (!state.error) return null;
  return (
    <div ref={ref} tabIndex={-1} className="form-status error" role="alert">
      {state.error}
    </div>
  );
}

function FieldError({ id, text }: { id: string; text?: string }) {
  return (
    <p id={id} className="field-error" hidden={!text}>
      {text}
    </p>
  );
}

/** Moves focus to the first field with an error after a failed submit. */
function useFocusFirstError(state: FormState, formRef: React.RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    const first = Object.keys(state.fieldErrors ?? {})[0];
    if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus?.();
  }, [state, formRef]);
}

export function TextField({ name, label, state, type = "text", required = true, hint, ...rest }: {
  name: string;
  label: string;
  state: FormState;
  type?: string;
  required?: boolean;
  hint?: string;
  defaultValue?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  placeholder?: string;
  dir?: string;
}) {
  const error = state.fieldErrors?.[name];
  const describedBy = [hint && `${name}-hint`, `${name}-error`].filter(Boolean).join(" ");
  return (
    <div className="field">
      <label htmlFor={name}>
        {label} {required && <span className="req">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy}
        {...rest}
        defaultValue={state.values?.[name] ?? rest.defaultValue}
        key={state.values?.[name] ?? rest.defaultValue}
      />
      {hint && <p id={`${name}-hint`} className="field-hint">{hint}</p>}
      <FieldError id={`${name}-error`} text={error} />
    </div>
  );
}

export function PasswordField({ name = "password", label = "الباسورد", state, autoComplete, hint }: {
  name?: string;
  label?: string;
  state: FormState;
  autoComplete: "current-password" | "new-password";
  hint?: string;
}) {
  const [shown, setShown] = useState(false);
  const error = state.fieldErrors?.[name];
  return (
    <div className="field">
      <label htmlFor={name}>
        {label} <span className="req">*</span>
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={autoComplete === "new-password" ? 8 : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={[hint && `${name}-hint`, `${name}-error`].filter(Boolean).join(" ")}
          style={{ paddingLeft: "84px" }}
        />
        <button
          type="button"
          className="absolute left-1 top-1/2 -translate-y-1/2 min-h-11 px-3 rounded-full font-bold text-brand hover:bg-beige-dark/50 cursor-pointer"
          aria-pressed={shown}
          aria-controls={name}
          onClick={() => setShown((s) => !s)}
        >
          {shown ? "إخفاء" : "إظهار"}
        </button>
      </div>
      {hint && <p id={`${name}-hint`} className="field-hint">{hint}</p>}
      <FieldError id={`${name}-error`} text={error} />
    </div>
  );
}

export function StudentGroupField({ state, defaultValue }: { state: FormState; defaultValue?: string | null }) {
  const error = state.fieldErrors?.student_group;
  const current = state.values?.student_group ?? defaultValue ?? "";
  return (
    <fieldset className="field" aria-describedby="student_group-error">
      <legend>
        فئة الطالب <span className="req">*</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-2" key={current}>
        {Object.entries(STUDENT_GROUPS).map(([value, label]) => (
          <label
            key={value}
            className="flex items-center gap-3 min-h-12 px-4 rounded-xl border-[1.5px] border-beige-dark bg-beige cursor-pointer has-[:checked]:border-brand has-[:checked]:bg-white font-semibold"
          >
            <input
              type="radio"
              name="student_group"
              value={value}
              defaultChecked={current === value}
              required
              className="size-5 accent-brand"
            />
            {label}
          </label>
        ))}
      </div>
      <FieldError id="student_group-error" text={error} />
    </fieldset>
  );
}

function ProfileFields({ state, profile }: {
  state: FormState;
  profile?: { full_name?: string; whatsapp?: string; student_group?: string | null };
}) {
  return (
    <>
      <TextField name="full_name" label="الاسم" state={state} autoComplete="name" maxLength={100} defaultValue={profile?.full_name} />
      <TextField
        name="whatsapp"
        label="رقم الواتساب"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={20}
        placeholder="01xxxxxxxxx"
        hint="Frau Asmaa بتتواصل مع الطلبة على الرقم ده."
        state={state}
        defaultValue={profile?.whatsapp}
      />
      <StudentGroupField state={state} defaultValue={profile?.student_group} />
    </>
  );
}

const PRIVACY_NOTE =
  "بنحفظ اسمكم وإيميلكم ورقم الواتساب وفئة الطالب وطلبات الحجز ونتايج اختبار المستوى، عشان Frau Asmaa تقدر تتواصل معاكم وتتابع حجوزاتكم. مش بنشاركها مع حد، ومحدش بيشوف الباسورد بتاعكم.";

export function SignupForm({ next }: { next: string }) {
  const [state, action] = useActionState(signUp, {});
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(state, formRef);

  if (state.done) {
    return (
      <div className="text-center" role="status">
        <h2 className="text-2xl font-extrabold text-brand">فاضل خطوة واحدة</h2>
        <p className="mt-3 text-lg">
          بعتنا رسالة تأكيد على <bdi dir="ltr" className="font-bold">{state.email}</bdi>. افتحوها ودوسوا على الرابط عشان
          حسابكم يشتغل.
        </p>
        <p className="mt-3 text-muted">لو ما لقيتوهاش خلال دقايق، بصّوا في الـ Spam.</p>
        <ResendConfirmation email={state.email!} />
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate>
      <input type="hidden" name="next" value={next} />
      <ProfileFields state={state} />
      <TextField name="email" label="الإيميل" type="email" autoComplete="email" dir="ltr" state={state} />
      <PasswordField state={state} autoComplete="new-password" hint="8 حروف أو أرقام على الأقل." />
      <p className="mb-5 rounded-xl bg-beige p-4 text-[0.95rem] text-muted">{PRIVACY_NOTE}</p>
      <SubmitButton pending="جارٍ إنشاء الحساب…">إنشاء الحساب</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}

export function ResendConfirmation({ email }: { email: string }) {
  const [state, action] = useActionState(resendConfirmation, {});
  return (
    <form action={action} className="mt-4">
      <input type="hidden" name="email" value={email} />
      {state.done ? (
        <p className="form-status success" role="status">بعتنا رسالة تأكيد جديدة.</p>
      ) : (
        <SubmitButton className="link-btn" pending="جارٍ الإرسال…">ابعتوا رسالة التأكيد تاني</SubmitButton>
      )}
      <FormMessage state={state} />
    </form>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(signIn, {});
  return (
    <>
      <form action={action}>
        <input type="hidden" name="next" value={next} />
        <TextField name="email" label="الإيميل" type="email" autoComplete="email" dir="ltr" state={state} />
        <PasswordField state={state} autoComplete="current-password" />
        <p className="-mt-2 mb-5">
          <Link href="/forgot-password" className="font-bold text-brand underline">
            نسيت الباسورد؟
          </Link>
        </p>
        <SubmitButton pending="جارٍ تسجيل الدخول…">تسجيل الدخول</SubmitButton>
        <FormMessage state={state} />
      </form>
      {state.unconfirmed && state.email && <ResendConfirmation email={state.email} />}
    </>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, {});
  if (state.done) {
    return (
      <p className="form-status success" role="status">
        لو فيه حساب بالإيميل <bdi dir="ltr">{state.email}</bdi>، هتوصله رسالة فيها رابط تغيير الباسورد. الرابط بيشتغل مرة
        واحدة ولمدة محدودة.
      </p>
    );
  }
  return (
    <form action={action} noValidate>
      <TextField name="email" label="الإيميل" type="email" autoComplete="email" dir="ltr" state={state} />
      <SubmitButton pending="جارٍ الإرسال…">ابعتوا لي رابط تغيير الباسورد</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState(updatePassword, {});
  return (
    <form action={action} noValidate>
      <PasswordField state={state} label="الباسورد الجديد" autoComplete="new-password" hint="8 حروف أو أرقام على الأقل." />
      <PasswordField state={state} name="confirm" label="اكتبوا الباسورد تاني" autoComplete="new-password" />
      <SubmitButton pending="جارٍ الحفظ…">حفظ الباسورد</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}

export function ProfileForm({ profile, next, submitLabel }: {
  profile: { full_name: string; whatsapp: string; student_group: string | null };
  next?: string;
  submitLabel: string;
}) {
  const [state, action] = useActionState(saveProfile, {});
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(state, formRef);
  return (
    <form ref={formRef} action={action} noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <ProfileFields state={state} profile={profile} />
      <SubmitButton pending="جارٍ الحفظ…">{submitLabel}</SubmitButton>
      <FormMessage state={state} />
      {state.done && <p className="form-status success" role="status">اتحفظت البيانات.</p>}
    </form>
  );
}
