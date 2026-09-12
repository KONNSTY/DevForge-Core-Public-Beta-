import curriculumData from '../data/curriculum.json';
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
  runtime: "browser_sandbox" | "roslyn_csharp" | "pyodide_python" | "sqlite_in_memory";
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
  {
    id: "web-grundlagen",
    order: 1,
    title: "1. Wie das Internet funktioniert",
    concept: "Browser, Server und wie Webseiten auf den Bildschirm kommen",
    localized_titles: {
      de: { title: "1. Wie das Internet funktioniert", concept: "Browser, Server und wie Webseiten auf den Bildschirm kommen" },
      en: { title: "1. How the Internet Works", concept: "Browsers, servers, and how packets turn into screens" },
      id: { title: "1. Cara Kerja Internet", concept: "Peramban, server, dan bagaimana halaman web ditampilkan" },
      zh: { title: "1. 互联网底层运行机制", concept: "浏览器、服务器与网页渲染全流程" },
      ko: { title: "1. 인터넷의 동작 원리", concept: "브라우저, 서버, 그리고 웹페이지가 화면에 렌더링되는 원리" },
      ja: { title: "1. インターネットの動作原理", concept: "ブラウザ、サーバー、Webページが画面に描画される仕組み" }
    }
  },
  {
    id: "html-einstieg",
    order: 2,
    title: "2. HTML – Das Skelett jeder Webseite",
    concept: "Texte, Buttons, Bilder und Formulare verständlich aufbauen",
    localized_titles: {
      de: { title: "2. HTML – Das Skelett jeder Webseite", concept: "Texte, Buttons, Bilder und Formulare verständlich aufbauen" },
      en: { title: "2. HTML – The Structural Skeleton", concept: "Semantic text, buttons, media, and accessible forms" },
      id: { title: "2. HTML – Kerangka Situs Web", concept: "Menyusun teks, tombol, gambar, dan formulir dengan mudah" },
      zh: { title: "2. HTML – 网页核心骨架", concept: "通俗构建文本、按钮、图片与高可用表单" },
      ko: { title: "2. HTML – 웹페이지의 뼈대", concept: "텍스트, 버튼, 이미지, 폼 요소를 직관적으로 구성하기" },
      ja: { title: "2. HTML – Webページの骨格", concept: "テキスト、ボタン、画像、フォームの構造的マークアップ" }
    }
  },
  {
    id: "css-einstieg",
    order: 3,
    title: "3. CSS – Kleidung und Design",
    concept: "Farben, Abstände, Flexbox und moderne Layouts ohne Frust",
    localized_titles: {
      de: { title: "3. CSS – Kleidung und Design", concept: "Farben, Abstände, Flexbox und moderne Layouts ohne Frust" },
      en: { title: "3. CSS – Styling and Layouts", concept: "Colors, box model, Flexbox, and CSS Grid without headaches" },
      id: { title: "3. CSS – Tata Letak & Gaya", concept: "Warna, jarak, Flexbox, dan tata letak modern tanpa frustrasi" },
      zh: { title: "3. CSS – 样式与现代布局", concept: "色彩、盒模型、Flexbox 与 Grid 现代化布局" },
      ko: { title: "3. CSS – 스타일링과 레이아웃", concept: "색상, 여백, Flexbox 및 CSS Grid를 활용한 직관적 디자인" },
      ja: { title: "3. CSS – スタイルとモダンレイアウト", concept: "カラー、ボックスモデル、Flexbox、CSS Gridの完全攻略" }
    }
  },
  {
    id: "js-programmieren",
    order: 4,
    title: "4. JavaScript – Das Gehirn der Webseite",
    concept: "Logik, Reaktionen auf Klicks, Daten speichern und Schleifen",
    localized_titles: {
      de: { title: "4. JavaScript – Das Gehirn der Webseite", concept: "Logik, Reaktionen auf Klicks, Daten speichern und Schleifen" },
      en: { title: "4. JavaScript – Client-side Brain", concept: "State, DOM events, asynchronous operations, and APIs" },
      id: { title: "4. JavaScript – Otak Halaman Web", concept: "Logika pemrograman, aksi klik, penyimpanan data, dan API" },
      zh: { title: "4. JavaScript – 网页的逻辑大脑", concept: "变量、函数、事件循环与网络数据请求" },
      ko: { title: "4. JavaScript – 웹페이지의 두뇌", concept: "논리 연산, 클릭 이벤트 처리, 데이터 저장 및 비동기 통신" },
      ja: { title: "4. JavaScript – 動的制御の頭脳", concept: "ロジック、イベント処理、データ保持、Fetch API" }
    }
  },
  {
    id: "ts-sicherheit",
    order: 5,
    title: "5. TypeScript – Der Sicherheitsgurt",
    concept: "Typen definieren, Fehler vor dem Ausführen verhindern",
    localized_titles: {
      de: { title: "5. TypeScript – Der Sicherheitsgurt", concept: "Typen definieren, Fehler vor dem Ausführen verhindern" },
      en: { title: "5. TypeScript – Safety Harness", concept: "Static typing, generics, interfaces, and compile-time guarantees" },
      id: { title: "5. TypeScript – Sabuk Pengaman Koding", concept: "Definisi tipe data, mencegah bug sebelum kode dijalankan" },
      zh: { title: "5. TypeScript – 工业级类型安全带", concept: "静态类型、接口契约与编译期缺陷阻截" },
      ko: { title: "5. TypeScript – 코드 안전벨트", concept: "타입 정의, 인터페이스 계약, 실행 전 버그 사전 차단" },
      ja: { title: "5. TypeScript – 型安全のシートベルト", concept: "型定義、インターフェース、コンパイル時エラー検出" }
    }
  },
  {
    id: "react-bausteine",
    order: 6,
    title: "6. React – Webseiten aus LEGO bauen",
    concept: "Wiederverwendbare Komponenten, State und moderne Web-Apps",
    localized_titles: {
      de: { title: "6. React – Webseiten aus LEGO bauen", concept: "Wiederverwendbare Komponenten, State und moderne Web-Apps" },
      en: { title: "6. React – Component Architecture", concept: "Reusable components, reactive state, and declarative UI" },
      id: { title: "6. React – Membangun Web dari LEGO", concept: "Komponen yang dapat digunakan kembali, state, dan aplikasi web" },
      zh: { title: "6. React – 积木式现代组件工程", concept: "可复用组件、响应式状态与虚拟 DOM" },
      ko: { title: "6. React – 레고 블록처럼 쌓는 웹", concept: "재사용 가능한 컴포넌트, 상태 관리, 최신 SPA 구조" },
      ja: { title: "6. React – LEGOのように組み立てるWeb", concept: "再利用可能なコンポーネント、State管理、現代的SPA構築" }
    }
  },
  {
    id: "csharp-backend",
    order: 7,
    title: "7. C# & .NET – Das Kraftwerk im Hintergrund",
    concept: "Objektorientierte Programmierung verständlich gemacht",
    localized_titles: {
      de: { title: "7. C# & .NET – Das Kraftwerk im Hintergrund", concept: "Objektorientierte Programmierung verständlich gemacht" },
      en: { title: "7. C# & .NET – Enterprise Engine", concept: "Strict typing, OOP architectures, LINQ, and CLR runtime" },
      id: { title: "7. C# & .NET – Pembangkit Tenaga Backend", concept: "Pemrograman berorientasi objek yang kuat dan terstruktur" },
      zh: { title: "7. C# & .NET – 高性能后端核心引擎", concept: "面向对象编程、强类型规范、LINQ 与 CLR 运行时" },
      ko: { title: "7. C# & .NET – 백엔드 엔진룸", concept: "객체 지향 프로그래밍, LINQ, 강력한 타입 시스템" },
      ja: { title: "7. C# & .NET – 堅牢なバックエンドエンジン", concept: "オブジェクト指向設計、LINQ、型安全なCLRランタイム" }
    }
  },
  {
    id: "aspnet-web-api",
    order: 8,
    title: "8. ASP.NET Core – Eigene APIs bauen",
    concept: "Wie das Backend dem Frontend antwortet",
    localized_titles: {
      de: { title: "8. ASP.NET Core – Eigene APIs bauen", concept: "Wie das Backend dem Frontend antwortet" },
      en: { title: "8. ASP.NET Core – High-Performance APIs", concept: "Minimal APIs, pipeline middleware, JSON contracts, and auth" },
      id: { title: "8. ASP.NET Core – Membangun Web API", concept: "Bagaimana backend merespons permintaan frontend" },
      zh: { title: "8. ASP.NET Core – 构建工业级 Web API", concept: "Minimal API 架构、管道中间件与高性能 JSON 响应" },
      ko: { title: "8. ASP.NET Core – 나만의 웹 API 구축", concept: "프론트엔드와 통신하는 고성능 백엔드 API 설계" },
      ja: { title: "8. ASP.NET Core – 高速Web APIの構築", concept: "フロントエンドと通信するエンドポイント設計とJSON応答" }
    }
  },
  {
    id: "datenbanken-sql",
    order: 9,
    title: "9. Datenbanken & SQL – Das Langzeitgedächtnis",
    concept: "Daten sicher in Tabellen speichern, verknüpfen und abfragen",
    localized_titles: {
      de: { title: "9. Datenbanken & SQL – Das Langzeitgedächtnis", concept: "Daten sicher in Tabellen speichern, verknüpfen und abfragen" },
      en: { title: "9. Databases & SQL – Persistent Memory", concept: "Relational tables, ACID transactions, queries, and joins" },
      id: { title: "9. Basis Data & SQL – Memori Jangka Panjang", concept: "Menyimpan data dengan aman, menghubungkan tabel, dan kueri" },
      zh: { title: "9. 数据库与 SQL – 系统的长期记忆", concept: "关系型表结构设计、ACID 事务与高效多表关联" },
      ko: { title: "9. 데이터베이스 & SQL – 영구 기억 저장소", concept: "데이터 테이블 설계, 인덱싱, 정밀 쿼리 및 JOIN 기법" },
      ja: { title: "9. データベースとSQL – データの長期記憶", concept: "テーブル設計、ACIDトランザクション、JOIN結合クエリ" }
    }
  },
  {
    id: "python-ki-lab",
    order: 10,
    title: "10. Extra-Pfad: Python & KI-Engineering",
    concept: "Getrennter Pfad für moderne KI-Programmierung, LLM-Anbindung und Prompts",
    localized_titles: {
      de: { title: "10. Extra-Pfad: Python & KI-Engineering", concept: "Getrennter Pfad für moderne KI-Programmierung, LLM-Anbindung und Prompts" },
      en: { title: "10. AI Engineering Track: Python & LLMs", concept: "Scripting, structured generation, tool use, and model APIs" },
      id: { title: "10. Jalur Ekstra: Python & Rekayasa AI", concept: "Pemrograman AI modern, integrasi LLM, dan manipulasi prompt" },
      zh: { title: "10. AI 专项工程：Python 与大模型开发", concept: "LLM 接口编排、结构化 JSON 输出与 AI 提示词工程" },
      ko: { title: "10. AI 엔지니어링 트랙: Python과 LLM 연동", concept: "파이썬 기초, LLM API 호출 및 Pydantic 기반 구조화 출력" },
      ja: { title: "10. AIエンジニアリング専攻: Python & LLM活用", concept: "スクリプト開発、LLM API連携、Pydantic構造化出力" }
    }
  }
];

export const lessons: Lesson[] = curriculumData as Lesson[];

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
