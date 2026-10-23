from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.core.db import Base, engine
from app.api.upload import router as upload_router
from app.api.jobs import router as jobs_router
from app.api.ws import router as ws_router
from app.api.settings import router as settings_router

# Create tables — non-fatal on Railway before Postgres plugin attaches
try:
    Base.metadata.create_all(bind=engine)
    print("[db] tables ready")
except Exception as e:
    print(f"[db] init failed (will retry on request): {e}")

app = FastAPI(title="AIOTCG API", version="1.0.0", description="All-In Tools Content Generator - Self-hosted PWA backend. Frontend: https://aiotcg-alpha.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["jobs"])
app.include_router(ws_router, tags=["ws"])
app.include_router(settings_router, prefix="/api/settings", tags=["settings"])

os.makedirs("outputs", exist_ok=True)
os.makedirs("uploads", exist_ok=True)
if os.path.isdir("outputs"):
    app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

@app.get("/")
def root():
    return {"service":"AIOTCG","status":"online","docs":"/docs","version":"1.0.0","pwa":"Install via Add to Home Screen — aiotcg-alpha.vercel.app"}

@app.get("/health")
def health():
    return {"status":"ok"}

@app.get("/api/health")
def api_health():
    return {"status":"ok","gpu":"auto","whisper":"large-v3"}
