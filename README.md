# devForgeCore Powerd by Regler Productions - Polymath Productions
> Kostenlose, accountfreie Fullstack-Lernplattform mit lokalem Code-Labor

DevForge Core ist ein kostenloses Bildungsprodukt von [Regler Productions](https://reglerproductions.com/) / [Polymath Productions](https://reglerproductions.com/). Die App funktioniert ohne Accounts, ohne Login, ohne Profilserver und ohne API-Schlüssel. Lernfortschritt und XP bleiben im Browser.

## Quick Start (Local Development)

Du kannst die Oberfläche lokal mit Docker Compose oder den bereitgestellten Startskripten ausführen.

### Option 1: Docker Compose (Recommended)

1. Ensure Docker Desktop is running.
2. Run the shell script:
   ```bash
   chmod +x run-local.sh
   ./run-local.sh
   ```
   *Windows (PowerShell):*
   ```powershell
   .\run-local.ps1
   ```

3. The application will be available at:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **OpenAPI JSON**: http://localhost:5000/openapi/v1.json
   - **Isolated Python/C# runner**: http://localhost:2000 (bound to this computer only)

### Option 2: Manual Start

**Frontend (Next.js)**:
```bash
cd frontend
npm ci
npm run dev
```

To run Python and C# from this local Next.js server, start the isolated runner in another terminal from the project root:
```bash
docker compose up -d piston-init
```
The first start downloads the sandbox image plus the Python and .NET runtimes. HTML, CSS and JavaScript run in the browser sandbox and do not need this service.

**Backend (ASP.NET Core)**:
```bash
cd backend
dotnet restore
dotnet run
```

## Architektur

- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS und lokale Browser-Speicherung.
- **Browser-Labor**: HTML, CSS und JavaScript laufen in einem `allow-scripts`-iframe.
- **Codeausführung**: HTML, CSS und JavaScript laufen in einem sandboxed Browser-Iframe. Python 3.12 und C# laufen in Piston-Sandboxes mit deaktiviertem Netzwerk, begrenzter Laufzeit, Arbeitsspeicher- und Ausgabemenge.
- **SQL-Übungen**: Die Kursansicht stellt keinen SQL-Runner bereit; Aufgaben modellieren Abfragen, ohne sie an eine Datenbank zu senden.

## Datenschutz und Quellcode

Es werden keine Konten angelegt und keine Lernprofile synchronisiert. Die App benötigt keine externen KI-, Analyse- oder Authentifizierungsdienste. Der Quellcode enthält bewusst keine `LICENSE`-Datei; öffentliche Sichtbarkeit auf GitHub ist daher nicht automatisch eine Erlaubnis zum Kopieren oder Weiterverteilen.

Mehr über das Produkt und das [Polymath-Angebot](https://reglerproductions.com/preise.html).

## Recruiter Mode

Toggle **Recruiter Mode** from the sidebar to view architectural notes, system sequence diagrams, and complexity analysis for the underlying systems.

## Production ingress

The production container joins the external Docker network `polymath_intern` and listens on port `3000`. The shared Caddy reverse proxy must also join that network and load [`deploy/Caddyfile.devforge`](deploy/Caddyfile.devforge); this route provides HTTPS and proxies requests to `devforgecore:3000`. Piston runs on a separate `devforge_runner` network shared only with the Next.js app and its one-shot runtime installer. The Next.js `/api/execute` handler is the only public entry point for Python/C# code; it applies input and rate limits before forwarding code to Piston. Keep the proxy route with the deployment configuration so a Caddy rebuild cannot silently remove the DevForge hostname again.

## Lehrplan und Quellen

Die Lernbibliothek umfasst 110 frei zugängliche Lektionen in 16 Lernpfaden. Der CS50-Katalog enthält 11 aktive Kurse und zwei klar gekennzeichnete Archivkurse; alle 112 Vorlesungswochen verweisen auf passende Lernlektionen. Inhalte bereiten auf die Themen der HarvardX-Programme vor, ersetzen aber nicht deren offizielle Aufgaben und Bewertungen. Die Themenzuordnung, geprüften öffentlichen Quellen und Grenzen der Code-Laufzeiten stehen in [`docs/curriculum-coverage.md`](docs/curriculum-coverage.md). C, SQL, Scratch, R und Lua/React Native werden hier nicht nativ ausgeführt; betroffene Lektionen erklären die verfügbare Übungsalternative.
