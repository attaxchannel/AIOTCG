from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import os, shutil, uuid
from app.core.db import get_db
from app.models.job import Job
from app.workers.tasks import process_auto

router = APIRouter()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@router.post("/upload")
async def upload_video(file: UploadFile = File(...), mode: str = "auto", ratios: str = "9:16", db: Session = Depends(get_db)):
    if not file.filename:
        raise HTTPException(400, "No filename")
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["mp4","mov","avi","mkv","webm","m4v"]:
        raise HTTPException(400, f"Unsupported extension .{ext}")

    job_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{job_id}.{ext}")
    with open(save_path, "wb") as out:
        shutil.copyfileobj(file.file, out)

    ratios_list = [r.strip() for r in ratios.split(",") if r.strip()]
    job = Job(id=job_id, status="queued", input_path=save_path, mode=mode, ratios=ratios_list, progress=5)
    db.add(job); db.commit()

    # fire celery async DAG
    process_auto.delay(job_id)

    return {"job_id": job_id, "status": "queued", "mode": mode, "ratios": ratios_list}

@router.post("/upload-url")
async def upload_via_url(url: str, mode: str = "auto", ratios: str = "9:16", db: Session = Depends(get_db)):
    """For Share Target from YouTube/TikTok on phone: server downloads url"""
    import httpx, uuid, os
    job_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{job_id}.mp4")
    async with httpx.AsyncClient(follow_redirects=True) as client:
        r = await client.get(url, timeout=60)
        r.raise_for_status()
        with open(save_path, "wb") as f:
            f.write(r.content)
    ratios_list = [r.strip() for r in ratios.split(",") if r.strip()]
    job = Job(id=job_id, status="queued", input_path=save_path, mode=mode, ratios=ratios_list, progress=5)
    db.add(job); db.commit()
    process_auto.delay(job_id)
    return {"job_id": job_id, "status": "queued"}
