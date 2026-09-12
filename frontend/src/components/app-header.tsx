"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllLessonsLinear, getTracks } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { Zap, ChevronRight, BookOpen } from "lucide-react";
import { RecruiterToggle } from "@/components/recruiter-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthModalButton } from "@/components/auth-modal";
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
    <header className="h-14 border-b flex items-center justify-between px-3 sm:px-6 shrink-0 bg-background/80 backdrop-blur sticky top-0 z-30 gap-2">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm overflow-hidden">
        <Link href="/tracks" className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center space-x-1 shrink-0">
          <BookOpen size={14} className="mr-0.5" />
          <span>DevForge</span>
        </Link>
        {breadcrumbTrack && (
          <>
            <ChevronRight size={13} className="text-muted-foreground/60 shrink-0" />
            <span className="text-muted-foreground max-w-[100px] sm:max-w-[160px] truncate hidden xs:inline">
              {breadcrumbTrack}
            </span>
          </>
        )}
        <ChevronRight size={13} className="text-muted-foreground/60 shrink-0" />
        <span className="font-semibold text-foreground max-w-[120px] sm:max-w-[200px] truncate">
          {breadcrumbTitle}
        </span>
      </div>

      {/* Right: Architecture Inspector, Language Switcher, XP, Auth, Recruiter */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <SystemArchitectureInspector />

        <LanguageSwitcher />

        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-xs font-bold">
          <Zap size={13} className="fill-amber-500" />
          <span>{totalXp} XP</span>
        </div>

        <AuthModalButton />

        <RecruiterToggle />
      </div>
    </header>
  );
}
