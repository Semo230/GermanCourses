- Deutsch mit Asmaa. المعلومات في info.md، وما تخترعش غيرها. أي محتوى تعليمي جديد (أسئلة، دروس) لازم Frau Asmaa توافق عليه قبل ما يتنشر.
- الموقع Next.js 16 (App Router) على Cloudflare Workers عن طريق OpenNext، والطلبة بيعملوا حسابات بـ Supabase Auth، والإيميلات من Gmail بتاع Frau Asmaa (`SPEC-2.md`، ADRs 0004–0007). من غير Clerk ولا Resend.
- كل push على main بيتبني ويتنشر لوحده على Cloudflare Workers (مش Pages): `germancourses` ده الموقع الرسمي https://germancourses.asmaaabdelhamidm.workers.dev/، وكمان `germancoursesss`. بيلد الاتنين لازم يكون `opennextjs-cloudflare build` ومعاه `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`، وGitHub Pages لازم يفضل مقفول (ما بيعرفش يشغّل Next.js). ما تعملش push على main من غير موافقة.
- بيلدات الـ preview على Cloudflare للفروع التانية فشلت (PR #2) مع إن main بيتبني عادي، فما تعتمدش عليها للاختبار. جرّب محليًا: `npm run dev`، و`npm run preview` (نسخة Workers محلية).
- الصفحات: `/` و`/quiz` و`/lesson`، والحسابات `/signup` و`/login` و`/account`، والحجز `/book/<id>`، ولوحة التحكم `/admin`. الروابط القديمة `quiz.html` و`lesson.html` بتتحوّل في `next.config.ts`.
- الألوان والخطوط في `app/globals.css`، ونظام التصميم في `DESIGN.md`.
- `proxy.ts` بيبعت اللي مش عامل تسجيل دخول لصفحة الدخول، ولوحة التحكم بتتأكد من الأدمن في `app/admin/layout.tsx`. الأدمن هو الحساب اللي `app_metadata.role = 'admin'`، وده بيتحط بـ SQL بس.
- الفورم بيحفظ في جدول messages على Supabase (المفتاح العام بيضيف بس، ما بيقراش) وبيبعت إيميل بـ Web3Forms. الرسالة بتظهر "وصلت" لو واحد بس منهم نجح، فاتأكد من الاتنين.
- ما تعدّلش ولا تمسح رسايل حقيقية في جدول messages، وما تحطش أي secret key في الكود. الكود بيستخدم المفتاح العام بس، والمفاتيح السرية في أسرار Edge Functions على Supabase بس.
- بعد أي تعديل على الصفحة الرئيسية أو الفورم: ابعت رسالة من الفورم على الموقع الرسمي باسم "TEST – Claude"، واتأكد إن Supabase رجّع 201 وإن الرسالة ظاهرة في Supabase dashboard ← Table Editor ← messages.

- قاعدة البيانات: كل تغيير migration جديد في `supabase/migrations/` (بيضيف بس، ما بيمسحش)، ويتجرّب على مشروع التجارب الأول. Edge Functions في `supabase/functions/`.
- مشروع Supabase للتجارب منفصل عن الموقع الرسمي، والتيستات ما تشتغلش أبدًا على المشروع الرسمي `twvrftjwwwiliywjdtjo`. بيانات مشروع التجارب في `.env` (متسجّل في `.gitignore`، وما يتعملوش commit): `SUPABASE_TEST_PROJECT_REF`، `SUPABASE_TEST_URL`، `SUPABASE_TEST_PUBLISHABLE_KEY`، `SUPABASE_TEST_ADMIN_EMAIL`، `SUPABASE_TEST_ADMIN_PASSWORD`، وطالبين تجربة `SUPABASE_TEST_STUDENT_A_*` و`SUPABASE_TEST_STUDENT_B_*`. `.env.local` (لـ `npm run dev`) بيشاور على مشروع التجارب برضه. لو محتاج تعمله من الأول: `bash scripts/wizard-test-supabase.sh`.
- قبل أي commit: `npm run typecheck` و`node scripts/test-security.mjs` (لازم كله PASS).

## Agent skills

### Issue tracker

التذاكر على GitHub Issues في Semo230/GermanCourses، وبنستخدم `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

الـ labels الخمسة الافتراضية: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` و`docs/adr/` في جذر المشروع، وبيتعملوا لما نحتاجهم بس. See `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
