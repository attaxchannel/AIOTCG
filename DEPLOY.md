# 🚀 Deploy AIOTCG — Handphone & PC Complete

AIOTCG is split: **frontend (Next.js PWA) → Vercel/Netlify** (serverless, free), **backend (FastAPI+Whisper+FFmpeg+YOLO) → Railway/Render/RunPod/Codespaces** (GPU, always-on).

> Galaxy background + `NEXT_PUBLIC_API_URL` make it interactive. Change the env, whole PWA follows.

---

## 1) Self-Host — Localhost Chrome

### PC Chrome (Windows / Mac / Linux) — Docker

```bash
git clone https://github.com/attaxchannel/AIOTCG.git
cd AIOTCG
cp .env.example .env
# (optional) nano .env — add OPENAI_API_KEY or skip → use app /settings
docker compose up --build -d
# Open:
# http://localhost:3000  frontend
# http://localhost:8000/docs  API Swagger
# http://localhost:9001  MinIO (aitcg / aitcg12345)
docker compose logs -f api worker
```

**Expose to phone same Wi-Fi:** `ipconfig` → `192.168.1.xxx` → `echo "NEXT_PUBLIC_API_URL=http://192.168.1.xxx:8000" > frontend/.env.local` → `docker compose up -d --build frontend` → phone `http://192.168.1.xxx:3000`.

### PC Chrome — Without Docker (3 terminals)

```bash
# T1 backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
# T2 worker
celery -A app.celery_app.celery worker -Q default,gpu --loglevel=info -c 2
# T3 frontend
cd frontend && npm install && NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

### Phone Chrome — No PC Needed

| Method | Steps (on Phone Chrome) |
|---|---|
| **Termux** | Play Store → Termux → `pkg install git nodejs-lts` → `git clone https://github.com/attaxchannel/AIOTCG.git; cd AIOTCG/frontend; npm install; npm run dev` → Chrome `http://localhost:3000` |
| **Acode** | Acode → Open folder `AIOTCG/frontend` → Terminal → `npm run dev` |
| **Codespaces** | `github.com/attaxchannel/AIOTCG` → Code → Codespaces → Create → `cp .env.example .env && docker compose up --build -d` → Ports → open 3000 |
| **Cloudflare Tunnel** | On PC: `cloudflared tunnel --url http://localhost:3000` → copy `https://xxx.trycloudflare.com` → on phone |
| **Backend locally on phone?** | Not recommended (no GPU) — host backend on Railway/RunPod instead |

---

## 2) Hosted Web — Vercel (Handphone & PC)

### On Handphone Chrome (step-by-step)

1. Open **vercel.com** → Log in with GitHub → **Add New Project**.
2. Import `attaxchannel/AIOTCG` → **Root Directory → Edit → `frontend`** (critical).
3. Framework: Next.js (auto, reads `vercel.json`).
4. **Environment Variables** → `NEXT_PUBLIC_API_URL` = `https://YOUR-BACKEND.railway.app` (or `https://xxx-8000.app.github.dev` if backend on Codespaces).
5. **Deploy** (~90s) → open `https://xxx.vercel.app`.
6. Chrome menu → **Add to Home Screen** → open PWA → you should see galaxy + **Backend online** on home card.
7. Need to switch backend? Vercel → Project → Settings → Environment Variables → edit → **Redeploy**. Or quick: in PWA console `localStorage.setItem('NEXT_PUBLIC_API_URL','https://new-backend.com'); location.reload()`.

### On PC Chrome

Same flow on `vercel.com` desktop, or CLI:
```bash
npm i -g vercel
cd frontend
vercel --prod
# set env in vercel dashboard or vercel env add NEXT_PUBLIC_API_URL
```

Config: root `vercel.json` + `frontend/vercel.json` already set (`buildCommand`, `outputDirectory`).

---

## 3) Hosted Web — Netlify (Handphone & PC)

### On Handphone Chrome

1. Open **app.netlify.com** → Add new site → Import from GitHub → `attaxchannel/AIOTCG`.
2. Auto-reads `netlify.toml`: `base = frontend`, `command = npm run build`, `publish = .next`, `[[plugins]] @netlify/plugin-nextjs`.
3. **Site settings → Build & deploy → Environment** → `NEXT_PUBLIC_API_URL` = your backend.
4. **Deploy** → `https://xxx.netlify.app` → menu → Add to Home Screen.

### On PC Chrome

Same, or CLI: `npm i -g netlify-cli && cd frontend && netlify deploy --prod`.

---

## 4) Backend GPU — Deploy from Phone Browser

Backend needs GPU for Whisper + YOLO. **Vercel/Netlify cannot run it** (serverless, no FFmpeg GPU).

| Host | Steps (phone browser) | Notes |
|---|---|---|
| **Railway** | `railway.app` → New Project → Deploy from GitHub → `attaxchannel/AIOTCG` → Add Plugins: **Redis + Postgres** → Variables → Deploy | Uses `backend/Dockerfile` auto |
| **Render** | `render.com` → New → Web Service → connect GitHub → Docker → add Redis/Postgres | |
| **RunPod** | `runpod.io` → Deploy pod (GPU) → git clone → `docker compose up` | Cheapest GPU |
| **HuggingFace Spaces** | Spaces → New → Docker → clone | Community GPU |
| **Codespaces (free)** | `github.com/attaxchannel/AIOTCG` → Code → Codespaces → New → `docker compose up` → Port 8000 → copy forwarded `https://xxx-8000.app.github.dev` | Use that URL as `NEXT_PUBLIC_API_URL` |

> After backend up → **update Vercel/Netlify `NEXT_PUBLIC_API_URL` and redeploy frontend once**. Then add LLM keys in-app at `https://your-frontend.vercel.app/settings` — no env rebuild needed.

---

## 5) `NEXT_PUBLIC_API_URL` — Where to Store (Summary)

| Frontend host | Where |
|---|---|
| Vercel | Project → Settings → Environment Variables |
| Netlify | Site → Settings → Build & deploy → Environment |
| Docker Compose | `docker-compose.yml` `frontend.build.args.NEXT_PUBLIC_API_URL` + root `.env` + `frontend/.env.local` |
| Codespaces | Ports forwarded URL |
| Dev | `frontend/.env.local` or inline `NEXT_PUBLIC_API_URL=... npm run dev` |

`frontend/lib/api.ts` reads it at **build time** (Next.js inlines) + also checks `localStorage` override at runtime for phone quick switch.

Also see `frontend/.env.example` and home card **Where the web talks to AI**.

---

## 6) Verify

- [ ] Frontend opens, **galaxy parallax** moves with finger/mouse.
- [ ] Home card shows **Backend online** (probe `GET /api/health`).
- [ ] Upload test video (mp4, < 500MB) → `Auto Generate` → `Jobs` shows `transcribing → analyzing → rendering → done` via WebSocket.
- [ ] `Settings` → add Groq key `gsk_...` → Test → valid → go generate again → LLM viral clips instead of fallback.
- [ ] Outputs at `/outputs/jobid_clip0_9x16.mp4` — download on phone.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Backend not reachable` / CORS | Check `NEXT_PUBLIC_API_URL` points to `https://...` not `http://localhost` when frontend on Vercel. Backend must allow CORS (we do `allow_origins=["*"]`). |
| Build fails on Vercel | Ensure **Root Directory = `frontend`** (not root). Check `frontend/package.json` `build: next build`. |
| No icon on home screen | Clear cache → we ship real `icon-192/512.png` galaxy icons (was 0 bytes, fixed). |
| `ffmpeg not found` | Backend Docker installs `ffmpeg` — if using native, `apt install ffmpeg`. |
| OOM on worker | Reduce `whisper_model` to `small` in `.env` or RunPod larger RAM. |
| Keys not saving | Check Postgres up (`docker compose ps postgres`). `GET /api/settings` masked — if empty, vault empty, it falls back to `.env`. |
