const api = (process.env.PISTON_API_URL ?? "http://piston:2000").replace(/\/$/, "");
const requiredPackages = [
  { language: "python", version: "3.12.0" },
  { language: "dotnet", version: "5.0.201" },
];

async function getJson(path) {
  const response = await fetch(`${api}${path}`);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message ?? `Piston returned HTTP ${response.status}.`);
  return body;
}

async function installPackage(language, version) {
  const response = await fetch(`${api}/api/v2/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, version }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message ?? `Could not install ${language} ${version}.`);
  console.log(`Installed ${body.language} ${body.version}.`);
}

let reachable = false;
for (let attempt = 1; attempt <= 60; attempt += 1) {
  try {
    await getJson("/api/v2/packages");
    reachable = true;
    break;
  } catch {
    console.log(`Waiting for Piston API (${attempt}/60)…`);
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
}
if (!reachable) throw new Error("Piston API did not become ready within two minutes.");

const packages = await getJson("/api/v2/packages");
for (const required of requiredPackages) {
  const installed = packages.some((item) =>
    item.language === required.language && item.language_version === required.version && item.installed,
  );
  if (!installed) await installPackage(required.language, required.version);
}

const runtimes = await getJson("/api/v2/runtimes");
for (const [language, version] of [["python", "3.12.0"], ["csharp.net", "5.0.201"]]) {
  if (!runtimes.some((runtime) => runtime.language === language && runtime.version === version)) {
    throw new Error(`Required runtime ${language} ${version} is missing after installation.`);
  }
}
console.log("Python 3.12 and C#/.NET 5 runtimes are ready.");
