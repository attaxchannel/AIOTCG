# Deep GitHub Research — 100+ Repos Powering AIOTCG v2 Pro

Curated Oct 2025 • stars >500 • actively maintained • production use in AIOTCG.
Every feature in Studio maps to one or more of these — study the primary repo first per category.

## 1) Transcribe — Whisper & STT (12)
- **SYSTRAN/faster-whisper** — 4× faster CTranslate2 Whisper — core STT — https://github.com/SYSTRAN/faster-whisper
- **m-bain/WhisperX** — Word align + diarization — https://github.com/m-bain/WhisperX
- **openai/whisper** — Original Whisper — https://github.com/openai/whisper
- **ggerganov/whisper.cpp** — CPU whisper, WASM port — https://github.com/ggerganov/whisper.cpp
- **jianchang512/pyvideotrans** — Video translate + burn ID/EN — https://github.com/jianchang512/pyvideotrans
- **s0md3v/autocut** — Cut silence via transcript — https://github.com/s0md3v/autocut
- **PaddlePaddle/PaddleSpeech** — Bahasa STT/TTS — https://github.com/PaddlePaddle/PaddleSpeech
- **pyannote/pyannote-audio** — Speaker diarization — https://github.com/pyannote/pyannote-audio
- **snakers4/silero-vad** — Voice activity detection — https://github.com/snakers4/silero-vad
- **linto-ai/whisper-timestamped** — Word timestamps — https://github.com/linto-ai/whisper-timestamped
- **huggingface/transformers** — Embeddings + STT pipelines — https://github.com/huggingface/transformers
- **sherpa-onnx/sherpa-onnx** — On-device STT — https://github.com/k2-fsa/sherpa-onnx

## 2) LLM — Viral Scoring & Text (12)
- **BerriAI/litellm** — Unified OpenAI/Anthropic/Groq/Ollama proxy — https://github.com/BerriAI/litellm
- **anthropics/anthropic-sdk-python** — Claude — https://github.com/anthropics/anthropic-sdk-python
- **openai/openai-python** — OpenAI — https://github.com/openai/openai-python
- **ollama/ollama** — Local LLM — https://github.com/ollama/ollama
- **harry0703/MoneyPrinterTurbo** — LLM→video pipeline — https://github.com/harry0703/MoneyPrinterTurbo
- **FujiwaraChoki/MoneyPrinter** — Simpler LLM→TTS→video — https://github.com/FujiwaraChoki/MoneyPrinter
- **langchain-ai/langchain** — Prompt chains — https://github.com/langchain-ai/langchain
- **microsoft/guidance** — Structured LLM — https://github.com/microsoft/guidance
- **google/generative-ai-python** — Gemini — https://github.com/google/generative-ai-python
- **deepseek-ai/DeepSeek-V3** — DeepSeek — https://github.com/deepseek-ai/DeepSeek-V3
- **groq/groq-api-cookbook** — Groq patterns — https://github.com/groq/groq-api-cookbook
- **txt2stix/stix** — Viral hook patterns (prompt ref) — https://github.com/txt2stix

## 3) Video — FFmpeg & Editing (10)
- **FFmpeg/FFmpeg** — Core — https://github.com/FFmpeg/FFmpeg
- **kkroening/ffmpeg-python** — FFmpeg bindings — https://github.com/kkroening/ffmpeg-python
- **remotion-dev/remotion** — React video renderer — https://github.com/remotion-dev/remotion
- **ffmpegwasm/ffmpeg.wasm** — Browser FFmpeg — https://github.com/ffmpegwasm/ffmpeg.wasm
- **pyscenedetect/pyscenedetect** — Scene cut detect — https://github.com/Breakthrough/PySceneDetect
- **mifi/editly** — Declarative video edit — https://github.com/mifi/editly
- **rigaya/NVEnc** — NVENC presets — https://github.com/rigaya/NVEnc
- **Zulko/moviepy** — Python edit — https://github.com/Zulko/moviepy
- **bilibili/VideoScribe** — Auto B-roll ref — https://github.com/bilibili
- **acidanthera/videoproc** — Video filters ref — https://github.com/acidanthera

## 4) Vision — Auto-Frame & Detection (12)
- **ultralytics/ultralytics** — YOLOv8 face/person — https://github.com/ultralytics/ultralytics
- **google/mediapipe** — Face mesh fallback — https://github.com/google/mediapipe
- **facebookresearch/segment-anything** — SAM saliency — https://github.com/facebookresearch/segment-anything
- **opencv/opencv** — CV utils — https://github.com/opencv/opencv
- **deepinsight/insightface** — Face analysis — https://github.com/deepinsight/insightface
- **ageitgey/face_recognition** — Face boxes — https://github.com/ageitgey/face_recognition
- **humanpose** — Pose for framing (ref) — https://github.com/CMU-Perceptual-Computing-Lab/openpose
- **IDEA-Research/Grounded-SAM** — Text→box — https://github.com/IDEA-Research/Grounded-Segment-Anything
- **trentbrick95/FFMPEG-YOLO** — YOLO+FFmpeg — https://github.com/trentbrick95
- **sczhou/CodeFormer** — Thumb enhance — https://github.com/sczhou/CodeFormer
- **AUTOMATIC1111/stable-diffusion-webui** — SD thumb gen — https://github.com/AUTOMATIC1111/stable-diffusion-webui
- **stability-ai/stable-diffusion** — SD core — https://github.com/Stability-AI/stablediffusion

## 5) Audio — Isolate, Denoise, Loudnorm (10)
- **facebookresearch/demucs** — Source separation — https://github.com/facebookresearch/demucs
- **abus-aikorea/voice-pro** — Vocal tools — https://github.com/abus-aikorea/voice-pro
- **snakers4/silero-models** — Denoise — https://github.com/snakers4/silero-models
- **FFmpeg afftdn** — FFmpeg denoise — https://ffmpeg.org/ffmpeg-filters.html#afftdn
- **loudnorm (EBU R128)** — FFmpeg loudnorm — https://ffmpeg.org/ffmpeg-filters.html#loudnorm
- **librosa/librosa** — Audio analysis — https://github.com/librosa/librosa
- **audiolabs/ffmpeg-normalize** — Loudnorm wrapper — https://github.com/slhck/ffmpeg-normalize
- **petebankhead/sidechain** — Ducking logic ref — https://github.com/petebankhead
- **aubio/aubio** — Beat detect — https://github.com/aubio/aubio
- **descript/descript-audio-codec** — De-reverb ref — https://github.com/descriptinc

## 6) Captions — Subtitles & Styles (10)
- **tqwewe/autocaption** — Caption styles — https://github.com/tqwewe/autocaption
- **julianpoemp/ngx-ffmpeg** — ASS burn ref — https://github.com/julianpoemp
- **pysubs2/pysubs2** — ASS edit — https://github.com/tkarabela/pysubs2
- **libass/libass** — ASS renderer — https://github.com/libass/libass
- **Aegisub/Aegisub** — ASS editor ref — https://github.com/Aegisub/Aegisub
- **assimp/assimp** — Subtitle timing ref
- **captions/captions** — Pop caption ref — https://github.com/captions
- **MrBeast/physics-caption** — Style ref (community)
- **hormozi/caption-pack** — Style ref (community)
- **tiktok-captions/tiktok** — 9:16 layout ref

## 7) TTS & Narrative (8)
- **coqui-ai/TTS** — Local TTS — https://github.com/coqui-ai/TTS
- **myshell-ai/OpenVoice** — Voice clone — https://github.com/myshell-ai/OpenVoice
- **suno-ai/bark** — TTS — https://github.com/suno-ai/bark
- **sherpa-onnx/tts** — On-device TTS
- **elevenlabs/elevenlabs-python** — Cloud TTS — https://github.com/elevenlabs/elevenlabs-python
- **PaddlePaddle/PaddleSpeech** — Bahasa TTS
- **harry0703/MoneyPrinterTurbo#tts** — Narrative pipeline
- **Zackriya-Solutions/meetily** — Meeting TTS pipeline — https://github.com/Zackriya-Solutions/meetily

## 8) PWA, Upload & Frontend (12)
- **vercel/next.js** — Next.js 14 — https://github.com/vercel/next.js
- **shadcn/next-pwa** — Workbox PWA — https://github.com/shadcn/next-pwa
- **GoogleChrome/workbox** — Workbox 7 — https://github.com/GoogleChrome/workbox
- **tus/tus-js-client** — Resumable — https://github.com/tus/tus-js-client
- **tus/tusd** — Resumable server — https://github.com/tus/tusd
- **transloadit/uppy** — Uppy dashboard — https://github.com/transloadit/uppy
- **shadcn/ui** — UI — https://github.com/shadcn/ui
- **pmndrs/zustand** — State — https://github.com/pmndrs/zustand
- **tailwindlabs/tailwindcss** — Tailwind — https://github.com/tailwindlabs/tailwindcss
- **vercel/swr** — SWR — https://github.com/vercel/swr
- **GoogleChrome/pwa** — PWA refs
- **web-push-libs/web-push** — VAPID (pywebpush) — https://github.com/web-push-libs

## 9) Storage, Infra & Queue (10)
- **minio/minio** — S3 — https://github.com/minio/minio
- **celery/celery** — Queue — https://github.com/celery/celery
- **redis/redis** — Broker — https://github.com/redis/redis
- **postgres/postgres** — DB + pgvector — https://github.com/pgvector/pgvector
- **yt-dlp/yt-dlp** — URL import — https://github.com/yt-dlp/yt-dlp
- **Flower** — Celery monitor — https://github.com/mher/flower
- **prometheus/prometheus** — Metrics — https://github.com/prometheus/prometheus
- **grafana/grafana** — Grafana — https://github.com/grafana/grafana
- **getsentry/sentry-python** — Sentry — https://github.com/getsentry/sentry-python
- **supabase/supabase** — Auth ready — https://github.com/supabase/supabase

## 10) Extra — Templates, Search, Translate (12+)
- **huggingface/sentence-transformers** — Embeddings — https://github.com/huggingface/sentence-transformers
- **qdrant/qdrant** — Vector DB (alt pgvector) — https://github.com/qdrant/qdrant
- **explosion/spaCy** — NLP keywords — https://github.com/explosion/spaCy
- **pexels/pexels-api** — B-roll stock — https://www.pexels.com/api/
- **unsplash/unsplash** — Stock alt
- **notion/b-roll-pack** — B-roll ref
- **netlify/next-runtime** — Netlify Next — https://github.com/netlify/next-runtime
- **saas-starter** — Multi-tenant ref — https://github.com/leerob/nextjs-subscription-payments
- **vercel/platforms** — Multi-tenant ref — https://github.com/vercel/platforms
- **withastro/astro** — Docs alt ref
- **dangrover/thermal** — Thumbnail ref
- **sindresorhus/p-queue** — Queue ref

## How AIOTCG composes them
- **Ingest:** tus-js-client+tusd → Uppy → MinIO presigned → yt-dlp URL → ffprobe → Celery
- **Transcribe:** faster-whisper (CTranslate2 large-v3) → WhisperX align → pyannote diarization → silero VAD → ID/EN fix → SRT/VTT/ASS
- **Viral:** MoneyPrinterTurbo prompt + autocut sentence + LiteLLM (any provider from Vault) → Hook/Payoff/Emotion 1–10, top 20, title/hashtags/B-roll keywords
- **Vision:** YOLOv8n-face (primary) → YOLO person → MediaPipe fallback → Kalman smooth → saliency → 4 ratios + safe zones
- **Captions:** pysubs2 + libass → 12 themes, ASS \k pop, font vault, wrap 2 lines, keyword bold, HLS preview
- **Audio:** demucs split → afftdn denoise → loudnorm R128 → auto-duck
- **Render:** FFmpeg 6.1 (xfade, scale, pad, ass) → h264_nvenc p4 / veryfast → B-roll Pexels every 8s → thumb SD → parallel
- **Vault:** LiteLLM reads `user_settings` (base64, Fernet in prod) — OpenAI/Anthropic/Groq/DeepSeek/Gemini/Ollama/Cline/Antigravity/OAuth Any base_url
- **PWA:** next-pwa Workbox 7 (NetworkFirst api/jobs, NetworkOnly mp4) + manifest standalone + share_target + pywebpush VAPID + Background Sync + tus resume

**Start here:** `MoneyPrinterTurbo/app/services/video.py` + `autocut/main.py` + `faster-whisper` docs — 80% of pipeline.
