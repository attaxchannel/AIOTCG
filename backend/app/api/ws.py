from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio, json
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.models.job import Job

router = APIRouter()

@router.websocket("/ws/jobs/{job_id}")
async def job_ws(websocket: WebSocket, job_id: str):
    await websocket.accept()
    try:
        while True:
            db = SessionLocal()
            job = db.query(Job).filter(Job.id==job_id).first()
            db.close()
            if not job:
                await websocket.send_json({"error": "not found"})
                break
            await websocket.send_json({"id": job.id, "status": job.status, "progress": job.progress, "outputs": job.outputs, "clips": job.clips, "error": job.error})
            if job.status in ["done","failed"]:
                break
            await asyncio.sleep(1.2)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try: await websocket.send_json({"error": str(e)})
        except: pass
