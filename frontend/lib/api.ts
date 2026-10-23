export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function uploadVideo(file: File, ratios: string[] = ["9:16"]) {
  const fd = new FormData();
  fd.append("file", file);
  const url = `${API}/api/upload?mode=auto&ratios=${ratios.join(",")}`;
  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{job_id: string, status: string}>;
}

export async function getJob(jobId: string) {
  const res = await fetch(`${API}/api/jobs/${jobId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("job not found");
  return res.json();
}

export async function listJobs() {
  const res = await fetch(`${API}/api/jobs`, { cache: "no-store" });
  return res.json();
}

export function wsUrl(jobId: string) {
  return `${API.replace(/^http/, "ws")}/ws/jobs/${jobId}`;
}
