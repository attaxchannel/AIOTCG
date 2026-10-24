export default function DocsPage(){
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="card border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-black grid place-items-center font-black">≡</div>
          <div>
            <h1 className="text-[18px] font-black tracking-tight">Docs — Content OS</h1>
            <p className="text-xs text-zinc-500">108 tools • PWA • Self-hosted • Phone-first • Vault</p>
          </div>
          <span className="ml-auto hidden sm:inline text-[11px] bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full text-zinc-400">v2 Pro</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="/" className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold">Open Studio</a>
          <a href="/settings" className="bg-violet-600 text-white px-4 py-2 rounded-full text-xs font-semibold">Vault — Keys</a>
          <a href="https://github.com/attaxchannel/AIOTCG" target="_blank" className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-full text-xs">GitHub ↗</a>
          <a href="https://aiotcg-alpha.vercel.app" target="_blank" className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-full text-xs">Live: aiotcg-alpha.vercel.app</a>
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="font-bold tracking-tight">Self-Host — Phone & PC (Chrome)</h2>
        <div className="text-sm leading-relaxed text-zinc-300 space-y-3">
          <div>
            <div className="text-xs font-bold text-zinc-200 uppercase tracking-wide">PC Chrome — Windows/Mac/Linux (Docker)</div>
            <code className="block bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs mono mt-1.5 overflow-auto">git clone https://github.com/attaxchannel/AIOTCG.git && cd AIOTCG && cp .env.example .env && docker compose up --build -d</code>
            <div className="text-xs text-zinc-500 mt-1">Edit <code className="bg-zinc-800 px-1 rounded">.env</code> or better use in-app <a href="/settings" className="text-violet-400">Vault</a>. Open <code className="bg-zinc-800 px-1 rounded">http://localhost:3000</code> + <code className="bg-zinc-800 px-1 rounded">http://localhost:8000/docs</code>.</div>
          </div>
          <div className="border-t border-zinc-800 pt-3">
            <div className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Phone Chrome — No PC (Recommended split)</div>
            <ul className="list-disc ml-5 text-xs text-zinc-400 mt-1.5 space-y-1">
              <li><b className="text-zinc-200">Fastest:</b> Frontend → Vercel from phone browser → connect repo <code className="bg-zinc-800 px-1 rounded">AIOTCG</code> (Root Directory <code className="bg-zinc-800 px-1 rounded">frontend</code>). Backend → Railway/Render → Deploy from GitHub → Add Redis + Postgres → copy public URL.</li>
              <li>Open your <code className="bg-zinc-800 px-1 rounded">vercel.app</code> on Chrome → ⋮ → <b>Add to Home Screen</b> → standalone app.</li>
              <li>Then on the app homepage → <b>⦿ NEXT_PUBLIC_API_URL</b> card → paste Railway URL → <b>Save & Connect</b>. No Vercel rebuild needed.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card border-violet-500/20 space-y-3">
        <h2 className="font-bold tracking-tight">⦿ NEXT_PUBLIC_API_URL — One key connection</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">Frontend (Vercel <code className="bg-zinc-800 px-1 rounded">aiotcg-alpha.vercel.app</code> on your phone/PC) ↔ Backend (FastAPI + Whisper + FFmpeg on Railway). If you see <i>Backend not reachable</i>, fix it here — no code, no env editing.</p>
        <div className="grid sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3"><div className="font-bold">Where it lives</div><div className="text-zinc-500 mt-1"><code className="bg-zinc-800 px-1 rounded">frontend/lib/api.ts</code> — single <code className="bg-zinc-800 px-1 rounded">API</code> const</div></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3"><div className="font-bold">Permanent</div><div className="text-zinc-500 mt-1">Vercel → Env → <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_API_URL</code> → Redeploy</div></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3"><div className="font-bold">Instant (phone)</div><div className="text-zinc-500 mt-1">Homepage card → paste Railway URL → Save → reload</div></div>
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="font-bold tracking-tight">Vault — BYO Keys (in-app, no .env)</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">All keys stored on <b className="text-zinc-200">your server</b> — never in browser. OpenAI-compatible base_url means OpenRouter/Together/Fireworks work. Switch provider + model without restart.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center font-medium">OpenAI + base_url</div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center font-medium">Anthropic Claude</div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center font-medium">Groq (free)</div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center font-medium">DeepSeek</div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center font-medium">Gemini 1.5</div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center font-medium">Ollama Local</div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center font-medium">Cline OAuth</div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-center font-medium">Antigravity OAuth</div>
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="font-bold tracking-tight">108 Tools — by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs leading-relaxed">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"><b>Ingest (12)</b><br/><span className="text-zinc-500">tus 5 MB, Uppy, yt-dlp, presigned S3, batch 10, watch folder, ffprobe, lifecycle, dedupe, pause, offline sync</span></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"><b>Transcribe (12)</b><br/><span className="text-zinc-500">faster-whisper large-v3, WhisperX, diarization, ID/EN, punctuation, VAD, long-form, confidence, editor, SRT/VTT/ASS, translate, pgvector</span></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"><b>Viral (12)</b><br/><span className="text-zinc-500">Hook/Payoff/Emotion, 1–10 score, top 20, hook extract, reason, sentence cut, emotion curve, retention, title, hashtags, B-roll keywords, A/B</span></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"><b>Vision (12)</b><br/><span className="text-zinc-500">YOLOv8 face/person, MediaPipe, Kalman, saliency, 4 ratios, safe zones, face clamp, zoom, multi-face, scene detect, thumb</span></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"><b>Captions (12)</b><br/><span className="text-zinc-500">12 themes, ASS \k pop, font vault, stroke, wrap, keyword bold, emoji, ID slang, libass, HLS preview, per-clip, export ass</span></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"><b>Audio (10)</b><br/><span className="text-zinc-500">demucs, afftdn, loudnorm R128, duck, silence trim, highlights, BGM mixer, beat, waveform, de-reverb</span></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"><b>Render (10)</b><br/><span className="text-zinc-500">FFmpeg 6.1, h264_nvenc, xfade, B-roll 8s, thumb, presets, parallel, WebSocket, HLS, ZIP</span></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"><b>Vault+PWA+Studio (28)</b><br/><span className="text-zinc-500">8 providers, LiteLLM, Next.js 14, Workbox, install, offline, share target, push, tus, timeline 0.1s, tap word, rerender, templates, Flower, pgvector, Grafana, quotas, live %, Supabase Auth</span></div>
        </div>
        <div className="text-xs text-zinc-600">Full list on homepage — searchable & filterable. See <code className="bg-zinc-800 px-1 rounded">docs/GITHUB_REFS.md</code> for 100+ repos.</div>
      </div>

      <div className="card bg-zinc-950 border-zinc-800">
        <h2 className="font-bold tracking-tight">Architecture — Phone=Remote, Server=Studio</h2>
        <div className="text-xs leading-relaxed text-zinc-400 mt-2 mono overflow-auto">
          Browser/PWA (Vercel) —tus→ FastAPI /api/upload → MinIO (presigned) → Celery DAG:<br/>
          Ingest → faster-whisper large-v3 + WhisperX align + diarization → LiteLLM (vault) viral rank → YOLO auto-frame → FFmpeg ass+autoframe+4 ratios → outputs → Web Push → PWA<br/>
          Stack: Next.js 14 + Workbox 7 + tusd/Uppy • FastAPI + Celery 5.3 + Redis + Postgres 16+pgvector + MinIO • FFmpeg 6.1 + faster-whisper + YOLOv8n + MediaPipe + demucs + LiteLLM + pywebpush
        </div>
      </div>

      <div className="card bg-zinc-900/50 text-xs leading-relaxed">
        <b>GitHub Deep Research — 100+ repos:</b> faster-whisper, WhisperX, pyannote, whisper.cpp, pyvideotrans, autocut, MoneyPrinterTurbo, Ultralytics, MediaPipe, SAM, Remotion, ffmpeg.wasm, tus, Litellm, Ollama, coqui TTS, OpenVoice, demucs, transformers, pgvector, next-pwa... See <code className="bg-zinc-800 px-1 rounded">docs/GITHUB_REFS.md</code>.
      </div>
    </div>
  );
}
