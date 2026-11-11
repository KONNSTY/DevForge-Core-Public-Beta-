import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_CODE_LENGTH = 20_000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_PER_WINDOW = 20;
const MAX_RATE_LIMIT_BUCKETS = 1_000;
const OVERFLOW_CLIENT_ID = "\u0000overflow";
const requestCounts = new Map<string, { count: number; resetAt: number }>();
let lastBucketCleanupAt = 0;

type SupportedLanguage = "python" | "csharp";

async function readBoundedBody(request: Request, maxBytes: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function allowExecution(request: Request): boolean {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedClientId = forwardedFor?.split(",").at(-1)?.trim();
  let clientId = forwardedClientId && forwardedClientId.length <= 128 ? forwardedClientId : "unknown";
  const now = Date.now();
  let current = requestCounts.get(clientId);

  if (!current && requestCounts.size >= MAX_RATE_LIMIT_BUCKETS - 1) {
    if (now - lastBucketCleanupAt >= RATE_WINDOW_MS) {
      for (const [key, bucket] of requestCounts) {
        if (bucket.resetAt <= now) requestCounts.delete(key);
      }
      lastBucketCleanupAt = now;
    }

    if (requestCounts.size >= MAX_RATE_LIMIT_BUCKETS - 1) {
      clientId = OVERFLOW_CLIENT_ID;
      current = requestCounts.get(clientId);
    }
  }

  if (!current || current.resetAt <= now) {
    requestCounts.set(clientId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_PER_WINDOW) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_CODE_LENGTH + 1_024) {
    return NextResponse.json({ success: false, error: "Code ist auf 20.000 Zeichen begrenzt." }, { status: 413 });
  }

  const body = await readBoundedBody(request, MAX_CODE_LENGTH + 1_024).catch(() => null);
  if (body === null) {
    return NextResponse.json({ success: false, error: "Code ist auf 20.000 Zeichen begrenzt." }, { status: 413 });
  }

  const payload = await Promise.resolve().then(() => JSON.parse(body || "null")).catch(() => null) as
    { language?: unknown; code?: unknown } | null;
  if (!payload || (payload.language !== "python" && payload.language !== "csharp")) {
    return NextResponse.json({ success: false, error: "Diese Sprache wird nicht unterstützt." }, { status: 400 });
  }

  const language: SupportedLanguage = payload.language;
  if (typeof payload.code !== "string" || !payload.code.trim()) {
    return NextResponse.json({ success: false, error: "Der Code darf nicht leer sein." }, { status: 400 });
  }
  if (payload.code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ success: false, error: "Code ist auf 20.000 Zeichen begrenzt." }, { status: 413 });
  }
  if (!allowExecution(request)) {
    return NextResponse.json(
      { success: false, error: "Zu viele Ausführungen. Bitte warte eine Minute und versuche es erneut." },
      { status: 429 },
    );
  }

  const isCsharp = language === "csharp";
  const pistonBaseUrl = (process.env.PISTON_URL ?? "http://127.0.0.1:2000").replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), isCsharp ? 30_000 : 10_000);

  try {
    const response = await fetch(`${pistonBaseUrl}/api/v2/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: isCsharp ? "csharp.net" : "python",
        version: isCsharp ? "5.0.201" : "3.12.0",
        files: [{ name: isCsharp ? "main.cs" : "main.py", content: payload.code }],
        stdin: "",
        compile_timeout: isCsharp ? 20_000 : 10_000,
        run_timeout: 5_000,
        compile_memory_limit: 1_073_741_824,
        run_memory_limit: 268_435_456,
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    const result = await response.json().catch(() => null) as {
      message?: string;
      compile?: { code?: number | null; signal?: string | null; output?: string };
      run?: { code?: number | null; signal?: string | null; output?: string };
    } | null;

    if (!response.ok || !result) {
      return NextResponse.json(
        { success: false, error: result?.message || `Der isolierte Runner antwortete mit HTTP ${response.status}.` },
        { status: 502 },
      );
    }

    const compileSucceeded = !result.compile || (result.compile.code === 0 && !result.compile.signal);
    const runSucceeded = result.run?.code === 0 && !result.run.signal;
    const success = compileSucceeded && runSucceeded;
    const output = (success
      ? [result.run?.output]
      : [compileSucceeded ? undefined : result.compile?.output, runSucceeded ? undefined : result.run?.output])
      .filter((part): part is string => Boolean(part?.trim()))
      .join("\n")
      .slice(0, 8_000);

    return NextResponse.json({
      success,
      logs: output ? output.split(/\r?\n/).slice(0, 100) : [],
      ...(success ? {} : { error: output || "Der Code konnte nicht ausgeführt werden." }),
    });
  } catch (error) {
    const message = error instanceof DOMException && error.name === "AbortError"
      ? "Die Ausführung hat das Zeitlimit überschritten."
      : "Der isolierte Code-Runner ist gerade nicht erreichbar.";
    return NextResponse.json({ success: false, error: message }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}
