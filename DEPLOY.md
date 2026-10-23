# Deploy AIOTCG — Phone-only (Vercel + Netlify)

## Vercel (2 taps on Android Chrome)
1. vercel.com → Add New Project → Import **attaxchannel/AIOTCG**
2. **Root Directory = `frontend`** (critical)
3. Framework Next.js (auto) + `vercel.json` + `netlify.toml` in repo
4. Env `NEXT_PUBLIC_API_URL` = your backend (Railway/RunPod/Codespaces or http://YOUR_PC_IP:8000)
5. Deploy → `aiotcg.vercel.app` → Chrome ⋮ → **Add to Home Screen** → standalone PWA

## Netlify
1. netlify.com → Import GitHub → `attaxchannel/AIOTCG` → **Base = `frontend`** → Build `npm run build` → Publish `.next` (auto via `netlify.toml`)
2. Env same as above → Deploy → Add to Home Screen same.

## Backend (GPU) — deploy from phone browser
- Railway: New Project → Deploy from GitHub → `AIOTCG` → Plugins Redis + Postgres → Env `OPENAI_API_KEY` or skip (use in-app /settings) → Deploy backend Dockerfile.
- Or Render / RunPod / HuggingFace Spaces / **Codespaces** (Code → Codespaces → New → `docker compose up` → port 8000).

> After backend up, update Vercel env `NEXT_PUBLIC_API_URL` and redeploy frontend once. Keys can then be added in-app at `/settings` without rebuild.
