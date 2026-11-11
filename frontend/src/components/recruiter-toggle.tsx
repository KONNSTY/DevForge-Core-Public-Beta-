"use client";

import React from "react";
import { useRecruiterMode } from "./recruiter-mode-context";
import { Briefcase, Eye, EyeOff } from "lucide-react";

export function RecruiterToggle() {
  const { isRecruiterMode, toggleRecruiterMode } = useRecruiterMode();

  return (
    <button
      onClick={toggleRecruiterMode}
      aria-pressed={isRecruiterMode}
      aria-label={isRecruiterMode ? "Recruiter-Ansicht deaktivieren" : "Recruiter-Ansicht aktivieren"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors sm:h-auto sm:w-auto sm:justify-between sm:px-3 sm:py-2 ${
        isRecruiterMode
          ? "bg-primary/10 border-primary text-primary"
          : "bg-muted/50 border-transparent hover:bg-muted"
      }`}
    >
      <div className="flex items-center space-x-2">
        <Briefcase size={16} aria-hidden="true" />
        <span className="hidden text-sm font-medium sm:inline">Recruiter-Ansicht</span>
      </div>
      <span className="hidden sm:inline">
        {isRecruiterMode ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} className="text-muted-foreground" aria-hidden="true" />}
      </span>
    </button>
  );
}
