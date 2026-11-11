import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Braces, Code2, Database, Layers3, Mail, Sparkles, Terminal,
} from "lucide-react";

const capabilities = [
  {
    icon: Sparkles,
    number: "01",
    title: "AI engineering",
    description: "LLM applications, retrieval workflows and thoughtful AI features built around real product needs.",
    tags: ["LLM apps", "RAG", "Evaluation"],
  },
  {
    icon: Layers3,
    number: "02",
    title: "Full-stack products",
    description: "From clear interfaces to dependable APIs and the data models that connect them.",
    tags: ["React", "TypeScript", ".NET"],
  },
  {
    icon: Database,
    number: "03",
    title: "Quality by design",
    description: "Accessible experiences, useful feedback and careful testing at every layer.",
    tags: ["UX", "QA", "Security"],
  },
];

export function PortfolioHero() {
  return (
    <>
      <section id="overview" aria-labelledby="hero-title" className="portfolio-hero grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Portfolio · AI &amp; Full-stack Engineering
          </div>
          <p className="mb-3 text-sm font-semibold tracking-wide text-indigo-300">Hi, ich bin Konstantin.</p>
          <h1 id="hero-title" className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Ich baue digitale Produkte, die <span className="text-gradient">Menschen weiterbringen.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Full-stack Engineering, AI und Produktdenken — verbunden in Software, die verständlich, nützlich und sorgfältig umgesetzt ist.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:contact@reglerproductions.com" className="button-primary"><Mail size={16} aria-hidden="true" /> Kontakt aufnehmen</a>
            <a href="https://github.com/KONNSTY" target="_blank" rel="noreferrer" className="button-secondary"><Code2 size={16} aria-hidden="true" /> GitHub ansehen <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          <a href="#work" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
            Ausgewählte Arbeit entdecken <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-console" aria-label="Engineering-Schwerpunkte">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200"><Terminal size={15} className="text-indigo-300" aria-hidden="true" /> build-with-intent</div>
            <div className="flex gap-1.5" aria-hidden="true"><i className="h-2 w-2 rounded-full bg-rose-400/70" /><i className="h-2 w-2 rounded-full bg-amber-300/70" /><i className="h-2 w-2 rounded-full bg-emerald-300/70" /></div>
          </div>
          <div className="space-y-5 p-5 sm:p-7">
            <p className="font-mono text-xs text-slate-400">{"// product engineering, end to end"}</p>
            <div className="font-mono text-sm leading-7 sm:text-[15px]">
              <p><span className="text-violet-300">const</span> <span className="text-sky-200">approach</span> = {'{'}</p>
              <p className="pl-5"><span className="text-emerald-300">curiosity</span>: <span className="text-amber-200">&quot;always&quot;</span>,</p>
              <p className="pl-5"><span className="text-emerald-300">craft</span>: <span className="text-amber-200">&quot;by design&quot;</span>,</p>
              <p className="pl-5"><span className="text-emerald-300">focus</span>: [</p>
              <p className="pl-10 text-amber-200">&quot;AI that helps&quot;,</p>
              <p className="pl-10 text-amber-200">&quot;software that lasts&quot;</p>
              <p className="pl-5">],</p>
              <p>{'}'};</p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/[0.08] pt-5">
              {["AI", "Frontend", "Backend", "Product QA"].map((item) => <span key={item} className="tech-pill">{item}</span>)}
            </div>
          </div>
          <div className="console-glow" aria-hidden="true" />
        </div>
      </section>
      <div className="my-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-white/[0.08] py-5 text-xs font-medium uppercase tracking-[0.13em] text-slate-400 sm:my-16">
        <span>Software Engineering</span><span className="text-indigo-300" aria-hidden="true">✳</span>
        <span>Applied AI</span><span className="text-indigo-300" aria-hidden="true">✳</span>
        <span>Product Quality</span><span className="text-indigo-300" aria-hidden="true">✳</span>
        <span>Polymath Productions</span>
      </div>
    </>
  );
}

export function CapabilitiesSection() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="section-block">
      <div className="section-heading">
        <div><p className="eyebrow">Was ich einbringe</p><h2 id="approach-title">Vom ersten Gedanken bis zum letzten Detail.</h2></div>
        <p>Ich verbinde Produktverständnis und technische Umsetzung — mit Fokus auf das, was Menschen wirklich brauchen.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {capabilities.map(({ icon: Icon, number, title, description, tags }) => (
          <article key={number} className="capability-card">
            <div className="flex items-start justify-between"><span className="icon-tile"><Icon size={19} aria-hidden="true" /></span><span className="font-mono text-xs text-slate-600">{number}</span></div>
            <h3>{title}</h3><p>{description}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">{tags.map((tag) => <span key={tag} className="tech-pill">{tag}</span>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SelectedWorkSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="section-block">
      <div className="section-heading">
        <div><p className="eyebrow">Ausgewählte Arbeit</p><h2 id="work-title">Ein Produkt. Viele Perspektiven.</h2></div>
        <p>DevForge Core zeigt, wie Lernen, interaktive Werkzeuge und robuste Produktentwicklung zusammenkommen.</p>
      </div>
      <article className="project-card">
        <div className="project-art" aria-label="Abstrakte Darstellung des DevForge Core Code-Labors">
          <div className="project-window">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3"><span className="h-2 w-2 rounded-full bg-indigo-300" /><span className="font-mono text-[11px] text-slate-400">devforge / playground</span></div>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 p-4 font-mono text-xs leading-6 sm:p-6 sm:text-sm"><span className="text-slate-400">1</span><span><b className="text-violet-300">function</b> <b className="text-sky-200">learnByBuilding</b>() {'{'}</span><span className="text-slate-400">2</span><span className="pl-4"><b className="text-violet-300">return</b> <b className="text-emerald-300">practice</b> + <b className="text-amber-200">curiosity</b>;</span><span className="text-slate-400">3</span><span>{'}'}</span></div>
            <div className="mx-4 mb-4 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.05] px-3 py-2 font-mono text-[11px] text-emerald-200 sm:mx-6 sm:mb-6">✓ Preview ready <span className="float-right text-slate-400">interactive</span></div>
          </div>
          <div className="art-orbit art-orbit-one" /><div className="art-orbit art-orbit-two" />
        </div>
        <div className="project-info">
          <div className="flex flex-wrap items-center gap-2"><span className="project-label">Produkt &amp; Plattform</span><span className="project-label project-label-muted">Lernplattform</span></div>
          <h3>DevForge Core</h3>
          <p>Eine kostenlose, browserbasierte Lernumgebung mit strukturierten Lernpfaden, interaktivem Code-Labor und lokal gespeichertem Fortschritt.</p>
          <div className="mt-5 flex flex-wrap gap-2"><span className="tech-pill">Next.js</span><span className="tech-pill">TypeScript</span><span className="tech-pill">CodeMirror</span><span className="tech-pill">Sandbox</span></div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/tracks" className="button-primary">Lernpfade ansehen <ArrowRight size={15} aria-hidden="true" /></Link>
            <Link href="/courses" className="button-secondary">Kursbibliothek <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </article>
    </section>
  );
}

export function LabBanner() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="lab-banner">
      <div className="lab-icon"><Braces size={22} aria-hidden="true" /></div>
      <div className="min-w-0 flex-1"><p className="eyebrow">Direkt ausprobieren</p><h2 id="lab-title">Code schreiben. Sofort sehen, was passiert.</h2><p>Das interaktive Labor läuft direkt im Browser — ohne Konto und ohne Einrichtung.</p></div>
      <Link href="/tracks" className="button-primary shrink-0">Engineering Lab öffnen <ArrowRight size={15} aria-hidden="true" /></Link>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="contact-section">
      <div><p className="eyebrow">Lass uns sprechen</p><h2 id="contact-title">Eine gute Idee beginnt mit einem Gespräch.</h2><p>Du planst ein Produkt, suchst Engineering-Unterstützung oder möchtest über eine Zusammenarbeit sprechen?</p></div>
      <div className="flex flex-wrap gap-3">
        <a className="button-primary" href="mailto:contact@reglerproductions.com"><Mail size={16} aria-hidden="true" /> Nachricht schreiben <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a className="button-secondary" href="https://github.com/KONNSTY" target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" /> GitHub</a>
      </div>
    </section>
  );
}
