"use client";

import React, { useState } from "react";
import { Network, Activity, Cpu, Database, Server, Laptop, CheckCircle2, Shield, Zap } from "lucide-react";

export function SystemArchitectureInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      name: "Next.js Web Client",
      icon: Laptop,
      tech: "React 19 + Turbopack + i18n",
      desc: "Deterministic test runner in sandboxed iframe (allow-scripts), WCAG 2.1 AA keyboard trap, localized chunks across 6 locales.",
      latency: "12ms"
    },
    {
      id: 2,
      name: "Strict Auth & Rate Gate",
      icon: Shield,
      tech: "ASP.NET Core JWT Middleware",
      desc: "Zero anonymous progress writes. Reject with 401 Unauthorized unless signed with OWASP Argon2id issued bearer token.",
      latency: "2ms"
    },
    {
      id: 3,
      name: "CQRS Dispatcher",
      icon: Server,
      tech: "Minimal API Handler Pipeline",
      desc: "Separation of Commands (Register, SaveProgress, IncrementStreak) and Queries (GetUser, GetProgress, InspectLogs).",
      latency: "4ms"
    },
    {
      id: 4,
      name: "Execution Engine Sandbox",
      icon: Cpu,
      tech: "Microsoft.CodeAnalysis.CSharp.Scripting",
      desc: "In-memory Roslyn compilation script runner executing arbitrary C# syntax trees with strict timeout fences.",
      latency: "18ms"
    },
    {
      id: 5,
      name: "Relational Persistence",
      icon: Database,
      tech: "EF Core + SQLite (WAL Mode)",
      desc: "Indexed Foreign Key constraints (UserId -> Progress), unique composites, and streak tracking.",
      latency: "3ms"
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
        title="System Architecture Inspector"
      >
        <Network size={14} />
        <span className="hidden md:inline">Architektur-Inspektor</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-card border rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-primary/15 text-primary">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">System Architecture Inspector</h2>
                  <p className="text-xs text-muted-foreground">
                    End-to-End Enterprise Flow: Web Client → Strict Auth Gate → CQRS Pipeline → Roslyn Sandbox → EF Core
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              >
                Schließen
              </button>
            </div>

            {/* Sequence Diagram Pipeline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {steps.map((step) => {
                const Icon = step.icon;
                const isSelected = activeStep === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`cursor-pointer p-4 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] ${
                      isSelected 
                        ? "border-primary bg-primary/15 shadow-md" 
                        : "border-border/60 bg-muted/20 hover:border-border"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">0{step.id}</span>
                        <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {step.latency}
                        </span>
                      </div>
                      <Icon size={20} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                      <h4 className="font-bold text-xs text-foreground leading-tight">{step.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono">{step.tech}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Inspection Pane */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Zap size={14} />
                <span>
                  {activeStep ? `Komponente 0${activeStep}: ${steps.find(s => s.id === activeStep)?.name}` : "Klicke eine Komponente für Deep-Dive Details an"}
                </span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                {activeStep ? steps.find(s => s.id === activeStep)?.desc : "DevForge Core implementiert eine Zero-Secrets, cloud-native verteilte Architektur mit deterministischer Sandboxing-Isolierung und OWASP-kalibriertem Argon2id Token-Schutz."}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-background border">Zero-Trust Pipeline</span>
                <span className="px-2 py-0.5 rounded bg-background border">In-Memory SQLite WAL Mode</span>
                <span className="px-2 py-0.5 rounded bg-background border">Roslyn CSharpScript 4.12</span>
                <span className="px-2 py-0.5 rounded bg-background border">Argon2id (OWASP 64MB)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
