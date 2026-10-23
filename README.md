# AIOTCG Studio — Human Made, AI Powered ✨

**All-In Tools Content Generator** — Self-hosted web app for viral clipping (YouTube Shorts / TikTok / Reels) + narrative generation. **Phone = Remote, Server = Studio.** Never render on phone. Phone uploads, shows progress, drags timeline, downloads clips. Works fully from Android Chrome (Add to Home Screen PWA) and localhost Chrome on PC.

![PWA](https://img.shields.io/badge/PWA-Standalone-violet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![Whisper](https://img.shields.io/badge/Whisper-large--v3-red)
![Self-Hosted](https://img.shields.io/badge/Self--Hosted-Your%20Keys%20Your%20Data-emerald)

> **Human Touch UI:** Warm gradients, glass cards, huge thumb targets, bottom dock, soft shadows — built for creators on phone. 50+ tools, 1 primary action: **Upload → Auto Generate**.

---

## 🔑 NEW: In-App API Keys (No .env needed)

You can now add keys **directly inside the web** at **`/settings` → 🔑 Keys**. No restart, no `docker compose` edit.

| Provider | Where to paste | Notes |
|---|---|---|
| **OpenAI** | OpenAI Key + Base URL | `sk-proj-...` — any `https://api.openai.com/v1` |
| **Anthropic Claude** | Anthropic Key | `sk-ant-...` — `claude-3-5-sonnet` |
| **Groq** | Groq Key | `gsk_...` — `llama3-70b-8192` — **free & fast** |
| **DeepSeek** | DeepSeek Key | `sk-...` — `deepseek-chat` |
| **Gemini** | Gemini Key | `AI...` — `gemini-1.5-flash` |
| **Ollama (Local)** | Ollama URL | `http://localhost:11434` — no key, runs on your server |
| **Cline / Antigravity** | OAuth Token | Paste token from Cline/Antigravity — stored securely |
| **Any OpenAI-Compatible** | OpenAI Base URL | Point to OpenRouter, Together, Fireworks, Anyscale, Perplexity, etc. Just change Base URL + model |

Keys are stored on **your server** (Postgres vault, encoded at rest) and used by LiteLLM proxy. Frontend (Vercel/Netlify) only forwards to **your** backend. Falls back to `.env` if vault empty.

**Switch provider without restart:** Change Active Provider dropdown → Save → Test → done.

---

## 📱 Screenshots (Phone-First)

- **Generate (Home):** Hero with warm gradient + huge “Tap to pick video” dashed card + 4 ratio chips (9:16 default) + single ⚡ Auto Generate button + collapsible 50+ tools grid.
- **Projects:** Card list with progress bar, status chip, ranked clips with score/reason/hook_text.
- **Editor:** Paste Job ID → ranked clip chips → 0.1s start/end inputs → tap transcript word to set start → Rerender button.
- **Keys:** Provider grid (8 cards) + model input + masked keys + Test button + privacy note.

---

## ✨ 50+ Tools Inside

<details><summary><b>Tap to expand full list</b></summary>

1.  🎯 Viral Hook Finder (LLM HOOK/PAYOFF/EMOTION scoring)
2.  💬 TikTok Pop Captions (.ass word-pop karaoke, pysubs2)
3.  🎥 Auto-Frame 9:16 (YOLOv8n face tracking + Kalman + saliency fallback)
4.  🔇 Denoise & Loudnorm (afftdn + demucs + EBU R128)
5.  📐 4 Ratios Parallel (9:16/16:9/1:1/4:5, one job)
6.  ✂️ Manual Timeline (tap word, 0.1s handles, HLS preview)
7.  🔑 Bring Your Own Key (vault + LiteLLM + OpenAI/Anthropic/Groq/DeepSeek/Gemini/Ollama/Cline/Antigravity/custom)
8.  📱 Phone-First PWA (standalone, Workbox offline, share_target, push)
9.  🔄 Resumable 4G Upload (tus.io 5MB chunks, pause/resume)
10. 🗣️ Whisper large-v3 (faster-whisper + WhisperX word timestamps + diarization + Bahasa slang)
11. 🎨 12 Caption Themes (TikTok/MrBeast/Hormozi/elegant + safe zones)
12. 🖼️ B-Roll from Pexels (LLM keywords → stock overlay every 8s, Phase 4)
13. 🔊 Auto Ducking (voice over music)
14. 🌗 Auto Thumbnail (FFmpeg frame + SD option)
15. 📝 Title & Hashtags (LLM per clip)
16. 🌐 Translate ID ↔ EN (LLM + pyvideotrans)
17. ⚡ GPU Render (h264_nvenc p4, veryfast fallback)
18. ☁️ MinIO S3 (presigned, lifecycle 7d uploads/30d outputs)
19. 🔔 Push Notification (Web Push even if PWA closed)
20. 📊 Virality Score (ranked with reason + hook_text)
21. 🧠 Smart Crop Fallback (saliency if no face)
22. 🎞️ Transitions (xfade, whip, zoom)
23. 🔤 Font Vault (Montserrat/Bebas/Anton baked)
24. 📏 Safe Zones (avoid TikTok UI overlap)
25. 🌓 Dark Studio (warm human not stark)
26. 👥 Multi-Tenant Ready (Supabase Auth + quotas)
27. 📦 Batch & Watch Folder (MinIO + Celery beat)
28. 🔍 Semantic Search (pgvector embeddings)
29. 📈 Analytics (Flower/Grafana/Sentry hooks)
30. 🧩 Template Packs (Story/Podcast/Gaming/Vlog)
31. 🎙️ TTS Voice-Over (Coqui/OpenVoice)
32. ✨ Auto Highlights (loudness + autocut)
33. 🔍 ffprobe Segment Detection
34. 📎 Share Target API (YouTube → AIOTCG)
35. 🌙 Background Sync (Workbox)
36. 📂 Project History & Search
37. 🗂️ Lifecycle & Storage Limits
38. 🎚️ Quality Presets (720p/1080p, CRF)
39. 🧹 Silence Trim (autocut sentence logic)
40. 📖 In-App Docs (/docs)
41. 🧪 Provider Test Button (1-token health check)
42. 🔐 Masked Keys (show only `sk-***xxxx`)
43. 🌐 i18n ID/EN Slang Fix
44. ⏱️ Duration Ideal 25-58s
45. 📋 Copy Job ID
46. ⤓ Direct Download + HLS Play
47. 🗑️ Delete Job
48. 🔄 Rerender Manual
49. 📡 WebSocket Progress + Poll Fallback
50. 🖥️ Localhost on Phone (Termux/Codespaces) + PC Chrome
51. 🚀 Vercel + Netlify Ready (phone deploy)
52. 🧰 25+ GitHub Refs Documented

</details>

---

## 🏗️ Architecture — Phone = Remote, Server = Studio

```
[ Android Chrome PWA ]  —Add to Home Screen—  [ Vercel / Netlify (frontend, Next.js) ]
        | tus resumable 5MB chunks          NEXT_PUBLIC_API_URL
        v                                           |
[ Nginx ] → [ FastAPI:8000 ] → [ Celery + Redis ] → [ Postgres + pgvector (jobs, vault) ]
                | warms GPU            | FFmpeg + YOLO + faster-whisper
                v                      v
            [ MinIO S3 ]          [ GPU Worker (RunPod/Railway) ]
                | outputs/          | render 9:16/1:1/etc parallel
                v                   v
            [ /outputs/* ] ← presigned → [ Phone downloads ]
            [ WebSocket /ws/jobs/{id} + Web Push ]
```

**Stack:** Next.js 14 (App Router, Zustand, next-pwa/Workbox 7, Uppy+tus), FastAPI + Uvicorn + Celery 5.3 + Redis + Postgres 16 + MinIO, faster-whisper large-v3 + WhisperX + pyannote, LiteLLM (OpenAI/Groq/Gemini/Ollama/Anthropic + OAuth), YOLOv8n + MediaPipe, FFmpeg 6.1 (loudnorm+afftdn, ass, scale/crop, h264_nvenc), pysubs2, pgvector.

---

## 🚀 Self-Host — Localhost Chrome (Phone & PC)

### PC Chrome (Windows / Mac / Linux) — 1 command

```bash
git clone https://github.com/attaxchannel/AIOTCG.git
cd AIOTCG
cp .env.example .env
# Edit .env OR skip and use in-app /settings 🔑 (recommended)
# Set NEXT_PUBLIC_API_URL in frontend/.env.local if needed

docker compose up --build -d
# Frontend → http://localhost:3000  (Chrome)
# Backend API → http://localhost:8000/docs  (FastAPI Swagger)
# MinIO Console → http://localhost:9001
# Check: docker compose ps ; docker compose logs -f api worker
```

Open `http://localhost:3000` on Chrome → Upload video → Watch progress via WebSocket → Download clips from `/outputs`. Add `OPENAI_API_KEY` **either** in `.env` OR in the running app at `http://localhost:3000/settings`.

**Without Docker (dev):**
```bash
# Terminal 1 - backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
# Terminal 2 - worker
celery -A app.celery_app.celery worker -Q default,gpu --loglevel=info
# Terminal 3 - frontend
cd frontend && npm install && NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

### Phone Chrome (Android) — No PC Needed

| Method | Steps on Phone Chrome |
|---|---|
| **A) Vercel/Netlify (Recommended)** | `vercel.com` → Import `attaxchannel/AIOTCG` → **Root Directory = `frontend`** → Env `NEXT_PUBLIC_API_URL=https://your-backend.railway.app` → Deploy → Open URL → `⋮` → **Add to Home Screen** → fullscreen PWA |
| **B) Termux localhost** | Play Store → **Termux** → `pkg install git nodejs` → `git clone https://github.com/attaxchannel/AIOTCG.git; cd AIOTCG/frontend; npm install; npm run dev` → Chrome → `http://localhost:3000` |
| **C) GitHub Codespaces** | Phone Chrome → `github.com/attaxchannel/AIOTCG` → **Code → Codespaces → Create codespace** → terminal `cp .env.example .env && docker compose up --build -d` → forwarded port 3000 on phone |
| **D) Cloudflare Tunnel (PC→Phone)** | On PC: `cloudflared tunnel --url http://localhost:3000` → copy `https://xxx.trycloudflare.com` → open on phone Chrome |
| **E) Acode Editor** | Acode → Open folder `AIOTCG/frontend` → Terminal → `npm run dev` → Chrome |

**Expose backend to phone (when backend is on PC):** Find PC IP via `ipconfig` → front `NEXT_PUBLIC_API_URL=http://192.168.1.xxx:8000` → Chrome on same Wi-Fi.

**Push notifications:** After adding to Home Screen, browser will ask permission → enable → backend `pywebpush` sends when job `done`.

---

## 🔧 How API Keys Work (Vault Priority)

```
User taps 🔑 Keys → POST /api/settings (key + provider + model) → UserSettings table (base64)
                                      → GET /api/settings returns masked `sk-***xxxx`
Worker → services/viral_vault.get_active_llm() → reads vault first → if empty → falls back to .env
       → litellm.completion(model, api_key, api_base, messages)
```

**No need to touch `.env` or restart Docker.** Vault is single-tenant `user_id=default` (extend to Supabase Auth later). For production, replace `base64` with `cryptography Fernet` in `app/api/settings.py`.

Test button does a **1-token LLM call** (cost ~ $0.0001) to verify key + base_url + model.

---

## 📖 Docs & Research

- **In-app:** `/docs` → full localhost + 50+ features + research list.
- **`docs/GITHUB_REFS.md`** — 25+ repos studied: SYSTRAN/faster-whisper, m-bain/WhisperX, jianchang512/pyvideotrans, s0md3v/autocut, harry0703/MoneyPrinterTurbo, Ultralytics, demucs, voice-pro, meetily, Remotion, ffmpeg.wasm, tus, Litellm, Ollama, coqui-ai/TTS, OpenVoice, transformers, etc.
- **`docs/ARCHITECTURE.md`** — Deep dive + viral 6-stage DAG + ratio profiles.
- **`DEPLOY.md`** — Phone-only Vercel/Netlify steps.
- API Docs: `http://localhost:8000/docs` (Swagger) + `http://localhost:8000/api/health`.

---

## 🛠️ .env (Optional if using /settings vault)

```env
REDIS_URL=redis://redis:6379/0
DATABASE_URL=postgresql://aitcg:aitcg@postgres:5432/aitcg
S3_ENDPOINT=http://minio:9000
# Only if NOT using in-app /settings:
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.groq.com/openai/v1  # or https://api.openai.com/v1
LLM_MODEL=llama3-70b-8192
WHISPER_MODEL=large-v3
```

---

## 📄 License & Credits

Self-hosted, your keys your data. Research refs above. FFmpeg is LGPL, faster-whisper MIT, MoneyPrinterTurbo curated.

Made for phone creators — **Install as app, create anywhere.**
