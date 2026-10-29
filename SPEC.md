# SPEC · Deutsch mit Asmaa: level quiz and free pronunciation lesson

Status: **built and published (2026-10-29).** The content was approved, and PR #2 was merged into `main`.

## 1. The project today

**Deutsch mit Asmaa** is a one-page Arabic (RTL) website for German lessons with Frau Asmaa Abd ElHamid. It covers A1 and A2, in person and online. Every fact on the site comes from `info.md`.

| Part | Today |
|---|---|
| Page | `index.html` has a hero, "مين إحنا", "لمين الدروس دي؟", "خدماتنا التعليمية", a WhatsApp section with a QR code, the contact form, and a floating WhatsApp button. All CSS and JS are inline. |
| Images | `images/asmaa.jpg`, `images/cover.jpg` (link preview), `images/whatsapp-qr.svg` |
| Code | GitHub `Semo230/GermanCourses`, branch `main` |
| Hosting | Cloudflare. The live site is https://germancourses.asmaaabdelhamidm.workers.dev/. Every push to `main` publishes automatically. |
| Form | Name, phone and message. Each message is saved to the Supabase table `messages` and emailed through Web3Forms, both at once. The message counts as sent if either one succeeds. |
| Keys in the page | The Supabase **publishable** key and the Web3Forms access key. Both are made to be public: the table only allows inserts, and Web3Forms only sends to Asmaa's address. No secret key is in the code. |

## 2. Changes requested

Goal: make the site a "hook" that brings in learners through useful German content, then sends them to WhatsApp.

### 2.1 Level quiz: new page `quiz.html` (opens at `/quiz`)
- 10 multiple-choice questions on A1–A2 vocabulary and grammar. The instructions are in Arabic, and the questions are German with Arabic help where needed.
- One question at a time, with a progress indicator (for example, 3 / 10).
- At the end the visitor sees their score and one of three results:

  | Score | Result | Recommendation |
  |---|---|---|
  | 0–3 | Start from the beginning | A1 course |
  | 4–7 | You know some basics | Continue A1 |
  | 8–10 | You're ready for A2 | A2 course |

- Every result ends with a **WhatsApp button** whose pre-filled message includes the result, for example "أهلاً، عملت اختبار المستوى ونتيجتي … عايز أعرف تفاصيل الكورس". There's also a "retake the quiz" option.
- The result stays **on the visitor's screen only**. Nothing is saved anywhere.

### 2.2 Free mini lesson: new page `lesson.html` (opens at `/lesson`)
- Topic: **the German alphabet and pronunciation.**
- Contents: the letters A–Z, then the sounds Arabic speakers find hard: ä, ö, ü, ß, ch (≈ خ / soft ch), sch, ei vs ie, w, v, z, j, r. Each one gets a short example word.
- Each letter and example gets a **🔊 button** that uses the browser's built-in German voice (Web Speech API, `de-DE`). There are no audio files.
- If the device has no German voice, the 🔊 buttons are hidden and the lesson still works as text with an Arabic-letter guide.
- At the end: "Test your level" leads to `/quiz`, plus a WhatsApp button.

### 2.3 Home page (`index.html`): smallest possible change
- Add **two buttons** that lead to `/quiz` and `/lesson`. The suggested spot is a small block under the hero button. Their wording needs approval (see section 7).
- Nothing else on the home page changes.

### 2.4 Shared requirements for the new pages
- Same look as the home page: the same colours (`--beige`, `--red` …), the Cairo font, RTL, and mobile-first. The style rules are copied into each page so `index.html` isn't touched beyond 2.3.
- Each page has a link back to the home page, plus the floating WhatsApp button.
- Each page has its own `<title>`, description, and `og:` tags (reusing `images/cover.jpg`), so a shared link shows a proper preview on WhatsApp and Facebook.

### 2.5 Content process
- Claude drafts every quiz question, answer and lesson text.
- **Asmaa reviews and approves the content before it is published.** Nothing goes live until she does.

## 3. What will not change or be built

- The design, text and information on the home page stay the same, apart from the two buttons in 2.3.
- The contact form, its fields, its messages, and its Supabase and Web3Forms connections stay the same.
- No database changes: no new tables, no policy changes, and quiz results are not saved.
- The hosting doesn't move. It stays on GitHub and Cloudflare. No Railway, and Supabase isn't moved to another PostgreSQL host.
- No prices, schedules, address or areas are added (`info.md`).
- No new API keys or secrets, and none are put in the front-end code.
- No sign-up or login, no tracking or analytics, and no recorded audio.
- Existing messages in the `messages` table are never edited or deleted.

## 4. Deployment (GitHub and Cloudflare)

- Note: `day8.txt` says "Cloudflare Pages", but the live site is on **Cloudflare Workers** (the `workers.dev` address and `AGENTS.md`). The current setup stays as it is.
- The repo has no `wrangler` config, so the build settings live in the Cloudflare dashboard. New `.html` files at the repo root should be served as static files the same way `index.html` is.
- A push to `main` publishes to the live site immediately, so the workflow is:
  1. Work on a separate branch (for example, `quiz-and-lesson`).
  2. Test locally by opening the files in a browser.
  3. Open a pull request on GitHub for review.
  4. Merge into `main` **only after approval**. That publishes the site.
  5. Run the tests in section 6 on the live site.
- If something breaks after publishing, revert the merge on `main`. That publishes the previous version again.

## 5. Supabase and the form

- This work doesn't change Supabase at all. The new pages don't connect to Supabase.
- The form code in `index.html` isn't edited.
- After publishing, `AGENTS.md` requires one test message through the live form to confirm it still reaches the `messages` table:
  - Send it with the name **`TEST – Claude`** and the message **`رسالة اختبار بعد نشر صفحة الاختبار والدرس – يمكن تجاهلها`**, so it's easy to tell apart from real messages.
  - It also sends one email to Asmaa through Web3Forms.
  - The table only allows inserts, so the page can't read the message back. Check that it arrived in the **Supabase dashboard (Table Editor → messages)**, or through the Supabase connection once it reconnects.
  - The test row is not deleted unless the owner asks.

## 6. Tests

Run each test on a phone screen and on a computer.

**Home page**
1. The home page looks exactly as before, except for the two new buttons.
2. The "quiz" and "lesson" buttons open `/quiz` and `/lesson`.

**Quiz (`/quiz`)**
3. The page opens directly at `/quiz` (and `/quiz.html`) without a 404.
4. All 10 questions appear in order, and the progress indicator updates.
5. Answering 0–3, 4–7 and 8–10 correctly gives the right result each time. Check the edge scores: 3, 4, 7 and 8.
6. The result's WhatsApp button opens chat with 01212234806 (`wa.me/201212234806`), with the result in the message.
7. "Retake the quiz" starts over from question 1.
8. A page refresh doesn't break anything, and nothing is sent to any server (checked in the browser's Network tab).

**Lesson (`/lesson`)**
9. The page opens directly at `/lesson` without a 404.
10. The 🔊 button speaks the letter or word in a German voice in Chrome on Android, Safari on iPhone, and Chrome on a computer.
11. On a device without a German voice, the 🔊 buttons are hidden and the text still reads correctly.
12. The "Test your level" button leads to `/quiz`.

**General**
13. Sharing the `/quiz` and `/lesson` links on WhatsApp shows the right title and image.
14. The pages read correctly from right to left, and German words show in the right direction inside Arabic sentences.
15. No content appears that Asmaa hasn't approved.
16. Contact form: the test message in section 5 reaches the `messages` table, and the existing messages are still there.

## 7. Risks and open questions

**Decided (2026-10-29):**
- **Home page buttons:** under the hero button, labelled "اختبر مستواك في الألماني" and "درس مجاني: الحروف والنطق".
- **Where the content is recorded:** a new section in `info.md` ("المحتوى المجاني على الموقع") describes both pages and their review status.
- **Course recommendations:** the results say "A1 course" and "A2 course".
- **Page links:** links use `quiz.html` and `lesson.html` so they work both locally and on Cloudflare. Cloudflare serves them at `/quiz` and `/lesson`.

**Risks:**
- **Computer voices** vary between devices, and some Android phones have no German voice installed. 🔊 may not work for everyone. Mitigation: hide the buttons when there's no voice.
- **Content accuracy:** Claude drafts the questions and the lesson, so a mistake is possible until Asmaa reviews them.
- **Supabase connection:** it's failing in this Claude session, so the form check (test 16) may need to be done by hand in the Supabase dashboard.
- **Publishing:** merging into `main` goes live immediately. Cloudflare branch preview builds failed for PR #2, even though `main` builds fine, so there is no working preview site. A push to `main` also publishes to a second Worker (`germancoursesss`) and to GitHub Pages.
- **Email copy of form messages:** in the live test, Web3Forms answered 403 to the automated browser, so no email was sent for that test. Supabase saved the message (201). It's still unconfirmed whether emails reach Asmaa from a normal phone or browser.
- **Duplicate style rules:** copying the styles into each page means a future colour or font change has to be made in three files.
- **Outdated copy:** `Downloads\Agent.md\GermanCourses.md\md` is an older version of `info.md` (in-person only, with areas listed). It is ignored, and the project's `info.md` is the reference.
