# AIOTCG Architecture — Deep Dive

## Phone-First Principle
Phone = remote control, Server = studio. WebSocket progress, push notification when done.

## Pipeline (Celery DAG)
1. Upload -> MinIO (tus resumable)
2. Transcribe: faster-whisper large-v3, vad_filter, word_timestamps, initial_prompt for ID slang
3. Viral: LiteLLM prompt scoring HOOK/PAYOFF/EMOTION, returns JSON clips 25-58s
4. Autoframe: YOLOv8n person detection every 0.5s, Kalman smoothing, clamp offset
5. Caption: pysubs2 .ass, TikTok style (Montserrat ExtraBold 72, white + black stroke), per-word \k
6. Render: ffmpeg crop=ih*9/16:ih: (iw-ow)/2+offset :0 , scale=1080:1920, ass=, loudnorm+afftdn, h264_nvenc p4 or libx264 veryfast

## Phase Roadmap
- Phase 1: Backend + FFmpeg hard cut (done: docker-compose + Job model)
- Phase 2: Whisper + LLM + YOLO + ASS (done: services/)
- Phase 3: PWA + timeline (done: next-pwa, Workbox, share_target, Zustand)
- Phase 4: Multi-ratio parallel, Pexels B-roll, tus, push via pywebpush, lifecycle MinIO

## Bottlenecks
- OOM: use -ss seek, worker_max_memory, transcode proxy first
- VRAM: separate Celery queues, int8_float16, concurrency 1 for GPU
- 4G upload: tus.io chunks 5MB, resume
- LLM cost: Groq llama3-70b, cache hash, pydantic validation, heuristic fallback
- Slow render: h264_nvenc, preset p4, threads 0

## Repos to study
- SYSTRAN/faster-whisper, m-bain/WhisperX, jianchang512/pyvideotrans
- s0md3v/autocut, harry0703/MoneyPrinterTurbo, Ultralytics/ultralytics, facebookresearch/demucs
