"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/curriculum";

export function LessonPractice({ lesson }: { lesson: Lesson }) {
  const guide = lesson.learning_guide;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [exerciseDone, setExerciseDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const storageKey = `weblearn-practice-${lesson.lesson_id}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const value = JSON.parse(saved) as { answers?: Record<number, number>; exerciseDone?: boolean };
        // Browser-only progress is hydrated after the stable server render.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Read saved, local-only practice answers after hydration.
        setAnswers(value.answers ?? {});
        setExerciseDone(value.exerciseDone ?? false);
      }
    } catch {
      // Ignore corrupted local practice state; lesson access and content are unaffected.
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(storageKey, JSON.stringify({ answers, exerciseDone }));
  }, [answers, exerciseDone, hydrated, storageKey]);
  if (!guide) return null;

  return (
    <section className="space-y-5 rounded-xl border border-border/60 bg-card/40 p-4 sm:p-5" aria-labelledby="practice-title">
      <div>
        <h2 id="practice-title" className="text-lg font-bold">Lerncheck & Übung</h2>
        <p className="mt-1 text-xs text-muted-foreground">Etwa {guide.estimated_minutes} Minuten · {lesson.difficulty}</p>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Das lernst du</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {guide.learning_objectives.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Voraussetzungen</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {guide.prerequisites.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Häufige Fehler</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {guide.common_mistakes.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Wissenscheck</h3>
        {guide.questions.map((question, questionIndex) => (
          <fieldset key={question.prompt} className="space-y-2">
            <legend className="mb-2 text-sm">{question.prompt}</legend>
            {question.choices.map((choice, choiceIndex) => {
              const selected = answers[questionIndex];
              const answered = selected !== undefined;
              const correct = choiceIndex === question.answer;
              return (
                <button
                  type="button"
                  key={choice}
                  onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: choiceIndex }))}
                  aria-pressed={selected === choiceIndex}
                  className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    answered && correct ? "border-emerald-500/50 bg-emerald-500/10" :
                    selected === choiceIndex ? "border-rose-500/50 bg-rose-500/10" :
                    "border-border/60 hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >{choice}</button>
              );
            })}
            {answers[questionIndex] !== undefined && (
              <p role="status" className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <strong className={answers[questionIndex] === question.answer ? "text-emerald-500" : "text-amber-500"}>
                  {answers[questionIndex] === question.answer ? "Richtig. " : "Noch nicht. "}
                </strong>
                {question.explanation}
              </p>
            )}
          </fieldset>
        ))}
      </div>
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <h3 className="text-sm font-semibold">Praktische Aufgabe</h3>
        <p className="mt-1 text-sm text-muted-foreground">{guide.exercise}</p>
        <button
          type="button"
          aria-pressed={exerciseDone}
          onClick={() => setExerciseDone((done) => !done)}
          className={`mt-3 min-h-10 rounded-md border px-3 text-xs font-semibold ${exerciseDone ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" : "border-border/60 hover:border-primary/50"}`}
        >{exerciseDone ? "✓ Übung als erledigt gespeichert" : "Übung als erledigt markieren"}</button>
      </div>
      {guide.execution_note && <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">{guide.execution_note}</p>}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Quellen und Einordnung</h3>
        <ul className="space-y-1 text-xs text-muted-foreground">
          {guide.sources.map((source) => (
            <li key={source.url}><a className="text-primary underline-offset-2 hover:underline" href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>
          ))}
        </ul>
        {guide.beyond_cs50 && <p className="mt-2 text-xs text-amber-500">Ergänzender Lerninhalt: Dieses Thema erweitert den Umfang der genannten CS50-Kurse.</p>}
      </div>
    </section>
  );
}
