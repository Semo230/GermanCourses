// Arabic labels for the values stored in the database (GLOSSARY.md).

export const STUDENT_GROUPS = {
  experimental: "طالب مدرسة تجريبية",
  private: "طالب مدرسة خاصة",
  international: "طالب مدرسة دولية",
  adult: "متعلم كبير",
} as const;
export type StudentGroup = keyof typeof STUDENT_GROUPS;

export const LEVELS = ["A1", "A2"] as const;
export type Level = (typeof LEVELS)[number];

export const MODES = {
  in_person: "حضوري",
  online: "أونلاين",
  both: "حضوري وأونلاين",
} as const;
export type Mode = keyof typeof MODES;

// Badge class per status: new = needs attention, progress = in hand, done = finished.
export const ORDER_STATUSES = {
  new: { label: "جديد", tone: "new" },
  contacted: { label: "اتواصلنا", tone: "progress" },
  enrolled: { label: "اتسجّل", tone: "done" },
  closed: { label: "مقفول", tone: "" },
} as const;
export type OrderStatus = keyof typeof ORDER_STATUSES;

export const MESSAGE_STATUSES = {
  new: { label: "جديدة", tone: "new" },
  replied: { label: "اتردّ عليها", tone: "done" },
} as const;
export type MessageStatus = keyof typeof MESSAGE_STATUSES;

export const ACCOUNT_STATUSES = {
  active: { label: "نشط", tone: "done" },
  unconfirmed: { label: "الإيميل لسه ما اتأكدش", tone: "progress" },
  invited: { label: "اتبعتت له دعوة، لسه ما قبلهاش", tone: "progress" },
} as const;
export type AccountStatus = keyof typeof ACCOUNT_STATUSES;

// Quiz results, score ranges from SPEC.md: 0-3, 4-7, 8-10.
export const QUIZ_RESULTS = {
  start: { title: "ابدأوا من الأول", text: "مفيش أي مشكلة! كورس A1 هيبدأ معاكم من الصفر، خطوة بخطوة.", course: "A1" },
  basics: { title: "عندكم أساسيات", text: "عندكم بداية كويسة. كمّلوا مستوى A1 عشان تثبّتوا القواعد والمفردات.", course: "A1" },
  ready_a2: { title: "جاهزين لـ A2", text: "مستواكم كويس جدًا في أساسيات A1، وتقدروا تبدأوا كورس A2.", course: "A2" },
} as const;
export type QuizResult = keyof typeof QUIZ_RESULTS;

export function quizResultFor(score: number): QuizResult {
  if (score <= 3) return "start";
  if (score <= 7) return "basics";
  return "ready_a2";
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo" }).format(
    new Date(iso),
  );
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Cairo",
  }).format(new Date(iso));
}

export const PHONE_PATTERN = /^\+?[0-9 ]{8,20}$/;
