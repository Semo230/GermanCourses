"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Pronunciation uses the browser's built-in German voice (Web Speech API) - no audio files.

// Prefer German from Germany over Austrian or Swiss, then a voice installed on the device
// over an online one. Any German voice is still better than none.
function voiceScore(v: SpeechSynthesisVoice) {
  const lang = v.lang.toLowerCase().replace("_", "-");
  if (!lang.startsWith("de")) return 0;
  return 1 + (lang === "de-de" ? 4 : 0) + (v.localService ? 2 : 0);
}

// Chrome and Edge often drop a sound started right after cancelling one that was playing,
// which left the letters silent after the first click. So wait a moment after cutting off a
// playing sound, and retry once if a sound still has not started.
const AFTER_CANCEL_MS = 150; // pause between cutting off a sound and starting the next
const RETRY_AFTER_MS = 2500; // how long a sound may take to start before one retry

type LessonAudioValue = {
  noteVisible: boolean;
  speak: (text: string) => void;
};

const LessonAudioContext = createContext<LessonAudioValue>({ noteVisible: false, speak: () => {} });

/** Finds the German voice for the 🔊 buttons; hides the icons (.no-audio) until there is one. */
export function LessonAudio({ children }: { children: React.ReactNode }) {
  const germanVoice = useRef<SpeechSynthesisVoice | null>(null);
  const latestRequestId = useRef(0);
  const [hasVoice, setHasVoice] = useState(false);
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;

    function findGermanVoice() {
      if (!synth || germanVoice.current) return;
      let best: SpeechSynthesisVoice | null = null;
      for (const v of synth.getVoices()) {
        if (voiceScore(v) > (best ? voiceScore(best) : 0)) best = v;
      }
      germanVoice.current = best;
      if (best) setHasVoice(true);
    }

    if (synth) {
      findGermanVoice();
      synth.addEventListener("voiceschanged", findGermanVoice);
    }

    // Voices load late on some browsers, so wait before telling the visitor there is none.
    const timer = setTimeout(() => setWaited(true), 2500);

    return () => {
      synth?.removeEventListener("voiceschanged", findGermanVoice);
      clearTimeout(timer);
      // Leaving the page stops the sound, as the old page did when it unloaded.
      latestRequestId.current++;
      synth?.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    const voice = germanVoice.current;
    if (!voice) return;

    const play = (requestId: number, isRetry: boolean) => {
      if (requestId !== latestRequestId.current) return; // a newer click took over
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.8;
      let started = false;
      utterance.addEventListener("start", () => {
        started = true;
      });
      synth.speak(utterance);
      if (isRetry) return;
      setTimeout(() => {
        // Some browsers play without firing "start"; if anything is speaking, don't play it twice.
        if (started || synth.speaking || requestId !== latestRequestId.current) return;
        synth.cancel();
        setTimeout(() => play(requestId, true), AFTER_CANCEL_MS);
      }, RETRY_AFTER_MS);
    };

    const requestId = ++latestRequestId.current;
    const busy = synth.speaking || synth.pending;
    synth.cancel(); // also resets a voice stuck from earlier (Edge on Windows)
    if (busy) setTimeout(() => play(requestId, false), AFTER_CANCEL_MS);
    else play(requestId, false);
  }, []);

  const value = useMemo(() => ({ noteVisible: waited && !hasVoice, speak }), [waited, hasVoice, speak]);

  return (
    <LessonAudioContext value={value}>
      <div className={hasVoice ? undefined : "no-audio"}>{children}</div>
    </LessonAudioContext>
  );
}

/** Shown when the device still has no German voice after a short wait. */
export function AudioNote({ children }: { children: React.ReactNode }) {
  const { noteVisible } = useContext(LessonAudioContext);
  return (
    <p className="audio-note" id="audio-note" hidden={!noteVisible}>
      {children}
    </p>
  );
}

/** Listen button: letters speak `say`, words speak their own text without the icon. */
export function Say({ children, say, className }: { children: string; say?: string; className?: string }) {
  const { speak } = useContext(LessonAudioContext);
  const text = say || children.trim();
  return (
    <button
      className={className ? `say ${className}` : "say"}
      type="button"
      data-say={say}
      lang="de"
      aria-label={"اسمعوا نطق " + text}
      onClick={() => speak(text)}
    >
      {children} <span className="icon" aria-hidden="true">🔊</span>
    </button>
  );
}
