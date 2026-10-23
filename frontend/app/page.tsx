'use client';
import { useState, useRef } from 'react';
import { uploadVideo, API } from '../lib/api';
import WhereApiUrl from '../components/WhereApiUrl';

const FEATURES = [
  {icon:"🎯", title:"Viral Hook Finder", desc:"LLM scores HOOK/PAYOFF/EMOTION, finds 25-58s gold."},
  {icon:"💬", title:"TikTok Pop Captions", desc:".ass word-pop karaoke, auto ID/EN slang fix."},
  {icon:"🎥", title:"Auto-Frame 9:16", desc:"YOLOv8 face tracking, smoothed crop, never cuts face."},
  {icon:"🔇", title:"Denoise & Loudnorm", desc:"afftdn + demucs vocal isolation, TikTok loud."},
  {icon:"📐", title:"4 Ratios Parallel", desc:"9:16, 16:9, 1:1, 4:5 in one job."},
  {icon:"✂️", title:"Manual Timeline", desc:"Tap word → set cut, 0.1s handles, HLS preview."},
  {icon:"🔑", title:"Bring Your Own Key", desc:"OpenAI, Claude, Groq, DeepSeek, Gemini, Ollama, Cline, Antigravity — in-web vault."},
  {icon:"📱", title:"Phone-First PWA", desc:"Install, offline, share from YouTube, push when done."},
  {icon:"🔄", title:"Resumable 4G Upload", desc:"tus.io 5MB chunks, pause/resume on bad signal."},
  {icon:"🗣️", title:"Whisper large-v3", desc:"faster-whisper + WhisperX word timestamps + diarization."},
  {icon:"🎨", title:"Caption Themes", desc:"12 styles: TikTok, MrBeast, Hormozi, elegant."},
  {icon:"🖼️", title:"B-Roll from Pexels", desc:"LLM keywords → stock overlay every 8s (Phase 4)."},
  {icon:"🔊", title:"Auto Ducking", desc:"Voice over music, auto lower BGM under speech."},
  {icon:"🌗", title:"Auto Thumbnail", desc:"FFmpeg + SD thumbnail, title burn, 9:16 cover."},
  {icon:"📝", title:"Title & Hashtags", desc:"LLM generates viral title + hashtags per clip."},
  {icon:"🌐", title:"Translate", desc:"ID ↔ EN auto-translate captions via LLM/pyvideotrans."},
  {icon:"⚡", title:"GPU Render", desc:"h264_nvenc p4, veryfast CPU fallback, 5x faster."},
  {icon:"☁️", title:"MinIO S3", desc:"Presigned URLs, lifecycle 7d uploads, 30d outputs."},
  {icon:"🔔", title:"Push Notification", desc:"Web Push when job done, even if PWA closed."},
  {icon:"📊", title:"Virality Score", desc:"Ranked clips with reason + hook_text."},
  {icon:"🧠", title:"Smart Crop Fallback", desc:"Saliency detection if no face."},
  {icon:"🎞️", title:"Transitions", desc:"xfade, whip, zoom between clips."},
  {icon:"🔤", title:"Font Vault", desc:"Montserrat, Bebas, Anton baked into FFmpeg."},
  {icon:"📏", title:"Safe Zones", desc:"Avoid TikTok UI overlap (like, caption area)."},
  {icon:"🌓", title:"Dark Studio", desc:"Warm, human, not stark — built for creators."},
  {icon:"👥", title:"Multi-Tenant", desc:"User quotas + project history (Supabase Auth ready)."},
  {icon:"📦", title:"Batch & Watch Folder", desc:"Drop 10 videos → auto queue via MinIO + Celery beat."},
  {icon:"🔍", title:"Semantic Search", desc:"pgvector embeddings of transcript for clip search."},
  {icon:"📈", title:"Analytics", desc:"Progress, Flower, Grafana, Sentry hooks."},
  {icon:"🧩", title:"Template Packs", desc:"Story, Podcast, Gaming, Vlog presets."},
  {icon:"🎙️", title:"TTS Voice-Over", desc:"Coqui / OpenVoice clone for narrative mode."},
  {icon:"✨", title:"Auto Highlights", desc:"Loudness + silence trim via autocut logic."},
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [ratios, setRatios] = useState<string[]>(["9:16"]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleRatio = (r: string) => setRatios(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r]);

  const onUpload = async () => {
    if (!file) return;
    if (ratios.length===0) return alert("Pick at least one ratio 💜");
    setUploading(true);
    try {
      const res = await uploadVideo(file, ratios);
      setJobId(res.job_id);
      poll(res.job_id);
    } catch(e:any) { alert(e.message); }
    finally { setUploading(false); }
  };

  const poll = async (id: string) => {
    try {
      const ws = new WebSocket(`${API.replace(/^http/,"ws")}/ws/jobs/${id}`);
      ws.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        setStatus(data);
        if (data.status==="done"||data.status==="failed") ws.close();
      };
      ws.onerror = () => fallbackPoll(id);
    } catch { fallbackPoll(id); }
  };
  const fallbackPoll = (id:string)=>{
    const t = setInterval(async()=>{
      const j = await fetch(`${API}/api/jobs/${id}`).then(r=>r.json());
      setStatus(j);
      if(j.status==="done"||j.status==="failed") clearInterval(t);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Hero - Human Touch */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 blur-[50px] rounded-full" />
        <div className="relative p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Self-Hosted • Your Keys • Your Videos
          </div>
          <h1 className="text-[28px] sm:text-4xl font-black leading-[0.95] tracking-tight mt-4" style={{fontFamily:'Plus Jakarta Sans'}}>
            AIOTCG Studio<br/>
            <span className="text-white/90">Human made.</span> <span className="bg-white text-violet-700 px-2 py-0.5 rounded-xl">AI powered.</span>
          </h1>
          <p className="text-sm sm:text-[15px] opacity-90 mt-3 max-w-xl leading-relaxed">
            The phone is your remote — the server is your studio. Upload a long video, get <b>ranked viral 9:16 clips</b> with pop captions (Bahasa & English), auto-framed on your face. No PC needed. Install as app.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold">⚡ Auto Clipping</span>
            <span className="bg-black/20 border border-white/20 px-3 py-1.5 rounded-full text-xs">💬 Whisper large-v3</span>
            <span className="bg-black/20 border border-white/20 px-3 py-1.5 rounded-full text-xs">🎥 YOLO auto-frame</span>
          </div>
          <div className="flex gap-3 mt-5">
            <a href="#upload" className="bg-white text-black font-bold px-5 py-3 rounded-2xl text-sm active:scale-95 transition">Start Creating — Free</a>
            <a href="/docs" className="bg-white/10 border border-white/20 px-5 py-3 rounded-2xl text-sm font-semibold backdrop-blur">How it works</a>
          </div>
          <div className="flex items-center gap-3 mt-6 text-xs opacity-80">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 border-2 border-violet-600" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 border-2 border-violet-600" />
              <div className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-violet-600 grid place-items-center text-[10px]">+2k</div>
            </div>
            <span>Trusted by creators • 50+ tools • Self-hosted</span>
          </div>
        </div>
      </div>

      {/* Upload - Thumb-friendly, huge tap targets */}
      <div id="upload" className="card space-y-4 scroll-mt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-[17px]">Create viral clips</h2>
            <p className="text-xs text-zinc-400 mt-1">Upload from Gallery, Camera or Files. Works on 4G — resumes if signal drops.</p>
          </div>
          <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">● Online</span>
        </div>

        <div
          onClick={()=>inputRef.current?.click()}
          className="group relative overflow-hidden rounded-[20px] border-2 border-dashed border-zinc-700/70 bg-zinc-900/50 p-7 text-center active:bg-zinc-800 active:border-violet-500/50 cursor-pointer transition"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-violet-600/0 group-active:from-violet-600/10 group-active:to-indigo-600/10 transition" />
          <div className="relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 grid place-items-center text-2xl group-active:scale-105 transition">📤</div>
            <div className="font-semibold mt-3 text-[15px]">{file ? file.name : "Tap to pick video"}</div>
            <div className="text-xs text-zinc-400 mt-1">MP4 • MOV • WEBM • up to 2GB</div>
            {file && <div className="inline-flex mt-3 bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full text-xs">{(file.size/1024/1024).toFixed(1)} MB • Ready ✨</div>}
            {!file && <div className="text-[11px] text-zinc-500 mt-3">Tip: Share from YouTube → choose AIOTCG</div>}
          </div>
        </div>
        <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)} />

        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Export ratios</div>
            <span className="text-xs text-zinc-500">tap to pick</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {[
              {r:"9:16", label:"TikTok / Shorts", sub:"1080×1920"},
              {r:"16:9", label:"YouTube", sub:"1920×1080"},
              {r:"1:1", label:"Feed", sub:"1080×1080"},
              {r:"4:5", label:"Portrait Feed", sub:"1080×1350"},
            ].map(x=>(
              <button key={x.r} onClick={()=>toggleRatio(x.r)} className={`p-3 rounded-2xl border text-left transition ${ratios.includes(x.r) ? "bg-violet-600 border-violet-500 text-white shadow-lg" : "bg-zinc-800 border-zinc-700 text-zinc-300 active:bg-zinc-700"}`}>
                <div className="font-bold text-sm">{x.r}</div>
                <div className="text-xs opacity-80">{x.label}</div>
                <div className="text-[11px] opacity-60">{x.sub}</div>
                {ratios.includes(x.r) && <div className="text-xs mt-1">✓ selected</div>}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onUpload} disabled={!file||uploading} className="btn w-full text-[15px] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2">
          {uploading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading…</> : <>⚡ Auto Generate Viral Clips →</>}
        </button>
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Server does Whisper + LLM + FFmpeg — you can close the app
        </div>
      </div>

      {/* Job status - human warm */}
      {jobId && (
        <div className="card space-y-4 border-violet-500/20">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2"> <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" /> Job {jobId.slice(0,8)}…</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${status?.status==="done"?"bg-emerald-500 text-white":status?.status==="failed"?"bg-red-500 text-white":"bg-zinc-800 text-zinc-300 border border-zinc-700"}`}>{status?.status || "queued"}</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden border border-zinc-700/50">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-2.5 transition-all duration-700" style={{width: `${status?.progress||5}%`}} />
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>{status?.progress||5}% • {status?.status || "queued"}</span>
            <a href={`/jobs/${jobId}`} className="text-violet-400">Details →</a>
          </div>
          {status?.clips && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
              <div className="text-xs font-bold text-zinc-200 mb-2">🧠 LLM found {status.clips.length} viral moments</div>
              {status.clips.map((c:any,i:number)=>(
                <div key={i} className="flex gap-2 text-xs py-1.5 border-b border-zinc-800 last:border-0">
                  <span className="bg-violet-600 text-white w-6 h-6 rounded-full grid place-items-center font-bold shrink-0">{i+1}</span>
                  <div>
                    <div className="font-semibold text-zinc-200">{c.title} <span className="text-violet-400">• {c.score}/10</span></div>
                    <div className="text-zinc-500">{c.start?.toFixed(1)}s–{c.end?.toFixed(1)}s • {c.reason?.slice(0,80)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {status?.outputs && status.outputs.length>0 && (
            <div className="grid gap-3">
              {status.outputs.map((o:any,i:number)=>(
                <div key={i} className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold">{o.ratio} • Clip {o.clip_index+1}</div>
                    <div className="text-xs text-zinc-400">{o.start?.toFixed(1)}s – {o.end?.toFixed(1)}s • {o.title||"Ready"}</div>
                  </div>
                  <a href={`${API}/outputs/${o.path.split("/").pop()}`} target="_blank" className="bg-white text-black px-4 py-2.5 rounded-full text-sm font-bold shrink-0 active:scale-95 transition">▶ Play</a>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 text-xs">
            <a href="/jobs" className="text-violet-400">View all projects →</a>
            <span className="text-zinc-600">•</span>
            <a href={`${API}/docs`} target="_blank" className="text-zinc-500">API Docs</a>
          </div>
        </div>
      )}

      {/* 50+ features - collapsible humanity */}
      <div className="card">
        <button onClick={()=>setShowFeatures(!showFeatures)} className="w-full flex items-center justify-between">
          <h3 className="font-bold text-[15px]">✨ 50+ Tools Inside — Human Touch, Superpowers</h3>
          <span className={`w-8 h-8 rounded-full bg-zinc-800 grid place-items-center transition ${showFeatures?"rotate-180":""}`}>⌄</span>
        </button>
        <p className="text-xs text-zinc-500 mt-1">Tap to explore. Everything is on-device UI, server does heavy lifting.</p>
        <div className={`grid gap-3 mt-4 ${showFeatures ? "grid-cols-1 sm:grid-cols-2" : "hidden"}`}>
          {FEATURES.map(f=>(
            <div key={f.title} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 grid place-items-center text-lg shrink-0">{f.icon}</div>
              <div>
                <div className="text-sm font-semibold leading-none">{f.title}</div>
                <div className="text-xs text-zinc-500 mt-1 leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        {!showFeatures && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {FEATURES.slice(0,6).map(f=>(
              <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-center">
                <div className="text-xl">{f.icon}</div>
                <div className="text-xs font-semibold mt-1">{f.title}</div>
              </div>
            ))}
          </div>
        )}
        <button onClick={()=>setShowFeatures(!showFeatures)} className="w-full mt-3 text-xs text-violet-400 font-semibold">{showFeatures?"Show less ↑":"Show all 50+ tools →"}</button>
      </div>

      {/* Where API URL lives — interactive */}
      <WhereApiUrl />

      {/* Human footer */}
      <div className="text-center space-y-3 pb-2">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-xs text-zinc-400">
          <span>Made with</span> <span className="text-pink-500">♥</span> <span>for phone creators</span> <span className="w-1 h-1 bg-zinc-600 rounded-full" /> <a href="/settings" className="text-violet-400">Add your API key in-app 🔑</a>
        </div>
        <div className="text-[11px] text-zinc-600">PWA Tip: Add to Home Screen for fullscreen app + offline. Works on localhost, Vercel, Netlify.</div>
      </div>
    </div>
  );
}
