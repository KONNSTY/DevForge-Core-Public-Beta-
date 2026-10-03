"use client";

import React, { useState } from "react";
import { CodeEditor, Language } from "./code-editor";
import { Sandbox, SandboxResult } from "./sandbox";
import { Play, RotateCcw, Lightbulb } from "lucide-react";

async function executeCode(language: "csharp" | "python", code: string) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), language === "csharp" ? 35_000 : 15_000);

  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      throw new Error(data?.error || `Lokaler ${language}-Runner antwortete mit ${response.status}.`);
    }

    return data;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export interface PlaygroundProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  initialCsharp?: string;
  initialPython?: string;
  defaultLanguage?: Language;
  solutionCode?: string;
}

export function Playground({
  initialHtml = "<h1>Playground</h1>",
  initialCss = "h1 { color: #3b82f6; }",
  initialJs = "console.log('Hello from JS');",
  initialCsharp = 'using System;\n\nConsole.WriteLine("Hello from C#");',
  initialPython = 'print("Hello from Python")',
  defaultLanguage = "html",
  solutionCode = ""
}: PlaygroundProps) {
  const [activeTab, setActiveTab] = useState<Language>(defaultLanguage);
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [cssContent, setCssContent] = useState(initialCss);
  const [jsContent, setJsContent] = useState(initialJs);
  const [csharpContent, setCsharpContent] = useState(initialCsharp);
  const [pythonContent, setPythonContent] = useState(initialPython);
  
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [sandboxExecutionId, setSandboxExecutionId] = useState(0);

  const handleRun = async (language: "csharp" | "python", code: string) => {
    setIsExecuting(true);
    setOutputLogs([`${language === "csharp" ? "C#" : "Python"}-Sandbox wird gestartet …`]);
    try {
      const data = await executeCode(language, code);
      if (data.success) {
        setOutputLogs(data.logs?.length ? data.logs.map(String) : ["Ausführung ohne Ausgabe abgeschlossen."]);
      } else {
        setOutputLogs([`Fehler: ${data.error || "Unbekannter Fehler"}`, ...(data.logs?.map(String) ?? [])]);
      }
    } catch (error) {
      setOutputLogs([error instanceof DOMException && error.name === "AbortError"
        ? "Zeitüberschreitung: Der isolierte Runner antwortet nicht."
        : error instanceof Error ? error.message : "Der isolierte Code-Runner ist gerade nicht erreichbar."]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSandboxResult = (result: SandboxResult) => {
    if (result.success) {
      setOutputLogs(result.logs.map((log) => {
        try {
          return JSON.stringify(log) ?? String(log);
        } catch {
          return String(log);
        }
      }));
    } else {
      setOutputLogs([`Sandbox Error: ${result.error}`]);
    }
  };

  return (
    <div className="flex min-h-[520px] h-[min(680px,calc(100dvh-210px))] flex-col overflow-hidden rounded-lg border bg-background sm:min-h-[560px] sm:h-[min(680px,calc(100dvh-190px))]">
      <div className="flex flex-col gap-2 border-b bg-muted/40 p-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 space-x-1 overflow-x-auto sm:space-x-2">
          {(["html", "css", "javascript", "csharp", "python"] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`min-h-10 shrink-0 rounded-md px-3 py-1 text-sm transition-colors sm:min-h-9 sm:px-4 ${activeTab === lang ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (activeTab === "html") setHtmlContent(initialHtml);
              if (activeTab === "css") setCssContent(initialCss);
              if (activeTab === "javascript") setJsContent(initialJs);
              if (activeTab === "python") setPythonContent(initialPython);
              if (activeTab === "csharp") setCsharpContent(initialCsharp);
              setOutputLogs([]);
            }}
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-md border px-2 text-xs sm:min-h-9"
          ><RotateCcw size={13} /> Zurücksetzen</button>
          {solutionCode && (
            <button
              type="button"
              onClick={() => {
                if (activeTab === "html") setHtmlContent(solutionCode);
                if (activeTab === "javascript") setJsContent(solutionCode);
                if (activeTab === "python") setPythonContent(solutionCode);
                if (activeTab === "csharp") setCsharpContent(solutionCode);
              }}
              className="inline-flex min-h-10 items-center justify-center gap-1 rounded-md border border-primary/30 px-2 text-xs text-primary sm:min-h-9"
            ><Lightbulb size={13} /> Lösung laden</button>
          )}
        </div>
        {activeTab === "csharp" && (
          <button 
            onClick={() => handleRun("csharp", csharpContent)}
            disabled={isExecuting}
            className="flex min-h-10 w-full items-center justify-center space-x-1 rounded-md bg-green-600 px-4 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50 sm:min-h-9 sm:w-auto"
          >
            <Play size={14} />
            <span>{isExecuting ? "Running..." : "Run C#"}</span>
          </button>
        )}
        {activeTab === "python" && (
          <button 
            onClick={() => handleRun("python", pythonContent)}
            disabled={isExecuting}
            className="flex min-h-10 w-full items-center justify-center space-x-1 rounded-md bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50 sm:min-h-9 sm:w-auto"
          >
            <Play size={14} />
            <span>{isExecuting ? "Running..." : "Run Python"}</span>
          </button>
        )}
        {activeTab === "javascript" && (
          <button
            onClick={() => {
              setOutputLogs(["JavaScript wird ausgeführt …"]);
              setSandboxExecutionId((id) => id + 1);
            }}
            className="flex min-h-10 w-full items-center justify-center space-x-1 rounded-md bg-amber-600 px-4 py-1 text-sm text-white hover:bg-amber-700 sm:min-h-9 sm:w-auto"
          >
            <Play size={14} />
            <span>Run JavaScript</span>
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {/* Editor Pane */}
        <div className="h-1/2 min-h-0 w-full border-b md:h-auto md:w-1/2 md:border-b-0 md:border-r">
          <CodeEditor
            language={activeTab}
            value={
              activeTab === "html" ? htmlContent :
              activeTab === "css" ? cssContent :
              activeTab === "javascript" ? jsContent : 
              activeTab === "python" ? pythonContent : csharpContent
            }
            onChange={(val) => {
              if (activeTab === "html") setHtmlContent(val);
              if (activeTab === "css") setCssContent(val);
              if (activeTab === "javascript") setJsContent(val);
              if (activeTab === "python") setPythonContent(val);
              if (activeTab === "csharp") setCsharpContent(val);
            }}
          />
        </div>

        {/* Output/Sandbox Pane */}
        <div className="flex h-1/2 min-h-0 w-full flex-col md:h-auto md:w-1/2">
          {activeTab !== "csharp" && activeTab !== "python" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1">
                <Sandbox
                  htmlContent={htmlContent}
                  cssContent={cssContent}
                  jsContent={jsContent}
                  executionId={sandboxExecutionId}
                  onResult={handleSandboxResult}
                />
              </div>
              {activeTab === "javascript" && (
                <div aria-label="JavaScript-Konsole" className="max-h-32 overflow-y-auto border-t bg-black p-3 font-mono text-xs text-green-400">
                  {outputLogs.length === 0 ? "JavaScript-Konsole bereit" : outputLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-black p-4 font-mono text-sm text-green-400 break-words">
        <div className="mb-2 text-gray-500">Isolierte Ausführungsumgebung</div>
              {outputLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
