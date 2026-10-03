import curriculumData from '../data/curriculum.json';
import cs50CourseData from '../data/cs50-courses.json';
import { SupportedLocale } from './i18n';

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface JargonBuster {
  term: string;
  simple_analogy: string;
  production_definition: string;
}

export interface AiEngineeringLeverage {
  assistant: string;
  golden_prompt: string;
  verification_heuristic: string;
}

export interface AutomatedTest {
  test_name: string;
  assertion_code: string;
  failure_message: string;
}

export interface InteractiveChallenge {
  runtime: "browser_sandbox" | "roslyn_csharp" | "pyodide_python" | "python_server" | "sqlite_in_memory";
  task_description: string;
  starter_code: string;
  hints: string[];
  solution_code: string;
  automated_test_suite: AutomatedTest[];
}

export interface LocalizedContent {
  title: string;
  coach_context: string;
  mental_model_and_code: string;
  jargon_buster: JargonBuster[];
  ai_engineering_leverage: AiEngineeringLeverage;
}

export interface SeniorThoughtLogData {
  decision: string;
  alternativesConsidered: string[];
  tradeoffs: string;
  securityImplications: string;
}

export interface Lesson {
  track_id: string;
  lesson_id: string;
  title: string;
  difficulty: Difficulty;
  coach_context: string;
  jargon_buster: JargonBuster[];
  mental_model_and_code: string;
  ai_engineering_leverage: AiEngineeringLeverage;
  interactive_challenge: InteractiveChallenge;
  learning_guide?: {
    short_description: string;
    learning_objectives: string[];
    prerequisites: string[];
    common_mistakes: string[];
    summary: string[];
    questions: { prompt: string; choices: string[]; answer: number; explanation: string }[];
    exercise: string;
    estimated_minutes: number;
    sources: { label: string; url: string; course: string }[];
    beyond_cs50?: boolean;
    execution_note?: string;
  };
  xp: number;
  senior_thought_log?: SeniorThoughtLogData;
  content_matrix?: Partial<Record<SupportedLocale, LocalizedContent>>;
}

export interface TrackMetadata {
  id: string;
  order: number;
  title: string;
  concept: string;
  icon?: string;
  localized_titles?: Partial<Record<SupportedLocale, { title: string; concept: string }>>;
}

export const tracksMetadata: TrackMetadata[] = [
  { id: "cs-grundlagen", order: 1, title: "1. Informatik-Grundlagen", concept: "Daten, Algorithmen, Laufzeit, Speicher und passende Datenstrukturen" },
  { id: "python-ki-lab", order: 2, title: "2. Python und Software-Grundlagen", concept: "Programmieren, testen, Dateien, Fehler und objektorientierte Modelle" },
  { id: "ai-grundlagen", order: 3, title: "3. Grundlagen der Künstlichen Intelligenz", concept: "Suche, Wissen, Wahrscheinlichkeit, Optimierung und maschinelles Lernen" },
  { id: "datenbanken-sql", order: 4, title: "4. Datenbanken und SQL", concept: "Abfragen, Beziehungen, Integrität, Indizes und sichere Datenzugriffe" },
  { id: "web-grundlagen", order: 5, title: "5. Web-Grundlagen", concept: "Internet, HTML, CSS, JavaScript und asynchrone APIs" },
  { id: "aspnet-web-api", order: 6, title: "6. Fullstack und Backend", concept: "Git, HTTP-APIs, Sessions, Validierung, Modelle und Migrationen" },
  { id: "react-bausteine", order: 7, title: "7. Frontend Engineering", concept: "Komponenten, State, Formulare, TypeScript und zugängliche UI" },
  { id: "ai-engineering", order: 8, title: "8. AI Engineering", concept: "LLMs, Retrieval, Tool-Nutzung, Evaluation und sichere Integration" },
  { id: "cybersecurity", order: 9, title: "9. Cybersecurity", concept: "Threat Modeling, Webangriffe, Kontoschutz und Datenschutz" },
  { id: "cs50-scratch", order: 10, title: "10. CS50 Scratch", concept: "Programmieren mit Ereignissen, Variablen, Schleifen und eigenen Projekten" },
  { id: "cs50-r", order: 11, title: "11. CS50 R", concept: "Daten darstellen, umformen, analysieren, visualisieren und testen" },
  { id: "cs50-2d", order: 12, title: "12. CS50 2D", concept: "Spielschleifen, Eingaben, Physik, Kollisionen und Spielzustände" },
  { id: "cs50-business", order: 13, title: "13. CS50 Business", concept: "Informatik, Daten, KI, Internet und Sicherheit im Geschäftskontext" },
  { id: "cs50-lawyers", order: 14, title: "14. CS50 for Lawyers", concept: "Technische Grundlagen für die Analyse von Recht und Technologie" },
  { id: "cs50-mobile", order: 15, title: "15. CS50 Mobile (Archiv)", concept: "Historische Einführung in React Native und mobile Anwendungen" },
  { id: "cs50-technology", order: 16, title: "16. CS50 Technology (Archiv)", concept: "Historische Einführung in Hardware, Internet und Web" },
];

export const lessons: Lesson[] = curriculumData as Lesson[];

export interface Cs50CourseWeek {
  week: number | string;
  title: string;
  topic_outline: string;
  transcript_url?: string;
  course_page: string;
  transcript_version?: string[];
  lesson_ids?: string[];
}

export interface Cs50Course {
  id: string;
  title: string;
  official: string;
  syllabus_url: string;
  status: "active" | "archived";
  description: string;
  weeks: Cs50CourseWeek[];
}

export interface Cs50ProfessionalCertificate {
  id: string;
  title: string;
  provider: string;
  courses: string[];
  edx: string;
  note?: string;
}

const cs50Catalog = cs50CourseData as {
  checked_utc: string;
  source_note: string;
  courses: Cs50Course[];
  professional_certificates: Cs50ProfessionalCertificate[];
};

export const cs50Courses = cs50Catalog.courses;
export const cs50ProfessionalCertificates = cs50Catalog.professional_certificates;

export function getTracks(): TrackMetadata[] {
  return tracksMetadata;
}

export function getTrackById(trackId: string): TrackMetadata | undefined {
  return tracksMetadata.find(t => t.id === trackId);
}

export function getLessonsForTrack(trackId: string): Lesson[] {
  return lessons.filter(l => l.track_id === trackId);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find(l => l.lesson_id === lessonId);
}

export function getAllLessonsLinear(): Lesson[] {
  return tracksMetadata.flatMap(track => getLessonsForTrack(track.id));
}

export function getFirstLesson(): Lesson | undefined {
  return getAllLessonsLinear()[0];
}

export function getLocalizedLessonContent(lesson: Lesson, locale: SupportedLocale): {
  title: string;
  coach_context: string;
  mental_model_and_code: string;
  jargon_buster: JargonBuster[];
  ai_engineering_leverage: AiEngineeringLeverage;
} {
  const matrix = lesson.content_matrix?.[locale];
  if (matrix) {
    return {
      title: matrix.title || lesson.title,
      coach_context: matrix.coach_context || lesson.coach_context,
      mental_model_and_code: matrix.mental_model_and_code || lesson.mental_model_and_code,
      jargon_buster: matrix.jargon_buster && matrix.jargon_buster.length > 0 ? matrix.jargon_buster : lesson.jargon_buster,
      ai_engineering_leverage: matrix.ai_engineering_leverage || lesson.ai_engineering_leverage
    };
  }

  // Fallback to default lesson content
  return {
    title: lesson.title,
    coach_context: lesson.coach_context,
    mental_model_and_code: lesson.mental_model_and_code,
    jargon_buster: lesson.jargon_buster,
    ai_engineering_leverage: lesson.ai_engineering_leverage
  };
}

export function getAdjacentLessons(currentLessonId: string): {
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  currentTrack: TrackMetadata | null;
} {
  const all = getAllLessonsLinear();
  const index = all.findIndex(l => l.lesson_id === currentLessonId);
  if (index === -1) {
    return { prevLesson: null, nextLesson: null, currentTrack: null };
  }
  const currentLesson = all[index];
  const currentTrack = tracksMetadata.find(t => t.id === currentLesson.track_id) || null;
  return {
    prevLesson: index > 0 ? all[index - 1] : null,
    nextLesson: index < all.length - 1 ? all[index + 1] : null,
    currentTrack
  };
}
