"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, ExternalLink, FileText } from "lucide-react";
import { cs50Courses, getLessonById } from "@/lib/curriculum";

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const course = cs50Courses.find((item) => item.id === params.courseId);

  if (!course) {
    return (
      <main className="mx-auto max-w-3xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Kurs nicht gefunden</h1>
        <Link href="/courses" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"><ArrowLeft size={16} /> Zu allen Kursen</Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"><ArrowLeft size={16} /> Alle CS50-Kurse</Link>
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {course.status === "archived" ? "Archivkurs · historische Inhalte, kein aktueller Zertifikatspfad" : `${course.weeks.length} Wochen`}
          {" · für Einsteigerinnen und Einsteiger jeden Alters"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{course.description}</p>
        <a href={course.official} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">Offizielle Kursseite <ExternalLink size={14} /></a>
      </header>

      <section aria-labelledby="weekly-content-title" className="space-y-4">
        <div>
          <h2 id="weekly-content-title" className="text-xl font-bold">Vollständiger Wochenüberblick</h2>
          <p className="mt-1 text-sm text-muted-foreground">Jede Woche führt zu einer eigenen Lernlektion mit verständlicher Erklärung, Beispiel und Übung. Die offiziellen Vorlesungsseiten und Transkripte dienen als Quellenabgleich und sind freiwillige Vertiefung.</p>
        </div>
        <ol className="space-y-3">
          {course.weeks.map((week) => (
            <li key={week.week} className="rounded-xl border bg-card/40 p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">Woche {week.week}: {week.title}</h3>
                <a href={week.course_page} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">Vorlesungsseite <ExternalLink size={12} /></a>
              </div>
              {week.topic_outline ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{week.topic_outline}</p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Abschluss und Zusammenführung der Kursinhalte.</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                {week.lesson_ids?.map((lessonId) => {
                  const lesson = getLessonById(lessonId);
                  return lesson ? (
                    <Link key={lessonId} href={`/tracks/${lesson.track_id}/lessons/${lesson.lesson_id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      <BookOpen size={14} /> Eigene Lernlektion: {lesson.title}
                    </Link>
                  ) : null;
                })}
                {week.transcript_url && (
                  <a href={week.transcript_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline">
                    <FileText size={13} /> Öffentliches Transkript
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <aside className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-muted-foreground sm:p-5">
        <strong className="text-foreground">So nutzt du den Überblick:</strong> Lerne die Begriffe und Zusammenhänge, löse danach neue Aufgaben ohne Vorlage und erkläre deine Entscheidungen. Offizielle Zertifikate erfordern weiterhin die von HarvardX vorgesehenen Abgaben und Bewertungen.
      </aside>
    </main>
  );
}
