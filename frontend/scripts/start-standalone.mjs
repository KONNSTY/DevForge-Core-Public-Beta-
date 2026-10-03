import { cpSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";

const standaloneRoot = ".next/standalone";

if (!existsSync(`${standaloneRoot}/server.js`)) {
  console.error("Production build missing. Run npm run build before npm run start.");
  process.exit(1);
}

if (existsSync("public")) {
  cpSync("public", `${standaloneRoot}/public`, { recursive: true, force: true });
}

if (existsSync(".next/static")) {
  cpSync(".next/static", `${standaloneRoot}/.next/static`, { recursive: true, force: true });
}

const server = spawn(process.execPath, ["server.js"], {
  cwd: standaloneRoot,
  env: { ...process.env, HOSTNAME: process.env.HOSTNAME || "0.0.0.0" },
  stdio: "inherit",
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
