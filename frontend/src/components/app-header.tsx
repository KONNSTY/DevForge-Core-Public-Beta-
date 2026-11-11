"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { LanguageSwitcher } from "@/components/language-switcher";
import { RecruiterToggle } from "@/components/recruiter-toggle";

const mobileLinks = [
  { href: "/#overview", label: "Portfolio" },
  { href: "/#work", label: "Arbeit" },
  { href: "/tracks", label: "Lernpfade" },
  { href: "/courses", label: "Kurse" },
  { href: "/#contact", label: "Kontakt" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { progress } = useProgress();
  const totalXp = Object.values(progress).reduce((sum, track) => sum + (track.xp || 0), 0);
  const isLearningRoute = pathname.startsWith("/tracks") || pathname.startsWith("/courses");
  const pageTitle = pathname === "/" ? "Portfolio" : pathname.startsWith("/courses") ? "Kursbibliothek" : pathname.startsWith("/tracks") ? "Engineering Lab" : "Impressum & Datenschutz";

  return (
    <header className="app-header sticky top-0 z-30 shrink-0">
      <div className="flex min-h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link href="/" className="shrink-0 font-medium text-slate-400 transition-colors hover:text-white">Konstantin Regler</Link>
          <span className="text-slate-700" aria-hidden="true">/</span>
          <span className="truncate font-semibold text-slate-100" aria-current="page">{pageTitle}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isLearningRoute && <span className="hidden items-center gap-1.5 rounded-full border border-amber-300/10 bg-amber-300/[0.06] px-2.5 py-1 font-mono text-xs font-semibold text-amber-200 sm:inline-flex"><Zap size={13} aria-hidden="true" />{totalXp} XP</span>}
          {(pathname === "/" || pathname.includes("/lessons/")) && <RecruiterToggle />}
          <LanguageSwitcher />
        </div>
      </div>
      <nav className="mobile-navigation md:hidden" aria-label="Mobile Navigation">
        {mobileLinks.map(({ href, label }) => <Link key={href} href={href} className="mobile-nav-link">{label}</Link>)}
      </nav>
    </header>
  );
}
