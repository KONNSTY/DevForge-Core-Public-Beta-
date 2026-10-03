"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllLessonsLinear, getTracks } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { Zap, ChevronRight, BookOpen } from "lucide-react";
import { RecruiterToggle } from "@/components/recruiter-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SystemArchitectureInspector } from "@/components/architecture-inspector";

export function AppHeader() {
  const pathname = usePathname();
  const { progress } = useProgress();
  const tracks = getTracks();
  const allLessons = getAllLessonsLinear();

  // Calculate total XP across all tracks
  const totalXp = Object.values(progress).reduce((acc, curr) => acc + (curr.xp || 0), 0);

  // Derive breadcrumb from pathname
  let breadcrumbTitle = "Dashboard";
  let breadcrumbTrack = "";

  if (pathname.startsWith("/tracks")) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1) {
      breadcrumbTitle = "Alle Tracks";
    } else if (segments.length >= 2) {
      const trackId = segments[1];
      const track = tracks.find(t => t.id === trackId);
      if (track) breadcrumbTrack = track.title;

      if (segments.length >= 4) {
        const lessonId = segments[3];
        const lesson = allLessons.find(l => l.lesson_id === lessonId);
        if (lesson) breadcrumbTitle = lesson.title;
      }
    }
  } else if (pathname === "/impressum") {
    breadcrumbTitle = "Impressum & Datenschutz";
  }

  return (
    <header className="min-h-14 border-b flex items-center justify-between gap-2 px-3 py-2 sm:h-14 sm:px-6 sm:py-0 shrink-0 bg-background/80 backdrop-blur sticky top-0 z-30">
      {/* Left: Breadcrumbs */}
      <div className="min-w-0 flex flex-1 items-center space-x-1.5 overflow-hidden text-xs sm:space-x-2 sm:text-sm">
        <Link href="/tracks" className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center space-x-1 shrink-0">
          <BookOpen size={14} className="mr-0.5" />
          <span className="hidden sm:inline">DevForge</span>
        </Link>
        {breadcrumbTrack && (
          <>
            <ChevronRight size={13} className="text-muted-foreground/60 shrink-0" />
            <span className="hidden max-w-[100px] truncate text-muted-foreground sm:inline sm:max-w-[160px]">
              {breadcrumbTrack}
            </span>
          </>
        )}
        <ChevronRight size={13} className="text-muted-foreground/60 shrink-0" />
        <span className="min-w-0 font-semibold text-foreground max-w-[120px] sm:max-w-[200px] truncate">
          {breadcrumbTitle}
        </span>
      </div>

      {/* Right: Architecture Inspector, Polymath CTA, Language Switcher, XP, Recruiter */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <SystemArchitectureInspector />

        <a
          href="https://reglerproductions.com/preise.html"
          target="_blank"
          rel="noreferrer"
          className="hidden lg:inline-flex items-center rounded-md border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-400/20 transition-colors"
        >
          Polymath Angebot
        </a>

        <LanguageSwitcher />

        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-xs font-bold">
          <Zap size={13} className="fill-amber-500" />
          <span>{totalXp} XP</span>
        </div>

        <RecruiterToggle />
      </div>
    </header>
  );
}
