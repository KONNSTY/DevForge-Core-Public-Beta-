"use client";

import React, { useState } from "react";
import { CodeEditor, Language } from "./code-editor";
import { Sandbox, SandboxResult } from "./sandbox";
import { Play } from "lucide-react";

export interface PlaygroundProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  initialCsharp?: string;
  initialPython?: string;
  defaultLanguage?: Language;
}

export function Playground({
  initialHtml = "<h1>Playground</h1>",
  initialCss = "h1 { color: #3b82f6; }",
  initialJs = "console.log('Hello from JS');",
  initialCsharp = 'Console.WriteLine("Hello from C#");',
  initialPython = 'print("Hello from Python")',
  defaultLanguage = "html"
}: PlaygroundProps) {
  const [activeTab, setActiveTab] = useState<Language>(defaultLanguage);
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [cssContent, setCssContent] = useState(initialCss);
  const [jsContent, setJsContent] = useState(initialJs);
  const [csharpContent, setCsharpContent] = useState(initialCsharp);
  const [pythonContent, setPythonContent] = useState(initialPython);
  
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [isExecutingCSharp, setIsExecutingCSharp] = useState(false);
  const [isExecutingPython, setIsExecutingPython] = useState(false);

  const handleRunCSharp = async () => {
    setIsExecutingCSharp(true);
    setOutputLogs(["Executing C#..."]);
    try {
      const res = await fetch("http://localhost:5000/api/v1/execute/csharp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: csharpContent })
      });
      const data = await res.json();
      if (data.success) {
        setOutputLogs(data.logs || ["Execution completed with no output."]);
      } else {
        setOutputLogs([`Error: ${data.error}`]);
      }
    } catch (e) {
      setOutputLogs(["Network error. Ensure the backend is running."]);
    } finally {
      setIsExecutingCSharp(false);
    }
  };

  const handleRunPython = async () => {
    setIsExecutingPython(true);
    setOutputLogs(["Executing Python..."]);
    try {
      const res = await fetch("http://localhost:5000/api/v1/execute/python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: pythonContent })
      });
      const data = await res.json();
      if (data.success) {
        setOutputLogs(data.logs || ["Execution completed with no output."]);
      } else {
        setOutputLogs([`Error: ${data.error}`]);
      }
    } catch (e) {
      setOutputLogs(["Network error. Ensure the backend is running."]);
    } finally {
      setIsExecutingPython(false);
    }
  };

  const handleSandboxResult = (result: SandboxResult) => {
    if (result.success) {
      setOutputLogs(result.logs.map(l => JSON.stringify(l)));
    } else {
      setOutputLogs([`Sandbox Error: ${result.error}`]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] border rounded-lg overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b p-2 bg-muted/40">
        <div className="flex space-x-2">
          {(["html", "css", "javascript", "csharp", "python"] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${activeTab === lang ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        {activeTab === "csharp" && (
          <button 
            onClick={handleRunCSharp} 
            disabled={isExecutingCSharp}
            className="flex items-center space-x-1 px-4 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
          >
            <Play size={14} />
            <span>{isExecutingCSharp ? "Running..." : "Run C#"}</span>
          </button>
        )}
        {activeTab === "python" && (
          <button 
            onClick={handleRunPython} 
            disabled={isExecutingPython}
            className="flex items-center space-x-1 px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <Play size={14} />
            <span>{isExecutingPython ? "Running..." : "Run Python"}</span>
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Pane */}
        <div className="w-1/2 border-r">
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
        <div className="w-1/2 flex flex-col">
          {activeTab !== "csharp" && activeTab !== "python" ? (
            <div className="flex-1">
              <Sandbox 
                htmlContent={htmlContent} 
                cssContent={cssContent} 
                jsContent={jsContent} 
                onResult={handleSandboxResult}
              />
            </div>
          ) : (
            <div className="flex-1 bg-black text-green-400 p-4 font-mono text-sm overflow-y-auto">
              <div className="mb-2 text-gray-500">// Terminal Output</div>
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
