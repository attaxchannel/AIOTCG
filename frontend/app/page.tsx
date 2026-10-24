'use client';
import { useState, useRef, useMemo } from 'react';
import { uploadVideo, API } from '../lib/api';
import WhereApiUrl from '../components/WhereApiUrl';

type F = { cat:string; icon:string; title:string; desc:string; badge?:string };

const FEATURES: F[] = [
  // INGEST
  {cat:"Ingest", icon:"⬆", title:"Resumable tus 5 MB", desc:"tus.io + tusd — pause/resume on 4G drops, no re-upload.", badge:"PWA"},
  {cat:"Ingest", icon:"▥", title:"Uppy Dashboard", desc:"Drag, camera, files — unified picker with previews."},
  {cat:"Ingest", icon:"🔗", title:"YouTube URL Import", desc:"yt-dlp — paste long video URL, fetch directly."},
  {cat:"Ingest", icon:"☁", title:"Presigned S3 Upload", desc:"MinIO/S3 direct — no server bottleneck, 2 GB."},
  {cat:"Ingest", icon:"⧉", title:"Batch Queue (10)", desc:"Drop 10 videos → auto Celery DAG, Flower view."},
  {cat:"Ingest", icon:"👁", title:"Watch Folder", desc:"MinIO event + Celery beat — auto ingest folder."},
  {cat:"Ingest", icon:"⊕", title:"Cloud via URL", desc:"Drive / Dropbox / S3 URL import."},
  {cat:"Ingest", icon:"◍", title:"ffprobe Validate", desc:"Codec, duration, fps check before queue."},
  {cat:"Ingest", icon:"♻", title:"Lifecycle", desc:"7 d uploads, 30 d outputs — S3 rules."},
  {cat:"Ingest", icon:"≡", title:"Checksum Dedupe", desc:"SHA + filename — skip duplicate uploads."},
  {cat:"Ingest", icon:"▬", title:"Progress + Pause", desc:"Live % + pause/cancel per chunk."},
  {cat:"Ingest", icon:"⟳", title:"Offline Queue", desc:"Background Sync — queues when offline, sends when back."},
  // TRANSCRIBE
  {cat:"Transcribe", icon:"◈", title:"faster-whisper large-v3", desc:"CTranslate2 — 4× faster, ID+EN, VAD.", badge:"AI"},
  {cat:"Transcribe", icon:"⧖", title:"WhisperX Word Align", desc:"Per-word timestamps for pop captions."},
  {cat:"Transcribe", icon:"◎", title:"Diarization", desc:"pyannote — who said what, per speaker."},
  {cat:"Transcribe", icon:"⬔", title:"ID ↔ EN Auto", desc:"Bahasa slang fix + EN, auto detect."},
  {cat:"Transcribe", icon:"✎", title:"Punctuation Fix", desc:"LLM post — commas, caps, slang."},
  {cat:"Transcribe", icon:"◑", title:"VAD Silero", desc:"Skip silence, focus speech windows."},
  {cat:"Transcribe", icon:"⧉", title:"Long-form Segments", desc:"Chunk → merge, no 30 s limit."},
  {cat:"Transcribe", icon:"▣", title:"Word Confidence", desc:"Score per word — dim low-conf."},
  {cat:"Transcribe", icon:"☰", title:"Transcript Editor", desc:"Click word → edit, re-render captions."},
  {cat:"Transcribe", icon:"⎙", title:"Export SRT/VTT/ASS", desc:"One click — all formats + TXT."},
  {cat:"Transcribe", icon:"🌐", title:"Translate ID/EN", desc:"LLM/pyvideotrans — auto burn translated."},
  {cat:"Transcribe", icon:"🔍", title:"pgvector Search", desc:"Embeddings — search clips by meaning."},
  // VIRAL
  {cat:"Viral", icon:"◆", title:"Hook/Payoff/Emotion", desc:"LLM scores every 5–60 s window.", badge:"LLM"},
  {cat:"Viral", icon:"⬢", title:"Virality 1–10", desc:"Ranked — reason + hook_text per clip."},
  {cat:"Viral", icon:"20", title:"Top 20 Clips", desc:"Auto — best first, ideal 25–58 s."},
  {cat:"Viral", icon:"❝", title:"Hook Extract", desc:"Exact viral line for thumbnail/title."},
  {cat:"Viral", icon:"◐", title:"Reason", desc:"Why it goes viral — LLM explanation."},
  {cat:"Viral", icon:"✂", title:"Sentence Boundaries", desc:"autocut logic — never cut mid-word."},
  {cat:"Viral", icon:"∿", title:"Emotion Curve", desc:"Energy graph across timeline."},
  {cat:"Viral", icon:"▤", title:"Retention Predict", desc:"Drop-off risk per second."},
  {cat:"Viral", icon:"🏷", title:"Title Gen", desc:"Viral title per clip — LLM, ID/EN."},
  {cat:"Viral", icon:"#", title:"Hashtags", desc:"Auto # per clip — niche + broad."},
  {cat:"Viral", icon:"⌖", title:"B-roll Keywords", desc:"LLM → Pexels overlay every 8 s."},
  {cat:"Viral", icon:"⧓", title:"A/B Variants", desc:"2 cuts per moment — test hooks."},
  // VISION
  {cat:"Vision", icon:"◉", title:"YOLOv8 Face", desc:"n-face — primary tracker for 9:16.", badge:"Vision"},
  {cat:"Vision", icon:"◎", title:"YOLO Person Fallback", desc:"If no face — full person box."},
  {cat:"Vision", icon:"⬡", title:"MediaPipe Mesh", desc:"Fallback face mesh when YOLO misses."},
  {cat:"Vision", icon:"〜", title:"Kalman Smooth", desc:"No jitter — smoothed crop path."},
  {cat:"Vision", icon:"◐", title:"Saliency Fallback", desc:"If no person — saliency crop."},
  {cat:"Vision", icon:"▭", title:"4 Ratios Parallel", desc:"9:16, 16:9, 1:1, 4:5 — one job."},
  {cat:"Vision", icon:"⬚", title:"Safe Zones", desc:"Avoid TikTok like/caption UI overlap."},
  {cat:"Vision", icon:"⊡", title:"Face Never Cut", desc:"Margin + clamp — always in frame."},
  {cat:"Vision", icon:"↗", title:"Zoom & Pan", desc:"Subtle Ken Burns per clip."},
  {cat:"Vision", icon:"👥", title:"Multi-face", desc:"Widest box when 2+ faces."},
  {cat:"Vision", icon:"✂", title:"Scene Detect", desc:"PySceneDetect — clean cut points."},
  {cat:"Vision", icon:"🖼", title:"Keyframe Thumb", desc:"Best frame + title burn 9:16."},
  // CAPTIONS
  {cat:"Captions", icon:"Aa", title:"12 Themes", desc:"TikTok, MrBeast, Hormozi, elegant…", badge:"Style"},
  {cat:"Captions", icon:"♪", title:"ASS \\k Pop", desc:"Word-pop karaoke — per syllable."},
  {cat:"Captions", icon:"A", title:"Font Vault", desc:"Bebas, Anton, Montserrat — baked FFmpeg."},
  {cat:"Captions", icon:"⬔", title:"Stroke/Shadow", desc:"Per theme — outline, blur, bg."},
  {cat:"Captions", icon:"↵", title:"Wrap 2 Lines", desc:"Never 3 — max readability on phone."},
  {cat:"Captions", icon:"★", title:"Keyword Emphasis", desc:"LLM bolds viral words."},
  {cat:"Captions", icon:"☺", title:"Emoji Inject", desc:"Optional — auto per emotion."},
  {cat:"Captions", icon:"ID", title:"ID Slang Norm", desc:"Gue→gue, wkwk clean."},
  {cat:"Captions", icon:"⬣", title:"Burn libass", desc:"FFmpeg — pixel-perfect."},
  {cat:"Captions", icon:"▶", title:"HLS Preview", desc:"Preview without re-render."},
  {cat:"Captions", icon:"◑", title:"Per-clip Override", desc:"Change style per clip before render."},
  {cat:"Captions", icon:"⎙", title:"Export .ass", desc:"Download captions alone."},
  // AUDIO
  {cat:"Audio", icon:"♫", title:"demucs Isolate", desc:"Vocal/BGM split — clean voice."},
  {cat:"Audio", icon:"∿", title:"afftdn Denoise", desc:"Fan/room noise out."},
  {cat:"Audio", icon:"◼", title:"Loudnorm R128", desc:"EBU → TikTok loud target."},
  {cat:"Audio", icon:"⬇", title:"Auto Duck", desc:"Lower BGM under speech."},
  {cat:"Audio", icon:"␣", title:"Silence Trim", desc:"Auto cut dead air."},
  {cat:"Audio", icon:"▇", title:"Highlights", desc:"Loudness + silence trim (autocut)."},
  {cat:"Audio", icon:"♬", title:"BGM Mixer", desc:"Add music, set duck dB."},
  {cat:"Audio", icon:"●", title:"Beat Detect", desc:"Cut on beat — optional."},
  {cat:"Audio", icon:"∿", title:"Waveform", desc:"Wave + transcript aligned."},
  {cat:"Audio", icon:"◎", title:"De-reverb", desc:"Room reverb reduction."},
  // RENDER
  {cat:"Render", icon:"⬢", title:"FFmpeg 6.1", desc:"xfade, ass, scale, pad — all via ffmpeg."},
  {cat:"Render", icon:"⚡", title:"h264_nvenc p4", desc:"GPU 5× • veryfast CPU fallback."},
  {cat:"Render", icon:"⇄", title:"xfade/whip/zoom", desc:"Transitions between clips."},
  {cat:"Render", icon:"▥", title:"B-roll Every 8 s", desc:"Pexels stock overlay — keyword matched."},
  {cat:"Render", icon:"◐", title:"Thumb + Title", desc:"FFmpeg + SD thumb burn."},
  {cat:"Render", icon:"⬚", title:"Shorts/Reels Preset", desc:"One tap 9:16 + 1:1."},
  {cat:"Render", icon:"⚙", title:"Parallel Ratios", desc:"Celery — 4 exports at once."},
  {cat:"Render", icon:"∿", title:"WebSocket Progress", desc:"Live % — queue→done, no poll needed."},
  {cat:"Render", icon:"▶", title:"HLS Preview", desc:"Stream before download."},
  {cat:"Render", icon:"⬇", title:"ZIP All", desc:"Download all ratios as ZIP."},
  // LLM / VAULT
  {cat:"Vault", icon:"◈", title:"OpenAI + base_url", desc:"Any OpenAI-compatible — OpenRouter etc.", badge:"BYO Key"},
  {cat:"Vault", icon:"◇", title:"Anthropic Claude", desc:"3.5 Sonnet/Haiku via vault."},
  {cat:"Vault", icon:"⚡", title:"Groq (free)", desc:"llama3-70b — ultra fast, free tier."},
  {cat:"Vault", icon:"🌊", title:"DeepSeek", desc:"chat/coder — cheap + strong."},
  {cat:"Vault", icon:"✦", title:"Gemini 1.5", desc:"Flash/Pro via LiteLLM."},
  {cat:"Vault", icon:"⬢", title:"Ollama Local", desc:"No key — llama3/mistral on your box."},
  {cat:"Vault", icon:"⬣", title:"Cline OAuth", desc:"Token vault — extend to redirect."},
  {cat:"Vault", icon:"⬔", title:"Antigravity OAuth", desc:"Token vault — extend to redirect."},
  {cat:"Vault", icon:"⇄", title:"OpenRouter etc", desc:"Together/Fireworks/Perplexity via base_url."},
  {cat:"Vault", icon:"⧉", title:"LiteLLM Proxy", desc:"One call — any provider, same prompt."},
  // PWA
  {cat:"PWA", icon:"⬢", title:"Next.js 14 PWA", desc:"Workbox 7 — NetworkFirst/NetworkOnly."},
  {cat:"PWA", icon:"⬣", title:"Install", desc:"Add to Home Screen — standalone."},
  {cat:"PWA", icon:"◍", title:"Offline Cache", desc:"UI + jobs cached — view offline."},
  {cat:"PWA", icon:"↗", title:"Share Target", desc:"Share from YouTube → AIOTCG."},
  {cat:"PWA", icon:"🔔", title:"Web Push VAPID", desc:"pywebpush — notify when done, app closed."},
  {cat:"PWA", icon:"⟳", title:"Background Sync", desc:"Queued upload sends when back online."},
  {cat:"PWA", icon:"⟡", title:"tus Resume 4G", desc:"Chunked — survives signal loss."},
  {cat:"PWA", icon:"◈", title:"A2HS Prompt", desc:"Smart install banner on Android."},
  // STUDIO
  {cat:"Studio", icon:"✂", title:"Timeline 0.1 s", desc:"Drag handles — huge thumb targets."},
  {cat:"Studio", icon:"☰", title:"Tap Word → Seek", desc:"Transcript word sets cut."},
  {cat:"Studio", icon:"↻", title:"Rerender Clip", desc:"Tweak → rerender one clip, keep rest."},
  {cat:"Studio", icon:"▥", title:"Templates", desc:"Story/Podcast/Gaming/Vlog presets."},
  {cat:"Studio", icon:"⧉", title:"Flower Queue", desc:"Celery monitor — see workers live."},
  {cat:"Studio", icon:"🔍", title:"Semantic Search", desc:"pgvector — find clips by idea."},
  {cat:"Studio", icon:"▤", title:"Grafana/Sentry", desc:"Metrics + errors — prod ready."},
  {cat:"Studio", icon:"👥", title:"Quotas + History", desc:"Per-user limits + project list."},
  {cat:"Studio", icon:"∿", title:"Live Progress", desc:"WebSocket or 1.5 s poll fallback."},
  {cat:"Studio", icon:"🔐", title:"Auth Ready", desc:"Supabase Auth — drop-in."},
];

const CATS = ["All","Ingest","Transcribe","Viral","Vision","Captions","Audio","Render","Vault","PWA","Studio"] as const;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [ratios, setRatios] = useState<string[]>(["9:16"]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleRatio = (r: string) => setRatios(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r]);

  const onUpload = async () => {
    if (!file) return;
    if (ratios.length===0) return alert("Pick at least one ratio");
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

  const filtered = useMemo(()=>{
    let f = FEATURES;
    if(cat!=="All") f = f.filter(x=>x.cat===cat);
    if(q.trim()){
      const qq=q.toLowerCase();
      f = f.filter(x=> (x.title+x.desc+x.cat).toLowerCase().includes(qq));
    }
    return f;
  },[cat,q]);

  const visible = showAll ? filtered : filtered.slice(0,12);

  return (
    <div className="space-y-6">
      {/* Pro hero — editorial, not bubbly */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.08] via-transparent to-transparent" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">CONTENT OS • SELF-HOSTED</span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> API: BYO Keys • Your Data</span>
            <span className="hidden sm:inline text-xs text-zinc-500 ml-auto mono">{FEATURES.length} tools • PWA • GPU</span>
          </div>
          <h1 className="text-[30px] sm:text-[42px] font-extrabold leading-[0.95] tracking-[-0.03em] mt-5">
            Turn long video<br/>
            <span className="text-zinc-500">into viral clips.</span> <span className="bg-white text-black px-2.5 py-0.5 rounded-xl">In one tap.</span>
          </h1>
          <p className="text-sm sm:text-[15px] text-zinc-400 mt-3 max-w-2xl leading-relaxed">
            Phone is the <b className="text-zinc-200">remote</b> — server is the <b className="text-zinc-200">studio</b>. Whisper large-v3 transcribes (ID+EN), LLM ranks 5–60 s windows, YOLO frames your face for 9:16, FFmpeg burns word-pop captions. <b className="text-zinc-200">No PC needed.</b>
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <a href="#studio" className="bg-white text-black font-semibold px-5 py-3 rounded-full text-sm">Open Studio →</a>
            <a href="/docs" className="bg-zinc-800 border border-zinc-700 text-white px-5 py-3 rounded-full text-sm font-medium">Docs & Deploy</a>
            <a href="/settings" className="hidden sm:inline bg-violet-600 text-white px-5 py-3 rounded-full text-sm font-semibold">Vault — Add Keys</a>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
            {[
              {k:"108", l:"tools"},
              {k:"4", l:"ratios"},
              {k:"12", l:"caption styles"},
              {k:"<60s", l:"clip length"},
              {k:"GPU", l:"nvenc / CPU"},
              {k:"PWA", l:"offline + push"},
            ].map(s=>(
              <div key={s.k} className="bg-zinc-800/80 border border-zinc-700/60 rounded-2xl px-3 py-3">
                <div className="text-[16px] font-extrabold leading-none tracking-tight">{s.k}</div>
                <div className="text-[11px] text-zinc-500 font-medium uppercase tracking-wide mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Studio — upload */}
      <div id="studio" className="card space-y-4 scroll-mt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-[16px] tracking-tight">Studio — Create</h2>
            <p className="text-xs text-zinc-500 mt-1">Gallery / Camera / Files • 4G resumable • server renders</p>
          </div>
          <span className="text-xs bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full font-medium">● Studio</span>
        </div>

        <div
          onClick={()=>inputRef.current?.click()}
          className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-800/40 p-7 text-center hover:border-zinc-600 hover:bg-zinc-800/60 cursor-pointer transition"
        >
          <div className="relative">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white text-black grid place-items-center font-black">⬆</div>
            <div className="font-semibold mt-3 text-[14px] tracking-tight">{file ? file.name : "Drop or tap to select video"}</div>
            <div className="text-xs text-zinc-500 mt-1">MP4 • MOV • WEBM • up to 2 GB • tus resumable</div>
            {file && <div className="inline-flex mt-3 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-full text-xs font-medium">{(file.size/1024/1024).toFixed(1)} MB • Ready</div>}
            {!file && <div className="text-[11px] text-zinc-600 mt-3">Share from YouTube → choose AIOTCG • Works installed as app</div>}
          </div>
        </div>
        <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)} />

        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">Export</div>
            <span className="text-xs text-zinc-500">multi-select</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {[
              {r:"9:16", label:"TikTok / Shorts", sub:"1080×1920"},
              {r:"16:9", label:"YouTube", sub:"1920×1080"},
              {r:"1:1", label:"Feed", sub:"1080×1080"},
              {r:"4:5", label:"Portrait", sub:"1080×1350"},
            ].map(x=>(
              <button key={x.r} onClick={()=>toggleRatio(x.r)} className={`p-3 rounded-2xl border text-left transition ${ratios.includes(x.r) ? "bg-white border-white text-black" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600"}`}>
                <div className="font-bold text-sm">{x.r}</div>
                <div className="text-xs opacity-70">{x.label}</div>
                <div className="text-[11px] opacity-50">{x.sub}</div>
                {ratios.includes(x.r) && <div className="text-xs mt-1 font-semibold">● selected</div>}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onUpload} disabled={!file||uploading} className="btn w-full text-[15px] disabled:opacity-50 flex items-center justify-center gap-2">
          {uploading ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Uploading…</> : <>Generate Viral Clips →</>}
        </button>
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Whisper + LLM + FFmpeg on server — close the app, get push when done
        </div>
      </div>

      {/* Job status */}
      {jobId && (
        <div className="card space-y-4 border-zinc-700">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2"><span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" /> Job {jobId.slice(0,8)}…</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${status?.status==="done"?"bg-emerald-500 text-white":status?.status==="failed"?"bg-red-500 text-white":"bg-zinc-800 text-zinc-300 border border-zinc-700"}`}>{status?.status || "queued"}</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-zinc-700/50">
            <div className="bg-white h-2 transition-all duration-700" style={{width: `${status?.progress||5}%`}} />
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{status?.progress||5}% • {status?.status || "queued"}</span>
            <a href={`/jobs/${jobId}`} className="text-violet-400 font-medium">Details →</a>
          </div>
          {status?.clips && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3">
              <div className="text-xs font-bold text-zinc-200 mb-2">{status.clips.length} viral moments — ranked</div>
              {status.clips.map((c:any,i:number)=>(
                <div key={i} className="flex gap-2 text-xs py-1.5 border-b border-zinc-800 last:border-0">
                  <span className="bg-white text-black w-6 h-6 rounded-full grid place-items-center font-bold shrink-0 text-[11px]">{i+1}</span>
                  <div>
                    <div className="font-semibold text-zinc-200">{c.title} <span className="text-zinc-500">• {c.score}/10</span></div>
                    <div className="text-zinc-500">{c.start?.toFixed(1)}s–{c.end?.toFixed(1)}s • {c.reason?.slice(0,80)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {status?.outputs && status.outputs.length>0 && (
            <div className="grid gap-3">
              {status.outputs.map((o:any,i:number)=>(
                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold">{o.ratio} • Clip {o.clip_index+1}</div>
                    <div className="text-xs text-zinc-500">{o.start?.toFixed(1)}s – {o.end?.toFixed(1)}s</div>
                  </div>
                  <a href={`${API}/outputs/${o.path.split("/").pop()}`} target="_blank" className="bg-white text-black px-4 py-2.5 rounded-full text-sm font-bold shrink-0">▶ Play</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 100+ tools — pro, filterable, categorized */}
      <div className="card space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-[15px] tracking-tight">108 Tools — Pro Studio</h3>
            <p className="text-xs text-zinc-500 mt-1">Search or filter by category. Server does heavy work — phone is remote.</p>
          </div>
          <span className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full font-medium">{filtered.length} tools</span>
        </div>

        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search — e.g. whisper, yolo, demucs, pwa…" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600" />
          <button onClick={()=>setShowAll(!showAll)} className="bg-zinc-800 border border-zinc-700 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap">{showAll?"Show less":"Show all"}</button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${cat===c?"bg-white text-black border-white":"bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"}`}>{c}</button>
          ))}
        </div>

        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(f=>(
            <div key={f.title} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 flex gap-3 hover:border-zinc-700 transition">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 grid place-items-center text-sm font-bold shrink-0">{f.icon}</div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold leading-none tracking-tight truncate">{f.title}</span>
                  {f.badge && <span className="text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">{f.badge}</span>}
                </div>
                <div className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">{f.desc}</div>
                <div className="text-[11px] text-zinc-600 mt-1 font-medium">{f.cat}</div>
              </div>
            </div>
          ))}
        </div>
        {!showAll && filtered.length>12 && (
          <button onClick={()=>setShowAll(true)} className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 py-3 rounded-full text-sm font-semibold transition">Show all {filtered.length} tools →</button>
        )}
        <div className="text-[11px] text-zinc-600 leading-relaxed">All tools run on <b className="text-zinc-400">FastAPI + Celery + FFmpeg + MinIO</b> on your server/Railway. Frontend (Vercel on phone) is thin. Bring keys in Vault — no .env editing.</div>
      </div>

      <WhereApiUrl />

      <div className="text-center space-y-3 pb-2">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" /> Content OS • Self-hosted • <a href="/settings" className="text-violet-400 font-semibold">Vault</a> • <a href="/docs" className="text-zinc-300">Docs</a>
        </div>
        <div className="text-[11px] text-zinc-600">Add to Home Screen for fullscreen • Works localhost, Vercel, Netlify • Backend on Railway/Render/RunPod</div>
      </div>
    </div>
  );
}
