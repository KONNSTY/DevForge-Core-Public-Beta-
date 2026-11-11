"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BriefcaseBusiness, Code2, GraduationCap, Home, Scale, Sparkles } from "lucide-react";
import { getTracks, getLessonsForTrack, getLocalizedLessonContent } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { useLanguage } from "@/components/language-context";

const portfolioLinks = [
  { href: "/#overview", title: "Überblick", icon: Home },
  { href: "/#approach", title: "Schwerpunkte", icon: Sparkles },
  { href: "/#work", title: "Ausgewählte Arbeit", icon: BriefcaseBusiness },
  { href: "/#contact", title: "Kontakt", icon: Code2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { progress } = useProgress();
  const { locale, t } = useLanguage();
  const isLesson = pathname.includes("/lessons/");

  const navLink = (href: string, title: string, Icon: typeof Home, active: boolean) => (
    <Link
      key={href}
      href={href}
      aria-current={active ? "page" : undefined}
      className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
    >
      <Icon size={16} aria-hidden="true" />
      <span>{title}</span>
    </Link>
  );

  return (
    <aside className="app-sidebar hidden h-full w-[248px] shrink-0 flex-col md:flex" aria-label="Hauptnavigation">
      <div className="border-b border-white/[0.08] p-5">
        <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span className="brand-mark" aria-hidden="true">K</span>
          <span className="min-w-0"><span className="block truncate text-sm font-semibold tracking-tight text-white">Konstantin Regler</span><span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.13em] text-indigo-300">Portfolio &amp; Engineering</span></span>
        </Link>
      </div>

      <nav className="space-y-1 px-3 py-5" aria-label="Portfolio">
        <p className="sidebar-label">Portfolio</p>
        {portfolioLinks.map(({ href, title, icon: Icon }) => navLink(href, title, Icon, false))}
      </nav>

      <div className="mx-4 border-t border-white/[0.08]" />
      <nav className="space-y-1 px-3 py-5" aria-label="Engineering-Lab">
        <p className="sidebar-label">Engineering Lab</p>
        {navLink("/tracks", "Lernpfade", BookOpen, pathname === "/tracks")}
        {navLink("/courses", "Kursbibliothek", GraduationCap, pathname.startsWith("/courses"))}
      </nav>

      {isLesson && (
        <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto border-t border-white/[0.08] px-3 py-5" aria-label={t("curriculum")}>
          <p className="sidebar-label">{t("curriculum")}</p>
          {getTracks().map((track) => {
            const lessons = getLessonsForTrack(track.id);
            const trackTitle = track.localized_titles?.[locale]?.title || track.title;
            return (
              <div key={track.id}>
                <p className="mb-1 truncate px-2 text-xs font-medium text-slate-400">{trackTitle}</p>
                <div className="space-y-0.5 border-l border-white/10 pl-2">
                  {lessons.map((lesson) => {
                    const isCurrent = pathname.includes(lesson.lesson_id);
                    const isCompleted = progress[track.id]?.completedLessons?.includes(lesson.lesson_id) ?? false;
                    return (
                      <Link key={lesson.lesson_id} href={`/tracks/${track.id}/lessons/${lesson.lesson_id}`} aria-current={isCurrent ? "page" : undefined} className={`lesson-nav-link ${isCurrent ? "lesson-nav-link-active" : ""}`}>
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isCompleted ? "bg-emerald-400" : "bg-slate-600"}`} aria-hidden="true" />
                        <span className="truncate">{getLocalizedLessonContent(lesson, locale).title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      )}

      <div className="mt-auto space-y-1 border-t border-white/[0.08] bg-white/[0.015] p-3">
        <a href="https://github.com/KONNSTY" target="_blank" rel="noreferrer" className="sidebar-link"><Code2 size={15} aria-hidden="true" /><span>GitHub</span></a>
        {navLink("/impressum", "Impressum & Datenschutz", Scale, pathname === "/impressum")}
      </div>
    </aside>
  );
}
