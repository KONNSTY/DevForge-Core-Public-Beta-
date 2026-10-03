import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { cs50Courses, cs50ProfessionalCertificates } from "@/lib/curriculum";

export default function CoursesPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl space-y-10 p-4 sm:p-6 lg:p-8">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">CS50 · offene Lernbibliothek</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Kurse und Zertifikatspfade</h1>
        <p className="max-w-3xl text-muted-foreground">
          Lerne die Themen Schritt für Schritt, ohne technisches Vorwissen und in deinem eigenen Tempo. Die Kursübersichten verbinden jede offizielle Vorlesungswoche mit den öffentlich verfügbaren Quellen.
        </p>
      </header>

      <section aria-labelledby="certificates-title" className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-primary" size={20} />
          <h2 id="certificates-title" className="text-xl font-bold">HarvardX Professional Certificates</h2>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Diese Pfade bündeln die jeweils genannten Kurse. Die Lernbibliothek bereitet auf deren Themen und typische Aufgabenformen vor; die offiziellen Abgaben und Zertifikatsbedingungen werden weiterhin direkt bei HarvardX erfüllt.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {cs50ProfessionalCertificates.map((certificate) => (
            <article key={certificate.id} className="rounded-xl border bg-card/50 p-4 sm:p-5">
              <h3 className="font-semibold">{certificate.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{certificate.courses.join(" · ")}</p>
              {certificate.note && <p className="mt-2 text-xs text-muted-foreground">{certificate.note}</p>}
              <a className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline" href={certificate.edx} target="_blank" rel="noreferrer">
                Offizielle Programminformationen <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="courses-title" className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="text-primary" size={20} />
          <h2 id="courses-title" className="text-xl font-bold">CS50-Kurse</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cs50Courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="group flex min-h-36 flex-col rounded-xl border bg-card/50 p-4 transition-colors hover:border-primary/50 hover:bg-muted/30 sm:p-5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${course.status === "archived" ? "text-muted-foreground" : "text-primary"}`}>
                {course.status === "archived" ? "Archivkurs · kein aktueller Kurslauf" : `${course.weeks.length} Vorlesungswochen`}
              </span>
              <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary">{course.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{course.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">Kursübersicht öffnen <ArrowRight size={13} /></span>
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Zusätzlich auffindbare Archivkurse sind im Quellen- und Abdeckungsdokument gekennzeichnet. Archivstatus und Zertifikatsverfügbarkeit können sich unterscheiden.
        </p>
      </section>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground sm:p-5">
        <strong className="text-foreground">Ziel: Junior-Entwicklung.</strong> Für den Berufsweg ist der Schwerpunkt eine solide Informatikbasis, Python, Webentwicklung, Datenbanken, Tests, Sicherheit und ein eigenes Abschlussprojekt. Spezialisierte Kurse wie Spieleentwicklung, R oder Business ergänzen diesen Kern.
      </div>
    </main>
  );
}
