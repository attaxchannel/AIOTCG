# Use AIOTCG Entirely From Phone

## Install PWA
1. Open your Vercel URL on Chrome Android
2. Menu (⋮) → Add to Home Screen / Install app
3. Open from home icon — standalone, no browser bar

## Upload
- Tap the dashed box → Gallery / Camera / Files
- Pick ratios 9:16 (default) — tap more for 1:1, 4:5
- Tap Auto Generate → see progress bar
- You can close app; reopen Projects to see done clips

## Share from YouTube
- In YouTube app → Share → AIOTCG → it posts URL to /upload

## Manual Edit
- Go to Editor → paste job_id → transcript appears → tap word to set start → adjust start/end 0.1s → Rerender

## Deploy from Phone (no PC)
- Frontend: vercel.com → Import GitHub repo → Deploy
- Backend: railway.app or runpod.io → New Project → From GitHub → add Redis/Postgres plugins → set env OPENAI_API_KEY
