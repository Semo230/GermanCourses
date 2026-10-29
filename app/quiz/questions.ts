// Quiz content: approved by Frau Asmaa and published on 2026-10-29 (see info.md).
// Any new or changed question needs her approval again before publishing.
// In "text", German goes inside [[...]] so it is shown left-to-right in red.
export type Question = {
  text: string;
  optionsLang: "ar" | "de";
  options: string[];
  answer: number;
  explain: string;
};

export const QUESTIONS: Question[] = [
  {
    text: "يعني إيه [[Guten Morgen]]؟",
    optionsLang: "ar",
    options: ["مساء الخير", "صباح الخير", "مع السلامة", "تصبحوا على خير"],
    answer: 1,
    explain: "Morgen = الصبح، فـ Guten Morgen = صباح الخير.",
  },
  {
    text: "كمّلوا الجملة: [[Ich ___ Mona.]]",
    optionsLang: "de",
    options: ["heißt", "heißen", "heiße", "heiß"],
    answer: 2,
    explain: "مع ich الفعل بياخد ‎-e في الآخر: Ich heiße Mona.",
  },
  {
    text: "حد سألكم [[Wie alt bist du?]] تردّوا بإيه؟",
    optionsLang: "de",
    options: ["Ich komme aus Ägypten.", "Ich bin 14 Jahre alt.", "Ich heiße Ali.", "Mir geht's gut."],
    answer: 1,
    explain: "Wie alt bist du? = عندك كام سنة؟ والرد: Ich bin 14 Jahre alt.",
  },
  {
    text: "اختاروا أداة التعريف الصح: [[___ Buch ist neu.]]",
    optionsLang: "de",
    options: ["Das", "Der", "Die", "Den"],
    answer: 0,
    explain: "كلمة Buch (كتاب) محايدة، فبنقول: das Buch.",
  },
  {
    text: "كمّلوا الجملة: [[Wir ___ in Kairo.]]",
    optionsLang: "de",
    options: ["wohnt", "wohne", "wohnst", "wohnen"],
    answer: 3,
    explain: "مع wir الفعل بيرجع لأصله: wir wohnen.",
  },
  {
    text: "كمّلوا الجملة: [[Ich habe ___ Bruder.]]",
    optionsLang: "de",
    options: ["ein", "einen", "eine", "einer"],
    answer: 1,
    explain: "Bruder مذكر، وبعد haben بيبقى مفعول به (Akkusativ)، فـ ein بتبقى einen.",
  },
  {
    text: "جمع كلمة [[das Kind]] (طفل) هو:",
    optionsLang: "de",
    options: ["die Kinds", "die Kinde", "die Kinder", "die Kindern"],
    answer: 2,
    explain: "das Kind ← die Kinder.",
  },
  {
    text: "اختاروا كلمة السؤال الصح: [[___ fährst du am Wochenende? – Nach Alexandria.]]",
    optionsLang: "de",
    options: ["Wohin", "Woher", "Wo", "Wann"],
    answer: 0,
    explain: "الرد Nach Alexandria (لإسكندرية)، يعني السؤال عن المكان اللي رايحين له: Wohin.",
  },
  {
    text: "كمّلوا الجملة: [[Gestern ___ ich ins Kino gegangen.]]",
    optionsLang: "de",
    options: ["habe", "bin", "war", "hat"],
    answer: 1,
    explain: "gehen في الماضي التام (Perfekt) بييجي مع sein: ich bin gegangen.",
  },
  {
    text: "كمّلوا الجملة: [[Ich komme nicht, ___ ich krank bin.]]",
    optionsLang: "de",
    options: ["denn", "aber", "weil", "und"],
    answer: 2,
    explain: "بعد weil الفعل بيروح آخر الجملة: weil ich krank bin.",
  },
];
