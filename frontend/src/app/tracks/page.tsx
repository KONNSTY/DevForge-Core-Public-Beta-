"use client";

import Link from "next/link";
import { getTracks, getLessonsForTrack, getLocalizedLessonContent, getFirstLesson } from "@/lib/curriculum";
import { CheckCircle, Circle, Sparkles, ArrowRight, GraduationCap } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/components/language-context";

export default function TracksPage() {
  const tracks = getTracks();
  const firstLesson = getFirstLesson();
  const { progress } = useProgress();
  const { locale, t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>{t("curriculum")} (Linear & Open)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("all_tracks")}</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
            Lerne den gesamten Stack – von Internet-Grundlagen bis zur industriellen KI-Orchestrierung. Alle Inhalte sind kostenlos und ohne Konto zugänglich.
          </p>
        </div>
        <Link
          href={firstLesson ? `/tracks/${firstLesson.track_id}/lessons/${firstLesson.lesson_id}` : "/tracks"}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow hover:opacity-90 transition-all text-sm shrink-0"
        >
          <span>{t("next_lesson")} 1</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <Link href="/courses" className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10">
        <GraduationCap size={16} />
        {t("cs50_courses")}
        <ArrowRight size={14} />
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-cyan-400/25 bg-cyan-400/5 px-4 py-3 text-sm">
        <span><strong>DevForge Core</strong> ist ein kostenloses Produkt von Polymath Productions / Regler Productions.</span>
        <a href="https://reglerproductions.com/preise.html" target="_blank" rel="noreferrer" className="font-bold text-cyan-300 hover:underline shrink-0">Polymath-Angebot ansehen →</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tracks.map((track) => {
          const trackLessons = getLessonsForTrack(track.id);
          const completedCount = trackLessons.filter(l => 
            progress[track.id]?.completedLessons?.includes(l.lesson_id)
          ).length;
          const isFullyDone = trackLessons.length > 0 && completedCount === trackLessons.length;
          const locTrack = track.localized_titles?.[locale] || { title: track.title, concept: track.concept };

          return (
            <div 
              key={track.id} 
              className={`min-w-0 border rounded-2xl p-4 bg-card/60 backdrop-blur flex flex-col justify-between transition-all hover:border-primary/60 hover:shadow-md sm:p-6 ${
                isFullyDone ? "border-emerald-500/40 bg-emerald-500/5" : ""
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    Track {track.order}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {completedCount} / {trackLessons.length} {t("completed")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-1 text-foreground">
                  {locTrack.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {locTrack.concept}
                </p>

                <div className="space-y-2">
                  {trackLessons.map((lesson, idx) => {
                    const isCompleted = progress[track.id]?.completedLessons?.includes(lesson.lesson_id);
                    const locLesson = getLocalizedLessonContent(lesson, locale);

                    return (
                      <Link
                        key={lesson.lesson_id}
                        href={`/tracks/${track.id}/lessons/${lesson.lesson_id}`}
                        className="group flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          {isCompleted ? (
                            <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                          ) : (
                            <Circle size={18} className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                          )}
                          <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {idx + 1}. {locLesson.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono shrink-0 ml-2">
                          +{lesson.xp} XP
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {trackLessons.length > 0 && (
                <div className="pt-6 mt-6 border-t border-border/40 flex justify-end">
                  <Link
                    href={`/tracks/${track.id}/lessons/${trackLessons[0].lesson_id}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>{locTrack.title}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
