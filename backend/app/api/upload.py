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
    if file.size and file.size > 2*1024*1024*1024:
        raise HTTPException(400, "File too large (2GB max)")

    job_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{job_id}.{ext}")
    with open(save_path, "wb") as out:
        shutil.copyfileobj(file.file, out)

    ratios_list = [r.strip() for r in ratios.split(",") if r.strip()]
    if not ratios_list:
        ratios_list = ["9:16"]
    job = Job(id=job_id, status="queued", input_path=save_path, mode=mode, ratios=ratios_list, progress=5)
    db.add(job); db.commit()

    # fire celery async DAG
    try:
        process_auto.delay(job_id)
    except Exception as e:
        print(f"[upload] celery delay failed {e} — will process inline on worker")

    return {"job_id": job_id, "status": "queued", "mode": mode, "ratios": ratios_list}

@router.post("/upload-url")
async def upload_via_url(url: str, mode: str = "auto", ratios: str = "9:16", db: Session = Depends(get_db)):
    """Share Target URL ingest: server downloads url (yt-dlp for YouTube, httpx for direct)."""
    import httpx, uuid, os, re
    # if youtube/tiktok etc — use yt-dlp to grab best mp4
    yt_match = re.search(r"(youtube\.com|youtu\.be|tiktok\.com|instagram\.com|facebook\.com)", url, re.I)
    job_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{job_id}.mp4")
    if yt_match:
        try:
            import yt_dlp
            ydl_opts = {"format":"mp4/best","outtmpl": save_path, "quiet": True, "noplaylist": True, "merge_output_format":"mp4"}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            if not os.path.exists(save_path):
                # ydl may add ext
                for ext in [".mp4",".mkv",".webm"]:
                    cand = save_path.replace(".mp4", ext)
                    if os.path.exists(cand):
                        save_path = cand; break
        except Exception as e:
            raise HTTPException(400, f"yt-dlp failed for {url}: {e}")
    else:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            r = await client.get(url, timeout=120)
            r.raise_for_status()
            with open(save_path, "wb") as f:
                f.write(r.content)
    ratios_list = [r.strip() for r in ratios.split(",") if r.strip()]
    if not ratios_list:
        ratios_list = ["9:16"]
    job = Job(id=job_id, status="queued", input_path=save_path, mode=mode, ratios=ratios_list, progress=5)
    db.add(job); db.commit()
    try:
        process_auto.delay(job_id)
    except Exception as e:
        print(f"[upload-url] celery delay failed {e}")
    return {"job_id": job_id, "status": "queued"}
