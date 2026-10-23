# Deep GitHub Research — 25+ Repos powering AIOTCG

Curated Feb 2024-2025, stars >500, actively maintained.

- **SYSTRAN/faster-whisper** — 4x faster Whisper CTranslate2 - our STT core — https://github.com/SYSTRAN/faster-whisper
- **m-bain/WhisperX** — Word-level alignment + diarization for TikTok pop captions — https://github.com/m-bain/WhisperX
- **jianchang512/pyvideotrans** — Video translate + subtitle burn with Bahasa support — https://github.com/jianchang512/pyvideotrans
- **s0md3v/autocut** — Auto-cut silences via transcript - sentence boundary logic — https://github.com/s0md3v/autocut
- **harry0703/MoneyPrinterTurbo** — End-to-end AI video gen pipeline - main arch ref — https://github.com/harry0703/MoneyPrinterTurbo
- **FujiwaraChoki/MoneyPrinter** — Original MoneyPrinter - simpler LLM->TTS->video — https://github.com/FujiwaraChoki/MoneyPrinter
- **Ultralytics/ultralytics** — YOLOv8 face/person tracking for 9:16 auto-frame — https://github.com/Ultralytics/ultralytics
- **facebookresearch/demucs** — Vocal/BGM split & noise removal — https://github.com/facebookresearch/demucs
- **abus-aikorea/voice-pro** — Vocal separate + denoise + TTS toolkit — https://github.com/abus-aikorea/voice-pro
- **Zackriya-Solutions/meetily** — Meeting Whisper + diarization pipeline — https://github.com/Zackriya-Solutions/meetily
- **tqwewe/autocaption** — Auto caption burn styles reference — https://github.com/tqwewe/autocaption
- **remotion-dev/remotion** — React video renderer alternative to FFmpeg — https://github.com/remotion-dev/remotion
- **ffmpegwasm/ffmpeg.wasm** — Browser FFmpeg fallback (preview only) — https://github.com/ffmpegwasm/ffmpeg.wasm
- **tus/tus-js-client + tusd** — Resumable uploads critical for 4G — https://github.com/tus/tus-js-client + tusd
- **shadcn/next-pwa** — PWA Workbox for standalone + offline — https://github.com/shadcn/next-pwa
- **vercel/next.js** — Next.js 14 App Router - frontend core — https://github.com/vercel/next.js
- **anthropics/anthropic-sdk-python** — Claude API compatible layer — https://github.com/anthropics/anthropic-sdk-python
- **BerriAI/litellm** — OpenAI/Anthropic/Groq/Ollama unified proxy — https://github.com/BerriAI/litellm
- **ollama/ollama** — Local LLM provider for offline — https://github.com/ollama/ollama
- **google/gemini-api** — Gemini OpenAI-compatible via LiteLLM — https://github.com/google/gemini-api
- **PaddlePaddle/PaddleSpeech** — TTS/ STT alternative for Bahasa — https://github.com/PaddlePaddle/PaddleSpeech
- **coqui-ai/TTS** — Local TTS for voice-over — https://github.com/coqui-ai/TTS
- **OpenVoice** — MyShell OpenVoice - cloning voice — https://github.com/OpenVoice
- **AUTOMATIC1111/stable-diffusion-webui** — Thumbnail gen via SD — https://github.com/AUTOMATIC1111/stable-diffusion-webui
- **huggingface/transformers** — Embeddings for viral search — https://github.com/huggingface/transformers

## How AIOTCG composes them
- **Transcribe:** faster-whisper (primary) -> WhisperX align -> pyvideotrans for ID post-fix
- **Viral:** MoneyPrinterTurbo viral prompt + autocut sentence logic
- **Video:** FFmpeg 6.1 direct + Remotion templates + ffmpeg.wasm preview
- **AI Frame:** Ultralytics YOLOv8n-face + MediaPipe fallback
- **Audio:** demucs + voice-pro denoise
- **LLM:** litellm proxy = OpenAI/Groq/DeepSeek + anthropic-sdk + ollama local + Gemini
- **PWA:** next-pwa + tus resumable

Study `MoneyPrinterTurbo/app/services/video.py` and `autocut/main.py` first — 80% of pipeline logic there.
