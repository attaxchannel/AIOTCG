# AIOTCG Backend — Railway / Render / Any Docker host
# Used when build context = repo root (Railway default). Local docker-compose uses backend/Dockerfile (context=backend).
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg git curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Leverage layer cache: deps first
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# Then app code (only backend)
COPY backend/app ./app
COPY backend/__init__.py ./__init__.py

# Data dirs Railway ephemeral (use /tmp volumes or S3 in prod)
RUN mkdir -p uploads outputs

EXPOSE 8000

# Railway injects $PORT (e.g. 8080). Local fallback 8000. Use shell to expand.
CMD ["sh","-c","uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
