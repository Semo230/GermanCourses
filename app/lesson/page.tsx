import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero, SiteEnd } from "@/app/_components/site";
import { WhatsAppIcon, whatsappLink } from "@/app/_components/whatsapp";
import { AudioNote, LessonAudio, Say } from "./lesson-player";
import "./lesson.css";

export const metadata: Metadata = {
  title: "درس مجاني: الحروف والنطق في الألماني | Deutsch mit Asmaa",
  description:
    "درس مجاني من Deutsch mit Asmaa: اتعلّموا الحروف الألمانية ونطقها، و ä ö ü ß، والأصوات اللي بتلخبط المتعلمين العرب، واسمعوا النطق بنفسكم.",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/lesson",
    title: "درس مجاني: الحروف والنطق في الألماني | Deutsch mit Asmaa",
    description: "اتعلّموا الحروف الألمانية ونطقها، واسمعوا كل حرف وكلمة بنفسكم.",
    images: [{ url: "/images/cover.jpg", width: 669, height: 458 }],
  },
};

// Lesson content: approved by Frau Asmaa and published on 2026-10-29 (see info.md).
// Any new or changed lesson text needs her approval again before publishing.

const LETTERS = [
  { letter: "A", name: "آ", word: "Apfel", meaning: "تفاحة" },
  { letter: "B", name: "بيه", word: "Ball", meaning: "كورة" },
  { letter: "C", name: "تسيه", word: "Computer", meaning: "كمبيوتر" },
  { letter: "D", name: "ديه", word: "Dach", meaning: "سقف" },
  { letter: "E", name: "إيه", word: "Elefant", meaning: "فيل" },
  { letter: "F", name: "إف", word: "Fisch", meaning: "سمكة" },
  { letter: "G", name: "جيه (ج مصرية)", word: "Garten", meaning: "جنينة" },
  { letter: "H", name: "ها", word: "Haus", meaning: "بيت" },
  { letter: "I", name: "إي", word: "Igel", meaning: "قنفد" },
  { letter: "J", name: "يوت", word: "Jahr", meaning: "سنة" },
  { letter: "K", name: "كا", word: "Katze", meaning: "قطة" },
  { letter: "L", name: "إل", word: "Lampe", meaning: "لمبة" },
  { letter: "M", name: "إم", word: "Mutter", meaning: "أم" },
  { letter: "N", name: "إن", word: "Nase", meaning: "مناخير" },
  { letter: "O", name: "أو", word: "Obst", meaning: "فاكهة" },
  { letter: "P", name: "پيه", word: "Papa", meaning: "بابا" },
  { letter: "Q", name: "كو", word: "Qualle", meaning: "قنديل البحر" },
  { letter: "R", name: "إر", word: "Rose", meaning: "وردة" },
  { letter: "S", name: "إس", word: "Sonne", meaning: "شمس" },
  { letter: "T", name: "تيه", word: "Tisch", meaning: "ترابيزة" },
  { letter: "U", name: "أوو", word: "Uhr", meaning: "ساعة" },
  { letter: "V", name: "فاو", word: "Vogel", meaning: "عصفورة" },
  { letter: "W", name: "ڤيه", word: "Wasser", meaning: "مية" },
  { letter: "X", name: "إكس", word: "Xylofon", meaning: "إكسيليفون" },
  { letter: "Y", name: "إپسيلون", word: "Yoga", meaning: "يوجا" },
  { letter: "Z", name: "تسيت", word: "Zug", meaning: "قطر" },
];

const PRACTICE = [
  { word: "Hallo", meaning: "أهلاً" },
  { word: "Danke", meaning: "شكرًا" },
  { word: "Bitte", meaning: "من فضلك" },
  { word: "Tschüss", meaning: "باي" },
  { word: "Entschuldigung", meaning: "لو سمحت / آسف" },
  { word: "Deutschland", meaning: "ألمانيا" },
];

export default function LessonPage() {
  return (
    <div className="lesson-page">
      <InnerHero title="درس مجاني: الحروف والنطق">
        <p>اتعلّموا تنطقوا الحروف الألمانية صح، واسمعوا كل حرف وكلمة بنفسكم.</p>
      </InnerHero>

      <LessonAudio>
        <main className="container">
          <AudioNote>
            جهازكم مفيهوش صوت ألماني، فالنطق مكتوب بالحروف العربية بس. جرّبوا تفتحوا الصفحة من متصفح Chrome أو Safari عشان تسمعوا النطق.
          </AudioNote>

          <section>
            <h2>الحروف الألمانية</h2>
            <p className="section-intro">
              الألماني فيه نفس الـ 26 حرف بتوع الإنجليزي، بس بيتنطقوا بطريقة مختلفة. اضغطوا على الحرف أو الكلمة عشان تسمعوا النطق 🔊
            </p>
            <ul className="letters">
              {LETTERS.map(({ letter, name, word, meaning }) => (
                <li key={letter}>
                  <Say className="say-letter" say={letter}>{`${letter} ${letter.toLowerCase()}`}</Say>
                  <div className="name">{name}</div>
                  <Say className="say-word">{word}</Say>
                  <div className="meaning">{meaning}</div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>الحروف الخاصة بالألماني</h2>
            <p className="section-intro">
              الحروف دي مش موجودة في الإنجليزي: النقطتين فوق الحرف اسمهم <bdi lang="de">Umlaut</bdi>.
            </p>
            <ul className="sounds">
              <li>
                <Say className="say-letter" say="Ä">Ä ä</Say>
                <div className="tip">زي «إيه» بس الصوت مفتوح شوية.</div>
                <div className="example">مثال: <Say>Mädchen</Say> = بنت</div>
              </li>
              <li>
                <Say className="say-letter" say="Ö">Ö ö</Say>
                <div className="tip">قولوا «إيه» وانتو مدوّرين شفايفكم.</div>
                <div className="example">مثال: <Say>schön</Say> = حلو</div>
              </li>
              <li>
                <Say className="say-letter" say="Ü">Ü ü</Say>
                <div className="tip">قولوا «إي» وانتو مدوّرين شفايفكم كأنكم هتقولوا «أو».</div>
                <div className="example">مثال: <Say>Tür</Say> = باب</div>
              </li>
              <li>
                <Say className="say-letter" say="ß">ß</Say>
                <div className="tip">اسمه <bdi lang="de">Eszett</bdi>، وبيتنطق «س» قوية زي <bdi lang="de">ss</bdi>.</div>
                <div className="example">مثال: <Say>Straße</Say> = شارع</div>
              </li>
            </ul>
          </section>

          <section>
            <h2>أصوات مهمة</h2>
            <p className="section-intro">الحروف دي لما تيجي مع بعض بتعمل صوت مختلف، وهي اللي بتلخبط أغلب المتعلمين.</p>
            <ul className="sounds">
              <li>
                <span className="say-letter" lang="de">ch</span>
                <div className="tip">بعد <bdi lang="de">a / o / u</bdi> بتتنطق «خ».</div>
                <div className="example">مثال: <Say>Buch</Say> = كتاب</div>
              </li>
              <li>
                <span className="say-letter" lang="de">ch</span>
                <div className="tip">بعد <bdi lang="de">e / i / ä / ö / ü</bdi> بتتنطق «ش» خفيفة جدًا، زي الهمس.</div>
                <div className="example">مثال: <Say>ich</Say> = أنا</div>
              </li>
              <li>
                <span className="say-letter" lang="de">sch</span>
                <div className="tip">بتتنطق «ش».</div>
                <div className="example">مثال: <Say>Schule</Say> = مدرسة</div>
              </li>
              <li>
                <span className="say-letter" lang="de">ei</span>
                <div className="tip">بتتنطق «آي».</div>
                <div className="example">مثال: <Say>nein</Say> = لأ</div>
              </li>
              <li>
                <span className="say-letter" lang="de">ie</span>
                <div className="tip">بتتنطق «إي» طويلة.</div>
                <div className="example">مثال: <Say>vier</Say> = أربعة</div>
              </li>
              <li>
                <span className="say-letter" lang="de">eu / äu</span>
                <div className="tip">بتتنطق «أوي».</div>
                <div className="example">مثال: <Say>Deutsch</Say> = ألماني</div>
              </li>
              <li>
                <span className="say-letter" lang="de">w</span>
                <div className="tip">بتتنطق «ڤ»، مش «و».</div>
                <div className="example">مثال: <Say>Welt</Say> = عالم</div>
              </li>
              <li>
                <span className="say-letter" lang="de">v</span>
                <div className="tip">غالبًا بتتنطق «ف».</div>
                <div className="example">مثال: <Say>Vater</Say> = أب</div>
              </li>
              <li>
                <span className="say-letter" lang="de">z</span>
                <div className="tip">بتتنطق «تس».</div>
                <div className="example">مثال: <Say>Zeit</Say> = وقت</div>
              </li>
              <li>
                <span className="say-letter" lang="de">j</span>
                <div className="tip">بتتنطق «ي».</div>
                <div className="example">مثال: <Say>ja</Say> = أيوه</div>
              </li>
              <li>
                <span className="say-letter" lang="de">s</span>
                <div className="tip">قبل حرف متحرك بتتنطق «ز».</div>
                <div className="example">مثال: <Say>sieben</Say> = سبعة</div>
              </li>
              <li>
                <span className="say-letter" lang="de">st / sp</span>
                <div className="tip">في أول الكلمة بتتنطق «شت» و«شپ».</div>
                <div className="example">مثال: <Say>Stadt</Say> = مدينة، <Say>Sport</Say> = رياضة</div>
              </li>
              <li>
                <span className="say-letter" lang="de">r</span>
                <div className="tip">بتطلع من الزور، قريبة من «غ» خفيفة.</div>
                <div className="example">مثال: <Say>rot</Say> = أحمر</div>
              </li>
            </ul>
          </section>

          <section>
            <h2>جرّبوا تقولوا</h2>
            <p className="section-intro">اسمعوا الكلمات دي وقولوها بصوت عالي.</p>
            <ul className="practice">
              {PRACTICE.map(({ word, meaning }) => (
                <li key={word}>
                  <Say>{word}</Say> <span className="meaning">{meaning}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="cta">
              <h2>عايزين تكمّلوا؟</h2>
              <p>اعرفوا مستواكم في الألماني في دقيقتين، أو كلّمونا على واتساب عشان تعرفوا تفاصيل الكورسات.</p>
              <div className="cta-buttons">
                <Link className="main-btn" href="/quiz">
                  اختبر مستواك في الألماني
                </Link>
                <a className="wa-btn" href={whatsappLink("أهلاً، عندي استفسار عن دروس اللغة الألمانية.")} target="_blank" rel="noopener">
                  <WhatsAppIcon />
                  واتساب
                </a>
              </div>
            </div>
          </section>
        </main>
      </LessonAudio>

      <SiteEnd />
    </div>
  );
}
