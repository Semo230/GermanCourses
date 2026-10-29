"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { WhatsAppIcon, whatsappLink } from "@/app/_components/whatsapp";
import { QUIZ_RESULTS, quizResultFor } from "@/lib/labels";
import { QUESTIONS } from "./questions";
import { saveQuizResult } from "./actions";

// Renders Arabic text with [[German]] parts wrapped in <bdi lang="de">.
function MixedText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[\[.*?\]\])/).map((part, i) =>
        part.startsWith("[[") ? <bdi key={i} lang="de">{part.slice(2, -2)}</bdi> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

type SaveState = "saving" | "saved" | "failed";

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [save, setSave] = useState<SaveState>("saving");
  const questionRef = useRef<HTMLParagraphElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const q = QUESTIONS[current];
  const answered = chosen !== null;
  const isCorrect = chosen === q.answer;

  useEffect(() => {
    if (answered) nextRef.current?.focus();
  }, [answered]);

  useEffect(() => {
    if (finished) resultRef.current?.focus();
  }, [finished]);

  function choose(i: number) {
    if (answered) return;
    setChosen(i);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
      setChosen(null);
      requestAnimationFrame(() => questionRef.current?.scrollIntoView({ block: "nearest" }));
    } else {
      setFinished(true);
      setSave("saving");
      saveQuizResult(score)
        .then((r) => setSave(r.ok ? "saved" : "failed"))
        .catch(() => setSave("failed"));
    }
  }

  function restart() {
    setCurrent(0);
    setScore(0);
    setChosen(null);
    setFinished(false);
  }

  const result = QUIZ_RESULTS[quizResultFor(score)];
  const waMessage =
    "أهلاً، عملت اختبار المستوى على صفحة Deutsch mit Asmaa وجبت " + score +
    " من " + QUESTIONS.length + " (" + result.title + "). عايز أعرف تفاصيل كورس " + result.course + ".";

  return (
    <div className="card" id="quiz" aria-live="polite">
      {!finished ? (
        <div id="question-view">
          <div className="progress-label">
            <span>سؤال {current + 1} من {QUESTIONS.length}</span>
            <span>الإجابات الصح: {score}</span>
          </div>
          <div className="progress" aria-hidden="true">
            <span style={{ width: (current / QUESTIONS.length) * 100 + "%" }} />
          </div>
          <p className="question" ref={questionRef}><MixedText text={q.text} /></p>
          <ul className="options" key={current}>
            {q.options.map((option, i) => {
              const state = answered && i === q.answer ? " correct" : answered && i === chosen ? " wrong" : "";
              return (
                <li key={i}>
                  <button
                    type="button"
                    className={"option" + state}
                    lang={q.optionsLang === "de" ? "de" : undefined}
                    disabled={answered}
                    onClick={() => choose(i)}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
          {answered && (
            <div className={"feedback " + (isCorrect ? "correct" : "wrong")}>
              <strong>{isCorrect ? "إجابة صح! 👏" : "مش مظبوطة، الإجابة الصح: " + q.options[q.answer]}</strong>
              {q.explain}
            </div>
          )}
          <div className="next-row">
            {answered && (
              <button ref={nextRef} className="main-btn" type="button" onClick={next}>
                {current === QUESTIONS.length - 1 ? "شوفوا النتيجة" : "السؤال اللي بعده"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div id="result-view" className="result" tabIndex={-1} ref={resultRef}>
          <div className="score">
            <span>{score}</span>
            <small> / {QUESTIONS.length}</small>
          </div>
          <h2>{result.title}</h2>
          <p>{result.text}</p>
          <p className={"saved-note" + (save === "failed" ? " failed" : "")} role="status">
            {save === "saving" && "جارٍ حفظ النتيجة في حسابكم…"}
            {save === "saved" && <>اتحفظت النتيجة في <Link href="/account" className="underline">حسابكم</Link>.</>}
            {save === "failed" && "ما قدرناش نحفظ النتيجة دلوقتي، بس تقدروا تبعتوها على واتساب."}
          </p>
          <a className="wa-btn" href={whatsappLink(waMessage)} target="_blank" rel="noopener">
            <WhatsAppIcon />
            ابعتوا نتيجتكم على واتساب
          </a>
          <div className="result-links">
            <button className="link-btn" type="button" onClick={restart}>أعيدوا الاختبار</button>
            <Link href="/lesson">درس مجاني: الحروف والنطق</Link>
            <Link href="/">الصفحة الرئيسية</Link>
          </div>
        </div>
      )}
    </div>
  );
}
