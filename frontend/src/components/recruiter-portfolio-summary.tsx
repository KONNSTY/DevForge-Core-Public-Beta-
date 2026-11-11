"use client";

import { BriefcaseBusiness } from "lucide-react";
import { useRecruiterMode } from "@/components/recruiter-mode-context";
import { useProgress } from "@/hooks/useProgress";
import { getTracks } from "@/lib/curriculum";

export function RecruiterPortfolioSummary() {
  const { isRecruiterMode } = useRecruiterMode();
  const { progress, isHydrated } = useProgress();

  if (!isRecruiterMode) return null;

  const totalXp = Object.values(progress).reduce((sum, track) => sum + track.xp, 0);
  const completedLessons = Object.values(progress).reduce((sum, track) => sum + track.completedLessons.length, 0);

  return (
    <aside aria-live="polite" className="portfolio-note mt-6">
      <BriefcaseBusiness size={15} aria-hidden="true" />
      Recruiter-Ansicht aktiv · {isHydrated ? `${completedLessons} Lektionen abgeschlossen · ${totalXp} XP · ${getTracks().length} Lernpfade` : "Lokaler Lernfortschritt wird geladen"}
    </aside>
  );
}
