import React from "react";
import { FileCode, AlertTriangle, ShieldCheck } from "lucide-react";

interface SeniorThoughtLogProps {
  decision: string;
  alternativesConsidered: string[];
  tradeoffs: string;
  securityImplications: string;
}

export function SeniorThoughtLog({
  decision,
  alternativesConsidered,
  tradeoffs,
  securityImplications
}: SeniorThoughtLogProps) {
  return (
    <details className="group border border-border/60 rounded-xl overflow-hidden bg-card/40 my-4">
      <summary className="cursor-pointer p-4 flex items-center justify-between hover:bg-muted/40 transition-colors list-none">
        <div className="flex items-center space-x-2">
          <FileCode size={18} className="text-amber-500 shrink-0" />
          <span className="font-bold text-xs sm:text-sm text-foreground">
            Senior Engineering Thought Log (ADR & Architecture Decision)
          </span>
        </div>
        <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>

      <div className="p-4 pt-2 border-t border-border/40 space-y-4 text-xs leading-relaxed text-muted-foreground bg-muted/10">
        <div>
          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
            Architektur-Entscheidung:
          </span>
          <p className="text-foreground/90">{decision}</p>
        </div>

        <div>
          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
            Verworfene Alternativen & Begründung:
          </span>
          <ul className="list-disc pl-4 space-y-1">
            {alternativesConsidered.map((alt, i) => (
              <li key={i}>{alt}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center space-x-1.5 text-amber-500 font-semibold text-[10px] uppercase tracking-wider mb-1">
            <AlertTriangle size={12} />
            <span>Performance & Trade-Offs:</span>
          </div>
          <p>{tradeoffs}</p>
        </div>

        <div>
          <div className="flex items-center space-x-1.5 text-emerald-500 font-semibold text-[10px] uppercase tracking-wider mb-1">
            <ShieldCheck size={12} />
            <span>Security & OWASP Härtung:</span>
          </div>
          <p>{securityImplications}</p>
        </div>
      </div>
    </details>
  );
}
