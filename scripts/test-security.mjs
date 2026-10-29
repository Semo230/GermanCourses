// SPEC-2.md section 6, tests 7, 10-14, 22, 23 and 29, run against the TEST project with the
// publishable key only, the way a stranger or a student would. Never point this at the live project.
//
//   node scripts/test-security.mjs
//
// Reads SUPABASE_TEST_* from .env (test admin + two test students, see AGENTS.md).
// It adds test courses, bookings, quiz results and one message to the test project.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// The wizard writes KEY='value' (with ' inside written as '\''); lines added by hand may have no quotes.
const unquote = (v) => (/^'.*'$/.test(v) ? v.slice(1, -1).replaceAll("'\\''", "'") : v);
const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^SUPABASE_TEST_\w+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), unquote(l.slice(l.indexOf("=") + 1))]),
);
const URL_ = env.SUPABASE_TEST_URL;
const KEY = env.SUPABASE_TEST_PUBLISHABLE_KEY;
if (!URL_?.includes("scbuhowisqjtaadminct")) throw new Error("Refusing to run: SUPABASE_TEST_URL is not the test project.");

const client = () => createClient(URL_, KEY, { auth: { persistSession: false, autoRefreshToken: false } });
async function signedIn(who) {
  const c = client();
  const { data, error } = await c.auth.signInWithPassword({
    email: env[`SUPABASE_TEST_${who}_EMAIL`],
    password: env[`SUPABASE_TEST_${who}_PASSWORD`],
  });
  if (error) throw new Error(`${who} sign-in failed: ${error.message}`);
  return { c, id: data.user.id };
}

let failed = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `  (${detail})`}`);
  if (!ok) failed++;
}

const anon = client();
const admin = await signedIn("ADMIN");
const a = await signedIn("STUDENT_A");
const b = await signedIn("STUDENT_B");

// Courses (test 22, 14)
const visible = await admin.c.from("courses").insert({ name: "TEST كورس ظاهر", level: "A1", mode: "online" }).select().single();
check("admin adds a course", !visible.error, visible.error?.message);
check("a new course starts hidden", visible.data?.visible === false);
await admin.c.from("courses").update({ visible: true }).eq("id", visible.data.id);
const hidden = await admin.c.from("courses").insert({ name: "TEST كورس مخفي", level: "A2", mode: "both" }).select().single();

const anonCourses = await anon.from("courses").select("id");
check("visitors see the visible course", anonCourses.data?.some((c) => c.id === visible.data.id));
check("14 visitors don't see hidden courses", !anonCourses.data?.some((c) => c.id === hidden.data.id));
const studentAddsCourse = await a.c.from("courses").insert({ name: "x", level: "A1", mode: "online" });
check("students can't add courses", Boolean(studentAddsCourse.error));
const deleteCourse = await admin.c.from("courses").delete().eq("id", hidden.data.id).select();
check("nobody deletes courses, not even the admin", Boolean(deleteCourse.error) || deleteCourse.data?.length === 0);

// Bookings (tests 7, 12, 14, 11)
const orderA = await a.c.from("orders").insert({ course_id: visible.data.id, full_name: "طالب تجربة A", whatsapp: "01000000001", note: "TEST" }).select().single();
check("7 a student books a visible course", !orderA.error, orderA.error?.message);
check("7 the booking starts as new", orderA.data?.status === "new");
const hiddenBooking = await a.c.from("orders").insert({ course_id: hidden.data.id, full_name: "A", whatsapp: "01000000001" });
check("14 hidden courses can't be booked", Boolean(hiddenBooking.error));
const statusBooking = await a.c.from("orders").insert({ course_id: visible.data.id, full_name: "A", whatsapp: "01000000001", status: "enrolled" });
check("12 a student can't book with another status", Boolean(statusBooking.error));
const forOther = await a.c.from("orders").insert({ course_id: visible.data.id, full_name: "A", whatsapp: "01000000001", student_id: b.id });
check("a student can't book for someone else", Boolean(forOther.error));
const changeStatus = await a.c.from("orders").update({ status: "enrolled" }).eq("id", orderA.data.id).select();
check("12 a student can't change a status", Boolean(changeStatus.error) || changeStatus.data?.length === 0);
const anonBooking = await anon.from("orders").insert({ course_id: visible.data.id, full_name: "x", whatsapp: "01000000003" });
check("visitors can't book without an account", Boolean(anonBooking.error));
const bReadsA = await b.c.from("orders").select("id").eq("id", orderA.data.id);
check("11 a student can't read another student's bookings", bReadsA.data?.length === 0);
const deleteOrder = await a.c.from("orders").delete().eq("id", orderA.data.id).select();
check("students can't delete bookings", Boolean(deleteOrder.error) || deleteOrder.data?.length === 0);

// Admin changes the status, the student sees it (test 10)
const adminStatus = await admin.c.from("orders").update({ status: "contacted" }).eq("id", orderA.data.id).select().single();
check("10 the admin changes a status", adminStatus.data?.status === "contacted", adminStatus.error?.message);
const aSees = await a.c.from("orders").select("status").eq("id", orderA.data.id).single();
check("10 the student sees the new status", aSees.data?.status === "contacted");
const adminEmailStatus = await admin.c.from("orders").update({ email_status: "sent" }).eq("id", orderA.data.id);
check("only the status can be changed, not the email status", Boolean(adminEmailStatus.error));

// Quiz results (test 11, admin can't see them)
const quiz = await a.c.from("quiz_results").insert({ score: 7, result: "basics" }).select().single();
check("a student saves a quiz result", !quiz.error, quiz.error?.message);
const badQuiz = await a.c.from("quiz_results").insert({ score: 9, result: "start" });
check("a result must match its score", Boolean(badQuiz.error));
check("11 another student can't read it", (await b.c.from("quiz_results").select("id").eq("id", quiz.data.id)).data?.length === 0);
check("the admin can't read quiz results", (await admin.c.from("quiz_results").select("id")).data?.length === 0);

// Profiles (test 11)
check("11 a student can't read another profile", (await b.c.from("profiles").select("id").eq("id", a.id)).data?.length === 0);
const editOther = await b.c.from("profiles").update({ full_name: "hacked" }).eq("id", a.id).select();
check("a student can't edit another profile", Boolean(editOther.error) || editOther.data?.length === 0);
const editOwn = await a.c.from("profiles").update({ whatsapp: "01000000009" }).eq("id", a.id).select().single();
check("a student edits their own details", editOwn.data?.whatsapp === "01000000009", editOwn.error?.message);
await a.c.from("profiles").update({ whatsapp: "01000000001" }).eq("id", a.id);
check("the admin reads all profiles", ((await admin.c.from("profiles").select("id")).data?.length ?? 0) >= 3);

// Messages (tests 13, 23)
const anonMessage = await anon.from("messages").insert({ name: "TEST – Claude", phone: "01000000000", message: "رسالة اختبار من scripts/test-security.mjs" });
check("13 visitors can still send messages", !anonMessage.error, anonMessage.error?.message);
check("13 visitors can't read messages", ((await anon.from("messages").select("id")).data?.length ?? 0) === 0);
check("13 students can't read messages", ((await a.c.from("messages").select("id")).data?.length ?? 0) === 0);
const adminMessages = await admin.c.from("messages").select("id, status").order("created_at", { ascending: false }).limit(1);
check("13 the admin reads messages", (adminMessages.data?.length ?? 0) === 1, adminMessages.error?.message);
const replied = await admin.c.from("messages").update({ status: "replied" }).eq("id", adminMessages.data[0].id).select().single();
check("23 the admin marks a message as replied", replied.data?.status === "replied", replied.error?.message);
const editMessage = await admin.c.from("messages").update({ message: "changed" }).eq("id", adminMessages.data[0].id);
check("messages themselves can't be edited", Boolean(editMessage.error));

// admin_students() and invite-student (test 29)
const studentsAsAdmin = await admin.c.rpc("admin_students");
check("the admin lists students", (studentsAsAdmin.data?.length ?? 0) >= 2, studentsAsAdmin.error?.message);
check("the list never includes passwords", !JSON.stringify(studentsAsAdmin.data).includes("password"));
check("29 students can't call admin_students()", Boolean((await a.c.rpc("admin_students")).error));
check("29 visitors can't call admin_students()", Boolean((await anon.rpc("admin_students")).error));
check("visitors can't call account_status_for_email()", Boolean((await anon.rpc("account_status_for_email", { p_email: "x@example.com" })).error));
const inviteAsStudent = await a.c.functions.invoke("invite-student", { body: { email: "x@example.com" } });
check("29 students can't call invite-student", Boolean(inviteAsStudent.error));
const inviteAsAnon = await anon.functions.invoke("invite-student", { body: { email: "x@example.com" } });
check("29 visitors can't call invite-student", Boolean(inviteAsAnon.error));

// Leave the test data tidy: hide the visible test course again.
await admin.c.from("courses").update({ visible: false }).eq("id", visible.data.id);

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
