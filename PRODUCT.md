# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, all confirmed, all reading Arabic (Egyptian dialect) right to left:

- **Parents** booking German lessons for a child at an Egyptian experimental (تجريبي), private or international school. They often ask on WhatsApp first and book on the child's behalf.
- **School students** finding the site themselves, taking the level quiz and booking, mostly on their phones.
- **Adult learners** studying A1 or A2 for themselves.

Each account records one of four student groups (`GLOSSARY.md`): experimental school, private school, international school, adult learner.

The **admin** is Frau Asmaa alone. She uses the dashboard to answer bookings and messages, manage courses and invite students who find sign-up hard.

## Product Purpose

Deutsch mit Asmaa is Frau Asmaa Abd ElHamid's German-teaching site. A visitor learns who she is and what she teaches, tries free content (a level quiz and a letters-and-pronunciation lesson), then asks a question or requests a course booking. Every booking is followed up personally on WhatsApp.

Success means a family or learner reaches her on WhatsApp, or sends a booking request she can act on, and comes away understanding where to start (A1 or A2).

## Positioning

Confirmed reasons a family picks her:

- **She follows the school syllabus.** Lessons track what Egyptian experimental, private and international schools teach.
- **She explains in Arabic, step by step.** Grammar and vocabulary are explained patiently in Egyptian Arabic until beginners understand them.
- **The follow-up is personal, on WhatsApp.** She talks to each family directly and adjusts to each student's needs.
- **She is a qualified teacher.** She graduated from Al-Alsun (Faculty of Languages) with a very good grade and holds the General Diploma in Education.

## Operating Context

- **WhatsApp (01212234806) is the real channel.** Prices, times and the lesson location are agreed there and never published (`info.md`, `docs/adr/0002`).
- **A booking is a request, not a purchase.** It has no price and no payment. Its statuses are جديد → اتواصلنا → اتسجّل → مقفول, and bookings are never deleted.
- **Lessons are A1 and A2,** in person, online, or both.
- **Accounts:** students sign up with email + password or Google, or Frau Asmaa invites them. Nobody sees a student's password, including the admin.
- **Emails** go from Frau Asmaa's Gmail: booking notices, confirmation, password reset and invites.

## Capabilities and Constraints

- **Pages:** home, level quiz (needs an account; results are saved), free lesson (open to everyone), sign-in and sign-up, student account, booking, and the admin dashboard (bookings, courses, messages, students). Full scope is in `SPEC-2.md`.
- **Stack:** Next.js on Cloudflare Workers with Supabase (Auth, Postgres with row-level security, Edge Functions). There is no secret key in the site code.
- **Facts come only from `info.md`.** Any new educational content (questions, lessons) and any new public text needs Frau Asmaa's approval before it is published.
- **Never published:** prices, schedules, the address, areas, or payments, unless she approves them first.
- **Courses start hidden** and are hidden rather than deleted. Messages and bookings are never deleted.
- **Not decided:** which courses to publish first, and the final wording of the new sign-up, booking, email and privacy text (pending her review).

## Brand Commitments

- **Name:** "Deutsch mit Asmaa" (full form "Deutsch mit Asmaa Abd ElHamid"); the teacher is "Frau Asmaa". Both are shown left to right and never translated (`translate="no"`).
- **Tagline:** «ابدأ رحلتك في اللغة الألمانية مع Deutsch mit Asmaa، وافهم الألماني خطوة بخطوة.»
- **Voice:** warm Egyptian Arabic that addresses visitors in the plural (تواصلوا، اختبروا). German words appear inline, left to right.
- **Assets:**
  - `public/images/asmaa.jpg` (her photo), `public/images/cover.jpg` (share image), `public/images/whatsapp-qr.svg`.
  - A sticker mascot of her in 8 poses (`public/images/stickers/`).
- **Existing look:** the home page design and text must stay as they are (`SPEC-2.md` section 3).

## Evidence on Hand

- Her qualifications (above), the services and target groups (`info.md`), and the approved quiz and lesson content.
- **No testimonials, student results, reviews or numbers exist yet.** Do not show or invent any. Add them only when real ones exist and she and the families approve.

## Product Principles

1. **WhatsApp is the destination.** Every page should make it easy to reach Frau Asmaa or leave a request she can follow up.
2. **Only say what is true and approved.** No invented facts, prices, proof or educational content.
3. **Speak to beginners and their parents.** Use simple Egyptian Arabic, step by step, and never assume the visitor knows German or tech terms.
4. **Keep it personal.** It's one teacher, not a platform: keep her name, photo and voice front and centre.
5. **Respect people's data.** Ask only for name, WhatsApp, student group and email, say why, and never expose passwords.

## Accessibility & Inclusion

- **Language and direction:** Arabic RTL throughout. German and Latin text is isolated left to right (`<bdi>`, `lang="de"`).
- **Devices:** every page is tested on a phone and a computer (`SPEC-2.md` section 6).
- **Readable contrast:** the WhatsApp green was darkened to `#0f7a40` so white text reaches 5.4:1. Focus rings are visible, and motion respects `prefers-reduced-motion`.
