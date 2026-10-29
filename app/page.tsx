import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MODES, type Level, type Mode } from "@/lib/labels";
import { AccountLinks, SiteEnd } from "./_components/site";
import { ContactFormSection, Mascot, PeekObserver } from "./_components/home-client";
import { WhatsAppIcon, whatsappLink } from "./_components/whatsapp";
import "./_styles/home.css";

type Course = { id: string; name: string; level: Level; mode: Mode; description: string };

export default async function HomePage() {
  const supabase = await createClient();
  // Row-level security only returns visible courses (the admin sees hidden ones in /admin/courses).
  const { data } = await supabase
    .from("courses")
    .select("id, name, level, mode, description")
    .eq("visible", true)
    .order("level")
    .order("created_at");
  const courses = (data ?? []) as Course[];

  return (
    <div className="home">
      <header className="hero">
        <div className="container">
          <nav className="hero-account" aria-label="الحساب">
            <AccountLinks className="hero-account-link" />
          </nav>
          <Mascot />
          <h1 className="brand" translate="no">Deutsch mit Asmaa<span>Abd ElHamid</span></h1>
          <div className="teacher"><bdi translate="no">Frau Asmaa</bdi> | معلمة اللغة الألمانية</div>
          <p className="tagline">ابدأ رحلتك في اللغة الألمانية مع <bdi translate="no">Deutsch mit Asmaa</bdi>، وافهم الألماني خطوة بخطوة.</p>
          <div className="levels" aria-label="المستويات">
            <div className="level">A1</div>
            <div className="level">A2</div>
          </div>
          <a className="hero-cta" href="#contact">للاستفسار عن الأسعار والمواعيد</a>
          <div className="hero-links">
            <Link className="hero-link" href="/quiz">اختبر مستواك في الألماني</Link>
            <Link className="hero-link" href="/lesson">درس مجاني: الحروف والنطق</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <section>
          <h2>مين إحنا</h2>
          <div className="about">
            <img className="about-photo" src="/images/asmaa.jpg" width={720} height={985} loading="lazy"
                 alt="Frau Asmaa Abd ElHamid، معلمة اللغة الألمانية" />
            <div>
              <p><bdi translate="no">Frau Asmaa Abd ElHamid</bdi>، خريجة كلية الألسن بتقدير جيد جدًا، وحاصلة على الدبلوم العام التربوي.</p>
              <p>بنقدّم دروس لغة ألمانية حضوريًا وأونلاين للطلاب، مع الاهتمام بشرح القواعد والمفردات ومساعدة الطلاب على فهم اللغة والتدرّب عليها.</p>
            </div>
          </div>
        </section>

        <section className="has-peek">
          <img className="peek" src="/images/stickers/sticker-thinking.webp" width={305} height={400} alt="" loading="lazy" />
          <h2>لمين الدروس دي؟</h2>
          <ul className="services">
            <li>طلاب المدارس الحكومية التجريبية.</li>
            <li>طلاب المدارس الخاصة.</li>
            <li>طلاب المدارس الدولية.</li>
            <li>المتعلمين اللي عايزين يدرسوا مستوى <bdi>A1</bdi> أو <bdi>A2</bdi>.</li>
          </ul>
        </section>

        <section className="has-peek">
          <img className="peek" src="/images/stickers/sticker-notebook.webp" width={308} height={400} alt="" loading="lazy" />
          <h2>خدماتنا التعليمية</h2>
          <ul className="services">
            <li>دروس لغة ألمانية حضوريًا وأونلاين.</li>
            <li>كورسات لمستويات <bdi>A1</bdi> و<bdi>A2</bdi>.</li>
            <li>شرح القواعد والمفردات.</li>
            <li>التدريب على القراءة والفهم والتطبيق.</li>
            <li>شرح ومراجعة الدروس وفقًا لاحتياجات الطالب.</li>
          </ul>
        </section>

        {/* New in SPEC-2 (2.5): only shown once Frau Asmaa has made a course visible. */}
        {courses.length > 0 && (
          <section id="courses">
            <h2>الكورسات</h2>
            <ul className="courses">
              {courses.map((course) => (
                <li key={course.id} className="course">
                  <div className="course-head">
                    <h3>{course.name}</h3>
                    <span className="course-level">{course.level}</span>
                  </div>
                  <p className="course-mode">{MODES[course.mode]}</p>
                  {course.description && <p className="course-desc">{course.description}</p>}
                  <Link className="course-book" href={`/book/${course.id}`}>
                    احجز الكورس
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="contact" className="has-peek">
          <img className="peek" src="/images/stickers/sticker-thumbs-up.webp" width={302} height={400} alt="" loading="lazy" />
          <div className="contact">
            <h2>استفسروا عن التفاصيل</h2>
            <p>لمعرفة الأسعار والمواعيد والعنوان، تواصلوا معنا عبر واتساب.</p>
            <a className="phone" href="tel:01212234806">01212234806</a>
            <a className="wa-btn" href={whatsappLink()} target="_blank" rel="noopener">
              <WhatsAppIcon />
              واتساب
            </a>
            <p className="wa-note">زر مباشر لبدء المحادثة وإرسال استفساركم.</p>
            <figure className="wa-qr">
              <img src="/images/whatsapp-qr.svg" width={160} height={160} loading="lazy"
                   alt="كود QR للتواصل عبر واتساب على الرقم 01212234806" />
              <figcaption>أو امسحوا الكود بكاميرا الموبايل</figcaption>
            </figure>
            <ul className="contact-facts">
              <li><strong>نظام الدراسة:</strong> حضوري وأونلاين.</li>
              <li><strong>مكان الدروس:</strong> غير معلن، وبيتحدد عند التواصل والاستفسار.</li>
            </ul>
          </div>
        </section>

        <ContactFormSection />
      </main>

      <SiteEnd />
      <PeekObserver />
    </div>
  );
}
