# AIOTCG — All-In Tools Content Generator
**Self-Hosted Web App + PWA | Phone is the Remote, Server is the Studio**

![PWA](https://img.shields.io/badge/PWA-ready-7C3AED) ![FastAPI](https://img.shields.io/badge/FastAPI-009688) ![Next.js](https://img.shields.io/badge/Next.js-14-black)

## 📱 Phone-First: Use entirely from Android

1. Open `https://your-aitcg.vercel.app` on Chrome → **Add to Home Screen** → fullscreen app, no browser bar
2. Share from YouTube → Share → **AIOTCG** (Share Target API) → auto-imports
3. Upload from Gallery → close app → get **push notification** when 3 viral clips ready
4. Edit on touch timeline → Export 9:16 / 1:1 / 16:9 → Save to Gallery

> **Never render on phone.** All FFmpeg/Whisper/YOLO/LLM runs on Python GPU backend. Phone only uploads + previews.

## 🏗️ Architecture

```
[PWA Phone] --HTTPS/tus--> [Nginx] --> [FastAPI] --> [Celery Workers]
                                          |  |  |         |-- GPU: Whisper + YOLO
                                   [Redis][Postgres][MinIO S3]
```
- **Backend:** FastAPI + Celery + Redis + Postgres+pgvector + MinIO
- **AI:** faster-whisper large-v3 + WhisperX + YOLOv8 auto-frame + demucs + LiteLLM (Groq/OpenAI/DeepSeek)
- **Video:** FFmpeg 6.1 via ffmpeg-python, pysubs2 .ass captions
- **Frontend:** Next.js 14 + next-pwa + Workbox + Zustand
- **Upload:** tus.io resumable (critical for 4G)

## 🚀 Quick Start (From Phone)

**Frontend (Vercel - 2 taps):** Fork → vercel.com → Import → Deploy `frontend/`

**Backend (RunPod/Railway):**
```bash
git clone https://github.com/attaxchannel/AIOTCG.git
cd AIOTCG
cp .env.example .env  # set OPENAI_API_KEY
docker compose up --build -d
# Frontend http://YOUR_IP:3000  Backend http://YOUR_IP:8000/docs
```

## 📂 Structure
```
backend/app/{main,celery_app,api/{upload,jobs,ws},services/{transcribe,viral,video,caption},core/{config,db}}
frontend/app/{page,upload,jobs,editor} + public/manifest.json
```

## 🔑 Env
Copy `.env.example` → `.env` and set `OPENAI_API_KEY` + `OPENAI_BASE_URL` (Groq: `https://api.groq.com/openai/v1`)

See `docs/ARCHITECTURE.md` for full 4-phase roadmap, prompts, FFmpeg commands, bottlenecks.
