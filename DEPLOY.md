# Deploy AIOTCG - Phone-only (Vercel + Netlify)

## Vercel (Recommended - 2 taps on phone)

1. Go to **vercel.com** → Add New Project → Import **attaxchannel/AIOTCG**
2. **Root Directory:** `frontend` (IMPORTANT: set to frontend/)
3. Framework: Next.js (auto)
4. Env: `NEXT_PUBLIC_API_URL` = your backend URL (e.g. https://aiotcg-api.railway.app or http://YOUR_IP:8000)
5. Deploy → You get `aiotcg.vercel.app`
6. On Android Chrome → Open URL → Menu ⋮ → **Add to Home Screen** → Standalone PWA

> Vercel builds from `frontend/` only. Backend is NOT on Vercel (see below).

## Netlify (Alternative)

1. **netlify.com** → Add new site → Import from GitHub → `attaxchannel/AIOTCG`
2. **Base directory:** `frontend`
3. **Build command:** `npm run build`
4. **Publish directory:** `.next`
5. Plugin `@netlify/plugin-nextjs` auto-installed via `netlify.toml`
6. Env: `NEXT_PUBLIC_API_URL` same as above
7. Deploy → `aiotcg.netlify.app` → Add to Home Screen same as Vercel

## Backend Hosting (Required - Heavy GPU)

Vercel/Netlify are **frontend only**. Backend (FastAPI + Celery + Whisper + FFmpeg) needs a server with GPU/CPU:

**Options you can deploy from phone:**
- **Railway.app** → New Project → Deploy from GitHub → Select repo → Add Redis + Postgres plugins → Set env `OPENAI_API_KEY`, `OPENAI_BASE_URL=https://api.groq.com/openai/v1` → Deploy `backend/` (Dockerfile auto)
- **Render.com** → New Web Service → From GitHub → Docker → same env
- **RunPod.io / HuggingFace Spaces** (GPU) for faster-whisper/YOLO
- **Codespaces** (Your PAT has access) → GitHub → Code → Codespaces → New → `docker compose up`

Set `NEXT_PUBLIC_API_URL` in Vercel/Netlify to that backend URL.

## Local Phone Test (Termux/Acode)

```bash
git clone https://github.com/attaxchannel/AIOTCG.git
cd AIOTCG
# No docker on phone - just test frontend
cd frontend && npm install && npm run dev
```

## PWA Features Verified

- `manifest.json` share_target, standalone, maskable icons
- `next-pwa` Workbox caching, offline, background sync
- Share from YouTube → AIOTCG works after PWA install
