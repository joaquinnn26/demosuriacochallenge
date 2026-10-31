const apiBase = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_CONTENTS_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY ?? "joaquinnn26/demosuriacochallenge";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  return token ? { token, repository, branch } : null;
}

function githubHeaders(token: string) {
  return { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28" };
}

export function hasGitHubStore() { return Boolean(getConfig()); }

export async function readGitHubFile(path: string): Promise<Buffer | null> {
  const config = getConfig();
  if (!config) return null;
  const response = await fetch(`${apiBase}/repos/${config.repository}/contents/${path}?ref=${encodeURIComponent(config.branch)}`, { headers: githubHeaders(config.token), cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub no pudo leer ${path} (${response.status}).`);
  const data = await response.json() as { content?: string; encoding?: string };
  if (data.encoding !== "base64" || !data.content) throw new Error(`GitHub devolvió un archivo inválido: ${path}.`);
  return Buffer.from(data.content.replace(/\n/g, ""), "base64");
}

export async function writeGitHubFile(path: string, content: Buffer, message: string) {
  const config = getConfig();
  if (!config) throw new Error("Falta GITHUB_CONTENTS_TOKEN.");
  const url = `${apiBase}/repos/${config.repository}/contents/${path}`;
  const current = await fetch(`${url}?ref=${encodeURIComponent(config.branch)}`, { headers: githubHeaders(config.token), cache: "no-store" });
  const currentData = current.ok ? await current.json() as { sha?: string } : null;
  if (!current.ok && current.status !== 404) throw new Error(`GitHub no pudo revisar ${path} (${current.status}).`);
  const response = await fetch(url, {
    method: "PUT",
    headers: { ...githubHeaders(config.token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: content.toString("base64"), branch: config.branch, ...(currentData?.sha ? { sha: currentData.sha } : {}) })
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(data?.message ?? `GitHub no pudo guardar ${path} (${response.status}).`);
  }
}

export function getPublicGitHubUrl(path: string) {
  if (!path.startsWith("public/")) throw new Error("La imagen debe guardarse dentro de public/.");
  return `/${path.slice("public/".length)}`;
}
