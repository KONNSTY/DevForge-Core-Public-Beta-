"use client";

import { useParams, useRouter } from "next/navigation";
import { getLessonById, getAdjacentLessons, getLocalizedLessonContent } from "@/lib/curriculum";
import { Playground } from "@/components/playground";
import { LessonPractice } from "@/components/lesson-practice";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/components/language-context";
import { SeniorThoughtLog } from "@/components/senior-thought-log";
import { useRecruiterMode } from "@/components/recruiter-mode-context";
import { ArrowLeft, ArrowRight, Brain, Sparkles, Target, CheckCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { progress, markLessonComplete } = useProgress();
  const { locale, t } = useLanguage();
  const { isRecruiterMode } = useRecruiterMode();
  
  const lessonId = params.lessonId as string;
  const lesson = getLessonById(lessonId);
  const { prevLesson, nextLesson, currentTrack } = getAdjacentLessons(lessonId);

  const [showJargon, setShowJargon] = useState(false);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Lektion nicht gefunden</h1>
        <p className="text-muted-foreground mb-6">Diese Lektion existiert nicht oder wurde verschoben.</p>
        <button 
          onClick={() => router.push('/tracks')} 
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90"
        >
          {t("curriculum")}
        </button>
      </div>
    );
  }

  // Localized content for current language (DE, EN, ID, ZH, KO, JA)
  const localized = getLocalizedLessonContent(lesson, locale);

  const isCompleted = progress[lesson.track_id]?.completedLessons?.includes(lesson.lesson_id);

  const handleComplete = () => {
    markLessonComplete(lesson.track_id, lesson.lesson_id, lesson.xp);
  };

  const handleContinue = () => {
    handleComplete();
    router.push(
      nextLesson
        ? `/tracks/${nextLesson.track_id}/lessons/${nextLesson.lesson_id}`
        : "/tracks"
    );
  };

  // Derive initial language for playground
  let defaultLang: "html" | "css" | "javascript" | "csharp" | "python" = "html";
  let initialHtml = "<!-- Write your code here -->";
  let initialJs = "// JavaScript runtime logic";
  let initialCsharp = 'Console.WriteLine("Hello World");';
  let initialPython = 'print("Hello from Python")';

  if (lesson.interactive_challenge.runtime === "roslyn_csharp") {
    initialCsharp = lesson.interactive_challenge.starter_code;
    defaultLang = "csharp";
  } else if (lesson.interactive_challenge.runtime === "pyodide_python" || lesson.interactive_challenge.runtime === "python_server") {
    initialPython = lesson.interactive_challenge.starter_code;
    defaultLang = "python";
  } else {
    initialHtml = lesson.interactive_challenge.starter_code;
    if (lesson.interactive_challenge.runtime === "browser_sandbox" && lesson.interactive_challenge.starter_code.startsWith("//")) {
      initialJs = lesson.interactive_challenge.starter_code;
      defaultLang = "javascript";
    } else {
      defaultLang = "html";
    }
  }

  return (
    <div className="flex min-h-full flex-col overflow-visible pb-24 xl:flex-row xl:pb-0">
      {/* Left Column: Didactics, i18n & Senior ADR */}
      <div className="flex w-full flex-col justify-between border-r bg-card/20 p-3 sm:p-6 xl:w-5/12 xl:overflow-y-auto xl:p-8">
        <div className="space-y-6">
          {/* Top navigation row */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Link href="/tracks" className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft size={14} className="mr-1" /> {t("all_tracks")}
              </Link>
              {currentTrack && (
                <span className="text-xs font-medium text-muted-foreground truncate max-w-[200px]">
                  {currentTrack.localized_titles?.[locale]?.title || currentTrack.title}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <span className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                lesson.difficulty === 'beginner' ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20' : 
                lesson.difficulty === 'intermediate' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20' : 
                'bg-rose-500/15 text-rose-500 border border-rose-500/20'
              }`}>
                {lesson.difficulty}
              </span>
              <span className="text-xs text-muted-foreground font-mono font-semibold">
                +{lesson.xp} XP
              </span>
              {isCompleted && (
                <span className="inline-flex items-center space-x-1 text-xs text-emerald-500 font-semibold pl-2">
                  <CheckCircle size={14} />
                  <span>{t("completed")}</span>
                </span>
              )}
            </div>

            <h1 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">{localized.title}</h1>
            
            {/* 1. & 2. Kernidee & Warum brauche ich das? */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm leading-relaxed text-foreground">
              <div className="font-bold text-primary mb-1 flex items-center space-x-1.5">
                <span>💡 {t("everyday_analogy")}</span>
              </div>
              <p className="italic text-muted-foreground">
                &quot;{localized.coach_context}&quot;
              </p>
            </div>
          </div>

          {/* 3. Interaktives Mental Model & Erklärung */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-foreground font-bold text-lg">
              <Brain className="text-primary" size={20} />
              <h2>{t("mental_model")}</h2>
            </div>
            <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-code:text-primary prose-code:bg-muted/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded max-w-none text-sm leading-relaxed">
              <ReactMarkdown>{localized.mental_model_and_code}</ReactMarkdown>
            </div>
          </div>

          <LessonPractice lesson={lesson} />

          {/* Senior Engineering Thought Log (ADR) */}
          {lesson.senior_thought_log && isRecruiterMode && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <SeniorThoughtLog
                decision={lesson.senior_thought_log.decision}
                alternativesConsidered={lesson.senior_thought_log.alternativesConsidered}
                tradeoffs={lesson.senior_thought_log.tradeoffs}
                securityImplications={lesson.senior_thought_log.securityImplications}
              />
            </div>
          )}

          {/* 4. Fachbegriff-Dolmetscher (Jargon Buster zum Aufklappen) */}
          {localized.jargon_buster && localized.jargon_buster.length > 0 && (
            <div className="border border-border/60 rounded-xl overflow-hidden bg-card/40">
              <button
                onClick={() => setShowJargon(!showJargon)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
                aria-expanded={showJargon}
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle size={18} className="text-primary" />
                  <span className="font-bold text-xs sm:text-sm">{t("jargon_buster")}</span>
                </div>
                {showJargon ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {showJargon && (
                <div className="p-4 pt-0 space-y-3 border-t border-border/40 mt-1">
                  {localized.jargon_buster.map((jargon, idx) => (
                    <div key={idx} className="bg-background/60 p-3.5 rounded-lg border border-border/40 text-xs space-y-1.5">
                      <div className="font-bold text-sm text-foreground">{jargon.term}</div>
                      <div className="text-muted-foreground">
                        <span className="font-semibold text-primary">{t("interview_term")} </span>
                        {jargon.simple_analogy}
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{t("production_def")} </span>
                        {jargon.production_definition}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. KI-Power-Tipp */}
          {localized.ai_engineering_leverage && (
            <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
              <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                <Sparkles size={18} />
                <span>{t("ai_power_tip")}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-2">
                <div>
                  <span className="font-semibold text-foreground">{t("recommended_assistant")} </span>
                  <span className="font-mono text-primary">{localized.ai_engineering_leverage.assistant}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">{t("golden_prompt")}</div>
                  <pre className="p-3 rounded-md bg-black/50 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap border border-border/30">
                    {localized.ai_engineering_leverage.golden_prompt}
                  </pre>
                </div>
                <div>
                  <span className="font-semibold text-foreground">{t("verification_heuristic")} </span>
                  {localized.ai_engineering_leverage.verification_heuristic}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. Linearer 'Nächste Lektion' & Navigations-Block */}
        <div className="hidden pt-8 mt-8 border-t border-border/40 space-y-3 xl:block">
          <div className="flex items-center justify-between gap-4">
            {prevLesson ? (
              <Link
                href={`/tracks/${prevLesson.track_id}/lessons/${prevLesson.lesson_id}`}
                className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                <ArrowLeft size={14} />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{t("prev_lesson")}: {prevLesson.title}</span>
              </Link>
            ) : <div />}

            <button
              onClick={handleComplete}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                isCompleted 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {isCompleted ? `✓ ${t("completed")}` : t("complete_lesson")}
            </button>
          </div>

          {/* Prominenter 'Weiter'-Button wie an einer Perlenschnur */}
          {nextLesson ? (
            <Link
              href={`/tracks/${nextLesson.track_id}/lessons/${nextLesson.lesson_id}`}
              onClick={handleComplete}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg hover:opacity-95 transition-all text-sm group"
            >
              <span>{t("next_lesson")}: {nextLesson.title}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              href="/tracks"
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:opacity-95 transition-all text-sm"
            >
              <span>{t("all_lessons_done")}</span>
              <CheckCircle size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Right Column: 6. Deterministic Sandboxed Test Runner */}
      <div className="flex min-h-[540px] w-full flex-col border-t sm:min-h-[680px] xl:min-h-0 xl:w-7/12 xl:border-t-0">
        <div className="p-4 border-b bg-muted/20 flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Target className="text-primary" size={18} />
            <h2 className="text-base font-bold">{t("interactive_challenge")}</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {lesson.interactive_challenge.task_description}
          </p>
          {lesson.interactive_challenge.hints.length > 0 && (
            <details className="rounded-lg border border-border/60 px-3 py-2 text-xs">
              <summary className="cursor-pointer font-semibold text-primary">Hinweise auf Wunsch anzeigen</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {lesson.interactive_challenge.hints.map((hint) => <li key={hint}>{hint}</li>)}
              </ul>
            </details>
          )}
        </div>
        <div className="flex-1 overflow-hidden p-3 sm:p-4">
          <Playground 
            defaultLanguage={defaultLang}
            initialHtml={initialHtml}
            initialJs={initialJs}
            initialCsharp={initialCsharp}
            initialPython={initialPython}
            solutionCode={lesson.interactive_challenge.solution_code}
          />
        </div>
      </div>

      {/* Mobile navigation stays available after the exercise without forcing a long scroll back up. */}
      <nav
        aria-label="Lektionsnavigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 p-2 shadow-[0_-8px_24px_rgba(0,0,0,0.18)] backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-bottom xl:hidden"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleted}
            className={`min-w-0 flex-1 truncate rounded-lg border px-3 py-3 text-left text-xs font-bold transition-colors sm:text-sm ${
              isCompleted
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {isCompleted ? `✓ ${t("completed")}` : t("complete_lesson")}
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-3 text-xs font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 min-[400px]:px-4 sm:text-sm"
          >
            <span className="hidden min-[400px]:inline">
              {nextLesson ? t("next_lesson") : t("curriculum")}
            </span>
            <ArrowRight size={16} aria-hidden="true" />
            <span className="sr-only">{nextLesson ? t("next_lesson") : t("curriculum")}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
