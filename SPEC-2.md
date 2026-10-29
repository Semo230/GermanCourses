# SPEC #2 · Deutsch mit Asmaa: Next.js rebuild with student accounts, bookings and an admin dashboard

Status: **approved (2026-10-29), not built yet.**

This spec replaces three earlier decisions, each recorded in a new ADR:

| Earlier decision | Now |
|---|---|
| `docs/adr/0001`: keep plain HTML pages, no Next.js rebuild | Rebuild in **Next.js**, still on Cloudflare Workers (`docs/adr/0004`) |
| `GLOSSARY.md`: the admin is the only account | **Students have accounts** too, and create them themselves, with Supabase Auth (`docs/adr/0005`, glossary updated). The admin can also **invite** a student (`docs/adr/0007`) |
| `docs/adr/0003`: booking emails through Resend | Booking emails through **Frau Asmaa's Gmail** (no domain needed) (`docs/adr/0006`) |

It also changes one thing from SPEC #1: the level quiz now **needs an account**, and the score is saved to the student's account.

## 1. The project today

| Part | Today |
|---|---|
| Pages | `index.html` (home), `quiz.html` (level quiz), `lesson.html` (free pronunciation lesson). Arabic, RTL, all CSS and JS inline. Every fact comes from `info.md`. |
| Code | GitHub `Semo230/GermanCourses`. `main` is live. |
| Hosting | Cloudflare Workers: `germancourses` (official, https://germancourses.asmaaabdelhamidm.workers.dev/), plus `germancoursesss` and GitHub Pages. Every push to `main` publishes all three. |
| Database | Supabase project `twvrftjwwwiliywjdtjo`. One table, `messages` (contact form): visitors can only insert. |
| Emails | The contact form emails Frau Asmaa through Web3Forms from the visitor's browser. |
| Accounts | None. Nobody signs in. |
| Practice only | `Desktop\Vibe Coding\Day 3\clerk-nextjs` is a Clerk practice app. This spec does not use Clerk (see 2.3). |

## 2. Changes requested

### 2.1 Who uses the site

| Person | Account | Can do |
|---|---|---|
| **Visitor** | None | Read the home page and the free lesson, send a contact message, create an account. |
| **Student** (`Student`) | Creates their own, or is invited by the admin | Everything a visitor can, plus take the quiz, book courses, and see their own bookings and quiz results. |
| **Admin** | Frau Asmaa only | Manage courses, bookings, messages and see students. |

### 2.2 Student accounts
- **Sign-up** with **email + password** or **Google**.
- Sign-up asks for: **name**, **WhatsApp number**, and **student group** (experimental school, private school, international school, or adult learner, from `GLOSSARY.md`). Google sign-ups fill in these three on their first visit.
- **Email + password sign-ups must confirm their email** by clicking a link before they can sign in. The link is sent from Frau Asmaa's Gmail (2.6). Google accounts are already confirmed.
- **Forgot password**: a reset link, sent the same way.
- A student can edit their name, WhatsApp number and student group from their account page.
- **Invited by the admin** (for students who find sign-up hard): Frau Asmaa enters the student's email, name, WhatsApp number and student group in the dashboard (2.8). The student gets an invite email, clicks the link, chooses their own password, and is signed in. Their details are already filled in.
- **Nobody sees a student's password, not even the admin.** Supabase only stores a scrambled form of it. The admin never types, sets or sends a password. A student who forgets theirs gets a reset link.

### 2.3 Sign-in service: Supabase Auth
- Sign-in uses **Supabase Auth** in the same Supabase project as the data. Not Clerk: Clerk can't go live without a paid domain (its production setup requires "a domain you own"), and the site stays on the free `workers.dev` address.
- The admin is marked with `role: admin` in her account's `app_metadata`. Only the server can set that, so no one can make themselves admin from the browser.
- Admin sign-in uses the same sign-in page as students. Admin pages check the role on the server and send everyone else away.

### 2.4 Bookings (`Order`)
- A booking is still a **request**: no price, no payment, no schedule (`docs/adr/0002`, `info.md`).
- **Booking needs an account.** "Book" on a course sends signed-out visitors to sign in or sign up, and brings them back to the course afterwards.
- The booking form shows the course and the student's saved name and WhatsApp number (editable), plus an optional note.
- After booking, the student sees "we received your booking, Frau Asmaa will contact you on WhatsApp", and two emails go out (2.6).
- **Students can't cancel or change a booking.** They ask on WhatsApp, and Frau Asmaa changes the status.
- Statuses as in `GLOSSARY.md`: **جديد**, **اتواصلنا**, **اتسجّل**, **مقفول**. Bookings are never deleted.

### 2.5 Level quiz (`/quiz`), free lesson (`/lesson`), home page
- **Quiz:** same 10 questions, scoring and results as SPEC #1, but **an account is required**. Signed-out visitors see a short explanation and buttons to sign up or sign in. Each finished quiz is saved to the student's account (score, result, date). The WhatsApp button and "retake" stay.
- **Lesson:** unchanged and **open to everyone**, including the 🔊 buttons. Its "test your level" button leads to the quiz.
- **Home:** same design, texts, sections and contact form. Two additions: a **courses section** listing visible courses with a "book" button, and **sign-in / my account** links in the header.
- The contact form keeps working exactly as today: no account needed, saved to `messages`, emailed through Web3Forms.

### 2.6 Emails (Frau Asmaa's Gmail)
All emails are sent **from Frau Asmaa's Gmail** with a Google **app password**. Free, no domain, about 500 emails a day.

| Email | To | When | Sent by |
|---|---|---|---|
| Confirm your email / reset password | Student | Sign-up, forgot password, or the admin's "send" buttons (2.8) | Supabase Auth, with Gmail as its SMTP server |
| "Frau Asmaa invited you": link to choose a password | Student | The admin invites them (2.8) | Supabase Auth's invite email, started by the `invite-student` Edge Function |
| New booking: name, WhatsApp, course, level, note, link to the dashboard | Frau Asmaa | Every new booking | Supabase Edge Function, triggered when a booking row is inserted |
| "We received your booking" | Student | Every new booking | Same Edge Function |

- The app password is stored **only** in Supabase (Auth SMTP settings and Edge Function secrets). Never in the code, the HTML or GitHub.
- It uses Gmail's port **465**. Supabase blocks outgoing ports 25 and 587 from Edge Functions (Supabase docs, "Edge Functions limits").
- The booking is saved even if an email fails. A failed email is logged and shown to the admin as "email not sent".

### 2.7 Student area (`/account`)
- **My bookings:** course, date and status of each booking.
- **My quiz results:** score, result and date of each attempt.
- **My details:** edit name, WhatsApp number, student group.

### 2.8 Admin dashboard (`/admin`)
- **Bookings:** newest first, filterable by status. Each shows the student's name, WhatsApp (with a one-click `wa.me` link), student group, course, note and date. The admin changes the status.
- **Courses:** add, edit, hide or show a course: name, level (A1/A2), mode (in person / online / both), short description. New courses start **hidden** (`GLOSSARY.md`). Courses are hidden, never deleted.
- **Messages:** the contact form messages, newest first, with status **جديدة / اتردّ عليها**. Messages are never edited or deleted, except for that status.
- **Students:** everyone who signed up or was invited (name, email, WhatsApp, student group, sign-up date). Each also shows how they sign in (**email** or **Google**) and their account status: **active**, **email not confirmed**, or **invited, not accepted yet**. Opening a student shows their bookings.
- **Add student:** a form with email, name, WhatsApp number and student group. It sends the invite email (2.2). If that email already has an account, the admin is told so and nothing is sent.
- **Buttons on each student**, shown only when they apply:
  - **Send password reset link**: for an active email + password student who forgot their password. Not shown for Google-only students, who sign in with Google.
  - **Resend confirmation email**: for a student whose email isn't confirmed.
  - **Invite again**: for an invited student who hasn't accepted yet, for example because the link expired.
  - After each button, the admin sees "sent" or the reason it wasn't (for example "wait a minute and try again").
- The admin never sees, types or sets a student's password (2.2).
- The admin does **not** see students' quiz results (decided in the interview).

### 2.9 Technology
| Part | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript, Tailwind), Arabic RTL with the Cairo font and the current colours |
| Hosting | Cloudflare Workers via the **OpenNext** adapter (`@opennextjs/cloudflare`), same `germancourses` address |
| Database and sign-in | Supabase (`@supabase/ssr`), with row-level security on every table |
| Emails | Gmail SMTP from Supabase (2.6) |
| Secrets in the Next.js app | **None.** The app only uses the Supabase URL and publishable key. All permissions come from row-level security and the signed-in user's session. |
| Inviting students | The **`invite-student`** Supabase Edge Function (`docs/adr/0007`). Creating an account for someone else needs Supabase's secret key, which Edge Functions already have on Supabase's servers. The function first checks that the caller is signed in with `role: admin`, and refuses everyone else. Reset and confirmation emails don't need it: the dashboard asks Supabase Auth for them with the publishable key, as a student could. |

Already updated with this spec: `GLOSSARY.md` (Student, Quiz result, updated Visitor, Admin and Order), ADRs 0004–0007 (0001 and 0003 marked superseded), and a pointer in `AGENTS.md`. Updated during the build: the rest of `AGENTS.md`, `info.md` (quiz results are now saved), the test wizard, and `.env`.

### 2.10 Database (Supabase)
New tables, all with row-level security:

| Table | Holds | Who can do what |
|---|---|---|
| `profiles` | name, WhatsApp, student group, one row per account | Student: read and edit own. Admin: read all. Created automatically at sign-up or invite (an invite fills it from the details the admin entered). |
| `courses` | name, level, mode, description, visible | Everyone: read visible courses. Admin: everything except delete. |
| `orders` | student, course, WhatsApp, note, status, email status, date | Student: create own (status always "new"), read own. Admin: read all, change status. Nobody deletes. |
| `quiz_results` | student, score, result, date | Student: create and read own. Nobody else. |

The students' email, sign-in method and account status live in Supabase Auth, not in `profiles`. The Students page reads them through one database function, `admin_students()`, that returns them only when the caller is the admin.

One change to the existing table: `messages` gets a **`status`** column (default "new"). It's added, nothing is removed, and existing messages are untouched. The admin can read messages and change only their status; visitors can still only insert.

## 3. What will not change or be built

- No prices, payments, schedules, address or areas on the site (`info.md`, `docs/adr/0002`).
- The home page design and texts stay the same, apart from the courses section and header links in 2.5.
- The free lesson content and the quiz questions, scoring and results stay the same.
- The contact form, its fields and its Web3Forms email stay the same, with no account needed.
- No Clerk, no Resend, no domain purchase, no Railway, and Supabase is not moved.
- No secret key in the code, the HTML or GitHub.
- No phone/SMS sign-in.
- The admin never sees, sets or sends passwords. No temporary passwords on WhatsApp.
- Students can't cancel or edit bookings, and the admin doesn't see quiz results.
- Existing messages are never edited or deleted, apart from the new status.
- No tracking or analytics, no recorded audio.

## 4. Deployment (GitHub and Cloudflare)

1. The owner invites the Supabase account connected to Claude (**manneelsaba7-ops**) to the organization that owns `twvrftjwwwiliywjdtjo` (Organization → Team → Invite).
2. In that organization, create the free test project **germancourses-test**. All development and automated tests use it, never the live project. The wizard `scripts/wizard-test-supabase.sh` is updated, because stage 5 currently turns sign-ups **off** and students now need them **on**.
3. Build on a new branch (e.g. `nextjs-rebuild`). The old HTML pages move into the Next.js app, so `/`, `/quiz` and `/lesson` keep their addresses. `quiz.html` and `lesson.html` redirect to them, so old shared links keep working.
4. Test locally (`npm run dev`) and with a local Workers preview (`opennextjs-cloudflare preview`) against the test project.
5. Open a pull request. Frau Asmaa reviews all new text and the dashboard.
6. Before merging: apply the same database changes to the live project, deploy the `invite-student` Edge Function there, set up Gmail SMTP and Google sign-in there, create Frau Asmaa's admin account, and add her first courses (hidden until she shows them).
7. Change the Cloudflare build settings of **`germancourses`** and **`germancoursesss`** to the OpenNext build, with the Supabase URL and publishable key as build variables. **Turn off GitHub Pages**, because it can only serve plain files and would show a broken site.
8. Merge to `main`: the new site replaces the old one at the same address (**all at once**). Run the tests in section 6 on the live site.
9. If something breaks, revert the merge. That brings the old HTML site back. The new tables stay, and the old site ignores them.

## 5. Supabase and the form

- The live project is only changed in step 6 of section 4, by additive migrations: new tables, a new column, and new policies. Nothing is dropped or rewritten.
- Every migration is first applied and tested on `germancourses-test`.
- `messages` keeps its insert-only rule for visitors. The admin read and status-update rules are added next to it.
- After launch, send the usual contact-form test from the live site (name **`TEST – Claude`**, message **`رسالة اختبار بعد إطلاق موقع Next.js – يمكن تجاهلها`**). Check that it appears in `messages` and in the admin dashboard.
- One test booking is made on the live site with a test student account. It's set to **مقفول** afterwards, not deleted.

## 6. Tests

Each on a phone and a computer, first on the test project, then on the live site after launch.

**Accounts**
1. Sign up with email + password: a confirmation email arrives from Frau Asmaa's Gmail, and the student can't sign in before confirming.
2. Sign up with Google, then fill in name, WhatsApp and student group on the first visit.
3. Forgot password: the reset email arrives and the new password works.
4. A student can edit their details in `/account`.
5. A student opening `/admin` is sent away. A signed-out visitor opening `/account` or `/admin` is sent to sign in.

**Bookings and emails**
6. A signed-out visitor clicking "book" is sent to sign in, then back to the same course.
7. A booking appears in the student's account as **جديد** and in the dashboard.
8. Frau Asmaa receives the booking email, and the student receives "we received your booking".
9. With a wrong email password in the test project, the booking is still saved and the dashboard shows "email not sent".
10. The admin changes a status, and the student sees the new status.

**Security (with the publishable key, as a stranger would)**
11. A student can't read another student's bookings, quiz results or profile.
12. A student can't create a booking with a status other than "new", or change a status.
13. Nobody but the admin can read messages, and visitors can still insert them.
14. Hidden courses don't appear and can't be booked.
15. No secret key appears in the page source, the built files or GitHub.

**Pages**
16. The home page looks as before, plus the courses section and header links, in RTL.
17. `/lesson` works signed out, including 🔊.
18. `/quiz` asks signed-out visitors to sign up. Signed in, the score is saved and shown in `/account`. Check the result edges: 3, 4, 7 and 8.
19. The old links `/quiz.html` and `/lesson.html` still open the right pages.
20. Shared links show the right title and image on WhatsApp.
21. The contact form still saves to `messages` and still sends its Web3Forms email.

**Admin**
22. Add a course: it starts hidden. Show it: it appears on the home page.
23. Mark a message as replied.
24. The student list shows each student's details, sign-in method and account status, and opens their bookings.
25. **Add student:** the invite email arrives from Frau Asmaa's Gmail. The link lets the student choose a password, and they're signed in with their details already filled in. Until then, the list shows **invited, not accepted yet**.
26. Inviting an email that already has an account shows a message and sends nothing.
27. **Send password reset link** emails the student, and the new password works. The button doesn't appear for Google-only students.
28. **Resend confirmation email** and **Invite again** each send a new working link.
29. Calling `invite-student` or `admin_students()` as a student or signed-out visitor is refused.
30. No student's password appears anywhere in the dashboard.

## 7. Risks and open questions

**Open, to settle before or during the build:**
- **Supabase access:** the invite in step 1 of section 4 hasn't been sent yet. Until it is, Claude can't create the test project or apply migrations.
- **Frau Asmaa's admin email:** probably `asmaaabdelhamidm@gmail.com` (the address used on Day 3). Is the same Gmail also the sending address?
- **Gmail app password:** needs 2-step verification on that Google account. Changing the Google password cancels the app password, which then has to be created again and saved in Supabase.
- **Google sign-in:** needs a free Google Cloud OAuth client, which I'll guide. The consent screen has to be published, not left in "testing" mode, or only listed test users can sign in.
- **New text needs approval:** the courses section, sign-up form, account page, quiz sign-up message, emails (including the invite email), the "Add student" form, and a short **privacy note** on sign-up saying what's stored (name, email, WhatsApp, student group, bookings, quiz results) and why. The note is needed because the site now stores personal data.
- **Which courses to add first:** Frau Asmaa writes or approves them (e.g. A1 and A2, online and in person).

**Risks:**
- **Workers free plan size limit (3 MiB compressed):** Next.js apps can exceed it. This is checked in the first build. If it's exceeded, the options are trimming dependencies or the Workers paid plan ($5/month).
- **Next.js on Cloudflare:** OpenNext may lag behind the newest Next.js version. The first step pins the newest version OpenNext supports.
- **Quiz behind sign-up:** the quiz was the site's "hook". Requiring an account may mean fewer people take it.
- **Gmail delivery:** a few emails may land in spam, and Gmail limits are about 500 a day. Moving to a domain and Resend later is possible without changing the database.
- **Invite and reset links expire:** Supabase's email links last at most 24 hours. A student who's too late asks on WhatsApp, and the admin uses **Invite again** or **Send password reset link**.
- **Email limits in Supabase Auth:** about one email per student per minute, and an hourly limit on all Auth emails (adjustable in the Supabase dashboard). Fine for normal use, but the admin can't invite a whole class at the same moment.
- **Invites share the Gmail limit** of about 500 emails a day with booking emails.
- **Supabase free plan:** a project with no activity for 7 days is paused. Normal visits keep it active.
- **Launch is all at once:** the whole site changes in one merge. Reverting the merge brings the old site back within minutes.
- **The second Worker `germancoursesss`** gets the same new build settings. It stays a spare copy; if its settings aren't updated, it will fail to build.
- **The Clerk practice app** (Day 3) isn't used. Its development instance can be deleted later.
