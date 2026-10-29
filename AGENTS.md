- Deutsch mit Asmaa. المعلومات في info.md، وما تخترعش غيرها. أي محتوى تعليمي جديد (أسئلة، دروس) لازم Frau Asmaa توافق عليه قبل ما يتنشر.
- كل push على main بيتنشر لوحده على Cloudflare Workers (مش Pages): `germancourses` ده الموقع الرسمي https://germancourses.asmaaabdelhamidm.workers.dev/، وكمان على `germancoursesss` وعلى GitHub Pages. ما تعملش push على main من غير موافقة.
- بيلدات الـ preview على Cloudflare للفروع التانية فشلت (PR #2) مع إن main بيتبني عادي، فما تعتمدش عليها للاختبار.
- الروابط بين الصفحات بامتداد `.html` (زي `quiz.html`) عشان تشتغل على GitHub Pages ومحليًا؛ Cloudflare بيحوّلها لـ `/quiz`.
- quiz.html وlesson.html فيهم نسخة من CSS بتاع index.html: أي تغيير في الألوان أو الخط يتعمل في التلات ملفات.
- الفورم بيحفظ في جدول messages على Supabase (المفتاح العام بيضيف بس، ما بيقراش) وبيبعت إيميل بـ Web3Forms. الرسالة بتظهر "وصلت" لو واحد بس منهم نجح، فاتأكد من الاتنين.
- ما تعدّلش ولا تمسح رسايل حقيقية في جدول messages، وما تحطش أي secret key في الكود.
- بعد أي تعديل على index.html أو الفورم: ابعت رسالة من الفورم على الموقع الرسمي باسم "TEST – Claude"، واتأكد إن Supabase رجّع 201 وإن الرسالة ظاهرة في Supabase dashboard ← Table Editor ← messages.

## Agent skills

### Issue tracker

التذاكر على GitHub Issues في Semo230/GermanCourses، وبنستخدم `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

الـ labels الخمسة الافتراضية: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` و`docs/adr/` في جذر المشروع، وبيتعملوا لما نحتاجهم بس. See `docs/agents/domain.md`.
