import { InviteStudentForm } from "../student-forms";

export default function NewStudentPage() {
  return (
    <>
      <h2 className="text-2xl font-extrabold text-brand">إضافة طالب</h2>
      <p className="mb-5 mt-1 text-muted">للطلبة اللي التسجيل صعب عليهم: إنتِ بتكتبي بياناتهم، وهم بيختاروا الباسورد من الإيميل.</p>
      <InviteStudentForm />
    </>
  );
}
