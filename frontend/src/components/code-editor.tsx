"use client";

import React, { useEffect, useState } from "react";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { python } from "@codemirror/lang-python";

export type Language = "javascript" | "html" | "css" | "csharp" | "python";

interface CodeEditorProps extends Omit<ReactCodeMirrorProps, "theme"> {
  language: Language;
}

export function CodeEditor({ language, ...props }: CodeEditorProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration fix for next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  const getExtensions = () => {
    switch (language) {
      case "javascript":
        return [javascript({ jsx: true, typescript: true })];
      case "html":
        return [html()];
      case "css":
        return [css()];
      case "python":
        return [python()];
      default:
        // Fallback for C# until we add a specific lang pack if needed
        return [];
    }
  };

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  if (!mounted) {
    return <div className="h-full w-full bg-muted/20 animate-pulse rounded-md" />;
  }

  return (
    <div className="relative w-full h-full border rounded-md overflow-hidden bg-background">
      <CodeMirror
        theme={isDark ? "dark" : "light"}
        extensions={getExtensions()}
        className="text-sm h-full"
        height="100%"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        {...props}
      />
    </div>
  );
}
