"use client";

import React, { useEffect, useRef, useState } from "react";

interface SandboxProps {
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  onResult?: (result: SandboxResult) => void;
}

export type SandboxResult = {
  success: boolean;
  error?: string;
  logs: any[];
};

export function Sandbox({ htmlContent, cssContent, jsContent, onResult }: SandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin if necessary in production
      if (event.data?.type === 'SANDBOX_READY') {
        setIsReady(true);
      } else if (event.data?.type === 'SANDBOX_RESULT') {
        onResult?.(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onResult]);

  useEffect(() => {
    if (!isReady || !iframeRef.current?.contentWindow) return;

    // Send code to iframe for execution
    iframeRef.current.contentWindow.postMessage({
      type: 'EXECUTE',
      payload: { html: htmlContent, css: cssContent, js: jsContent }
    }, '*');
  }, [htmlContent, cssContent, jsContent, isReady]);

  // The runner script injected into the iframe
  const runnerScript = `
    const logs = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      logs.push(args);
      originalConsoleLog(...args);
    };

    window.addEventListener('message', (event) => {
      if (event.data?.type === 'EXECUTE') {
        const { html, css, js } = event.data.payload;
        
        try {
          // Clear previous state
          document.body.innerHTML = html;
          
          let styleEl = document.getElementById('sandbox-styles');
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'sandbox-styles';
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = css;
          
          // Clear logs before execution
          logs.length = 0;

          // Execute JS
          // Using a new Function is safer than eval in this context,
          // but we're already in a sandboxed iframe.
          const executeUserCode = new Function(js);
          executeUserCode();

          window.parent.postMessage({
            type: 'SANDBOX_RESULT',
            payload: { success: true, logs: [...logs] }
          }, '*');
        } catch (err) {
          window.parent.postMessage({
            type: 'SANDBOX_RESULT',
            payload: { success: false, error: err.toString(), logs: [...logs] }
          }, '*');
        }
      }
    });

    window.parent.postMessage({ type: 'SANDBOX_READY' }, '*');
  `;

  const iframeSrc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Sandbox</title>
        <style>
          body { margin: 0; padding: 16px; font-family: sans-serif; }
        </style>
      </head>
      <body>
        <script>
          ${runnerScript}
        </script>
      </body>
    </html>
  `;

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border rounded-md bg-white"
      sandbox="allow-scripts"
      srcDoc={iframeSrc}
      title="Code Sandbox"
    />
  );
}
