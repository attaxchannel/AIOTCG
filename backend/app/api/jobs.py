from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.job import Job
import os

router = APIRouter()

@router.get("/{job_id}")
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, "Job not found")
    return {
        "id": job.id,
        "status": job.status,
        "progress": job.progress,
        "mode": job.mode,
        "ratios": job.ratios,
        "clips": job.clips,
        "outputs": job.outputs,
        "error": job.error,
        "transcript": job.transcript,
        "created_at": job.created_at.isoformat() if job.created_at else None,
    }

@router.get("")
def list_jobs(limit: int = 20, db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).limit(limit).all()
    return [{"id": j.id, "status": j.status, "progress": j.progress, "mode": j.mode, "created_at": j.created_at.isoformat() if j.created_at else None, "clips": j.clips, "outputs": j.outputs} for j in jobs]

@router.delete("/{job_id}")
def delete_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, "Not found")
    # remove files
    for p in [job.input_path] + ( [o.get("path") for o in (job.outputs or []) if o.get("path")] if job.outputs else []):
        try: os.remove(p)
        except: pass
    db.delete(job); db.commit()
    return {"deleted": job_id}

@router.post("/{job_id}/rerender")
def rerender(job_id: str, payload: dict, db: Session = Depends(get_db)):
    """Manual rerender: payload = {clips: [{start,end}], ratios: ["9:16"]} """
    from app.workers.tasks import rerender_manual
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, "Not found")
    # create child job for rerender
    import uuid
    child_id = str(uuid.uuid4())
    child = Job(id=child_id, status="queued", input_path=job.input_path, mode="manual", ratios=payload.get("ratios", ["9:16"]), progress=5)
    # store requested clips as `clips`
    child.clips = payload.get("clips", [])
    child.transcript = job.transcript
    db.add(child); db.commit()
    rerender_manual.delay(child_id)
    return {"job_id": child_id, "status": "queued"}
