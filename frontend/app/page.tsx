'use client';
import { useState, useRef } from 'react';
import { uploadVideo, API } from '../lib/api';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [ratios, setRatios] = useState<string[]>(["9:16"]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleRatio = (r: string) => {
    setRatios(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r]);
  };

  const onUpload = async () => {
    if (!file) return;
    if (ratios.length===0) return alert("Pick at least one ratio");
    setUploading(true);
    try {
      const res = await uploadVideo(file, ratios);
      setJobId(res.job_id);
      poll(res.job_id);
    } catch(e:any) {
      alert(e.message);
    } finally { setUploading(false); }
  };

  const poll = async (id: string) => {
    // try websocket first, fallback to polling
    try {
      const ws = new WebSocket(`${API.replace(/^http/,"ws")}/ws/jobs/${id}`);
      ws.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        setStatus(data);
        if (data.status==="done"||data.status==="failed") ws.close();
      };
      ws.onerror = () => { // fallback
        const t = setInterval(async()=>{
          const j = await fetch(`${API}/api/jobs/${id}`).then(r=>r.json());
          setStatus(j);
          if(j.status==="done"||j.status==="failed") clearInterval(t);
        }, 1500);
      };
    } catch {
      const t = setInterval(async()=>{
        const j = await fetch(`${API}/api/jobs/${id}`).then(r=>r.json());
        setStatus(j);
        if(j.status==="done"||j.status==="failed") clearInterval(t);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="card bg-gradient-to-br from-violet-600 to-indigo-600 border-0">
        <h1 className="text-2xl font-black leading-tight">All-In Tools<br/>Content Generator</h1>
        <p className="text-sm opacity-90 mt-2">Phone is the Remote. Server is the Studio. Upload once → get viral 9:16 clips with auto captions (ID/EN) + auto-frame.</p>
        <div className="flex gap-2 mt-3 text-xs">
          <span className="bg-white/20 px-2 py-1 rounded-full">Auto Clipping</span>
          <span className="bg-white/20 px-2 py-1 rounded-full">Whisper large-v3</span>
          <span className="bg-white/20 px-2 py-1 rounded-full">FFmpeg + YOLO</span>
        </div>
      </div>

      {/* Upload */}
      <div className="card space-y-4">
        <h2 className="font-semibold">1) Upload Video (from Gallery / Camera)</h2>

        <div
          onClick={()=>inputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 rounded-2xl p-6 text-center active:bg-zinc-800 cursor-pointer"
        >
          <div className="text-3xl mb-2">📤</div>
          <div className="font-medium">{file ? file.name : "Tap to pick video"}</div>
          <div className="text-xs text-zinc-400 mt-1">MP4/MOV up to 2GB • Resumable on 4G if backend enables tus</div>
          {file && <div className="text-xs text-zinc-300 mt-2">{(file.size/1024/1024).toFixed(1)} MB</div>}
        </div>
        <input ref={inputRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)} />

        <div>
          <div className="text-sm font-medium mb-2">2) Export Ratios (tap to toggle)</div>
          <div className="flex flex-wrap gap-2">
            {["9:16","16:9","1:1","4:5"].map(r=>(
              <button key={r} onClick={()=>toggleRatio(r)} className={`px-4 py-2 rounded-full text-sm border ${ratios.includes(r) ? "bg-violet-600 border-violet-500 text-white":"bg-zinc-800 border-zinc-700"}`}>
                {r} {r==="9:16"?"• Shorts/TikTok":""} {r==="1:1"?"• Feed":""}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onUpload} disabled={!file||uploading} className="btn w-full text-base disabled:opacity-50">
          {uploading ? "Uploading..." : jobId ? "Uploading → Processing..." : "⚡ Auto Generate Viral Clips"}
        </button>
        <p className="text-xs text-zinc-400 text-center">Heavy processing on server (Whisper + LLM + FFmpeg). You can close the app — you'll get a notification when done (if push enabled).</p>
      </div>

      {/* Status */}
      {jobId && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Job {jobId.slice(0,8)}…</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${status?.status==="done"?"bg-green-600":status?.status==="failed"?"bg-red-600":"bg-zinc-700"}`}>{status?.status || "queued"}</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div className="bg-violet-600 h-2 transition-all" style={{width: `${status?.progress||5}%`}} />
          </div>
          <div className="text-xs text-zinc-400">{status?.progress||5}% • {status?.status || "queued"} {status?.error ? "• "+status.error : ""}</div>
          {status?.clips && (
            <div className="text-xs bg-zinc-800 p-3 rounded-xl">
              <div className="font-medium mb-1">LLM found {status.clips.length} viral candidates:</div>
              {status.clips.map((c:any,i:number)=>(<div key={i} className="opacity-80">#{i+1} {c.start?.toFixed(1)}s–{c.end?.toFixed(1)}s • score {c.score} • {c.title}</div>))}
            </div>
          )}
          {status?.outputs && status.outputs.length>0 && (
            <div className="grid gap-3">
              {status.outputs.map((o:any,i:number)=>(
                <div key={i} className="bg-zinc-800 rounded-xl p-3">
                  <div className="text-sm font-medium">{o.ratio} • Clip {o.clip_index+1} • {o.title||""}</div>
                  <div className="text-xs text-zinc-400">{o.start?.toFixed(1)}s – {o.end?.toFixed(1)}s</div>
                  <a href={`${API}/outputs/${o.path.split("/").pop()}`} target="_blank" className="inline-block mt-2 text-sm bg-white text-black px-3 py-1.5 rounded-full">▶ Preview / Download</a>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <a href={`/jobs`} className="text-sm text-violet-400">View all projects →</a>
            {status?.status==="done" && <a href={`${API}/docs`} target="_blank" className="text-sm text-zinc-400">API Docs</a>}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="card">
        <h3 className="font-semibold">How it works (phone-first)</h3>
        <ol className="text-sm text-zinc-400 list-decimal list-inside space-y-1 mt-2">
          <li>Upload 16:9 long video (podcast, vlog, movie)</li>
          <li>Server: <code className="text-zinc-200">faster-whisper</code> transcribes ID/EN word-level → <code className="text-zinc-200">LiteLLM</code> finds hooks → <code className="text-zinc-200">YOLOv8</code> tracks face → <code className="text-zinc-200">FFmpeg</code> crops 9:16 + burns ASS captions</li>
          <li>Get 2-3 ranked clips (25-58s) with TikTok-style captions. Edit manually in Editor if needed.</li>
          <li>Export 9:16 / 1:1 / 4:5 in parallel. Share to TikTok/Reels directly.</li>
        </ol>
      </div>

      <div className="text-xs text-zinc-500 text-center pb-6">PWA: Add to Home Screen on Android for fullscreen app + offline + share target.</div>
    </div>
  );
}
