"use client";

import React from "react";
import { useRecruiterMode } from "./recruiter-mode-context";
import { Briefcase, Eye, EyeOff } from "lucide-react";

export function RecruiterToggle() {
  const { isRecruiterMode, toggleRecruiterMode } = useRecruiterMode();

  return (
    <button
      onClick={toggleRecruiterMode}
      className={`w-full flex items-center justify-between p-3 rounded-md transition-colors border ${
        isRecruiterMode
          ? "bg-primary/10 border-primary text-primary"
          : "bg-muted/50 border-transparent hover:bg-muted"
      }`}
    >
      <div className="flex items-center space-x-2">
        <Briefcase size={16} />
        <span className="text-sm font-medium">Recruiter Mode</span>
      </div>
      {isRecruiterMode ? <Eye size={16} /> : <EyeOff size={16} className="text-muted-foreground" />}
    </button>
  );
}
