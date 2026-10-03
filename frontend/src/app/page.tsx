"use client";

import { useProgress } from "@/hooks/useProgress";
import { getFirstLesson } from "@/lib/curriculum";
import { Playground } from "@/components/playground";
import { Award, Terminal } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { progress, isHydrated } = useProgress();
  const firstLesson = getFirstLesson();

  const totalXP = Object.values(progress).reduce((sum, track) => sum + track.xp, 0);

  return (
    <div className="mx-auto flex w-full max-w-[1680px] min-w-0 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "devForgeCore Powerd by Regler Productions - Polymath Productions",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "description": "Interaktive Fullstack & AI Engineering Plattform",
            "creator": {
              "@type": "Organization",
              "name": "Polymath Productions / Regler Productions",
              "url": "https://reglerproductions.com/"
            }
          })
        }}
      />

      <section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" aria-label="Dashboard Overview">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Kostenlos lernen, ohne Konto und ohne API-Schlüssel.</p>
        </header>
        <div className="flex w-full max-w-xs items-center space-x-2 rounded-lg border bg-muted/40 p-3 sm:w-auto">
          <Award className="text-yellow-500" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total XP</span>
            <span className="font-bold">{isHydrated ? totalXP : "..."}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <article className="min-w-0 space-y-4 xl:col-span-2" aria-label="Interactive IDE">
          <header className="flex items-center space-x-2">
            <Terminal size={20} />
            <h3 className="text-xl font-semibold">Interaktives Code-Labor</h3>
          </header>
          <Playground />
        </article>
        
        <aside className="min-w-0 space-y-4" aria-label="Learning Curriculum">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Dein Lehrplan</h3>
            <Link href="/tracks" className="flex shrink-0 items-center text-sm font-medium text-primary hover:underline">
              Alle Lehrpfade &rarr;
            </Link>
          </div>
          
          <section className="border rounded-lg p-6 bg-card flex flex-col space-y-4 shadow-sm">
            <h4 className="font-bold text-lg">Als Nächstes</h4>
            <div className="text-sm text-muted-foreground">
              Starte mit den Grundlagen der Informatik und des Programmierens.
            </div>
            <Link 
              href={firstLesson ? `/tracks/${firstLesson.track_id}/lessons/${firstLesson.lesson_id}` : "/tracks"}
              className="mt-2 text-center bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              Lektion 1 starten (Informatik-Grundlagen)
            </Link>
          </section>
        </aside>
      </div>

      <section className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4" aria-label="Polymath Productions">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-300">Ein Produkt von Polymath Productions</p>
          <h3 className="mt-1 text-xl font-bold">DevForge Core · Regler Productions</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Die kostenlose Lernplattform wird von Regler Productions entwickelt. Entdecke auch unsere professionellen Angebote.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <a href="https://reglerproductions.com/" target="_blank" rel="noreferrer" className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">Polymath Productions</a>
          <a href="https://reglerproductions.com/preise.html" target="_blank" rel="noreferrer" className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition-colors">Zum Angebot</a>
        </div>
      </section>
    </div>
  );
}
