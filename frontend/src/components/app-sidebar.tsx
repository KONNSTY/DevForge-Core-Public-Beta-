"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTracks, getLessonsForTrack, getLocalizedLessonContent } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/components/language-context";
import { BookOpen, CheckCircle, Circle, Scale, Home, GraduationCap } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const tracks = getTracks();
  const { progress } = useProgress();
  const { locale, t } = useLanguage();

  return (
    <aside className="w-72 border-r bg-card/40 backdrop-blur hidden md:flex flex-col h-full shrink-0">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-300 to-primary border border-cyan-200/60 flex items-center justify-center text-slate-950 font-black group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight tracking-tight">{t("app_title")}</h1>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{t("app_subtitle")}</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="p-3 border-b space-y-1">
        <Link
          href="/"
          className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/" ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Home size={16} />
          <span>{t("dashboard")}</span>
        </Link>
        <Link
          href="/tracks"
          className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === "/tracks" ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <BookOpen size={16} />
          <span>{t("all_tracks")}</span>
        </Link>
        <Link
          href="/courses"
          className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname.startsWith("/courses") ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <GraduationCap size={16} />
          <span>{t("cs50_courses")}</span>
        </Link>
      </div>

      {/* Track & Lesson Tree Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
          {t("curriculum")} (Linear & Open)
        </div>
        {tracks.map((track) => {
          const lessons = getLessonsForTrack(track.id);
          const locTrack = track.localized_titles?.[locale] || { title: track.title, concept: track.concept };

          return (
            <div key={track.id} className="space-y-1">
              <div className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-foreground/80">
                <span className="truncate">{locTrack.title}</span>
              </div>
              <div className="space-y-0.5 pl-2 border-l border-border/40 ml-2">
                {lessons.map((lesson) => {
                  const isCompleted = progress[track.id]?.completedLessons?.includes(lesson.lesson_id);
                  const isCurrent = pathname.includes(lesson.lesson_id);
                  const locLesson = getLocalizedLessonContent(lesson, locale);

                  return (
                    <Link
                      key={lesson.lesson_id}
                      href={`/tracks/${track.id}/lessons/${lesson.lesson_id}`}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                        isCurrent 
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        {isCompleted ? (
                          <CheckCircle size={13} className={isCurrent ? "text-primary-foreground" : "text-emerald-500 shrink-0"} />
                        ) : (
                          <Circle size={13} className="shrink-0 opacity-40 group-hover:opacity-100" />
                        )}
                        <span className="truncate">{locLesson.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Legal & Footer */}
      <div className="p-3 border-t bg-muted/20 space-y-1">
        <Link
          href="/impressum"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Scale size={14} />
          <span>{t("imprint_privacy")}</span>
        </Link>
      </div>
    </aside>
  );
}
