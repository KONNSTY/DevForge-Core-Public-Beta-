"use client";

import { useProgress } from "@/hooks/useProgress";
import { Playground } from "@/components/playground";
import { Award, Terminal } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { progress, isHydrated } = useProgress();

  const totalXP = Object.values(progress).reduce((sum, track) => sum + track.xp, 0);

  return (
    <div className="flex flex-col space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "DevForge Core [Enterprise Beta v0.9]",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "description": "Interaktive Fullstack & AI Engineering Plattform",
            "creator": {
              "@type": "Person",
              "name": "Paul Konstantin Regler"
            }
          })
        }}
      />

      <section className="flex justify-between items-center" aria-label="Dashboard Overview">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back. Continue your learning journey.</p>
        </header>
        <div className="flex items-center space-x-2 bg-muted/40 p-3 rounded-lg border">
          <Award className="text-yellow-500" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total XP</span>
            <span className="font-bold">{isHydrated ? totalXP : "..."}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <article className="xl:col-span-2 space-y-4" aria-label="Interactive IDE">
          <header className="flex items-center space-x-2">
            <Terminal size={20} />
            <h3 className="text-xl font-semibold">Interactive Playground</h3>
          </header>
          <Playground />
        </article>
        
        <aside className="space-y-4" aria-label="Learning Curriculum">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your Curriculum</h3>
            <Link href="/tracks" className="text-sm font-medium text-primary hover:underline flex items-center">
              Browse All Tracks &rarr;
            </Link>
          </div>
          
          <section className="border rounded-lg p-6 bg-card flex flex-col space-y-4 shadow-sm">
            <h4 className="font-bold text-lg">Next Up</h4>
            <div className="text-sm text-muted-foreground">
              Continue your journey with the Web Basics track.
            </div>
            <Link 
              href="/tracks/web-grundlagen/lessons/web-01-server"
              className="mt-2 text-center bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              Start Lesson 1 (Web-Mechanik)
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
