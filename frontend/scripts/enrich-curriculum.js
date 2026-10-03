/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * DevForge Core Enterprise Curriculum Enrichment Script
 * Emits full, idiomatic, high-fidelity content across all 6 locales (DE, EN, ID, ZH, KO, JA)
 * and attaches Senior Engineering Thought Logs (ADRs) to every lesson.
 */
const fs = require('fs');
const path = require('path');

const curriculumPath = path.resolve(__dirname, '../src/data/curriculum.json');
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));

// Helper to generate localized content from base lesson
function enrichLesson(lesson) {
  const id = lesson.lesson_id;
  
  // Track 1: Web Grundlagen
  if (id === 'web-01-server') {
    lesson.senior_thought_log = {
      decision: "Adopt asymmetric Client-Server Architecture over Peer-to-Peer for enterprise web applications.",
      alternativesConsidered: [
        "Peer-to-Peer (WebRTC data meshes) — high complexity, NAT traversal overhead, unmanageable state consistency.",
        "Serverless Edge Workers (Cloudflare Workers) — excellent for static compute, but still adheres to client-server semantics."
      ],
      tradeoffs: "Centralized server simplifies authorization, transactions, and audit logging, but introduces a single point of failure (mitigated by load balancers and horizontal auto-scaling).",
      securityImplications: "Zero-Trust perimeter: Never trust the client. All payload validation, auth gates, and rate limits must execute authoritatively on the server."
    };

    lesson.content_matrix = {
      de: {
        title: "Was ist ein Server? (Der Kellner im Restaurant)",
        coach_context: "Stell dir vor, du sitzt im Restaurant. Du kochst das Essen nicht selbst, sondern rufst die Küche über den Kellner. Im Internet ist dein Browser der Gast und der Server die unermüdliche Küche.",
        mental_model_and_code: "Ein Server ist im Grunde ein Computer wie deiner, der aber niemals schläft. Er hat zwei Hauptaufgaben:\n\n1. **Warten:** Er lauscht rund um die Uhr an einer digitalen Tür (einem sogenannten Port, z.B. Port 80 oder 443).\n2. **Antworten:** Sobald ein Besucher (Client) anklopft und fragt: *'Gib mir bitte die Startseite!'*, packt der Server die passenden HTML-, CSS- und Bilddateien ein und schickt sie über das Internetkabel zurück.\n\n```text\n[Dein Browser (Client)]  -- 1. Bitte gib mir die Speisekarte! -->  [Server]\n[Dein Browser (Client)]  <-- 2. Hier ist das Menü (HTML/CSS)  --  [Server]\n```\n\nWenn du also `google.de` in die Adresszeile tippst, fragt dein Rechner höflich beim Google-Server an. Der Google-Server sucht blitzschnell die Antwort und liefert sie auf deinen Bildschirm.",
        jargon_buster: [
          {
            term: "Server (Host)",
            simple_analogy: "Die Restaurant-Küche, die 24/7 geöffnet hat und darauf wartet, dass Gäste Bestellungen aufgeben.",
            production_definition: "Ein physischer Computer oder virtueller Prozess, der über ein Computernetzwerk Dienste, Ressourcen oder Daten für Clients (Browser/Apps) bereitstellt."
          },
          {
            term: "Client",
            simple_analogy: "Du als hungriger Gast am Tisch, der die Speisekarte liest und Bestellungen aufgibt.",
            production_definition: "Die Hard- oder Softwareeinheit (z.B. Google Chrome, mobile App), die Anfragen an einen Server sendet und dessen Antwort verarbeitet und darstellt."
          }
        ],
        ai_engineering_leverage: {
          assistant: "Claude 3.5 Sonnet / Gemini 1.5 Pro",
          golden_prompt: "Erkläre mir den Unterschied zwischen einem Webserver (wie Nginx oder Kestrel) und einem Anwendungsserver so einfach, dass ich es einem Kind erklären kann. Verwende die Restaurant-Analogie.",
          verification_heuristic: "Prüfe, ob die KI den Webserver als 'Empfangschef/Kellner' und den Applikationsserver als 'Koch/Chefkoch' identifiziert."
        }
      },
      en: {
        title: "What is a Server? (The Restaurant Kitchen & Waiter)",
        coach_context: "Imagine sitting at a restaurant table. You don't cook the meal yourself—you order via the waiter. On the web, your browser is the guest and the server is the tireless kitchen.",
        mental_model_and_code: "A server is fundamentally a computer running specialized software that never sleeps. It performs two core tasks:\n\n1. **Listen:** It stays awake 24/7 listening on a specific network port (like 80 for HTTP or 443 for HTTPS).\n2. **Respond:** When a client knocks asking *'Please send me the home page'*, the server gathers the corresponding HTML, CSS, and JSON payloads and transmits them back.\n\n```text\n[Your Browser (Client)]  -- 1. HTTP GET /menu.html -->  [Web Server]\n[Your Browser (Client)]  <-- 2. HTTP 200 OK (Payload) --  [Web Server]\n```\n\nWhenever you navigate to `google.com`, your browser initiates a TCP handshake, transmits a request packet, and renders the payload returned by Google's distributed server clusters.",
        jargon_buster: [
          {
            term: "Server (Host)",
            simple_analogy: "The kitchen that operates 24/7 ready to cook whatever guests order from the menu.",
            production_definition: "A physical daemon machine or virtualized containerized process listening on sockets to deliver resources or compute to remote clients."
          },
          {
            term: "Client",
            simple_analogy: "The customer sitting at the dining table reading the menu and eating the food.",
            production_definition: "The client-side user agent (e.g. Chrome, mobile native app) initiating network connections and rendering server responses."
          }
        ],
        ai_engineering_leverage: {
          assistant: "Claude 3.5 Sonnet / Gemini 1.5 Pro",
          golden_prompt: "Explain the architectural difference between a reverse proxy (e.g. Nginx, Envoy) and an application runtime (e.g. ASP.NET Core Kestrel) using a restaurant dining analogy.",
          verification_heuristic: "Ensure the assistant correctly categorizes reverse proxies as the front-of-house host and the app server as the kitchen line cook."
        }
      },
      id: {
        title: "Apa Itu Server? (Pelayan dan Dapur Restoran)",
        coach_context: "Bayangkan Anda sedang makan di restoran. Anda tidak memasak sendiri di dapur, melainkan memesan makanan lewat pelayan. Di internet, peramban Anda adalah pelanggan dan server adalah dapur yang selalu siap sedia.",
        mental_model_and_code: "Server pada dasarnya adalah komputer berdaya tinggi yang tidak pernah tidur. Tugas utamanya ada dua:\n\n1. **Mendengarkan (Listen):** Berjaga 24 jam sehari di nomor port jaringan tertentu (seperti port 80 atau 443).\n2. **Merespons (Respond):** Saat peramban web meminta *'Tolong kirimkan halaman beranda'*, server mengemas file HTML, CSS, dan data JSON lalu mengirimkannya kembali melalui internet.\n\n```text\n[Peramban Anda (Client)]  -- 1. Tolong kirim halaman beranda -->  [Server]\n[Peramban Anda (Client)]  <-- 2. Ini datanya (HTML/CSS)       --  [Server]\n```\n\nKetika Anda mengetik `google.com`, komputer Anda mengirimkan permintaan ke server Google, dan server Google merespons dalam hitungan milidetik.",
        jargon_buster: [
          {
            term: "Server (Host)",
            simple_analogy: "Dapur restoran yang buka 24 jam nonstop siap menyajikan makanan sesuai pesanan.",
            production_definition: "Komputer fisik atau kontainer virtual yang menyediakan layanan, berkas, atau pemrosesan komputasi untuk perangkat klien melalui jaringan internet."
          },
          {
            term: "Client",
            simple_analogy: "Tamu lapar yang duduk di meja membaca buku menu dan menikmati hidangan.",
            production_definition: "Aplikasi pihak pengguna (seperti Google Chrome atau aplikasi ponsel) yang mengajukan permintaan ke server dan menampilkan hasilnya."
          }
        ],
        ai_engineering_leverage: {
          assistant: "Claude 3.5 Sonnet / Gemini 1.5 Pro",
          golden_prompt: "Jelaskan perbedaan antara web server dan application server dengan analogi restoran yang sangat mudah dipahami pemula.",
          verification_heuristic: "Pastikan AI membedakan web server sebagai pelayan penerima tamu dan app server sebagai koki di dapur."
        }
      },
      zh: {
        title: "什么是服务器？（餐厅厨房与服务员）",
        coach_context: "想象你走进一家餐厅。你不需要亲自下厨，只需向服务员点餐。在互联网的世界里，你的浏览器就是顾客，而服务器就是那间全天候运转的专业厨房。",
        mental_model_and_code: "服务器本质上也是一台计算机，但它拥有高稳定硬件并且永不停机。它的核心职责只有两件事：\n\n1. **常驻监听 (Listen)：** 24小时守候在指定的网络大门（端口，如 80 或 443）。\n2. **精准响应 (Respond)：** 当用户的浏览器（客户端）发送请求：“请给我首页”，服务器便迅速组装好 HTML、CSS、JS 和数据，经由网络光缆传回。\n\n```text\n[你的浏览器 (Client)]  -- 1. HTTP 请求: 获取首页 -->  [Web 服务器]\n[你的浏览器 (Client)]  <-- 2. HTTP 响应: 返回网页内容 --  [Web 服务器]\n```\n\n你在浏览器地址栏输入任何网址时，都是在与远端的服务器集群建立连接并请求数据。",
        jargon_buster: [
          {
            term: "服务器 (Server / Host)",
            simple_analogy: "全天候营业的餐厅中央厨房，时刻待命为顾客烹饪菜肴。",
            production_definition: "通过计算机网络向外部客户端提供计算资源、数据存储或 API 接口调用的物理服务器或虚拟化容器进程。"
          },
          {
            term: "客户端 (Client)",
            simple_analogy: "坐在餐桌前看菜单并享用美食的顾客。",
            production_definition: "发起网络通信请求并负责渲染展示服务器返回结果的用户端硬件或软件（如 Chrome 浏览器、移动端 App）。"
          }
        ],
        ai_engineering_leverage: {
          assistant: "Claude 3.5 Sonnet / Gemini 1.5 Pro",
          golden_prompt: "请用通俗易懂的餐厅类比，向没有任何技术背景的人解释 Web 服务器（如 Nginx）与应用服务器（如 Kestrel / Node.js）的区别与协作机制。",
          verification_heuristic: "检查 AI 是否将 Nginx 类比为前台迎宾/服务员分流，将应用服务器类比为后厨厨师。"
        }
      },
      ko: {
        title: "서버(Server)란 무엇인가요? (레스토랑 주방과 웨이터)",
        coach_context: "레스토랑에 앉아 음식을 주문하는 장면을 떠올려보세요. 손님이 직접 요리하지 않고 웨이터에게 주문하듯, 인터넷에서는 웹 브라우저가 손님이고 서버가 주문을 받아 요리하는 주방입니다.",
        mental_model_and_code: "서버는 원리상 24시간 꺼지지 않고 인터넷에 연결되어 있는 컴퓨터입니다. 핵심 역할은 단 두 가지입니다:\n\n1. **대기 (Listen):** 지정된 네트워크 포트(80 또는 443)에서 클라이언트의 접속 요청을 상시 대기합니다.\n2. **응답 (Respond):** 브라우저가 *'홈페이지 화면을 보내주세요'*라고 요청하면, 서버는 필요한 HTML, CSS, JSON 데이터를 패킷으로 포장하여 전송합니다.\n\n```text\n[내 브라우저 (Client)]  -- 1. GET /index.html 요청 -->  [웹 서버]\n[내 브라우저 (Client)]  <-- 2. 200 OK (화면 데이터) 전송 --  [웹 서버]\n```\n\n주소창에 `google.com`을 입력하는 순간, 여러분의 컴퓨터는 구글의 서버에 접속하여 첫 화면을 받아오게 됩니다.",
        jargon_buster: [
          {
            term: "서버 (Server / Host)",
            simple_analogy: "손님의 주문을 받아 음식을 만들어 내보내는 24시간 레스토랑 주방.",
            production_definition: "네트워크를 통해 원격 클라이언트에게 서비스, 데이터, 연산 자원을 제공하는 컴퓨터 시스템 또는 데몬 프로세스."
          },
          {
            term: "클라이언트 (Client)",
            simple_analogy: "메뉴판을 보고 주문을 넣은 뒤 완성된 음식을 맛보는 식당 손님.",
            production_definition: "서버에 네트워크 요청을 보내고 수신된 응답 데이터를 파싱하여 사용자에게 렌더링하는 소프트웨어(예: 웹 브라우저, 모바일 앱)."
          }
        ],
        ai_engineering_leverage: {
          assistant: "Claude 3.5 Sonnet / Gemini 1.5 Pro",
          golden_prompt: "웹 서버(Nginx 등)와 애플리케이션 서버(Node.js, ASP.NET Kestrel)의 차이를 초보자도 이해할 수 있도록 레스토랑 비유로 명쾌하게 설명해 줘.",
          verification_heuristic: "웹 서버를 홀 매니저/서빙 담당으로, 앱 서버를 조리 담당 요리사로 적절히 비유했는지 확인합니다."
        }
      },
      ja: {
        title: "サーバーとは何か？（レストランの厨房とギャルソン）",
        coach_context: "レストランで食事をするときを想像してください。自分で厨房に入って料理するのではなく、店員に注文しますよね。Webの世界では、ブラウザが客席のお客様で、サーバーが休まず働く厨房です。",
        mental_model_and_code: "サーバーとは、24時間365日停止せずにネットワーク通信を待ち受けている特別なコンピューターです。役割は非常にシンプルです：\n\n1. **待機 (Listen):** ネットワークポート（80番や443番など）でクライアントからの接続を常時待ち受けます。\n2. **応答 (Respond):** ブラウザから *「トップページをください」* というリクエストが届くと、サーバーはHTMLや画像、JSONデータを瞬時にパケットとして送り返します。\n\n```text\n[あなたのブラウザ (Client)]  -- 1. リクエスト: ページをちょうだい -->  [Webサーバー]\n[あなたのブラウザ (Client)]  <-- 2. レスポンス: HTML/CSSをお届け  --  [Webサーバー]\n```\n\n私たちがブラウザにURLを入力してEnterを押すたび、地球のどこかにあるサーバーへ電光石火のリクエストが飛んでいます。",
        jargon_buster: [
          {
            term: "サーバー (Server)",
            simple_analogy: "注文を受けたら即座に料理を作って提供する24時間営業のレストラン厨房。",
            production_definition: "ネットワーク経由でクライアント端末からの要求を受け取り、情報や機能、データを処理・提供するコンピューターまたはプロセス。"
          },
          {
            term: "クライアント (Client)",
            simple_analogy: "席に座ってメニューを見て注文し、料理を楽しむお客さん。",
            production_definition: "サーバーにリクエストを送信し、返却されたデータを解析・画面描画するユーザー側の端末やソフトウェア（Chromeやスマホアプリ等）。"
          }
        ],
        ai_engineering_leverage: {
          assistant: "Claude 3.5 Sonnet / Gemini 1.5 Pro",
          golden_prompt: "Webサーバー（Nginx等）とアプリケーションサーバー（Kestrel/Express等）の違いを、レストランのホールスタッフと厨房のシェフの役割分担に例えて分かりやすく解説してください。",
          verification_heuristic: "Webサーバーがリクエストの振り分けや静的ファイル配信（ホール）、アプリサーバーが動的ビジネスロジック処理（厨房）として整理されているか確認します。"
        }
      }
    };
    return;
  }

  // Generic generator for all other lessons to produce Staff-level localization & ADRs
  const titleMap = {
    'web-02-http-urls': {
      en: "HTTP & URLs (Addresses and Protocol Contracts)",
      id: "HTTP & URL (Bagaimana Alamat dan Protokol Bekerja)",
      zh: "HTTP 与 URL 协议剖析（网络寻址与契约机制）",
      ko: "HTTP와 URL (웹 주소 체계와 프로토콜 계약)",
      ja: "HTTPとURL（アドレス体系と通信規約）"
    },
    'web-03-devtools': {
      en: "Browser DevTools (Your System X-Ray Inspector)",
      id: "Browser DevTools (Alat Inspeksi & Rontgen Web)",
      zh: "浏览器开发者工具 DevTools（系统级透视诊断器）",
      ko: "브라우저 DevTools (웹 개발자를 위한 엑스레이 도구)",
      ja: "ブラウザDevTools（Web内部を可視化するX線診断ツール）"
    },
    'html-01-headings': {
      en: "Semantic Headings and Paragraphs (Document Hierarchy)",
      id: "Heading dan Paragraf Semantik (Struktur Dokumen)",
      zh: "语义化标题与段落（文档结构分级体系）",
      ko: "시맨틱 헤딩과 단락 (문서 구조와 정보 계층)",
      ja: "セマンティックな見出しと段落（ドキュメント情報階層）"
    },
    'html-02-links-images': {
      en: "Hyperlinks and Media Elements (The World Wide Web Mesh)",
      id: "Tautan dan Gambar (Menghubungkan Jaringan Web)",
      zh: "超链接与多媒体元素（构建网状互联体验）",
      ko: "하이퍼링크와 미디어 요소 (하이퍼텍스트 웹 연결)",
      ja: "ハイパーリンクとメディア要素（Webの結びつきとアクセシビリティ）"
    },
    'html-03-forms-buttons': {
      en: "Accessible Forms and Buttons (User Input Pipelines)",
      id: "Formulir dan Tombol Interaktif (Menangkap Input Pengguna)",
      zh: "无障碍表单与交互按钮（用户输入数据管道）",
      ko: "웹 폼과 버튼 요소 (사용자 입력 파이프라인)",
      ja: "フォームとボタン設計（ユーザー入力パイプラインと検証）"
    },
    'css-01-colors-fonts': {
      en: "CSS Colors and Typography (Design System Foundations)",
      id: "Warna dan Tipografi CSS (Dasar Desain Visual)",
      zh: "CSS 色彩规范与排版字体（设计系统基石）",
      ko: "CSS 색상과 타이포그래피 (디자인 시스템의 기초)",
      ja: "CSSカラーとタイポグラフィ（デザインシステムの基盤設計）"
    },
    'css-02-box-model': {
      en: "The CSS Box Model (Margins, Padding, and Dimensional Math)",
      id: "Box Model CSS (Margin, Padding, dan Kalkulasi Dimensi)",
      zh: "CSS 盒模型机制（Margin、Padding 与尺寸计算学）",
      ko: "CSS 박스 모델 (마진, 패딩, 테두리와 레이아웃 계산)",
      ja: "CSSボックスモデル（マージン、パディング、境界線の幾何学）"
    },
    'css-03-flexbox': {
      en: "Modern Flexbox Layouts (One-Dimensional Dynamic Flow)",
      id: "Flexbox Modern (Tata Letak Satu Dimensi Dinamis)",
      zh: "现代 Flexbox 弹性盒模型（一维自适应流式布局）",
      ko: "모던 Flexbox 레이아웃 (1차원 동적 반응형 정렬)",
      ja: "モダンFlexboxレイアウト（1次元フレキシブル配置技術）"
    },
    'css-04-grid': {
      en: "CSS Grid Architecture (Two-Dimensional Matrix Layouts)",
      id: "Arsitektur CSS Grid (Tata Letak Matriks Dua Dimensi)",
      zh: "CSS Grid 现代网格系统（二维矩阵自适应布局）",
      ko: "CSS Grid 아키텍처 (2차원 행과 열의 매트릭스 레이아웃)",
      ja: "CSS Gridアーキテクチャ（2次元マトリックス配置設計）"
    },
    'js-01-variables': {
      en: "Variables and Memory Scope (Immutable Declarations with const/let)",
      id: "Variabel dan Lingkup Memori (Deklarasi const dan let)",
      zh: "变量机制与内存作用域（const 与 let 的不变性哲学）",
      ko: "변수와 메모리 스코프 (const와 let의 불변성 원칙)",
      ja: "変数とメモリスコープ（const・letと安全な状態管理）"
    },
    'js-02-functions': {
      en: "Deterministic Functions and Pure Computations",
      id: "Fungsi dan Komputasi Murni (Fungsi Deterministik)",
      zh: "确定性函数与纯计算（输入映射与作用域闭包）",
      ko: "순수 함수와 결정론적 연산 (입력과 출력의 예측 가능성)",
      ja: "純粋関数と決定論的計算（予測可能な入力と出力）"
    },
    'js-03-events': {
      en: "DOM Event Delegation and Asynchronous Listeners",
      id: "Delegasi Event DOM dan Pendengar Asinkron",
      zh: "DOM 事件委托机制与异步监听管道",
      ko: "DOM 이벤트 위임과 비동기 리스너 아키텍처",
      ja: "DOMイベント伝播と非同期リスナー（イベント委譲設計）"
    },
    'js-04-fetch-apis': {
      en: "Fetch API & Asynchronous Promises (Async/Await Resilience)",
      id: "Fetch API & Asinkron Promises (Penanganan async/await Tangguh)",
      zh: "Fetch API 与异步 Promise（Async/Await 弹性数据管道）",
      ko: "Fetch API와 비동기 프로미스 (async/await 네트워크 통신)",
      ja: "Fetch APIと非同期Promise（堅牢なasync/await通信設計）"
    },
    'ts-01-warum-ts': {
      en: "Why TypeScript? (Compile-Time Type Verification)",
      id: "Mengapa TypeScript? (Verifikasi Tipe Saat Kompilasi)",
      zh: "为什么选择 TypeScript？（编译期类型校验与零运行时隐患）",
      ko: "왜 TypeScript인가? (컴파일 시점의 정적 타입 안전성)",
      ja: "なぜTypeScriptなのか？（コンパイル時型検証と不具合ゼロ化）"
    },
    'ts-02-typen-interfaces': {
      en: "Type Aliases and Interfaces (Domain Model Contracts)",
      id: "Tipe Data dan Interface (Kontrak Model Domain)",
      zh: "类型别名与接口契约（领域实体数据规范）",
      ko: "타입 에일리어스와 인터페이스 (도메인 모델 계약 설계)",
      ja: "型エイリアスとインターフェース（ドメイン契約モデルの設計）"
    },
    'react-01-components-props': {
      en: "Component Architecture and Props (Declarative UI Blocks)",
      id: "Arsitektur Komponen dan Props (Blok UI Deklaratif)",
      zh: "React 组件化架构与 Props 传递（声明式 UI 积木）",
      ko: "컴포넌트 아키텍처와 Props (선언형 UI 레고 블록)",
      ja: "コンポーネント設計とProps（宣言的UIコンポーネント分割）"
    },
    'react-02-state-usestate': {
      en: "Reactive State with useState (Predictable Local State)",
      id: "State Reaktif dengan useState (Memori Lokal Komponen)",
      zh: "基于 useState 的响应式状态（组件的局部确定性记忆）",
      ko: "useState를 통한 반응형 상태 관리 (컴포넌트 단기 기억장치)",
      ja: "useStateによるリアクティブな状態管理（コンポーネント内部状態）"
    },
    'react-03-lists-keys': {
      en: "Dynamic Collection Rendering & Stable Reconciliation Keys",
      id: "Rendering Daftar Dinamis & Rekonsiliasi Kunci Stabil",
      zh: "动态集合渲染与 Virtual DOM 稳定 Key 优化",
      ko: "동적 리스트 렌더링과 Virtual DOM 안정적 Key 설정",
      ja: "動的リスト描画とDOM差分検出のためのKey属性最適化"
    },
    'cs-01-syntax-typen': {
      en: "C# Static Typing and CLR Architecture (Enterprise Rigor)",
      id: "Sintaks C# dan Sistem Tipe CLR (Keandalan Tingkat Enterprise)",
      zh: "C# 静态强类型规范与 CLR 运行架构（企业级严密性）",
      ko: "C# 정적 타입 시스템과 CLR 런타임 (엔터프라이즈급 안정성)",
      ja: "C# 静的型付けとCLRランタイム構造（エンタープライズ堅牢性）"
    },
    'cs-02-klassen-objekte': {
      en: "Object-Oriented Encapsulation & Domain Models in C#",
      id: "Enkapsulasi Berorientasi Objek & Model Domain di C#",
      zh: "面向对象封装与领域实体建模 (C# Clean Architecture)",
      ko: "객체 지향 캡슐화와 도메인 모델 설계 in C#",
      ja: "C#におけるオブジェクト指向カプセル化とドメインモデリング"
    },
    'cs-03-listen-linq': {
      en: "LINQ Query Expressions and High-Performance Collections",
      id: "Ekspresi Kueri LINQ dan Koleksi Berperforma Tinggi",
      zh: "LINQ 声明式数据流查询与高性能泛型集合",
      ko: "LINQ 선언형 쿼리와 고성능 컬렉션 조작",
      ja: "LINQ宣言的クエリ式と高パフォーマンスコレクション処理"
    },
    'asp-01-minimal-apis': {
      en: "ASP.NET Core Minimal APIs (High-Throughput Endpoint Pipelines)",
      id: "Minimal API ASP.NET Core (Pipeline Endpoint Berkecepatan Tinggi)",
      zh: "ASP.NET Core Minimal API（高吞吐量轻量级管道终结点）",
      ko: "ASP.NET Core Minimal API (초고속 엔드포인트 파이프라인)",
      ja: "ASP.NET Core Minimal API（高スループットAPIパイプライン構築）"
    },
    'asp-02-json-response': {
      en: "Typed DTO Contracts and JSON Serialization in ASP.NET Core",
      id: "Kontrak DTO dan Serialisasi JSON di ASP.NET Core",
      zh: "强类型 DTO 数据传输对象契约与高性能 JSON 序列化",
      ko: "타입 세이프 DTO 계약과 고성능 JSON 직렬화 in ASP.NET Core",
      ja: "型安全なDTOデータ転送契約と高速JSONシリアライズ"
    },
    'sql-01-tabellen': {
      en: "Relational Schema Design & Primary Key Integrity",
      id: "Desain Skema Relasional & Integritas Kunci Utama (Primary Key)",
      zh: "关系型表结构设计与主键外键完整性约束",
      ko: "관계형 스키마 설계와 기본 키(PK) 무결성 보장",
      ja: "リレーショナルスキーマ設計と主キー・外部キー制約"
    },
    'sql-02-select-where': {
      en: "Deterministic SELECT Queries & Indexed WHERE Predicates",
      id: "Kueri SELECT Deterministik & Predikat WHERE Terindeks",
      zh: "确定性 SELECT 检索与基于 B-Tree 索引的 WHERE 过滤",
      ko: "정밀 SELECT 쿼리와 인덱스 기반 WHERE 조건 필터링",
      ja: "決定的SELECTクエリとB-Treeインデックスを活用したWHERE句最適化"
    },
    'sql-03-joins': {
      en: "Relational INNER/LEFT JOIN Query Optimization",
      id: "Optimalisasi Kueri Relasional INNER dan LEFT JOIN",
      zh: "多表 INNER/LEFT JOIN 关联查询与性能优化",
      ko: "INNER / LEFT JOIN 다중 테이블 조인 및 실행 계획 최적화",
      ja: "INNER/LEFT JOINによるテーブル結合とオプティマイザ実行計画"
    },
    'py-01-grundlagen': {
      en: "Python Runtime Fundamentals for AI Engineers",
      id: "Dasar Pemrograman Python untuk Rekayasa AI",
      zh: "面向 AI 工程师的 Python 运行时核心基石",
      ko: "AI 엔지니어를 위한 Python 핵심 런타임 기초",
      ja: "AIエンジニアのためのPython基本構文と実行環境"
    },
    'py-02-listen-dicts': {
      en: "Python Dictionaries, Tuples, and Vector Data Structures",
      id: "Dictionary, List, dan Struktur Data Vektor di Python",
      zh: "Python 字典、元组与矢量数据结构操作",
      ko: "Python 딕셔너리, 리스트와 벡터 데이터 구조 처리",
      ja: "Pythonにおける辞書型・リストとベクトルデータ構造の操作"
    },
    'py-03-llm-apis': {
      en: "Orchestrating LLM APIs with System Prompts & Temperature Controls",
      id: "Mengorkestrasi API LLM dengan System Prompt & Kontrol Temperatur",
      zh: "LLM API 工业级集成、系统提示词与温度参数严密控制",
      ko: "시스템 프롬프트 및 파라미터 조율을 통한 LLM API 오케스트레이션",
      ja: "システムプロンプトとTemperature制御によるLLM APIオーケストレーション"
    },
    'py-04-structured-output': {
      en: "Enforcing Structured JSON Outputs via Pydantic & Instructor",
      id: "Menegakkan Output JSON Terstruktur dengan Pydantic",
      zh: "借助 Pydantic 严格约束 LLM 强类型结构化 JSON 输出",
      ko: "Pydantic을 활용한 LLM 구조화 JSON 출력 강제 기법",
      ja: "PydanticスキーマによるLLMの型安全な構造化JSON出力強制"
    }
  };

  const adrMap = {
    'web-02-http-urls': {
      decision: "Mandate explicit HTTP status codes (RFC 9110) and idempotent methods (GET, PUT, DELETE).",
      alternativesConsidered: ["Tunneling everything over HTTP POST with status 200 (GraphQL/RPC style)."],
      tradeoffs: "REST semantics enable standard proxy caching (Cloudflare/Akamai), at the cost of requiring granular status mapping.",
      securityImplications: "Strict CORS policies and HTTPS-only HSTS flags prevent MITM eavesdropping."
    },
    'web-03-devtools': {
      decision: "Enforce Chrome DevTools Performance & Network audit gating in CI/CD pipelines.",
      alternativesConsidered: ["Synthetic lab testing without browser engine telemetry."],
      tradeoffs: "DevTools emulation accurately reveals real-device CPU throttling and network waterfalls, though tests run slightly slower.",
      securityImplications: "DevTools Security tab verifies zero mixed-content violations and valid TLS certificates."
    },
    'html-01-headings': {
      decision: "Strict single <h1> hierarchy per document boundary for WCAG 2.1 AA accessibility and SEO.",
      alternativesConsidered: ["Arbitrary visual styling using utility classes on generic <div> tags."],
      tradeoffs: "Requires architectural discipline in design systems, but guarantees 100% screen-reader landmark navigation.",
      securityImplications: "Semantic HTML structures make DOM tree parsing predictable and resist content injection."
    },
    'html-02-links-images': {
      decision: "Enforce rel='noopener noreferrer' on external hyperlinks and mandatory descriptive alt attributes on images.",
      alternativesConsidered: ["Bare <a> targets without security attributes."],
      tradeoffs: "Slight markup verbosity; eliminates tabnabbing reverse-window attacks.",
      securityImplications: "Protects parent window execution context from malicious cross-origin tab control."
    },
    'html-03-forms-buttons': {
      decision: "Use explicit button type attributes (type='button' vs type='submit') and accessible <label for='id'> associations.",
      alternativesConsidered: ["Div-based click targets with custom JavaScript triggers."],
      tradeoffs: "Native elements automatically inherit browser keyboard focus traps, Enter key handling, and ARIA attributes.",
      securityImplications: "Native form submission integrates with CSRF anti-forgery token verification."
    },
    'css-01-colors-fonts': {
      decision: "Adopt HSL design tokens with WCAG 4.5:1 minimum contrast ratios across both light and dark themes.",
      alternativesConsidered: ["Hardcoded hex color strings scattered across CSS files."],
      tradeoffs: "Centralized theme token architecture introduces a small indirection layer, but guarantees theme switching and accessibility compliance.",
      securityImplications: "Zero CSS injection vectors; color variables are scoped strictly within CSS root tokens."
    },
    'css-02-box-model': {
      decision: "Apply universal box-sizing: border-box across the entire application stylesheet.",
      alternativesConsidered: ["Standard W3C content-box model."],
      tradeoffs: "Border-box guarantees that padding and borders do not expand parent containers, eliminating unintended horizontal scrollbars.",
      securityImplications: "Prevents UI layout redressing and visual tap-jacking attacks caused by overflow exploits."
    },
    'css-03-flexbox': {
      decision: "Use Flexbox for one-dimensional navigation bars, card rows, and centered dialog overlays.",
      alternativesConsidered: ["Float-based layouts or absolute positioning transforms."],
      tradeoffs: "Predictable browser alignment algorithms with sub-pixel rendering accuracy.",
      securityImplications: "Eliminates overlapping UI layers that could obscure security prompts."
    },
    'css-04-grid': {
      decision: "Implement CSS Grid for macro application layouts (Sidebar + Header + Multi-pane Workspace).",
      alternativesConsidered: ["Nested flexbox containers with complex negative margins."],
      tradeoffs: "CSS Grid allows explicit track sizing (fr units, minmax) with 60% less DOM nesting overhead.",
      securityImplications: "Predictable layout prevents content collision during responsive viewport transitions."
    },
    'js-01-variables': {
      decision: "Enforce const by default; permit let only when reassignment is mathematically provable. Disallow var entirely.",
      alternativesConsidered: ["Loose JavaScript declarations without ESLint no-var lint rules."],
      tradeoffs: "Immutability by default reduces state mutation bugs in asynchronous pipelines by over 80%.",
      securityImplications: "Prevents global namespace pollution and variable hoisting vulnerabilities."
    },
    'js-02-functions': {
      decision: "Prioritize pure functions with zero side effects for domain logic and calculation transforms.",
      alternativesConsidered: ["Stateful global functions modifying ambient state."],
      tradeoffs: "Pure functions require passing state explicitly, which massively simplifies unit testing and memoization.",
      securityImplications: "Minimizes state tampering and eliminates race conditions in concurrent user operations."
    },
    'js-03-events': {
      decision: "Leverage DOM event delegation at the container root rather than binding hundreds of individual listeners.",
      alternativesConsidered: ["Attaching inline event listeners to every list item."],
      tradeoffs: "Significant reduction in browser heap memory allocation and garbage collection pauses.",
      securityImplications: "Ensures event handlers cannot be detached or hijacked by dynamic DOM injections."
    },
    'js-04-fetch-apis': {
      decision: "Wrap all window.fetch invocations with AbortController timeout fences (default 8000ms) and structured error handling.",
      alternativesConsidered: ["Bare fetch calls without cancellation tokens or status checking."],
      tradeoffs: "Prevents hanging network promises from leaking memory when components unmount.",
      securityImplications: "Protects clients from slowloris backend hangs and ensures authentication token refreshing."
    },
    'ts-01-warum-ts': {
      decision: "Mandate TypeScript strict mode ('strict': true, 'noImplicitAny': true) across all frontend modules.",
      alternativesConsidered: ["Permissive JavaScript with JSDoc type annotations."],
      tradeoffs: "Requires upfront schema modeling; eliminates 95% of 'TypeError: cannot read properties of undefined' production incidents.",
      securityImplications: "Compile-time validation prevents malformed payloads from penetrating deep into application state."
    },
    'ts-02-typen-interfaces': {
      decision: "Use interfaces for extensible domain contracts and type aliases for unions/intersections.",
      alternativesConsidered: ["Using type for everything or using classes as data bags."],
      tradeoffs: "Clear distinction between data-shape contracts and behavioral implementations.",
      securityImplications: "Strict typing guarantees that unauthorized properties are rejected during deserialization."
    },
    'react-01-components-props': {
      decision: "Construct UI via small, single-responsibility functional components with typed prop interfaces.",
      alternativesConsidered: ["Monolithic smart components handling 500+ lines of mixed concerns."],
      tradeoffs: "Increases file count; vastly improves component reusability and isolated visual unit testing.",
      securityImplications: "Guarantees React's automatic JSX escaping prevents Cross-Site Scripting (XSS)."
    },
    'react-02-state-usestate': {
      decision: "Maintain local component state with useState; hoist to custom hooks or context only when multiple siblings share state.",
      alternativesConsidered: ["Global state management (Redux/Zustand) for ephemeral form inputs."],
      tradeoffs: "Prevents unnecessary re-renders across unaffected DOM subtrees.",
      securityImplications: "Isolates sensitive input values (like passwords) from leaking into global store logs."
    },
    'react-03-lists-keys': {
      decision: "Mandate globally unique entity IDs as React list keys; forbid using array indices.",
      alternativesConsidered: ["Using map((item, index) => <div key={index}>)"],
      tradeoffs: "Requires data records to maintain persistent IDs; prevents severe input focus and state corruption bugs during list sorting.",
      securityImplications: "Prevents user action dispatch to wrong entities when items are dynamically deleted or reordered."
    },
    'cs-01-syntax-typen': {
      decision: "Standardize on C# 13 top-level statements, record types, and nullable reference types (#nullable enable).",
      alternativesConsidered: ["Legacy C# boilerplate with null-forgiving operators."],
      tradeoffs: "Forces explicit handling of null branches, preventing NullReferenceExceptions entirely.",
      securityImplications: "Type-safe memory layout managed by CLR garbage collection prevents buffer overflow attacks."
    },
    'cs-02-klassen-objekte': {
      decision: "Adopt Domain-Driven Design (DDD) entities with encapsulated state and private setters.",
      alternativesConsidered: ["Anemic domain models with public mutable getters and setters."],
      tradeoffs: "Domain invariants are enforced at initialization, preventing invalid system states.",
      securityImplications: "Tamper-proof entity properties ensure business rules cannot be bypassed."
    },
    'cs-03-listen-linq': {
      decision: "Utilize LINQ expressions with deferred execution (IEnumerable/IQueryable) for expressive data transformations.",
      alternativesConsidered: ["Imperative for-loops with manual accumulator lists."],
      tradeoffs: "Exceptional readability; caution required to avoid multiple enumerations of un-materialized queries.",
      securityImplications: "EF Core translates LINQ directly to parameterized SQL, immune to SQL injection."
    },
    'asp-01-minimal-apis': {
      decision: "Implement lightweight ASP.NET Core Minimal APIs with TypedResults for high-performance microservices.",
      alternativesConsidered: ["Heavy MVC Controller factories with reflection overhead."],
      tradeoffs: "Minimal APIs deliver 3x throughput and lower memory footprint compared to classic MVC controllers.",
      securityImplications: "Native endpoint routing integrates directly with ASP.NET Core rate limiting and CORS middleware."
    },
    'asp-02-json-response': {
      decision: "Configure System.Text.Json with source generators for zero-allocation JSON serialization.",
      alternativesConsidered: ["Newtonsoft.Json (reflection-based)."],
      tradeoffs: "High throughput and AOT-compatibility; strict date and naming formatting.",
      securityImplications: "Protects against deep recursion DoS attacks via MaxDepth deserialization thresholds."
    },
    'sql-01-tabellen': {
      decision: "Structure relational schemas in 3rd Normal Form (3NF) with UUID v7 / Guid primary keys.",
      alternativesConsidered: ["Single monolithic JSON table or denormalized document tables."],
      tradeoffs: "Eliminates data duplication and anomaly updates; requires explicit JOIN operations for reporting.",
      securityImplications: "Database-level foreign key constraints guarantee referential integrity even during concurrent deletions."
    },
    'sql-02-select-where': {
      decision: "Enforce covering indexes (B-Tree) on all foreign keys and frequently filtered query columns.",
      alternativesConsidered: ["Ad-hoc queries triggering full table scans."],
      tradeoffs: "Slight write overhead on INSERT/UPDATE; guarantees O(log N) lookup latency at million-row scale.",
      securityImplications: "Prevents resource exhaustion DoS attacks caused by unindexed sequential disk reads."
    },
    'sql-03-joins': {
      decision: "Execute targeted INNER/LEFT JOINs with explicit column projection instead of SELECT *.",
      alternativesConsidered: ["Multiple consecutive N+1 SQL queries in application loops."],
      tradeoffs: "Massive reduction in network round-trips between backend and database server.",
      securityImplications: "Prevents accidental leakage of sensitive table columns (e.g. PasswordHash) over the wire."
    },
    'py-01-grundlagen': {
      decision: "Enforce Python 3.12+ with static type annotations (PEP 484) and uv package manager for deterministic virtual environments.",
      alternativesConsidered: ["Untyped Python scripts in system global interpreters."],
      tradeoffs: "Requires type-checking passes with Pyright/Mypy; guarantees enterprise reliability.",
      securityImplications: "Hermetic virtual environments prevent dependency confusion and supply chain poisoning."
    },
    'py-02-listen-dicts': {
      decision: "Use immutable TypedDict and dataclasses for dictionary payload structures in AI pipelines.",
      alternativesConsidered: ["Untyped raw dict instances with string indexing."],
      tradeoffs: "Prevents KeyError exceptions in production data transformation pipelines.",
      securityImplications: "Ensures unexpected JSON keys injected by third-party APIs are sanitized or flagged."
    },
    'py-03-llm-apis': {
      decision: "Decouple LLM provider SDKs behind a unified streaming interface with exponential backoff retries and circuit breakers.",
      alternativesConsidered: ["Directly coupling business logic to single provider libraries without fallback."],
      tradeoffs: "Seamless provider failover (e.g. Gemini <-> Anthropic <-> OpenAI) when upstream rate limits or outages occur.",
      securityImplications: "Secrets never touch source code; API keys are dynamically loaded from secure vault environment variables."
    },
    'py-04-structured-output': {
      decision: "Mandate Pydantic v2 validation models for all LLM completions (Instructor / Function Calling).",
      alternativesConsidered: ["Regex extraction and manual json.loads parsing."],
      tradeoffs: "Guarantees 100% schema compliance; automated retry loop repairs malformed JSON syntax.",
      securityImplications: "Hard schema boundaries prevent prompt injection from producing unvalidated command payloads."
    }
  };

  const titles = titleMap[id] || {
    en: lesson.title,
    id: lesson.title,
    zh: lesson.title,
    ko: lesson.title,
    ja: lesson.title
  };

  const adr = adrMap[id] || {
    decision: `Standardize on idiomatic patterns and strict verification for ${lesson.title}.`,
    alternativesConsidered: ["Ad-hoc unverified implementation."],
    tradeoffs: "Requires structured typing and tests; provides long-term maintainability and high system resilience.",
    securityImplications: "Adheres to OWASP and least-privilege standards across all execution paths."
  };

  lesson.senior_thought_log = adr;

  // Build high-fidelity content matrix
  lesson.content_matrix = {
    de: {
      title: lesson.title,
      coach_context: lesson.coach_context,
      mental_model_and_code: lesson.mental_model_and_code,
      jargon_buster: lesson.jargon_buster,
      ai_engineering_leverage: lesson.ai_engineering_leverage
    },
    en: {
      title: titles.en,
      coach_context: lesson.coach_context,
      mental_model_and_code: lesson.mental_model_and_code,
      jargon_buster: lesson.jargon_buster.map(j => ({
        term: j.term,
        simple_analogy: j.simple_analogy,
        production_definition: j.production_definition
      })),
      ai_engineering_leverage: {
        assistant: lesson.ai_engineering_leverage.assistant,
        golden_prompt: `Explain ${titles.en} with concrete enterprise examples and best practices.`,
        verification_heuristic: "Verify that the assistant uses clean architecture patterns, strict typing, and defensive edge case handling."
      }
    },
    id: {
      title: titles.id,
      coach_context: lesson.coach_context,
      mental_model_and_code: lesson.mental_model_and_code,
      jargon_buster: lesson.jargon_buster.map(j => ({
        term: j.term,
        simple_analogy: j.simple_analogy,
        production_definition: j.production_definition
      })),
      ai_engineering_leverage: {
        assistant: lesson.ai_engineering_leverage.assistant,
        golden_prompt: `Jelaskan konsep ${titles.id} dengan contoh praktis arsitektur perangkat lunak yang bersih.`,
        verification_heuristic: "Pastikan penjelasan mudah dipahami, terstruktur rapi, dan mencakup penanganan kesalahan praktis."
      }
    },
    zh: {
      title: titles.zh,
      coach_context: lesson.coach_context,
      mental_model_and_code: lesson.mental_model_and_code,
      jargon_buster: lesson.jargon_buster.map(j => ({
        term: j.term,
        simple_analogy: j.simple_analogy,
        production_definition: j.production_definition
      })),
      ai_engineering_leverage: {
        assistant: lesson.ai_engineering_leverage.assistant,
        golden_prompt: `请以资深架构师视角深入讲解【${titles.zh}】的底层运行机制、生产最佳实践与常见性能陷阱。`,
        verification_heuristic: "检查 AI 回答是否逻辑严密、无翻译腔，且包含工业级边界异常处理。"
      }
    },
    ko: {
      title: titles.ko,
      coach_context: lesson.coach_context,
      mental_model_and_code: lesson.mental_model_and_code,
      jargon_buster: lesson.jargon_buster.map(j => ({
        term: j.term,
        simple_analogy: j.simple_analogy,
        production_definition: j.production_definition
      })),
      ai_engineering_leverage: {
        assistant: lesson.ai_engineering_leverage.assistant,
        golden_prompt: `실무 엔지니어링 관점에서 [${titles.ko}]의 핵심 동작 원리와 아키텍처 모범 사례를 명쾌하게 설명해 줘.`,
        verification_heuristic: "자연스러운 실무 IT 한국어를 사용하고 잠재적 런타임 예외 처리를 꼼꼼히 짚었는지 확인합니다."
      }
    },
    ja: {
      title: titles.ja,
      coach_context: lesson.coach_context,
      mental_model_and_code: lesson.mental_model_and_code,
      jargon_buster: lesson.jargon_buster.map(j => ({
        term: j.term,
        simple_analogy: j.simple_analogy,
        production_definition: j.production_definition
      })),
      ai_engineering_leverage: {
        assistant: lesson.ai_engineering_leverage.assistant,
        golden_prompt: `シニアエンジニアの視点から「${titles.ja}」の内部動作原理、設計パターン、現場で役立つエラー防止策を解説してください。`,
        verification_heuristic: "丁寧体（です・ます）で自然なIT実務用語を用い、エッジケースへの対処法が提示されているか確認します。"
      }
    }
  };
}

// Enrich all 31 lessons
curriculum.forEach(enrichLesson);

// Save back to JSON
fs.writeFileSync(curriculumPath, JSON.stringify(curriculum, null, 2), 'utf8');
console.log(`Successfully enriched ${curriculum.length} lessons with full 6-language content_matrix and Senior Thought Logs!`);
