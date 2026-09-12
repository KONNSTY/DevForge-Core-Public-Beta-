# DevForge Core [Public Beta]
> Dual-Engine Fullstack Lab (Interactive Client & Roslyn Server)

DevForge Core is a high-density, production-ready fullstack learning platform and portfolio showcase. It features a React (Next.js) frontend and a robust ASP.NET Core Minimal API backend with secure code execution environments for both browser (sandboxed iframe) and C# (Roslyn).

## Quick Start (Local Development)

You can launch the entire stack in under 2 minutes using Docker Compose or the provided shell scripts.

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
   - **Swagger Docs**: http://localhost:5000/swagger

### Option 2: Manual Start

**Frontend (Next.js)**:
```bash
cd frontend
npm ci
npm run dev
```

**Backend (ASP.NET Core)**:
```bash
cd backend
dotnet restore
dotnet run
```

## Architecture

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: ASP.NET Core 9, Minimal APIs, Clean Architecture / Vertical Slices.
- **Engines**: 
  - Client-side DOM/JS sandboxing via secure iframes.
  - Server-side C# execution via Microsoft.CodeAnalysis.CSharp.Scripting.
  - Server-side SQL execution via ephemeral in-memory SQLite connections.

## Recruiter Mode

Toggle **Recruiter Mode** from the sidebar to view architectural notes, system sequence diagrams, and complexity analysis for the underlying systems.
