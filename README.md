# 🌌 AIOTCG Studio — Human Made, AI Powered

**All-In Tools Content Generator** — Self-hosted **Progressive Web App** that turns any long video into viral Shorts / Reels / TikToks in one tap — with a **living galaxy** behind it. No app store, no PC required. **Phone = Remote. Server = Studio.**

![PWA](https://img.shields.io/badge/PWA-Standalone-violet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi)
![Whisper](https://img.shields.io/badge/Whisper-large--v3-red)
![Galaxy](https://img.shields.io/badge/Background-Galaxy_Parallax-7C3AED)
![Self-Hosted](https://img.shields.io/badge/Your_Keys-Your_Data-emerald)

> **Upload → Auto Generate → Download.** The phone never renders — it just controls the studio. Add to Home Screen and it feels native.

---

## ✨ What is AIOTCG?

| Mode | What it does |
|---|---|
| **Automatic Content Generator** | `faster-whisper` transcribes (Bahasa ID + EN), LLM scores every 5–60s window on HOOK/PAYOFF/EMOTION (Groq/Claude/GPT/Gemini/Ollama), YOLO frames subject to center for 9:16, FFmpeg burns TikTok word-pop captions and renders 4 ratios in parallel. |
| **Manual Content Generator** | Human drags timeline (0.1s), taps transcript word to set start, picks B-roll/transition, rerenders — same GPU pipeline, your cut. |
| **Narrative / Studio Stories** | Long-form movie/storyline generation (template packs: Podcast/Gaming/Vlog/Story) + TTS + B-roll every 8s — Phase 4. |

**Built for creators on phone:** huge thumb targets, bottom dock, glass cards rounded-24, warm #0a0a0b studio not stark, offline cache, resumable 4G upload.

---

## 🌌 Galaxy Background — Beautiful & Interactive

This is not a static gradient. Every page lives under a **parallax galaxy**:

- **Canvas nebulae** (5 blobs, violet to indigo to pink hsla) with radial gradients + vignette
- **~w*h/4200 stars** that **twinkle** (sin phase) and **parallax with your cursor/finger** (mx/my * r*9)
- **Shooting star** streak (0.12% per frame) — watch the top-right
- **Respects prefers-reduced-motion** — falls back to static radial-gradient
- **DPR capped at 1.5**, passive touch, requestAnimationFrame — smooth on mid-range Android

> File: `frontend/components/GalaxyBackground.tsx` — mount once in `layout.tsx` as `fixed inset-0 -z-10`. No image, pure Canvas. Move your mouse/finger — stars follow.

Icons are **real galaxy icons** (`icon-192.png` 5.2KB + `icon-512.png` 16KB) — no more 0-byte placeholder — maskable, shows on Android launcher.

---

## 🔌 NEXT_PUBLIC_API_URL — The One Variable That Makes the Web Interactive

> "Where do I store it?" — the #1 question.

`frontend/lib/api.ts` does one thing:

```ts
export const API = (() => {
  const env = process.env.NEXT_PUBLIC_API_URL; // set at build time
  if (typeof window !== 'undefined') {
    const ls = localStorage.getItem('NEXT_PUBLIC_API_URL'); // interactive override
    if (ls?.startsWith('http')) return ls;
  }
  return env || "http://localhost:8000";
})();
// every fetch(`${API}/api/upload`) and WebSocket wsUrl uses it
```

**So: frontend (Vercel/Netlify/your phone) → NEXT_PUBLIC_API_URL → backend (FastAPI:8000). Change that URL and the whole PWA points somewhere else.**

### Where to store it for each deploy

| You deploy frontend on… | Where to paste NEXT_PUBLIC_API_URL | How to change interactively |
|---|---|---|
| **Vercel** | vercel.com → Project → Settings → Environment Variables → NEXT_PUBLIC_API_URL → Redeploy | Edit there, Redeploy — 30s, no code |
| **Netlify** | app.netlify.com → Site → Settings → Build & deploy → Environment → NEXT_PUBLIC_API_URL → Trigger deploy | Same — live after deploy |
| **Docker Compose (localhost)** | 1) root .env → NEXT_PUBLIC_API_URL=http://localhost:8000 2) frontend/.env.local (same) 3) docker-compose.yml → frontend.build.args.NEXT_PUBLIC_API_URL | echo "NEXT_PUBLIC_API_URL=http://192.168.1.50:8000" > frontend/.env.local && docker compose up -d --build frontend |
| **PC Chrome no Docker** | frontend/.env.local | NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev |
| **Phone Termux** | frontend/.env.local or inline | NEXT_PUBLIC_API_URL=https://your-railway.app npm run dev then http://localhost:3000 |
| **Codespaces** | Env + Ports forward | Set to https://xxx-8000.app.github.dev (Ports tab → 8000 → forward) |

**Phone without rebuild trick:** On your *.vercel.app → Chrome DevTools Console (or chrome://inspect) → `localStorage.setItem('NEXT_PUBLIC_API_URL','https://new-backend.railway.app'); location.reload()` — PWA instantly uses new backend because lib/api.ts checks localStorage first.

> Root Directory matters: Vercel → `frontend`, Netlify → `base = frontend` — we ship vercel.json + netlify.toml so it just works.

Check live value on home page — the **Where the web talks to AI** card shows current API + GET /api/health probe (Backend online / offline).

---

## ✨ 50+ Tools Inside

<details><summary><b>Tap to expand — 52 tools</b></summary>

1. Viral Hook Finder (HOOK/PAYOFF/EMOTION 1-10)
2. TikTok Pop Captions (.ass karaoke)
3. Auto-Frame 9:16 (YOLOv8n + Kalman)
4. Denoise & Loudnorm (afftdn + EBU R128)
5. 4 Ratios Parallel (9:16/16:9/1:1/4:5)
6. Manual Timeline (0.1s, tap word)
7. Bring Your Own Key (vault + LiteLLM)
8. Phone-First PWA (offline + push)
9. Resumable 4G Upload (tus.io 5MB)
10. Whisper large-v3 (faster-whisper + WhisperX)
11. 12 Caption Themes (safe zones)
12. B-Roll Pexels (LLM keywords, Phase 4)
13. Auto Ducking
14. Auto Thumbnail (FFmpeg frame)
15. Title & Hashtags (per clip)
16. Translate ID to EN + slang fix
17. GPU Render (h264_nvenc)
18. MinIO S3 presigned
19. Web Push (even if PWA closed)
20. Virality Rank + hook_text
21. Saliency Fallback
22. Transitions (xfade)
23. Font Vault (Montserrat/Bebas)
24. Safe Zones (no UI overlap)
25. Dark Studio warm
26. Multi-Tenant Ready
27. Batch & Watch Folder
28. Semantic Search (pgvector)
29. Analytics hook (Flower/Grafana/Sentry)
30. Template Packs (Story/Podcast/Gaming/Vlog)
31. TTS Voice-Over (Coqui/OpenVoice)
32. Auto Highlights (autocut)
33. ffprobe Scene Detect
34. Share Target API (YouTube → AIOTCG)
35. Background Sync (Workbox)
36. Project History & Search
37. Lifecycle (7d uploads / 30d outputs)
38. Quality Presets (720p/1080p, CRF)
39. Silence Trim (sentence logic)
40. In-App Docs (/docs)
41. Provider Test (1-token)
42. Masked Keys (sk-***xxxx)
43. ID/EN auto-detect
44. Ideal 25-58s clamp
45. Copy Job ID
46. Direct Download + HLS
47. Delete Job
48. Rerender Manual
49. WebSocket + Poll Fallback
50. Galaxy Parallax (new)
51. NEXT_PUBLIC_API_URL probe (new)
52. Handphone & PC Deploy (new)

</details>

---

## 🏗️ Architecture

```
[ Android Chrome PWA ] -- Add to Home Screen -- [ Vercel / Netlify (Next.js, +pwa) ]
        | tus 5MB chunks                  |
        | share_target -> /upload          | NEXT_PUBLIC_API_URL
        v                                 v
     [ Nginx ] -> [ FastAPI:8000 ] -> [ Celery + Redis ] -- [ Postgres+pgvector ]
                    | warms GPU      | FFmpeg+YOLO+Whisper     | jobs / vault
                    v                v                         v
               [ MinIO S3 ] <--- [ GPU Worker (Railway/RunPod) ] 
                    | outputs/     | renders 4 ratios parallel
                    v                v
               [ /outputs/* ] <-presigned-> [ Phone downloads ]
               [ /ws/jobs/{id} (1.2s poll) + Web Push (VAPID) ]
```

**Stack:** Next.js 14 + Tailwind + next-pwa/Workbox 7 + Zustand + Uppy/tus, FastAPI + Celery 5.3 + Redis + Postgres 16 + MinIO, faster-whisper large-v3 + WhisperX + pyannote, LiteLLM + YOLOv8n + FFmpeg 6.1 + pysubs2.

---

## 🚀 Quick Start — Pick Your Path

| Want… | Go to |
|---|---|
| Test on PC localhost now | Self-Host localhost Chrome |
| Test on phone (no PC) | Phone Chrome No PC Needed |
| Put frontend on internet (free) | Hosted Web Vercel/Netlify |
| Put backend GPU on cloud | Backend GPU |

---

## 🏠 Self-Host — Localhost Chrome (PC + Phone)

### PC Chrome (Windows / Mac / Linux)

**With Docker (1 command):**
```bash
git clone https://github.com/attaxchannel/AIOTCG.git
cd AIOTCG
cp .env.example .env
# Optional: nano .env — add OPENAI_API_KEY or skip and use /settings later
# Optional: echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local

docker compose up --build -d
# Frontend → http://localhost:3000
# API Docs → http://localhost:8000/docs
# MinIO    → http://localhost:9001  (aitcg / aitcg12345)
docker compose ps
docker compose logs -f api worker
```

**Without Docker (dev, 3 terminals):**
```bash
# 1 — backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 2 — worker
celery -A app.celery_app.celery worker -Q default,gpu --loglevel=info -c 2

# 3 — frontend (Chrome)
cd frontend && npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
# → http://localhost:3000
```

> Keys: add at http://localhost:3000/settings → Keys → paste Groq/Claude/GPT key → Save → Test. No .env edit needed.

### 📱 Phone Chrome — No PC Needed

| Method | Step-by-step on Phone Chrome |
|---|---|
| **A) Cloudflare Tunnel (PC to Phone zero-config)** | On PC: cloudflared tunnel --url http://localhost:3000 → copy https://xxx.trycloudflare.com → open on phone Chrome |
| **B) Termux localhost** | Play Store → Termux → pkg install git nodejs-lts → git clone https://github.com/attaxchannel/AIOTCG.git; cd AIOTCG/frontend; npm install; npm run dev → Chrome http://localhost:3000 |
| **C) Acode Editor** | Acode → Open folder AIOTCG/frontend → menu → Terminal → npm run dev → Chrome http://localhost:3000 |
| **D) GitHub Codespaces** | Phone Chrome → github.com/attaxchannel/AIOTCG → Code → Codespaces → Create → in terminal: cp .env.example .env && docker compose up --build -d → Ports tab → open 3000 forwarded URL |
| **E) Expose PC to Phone (same Wi-Fi)** | PC: ipconfig (Win) / ifconfig (Mac) → note 192.168.1.xxx → frontend/.env.local → NEXT_PUBLIC_API_URL=http://192.168.1.xxx:8000 → docker compose up -d --build frontend → phone Chrome http://192.168.1.xxx:3000 |

---

## 🌐 Hosted Web — Vercel + Netlify (Handphone & PC)

> We build only frontend/ on Vercel/Netlify. The backend (Whisper + FFmpeg + YOLO GPU) cannot run on serverless — host it separately (Railway/Render/RunPod/Codespaces backend URL).

### Vercel — On Handphone (2 taps) & PC (same)

**On Handphone Chrome:**
1. Open vercel.com → Log in with GitHub → Add New Project → Import attaxchannel/AIOTCG.
2. Root Directory → Edit → type frontend → Framework auto Next.js.
3. Environment Variables → NEXT_PUBLIC_API_URL = your backend URL (e.g. https://aiotcg-backend.railway.app or https://xxx-8000.app.github.dev from Codespaces).
4. Deploy → wait ~90s → open https://aiotcg-xxx.vercel.app → Chrome menu → Add to Home Screen → open PWA → see galaxy + Backend online.
5. Change backend later? Vercel → Project → Settings → Environment Variables → edit → Redeploy (or on PWA: console localStorage.setItem('NEXT_PUBLIC_API_URL','https://new-backend.com'); location.reload()).

**On PC Chrome:** Same steps on vercel.com desktop — or CLI: `npm i -g vercel && cd frontend && vercel --prod`.

**Config already in repo:** `vercel.json` (buildCommand: cd frontend && npm install && npm run build, outputDirectory: frontend/.next) + `frontend/vercel.json`.

### Netlify — On Handphone & PC

**On Handphone Chrome:**
1. app.netlify.com → Add new site → Import from GitHub → attaxchannel/AIOTCG.
2. It auto-reads netlify.toml: base = frontend, command = npm run build, publish = .next, plugins @netlify/plugin-nextjs.
3. Site settings → Build & deploy → Environment → NEXT_PUBLIC_API_URL = your backend.
4. Deploy → https://aiotcg-xxx.netlify.app → menu → Add to Home Screen.
5. Same localStorage trick works.

**On PC Chrome:** Same or `netlify deploy --prod` from frontend/.

### Backend GPU — Deploy from Phone Browser

| Host | How (on phone Chrome) | Env to set |
|---|---|---|
| **Railway** | railway.app → New Project → Deploy from GitHub → AIOTCG → Add Redis + Postgres plugins → Variables → Deploy (Dockerfile auto) | OPENAI_API_KEY optional (or use /settings vault) |
| **Render** | render.com → New → Web Service → AIOTCG → Docker → add Redis+Postgres | same |
| **RunPod** | runpod.io → Pods → GPU pod → pull image / git clone → docker compose up | same |
| **Codespaces (free GPU-ish)** | github.com/... → Code → Codespaces → New → docker compose up → Port 8000 forwarded → copy URL as NEXT_PUBLIC_API_URL | — |

After backend live → update Vercel/Netlify NEXT_PUBLIC_API_URL and redeploy frontend once. Then never touch env again — add LLM keys in-app at /settings.

---

## 🔑 In-App API Keys — No .env

Open /settings → Keys:

- 8 provider cards: OpenAI / Anthropic / Groq / DeepSeek / Gemini / Ollama / Cline / Antigravity — paste key + Base URL + model → Save.
- GET /api/settings returns masked sk-***xxxx, POST /api/settings encodes (base64 now, Fernet TODO), POST /api/settings/test does 5-token LiteLLM check.
- services/viral_vault.get_active_llm() reads vault first → falls back to .env (get_settings()).
- Switch Groq llama3-70b-8192 (free, fast) to Claude claude-3-5-sonnet without restart.

> Any OpenAI-compatible (OpenRouter/Together/Fireworks/Perplexity/Anyscale): set OpenAI Base URL to their endpoint + model name — LiteLLM handles it.

---

## 📖 Docs & References

- In-app /docs + docs/ARCHITECTURE.md + docs/PHONE_GUIDE.md + DEPLOY.md.
- docs/GITHUB_REFS.md — 25+ repos studied: SYSTRAN/faster-whisper (26k stars), m-bain/WhisperX, jianchang512/pyvideotrans, s0md3v/autocut, harry0703/MoneyPrinterTurbo, Ultralytics, demucs, Remotion, ffmpeg.wasm, tus, LiteLLM, Ollama, Coqui TTS etc.
- API: http://localhost:8000/docs Swagger, GET /api/health.

---

## 🐛 Bugs Fixed & Improvements (this release)

See full scan: docs/BUGSCAN.md. Highlights:

- Fixed video.py invalid escape min(iw\,ih) → min(iw\\,ih), caption.py ASS_HEADER raw string + \k f-string — no more SyntaxWarning.
- Fixed CORS allow_credentials=True with wildcard — now False (spec-compliant).
- Fixed lib/api.ts duplicate — now single API with localStorage override for interactive backend switching without rebuild.
- Fixed viral.py swallowed v scope + added provider-aware LiteLLM prefix (groq/, anthropic/, deepseek/, gemini/).
- frontend/Dockerfile now ARG NEXT_PUBLIC_API_URL + ENV so Next.js inlines correct backend at build; docker-compose.yml forwards build arg.
- Generated real galaxy icons (was 0 bytes) — PWA install now shows icon on Android.
- Added GalaxyBackground.tsx (Canvas parallax) + WhereApiUrl.tsx probe card on home.

**Still TODO (roadmap):** base64 → Fernet encryption, auth for vault, tus upload instead of plain multipart, pgvector embeddings, push VAPID, per-user quotas, thumbnail generation in job.

---

## 🛠️ .env.example (optional if using /settings)

```env
REDIS_URL=redis://redis:6379/0
DATABASE_URL=postgresql://aitcg:aitcg@postgres:5432/aitcg
S3_ENDPOINT=http://minio:9000
# Optional — prefer /settings vault:
OPENAI_API_KEY=sk-proj-...
OPENAI_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama3-70b-8192
WHISPER_MODEL=large-v3
# Frontend → Backend (for localhost/Docker)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📄 License

Self-hosted, your keys your data. FFmpeg LGPL, faster-whisper MIT. Research refs above.

**Made for phone creators — install as app, create anywhere.** 🌌
