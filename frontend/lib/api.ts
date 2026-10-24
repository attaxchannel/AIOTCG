function resolveAPI(){
  if (typeof window !== 'undefined') {
    try {
      const ls = window.localStorage.getItem('NEXT_PUBLIC_API_URL');
      if (ls && ls.startsWith('http')) return ls.replace(/\/+$/,'');
    } catch {}
  }
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env && env.startsWith('http')) return env.replace(/\/+$/,'');
  return "http://localhost:8000";
}
export function getAPI(): string { return resolveAPI(); }
// Static snapshot for backward-compat `${API}` — WhereApiUrl Save does reload so it picks up new value.
// For live without reload, use getAPI() (already migrated in page/jobs/editor/settings).
export const API: string = resolveAPI() as string;

export async function uploadVideo(file: File, ratios: string[] = ["9:16"]) {
  const fd = new FormData();
  fd.append("file", file);
  const base = getAPI();
  const url = `${base}/api/upload?mode=auto&ratios=${ratios.join(",")}`;
  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{job_id: string, status: string}>;
}

export async function getJob(jobId: string) {
  const base = getAPI();
  const res = await fetch(`${base}/api/jobs/${jobId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("job not found");
  return res.json();
}

export async function listJobs() {
  const base = getAPI();
  const res = await fetch(`${base}/api/jobs`, { cache: "no-store" });
  return res.json();
}

export function wsUrl(jobId: string) {
  return `${getAPI().replace(/^http/, "ws")}/ws/jobs/${jobId}`;
}
