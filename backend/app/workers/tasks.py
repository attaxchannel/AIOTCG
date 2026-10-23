import os, traceback
from celery import current_task
from app.celery_app import celery
from app.core.db import SessionLocal
from app.models.job import Job
from app.services.transcribe import transcribe_file
from app.services.viral import find_viral_clips
from app.services.caption import segments_to_ass
from app.services.video import render_clip
from app.services.autoframe import compute_offsets, offset_for_time

def update_job(job_id, **kwargs):
    db = SessionLocal()
    job = db.query(Job).filter(Job.id==job_id).first()
    if job:
        for k,v in kwargs.items():
            setattr(job, k, v)
        db.commit()
    db.close()

@celery.task(bind=True, name="app.workers.tasks.process_auto")
def process_auto(self, job_id: str):
    db = SessionLocal()
    job = db.query(Job).filter(Job.id==job_id).first()
    db.close()
    if not job:
        return {"error":"job not found"}
    try:
        input_path = job.input_path
        ratios = job.ratios or ["9:16"]

        # Step 1: Transcribe (faster-whisper)
        update_job(job_id, status="transcribing", progress=15)
        self.update_state(state="PROGRESS", meta={"step":"transcribing","pct":15})
        transcript = transcribe_file(input_path, language=None)
        segments = transcript["segments"]
        update_job(job_id, transcript=transcript, progress=40)

        # Step 2: Viral analysis (LLM)
        update_job(job_id, status="analyzing", progress=45)
        self.update_state(state="PROGRESS", meta={"step":"analyzing","pct":45})
        clips = find_viral_clips(segments, max_clips=3)
        if not clips:
            clips = [{"start": segments[0]["start"], "end": min(segments[0]["start"]+35, segments[-1]["end"]), "score": 7, "title": "Auto Clip", "hook_text": segments[0]["text"][:60], "hashtags":[]}]
        update_job(job_id, clips=clips, status="rendering", progress=55)

        # Step 3: Autoframe offsets (YOLO)
        self.update_state(state="PROGRESS", meta={"step":"autoframe","pct":60})
        try:
            offsets = compute_offsets(input_path, fps_sample=1)
        except Exception as e:
            print(f"[autoframe] failed {e}")
            offsets = {}

        # Step 4: Generate ASS per clip segment slice
        outputs = []
        total_clips = len(clips) * len(ratios)
        done = 0
        for idx, clip in enumerate(clips):
            clip_start = float(clip["start"])
            clip_end = float(clip["end"])
            # slice transcript to clip window
            clip_segments = [s for s in segments if s["end"] >= clip_start and s["start"] <= clip_end]
            # generate ass
            ass_path = f"outputs/{job_id}_clip{idx}.ass"
            os.makedirs("outputs", exist_ok=True)
            try:
                segments_to_ass(clip_segments, ass_path)
            except Exception as e:
                print(f"[caption] failed {e}, no ass")
                ass_path = None

            # for each ratio render
            for ratio in ratios:
                done += 1
                pct = 55 + int(40 * done / max(1,total_clips))
                update_job(job_id, progress=pct)
                self.update_state(state="PROGRESS", meta={"step":f"rendering {idx+1}/{len(clips)} {ratio}","pct":pct})
                offset = offset_for_time(offsets, clip_start, 0)
                out_path = f"outputs/{job_id}_clip{idx}_{ratio.replace(':','x')}.mp4"
                try:
                    render_clip(input_path, out_path, clip_start, clip_end, ratio=ratio, ass_path=ass_path, use_nvenc=False, y_center_offset=offset)
                    outputs.append({"clip_index": idx, "ratio": ratio, "path": out_path, "start": clip_start, "end": clip_end, "title": clip.get("title",""), "score": clip.get("score")})
                except Exception as e:
                    print(f"[render] clip {idx} {ratio} failed {e}")
                    traceback.print_exc()

        update_job(job_id, status="done", progress=100, outputs=outputs)
        self.update_state(state="SUCCESS", meta={"pct":100})
        return {"status":"done","outputs":outputs}

    except Exception as e:
        traceback.print_exc()
        update_job(job_id, status="failed", error=str(e)[:2000])
        self.update_state(state="FAILURE", meta={"error":str(e)})
        raise

@celery.task(bind=True, name="app.workers.tasks.rerender_manual")
def rerender_manual(self, job_id: str):
    """Same as process_auto but uses pre-set clips (manual timeline)"""
    db = SessionLocal()
    job = db.query(Job).filter(Job.id==job_id).first()
    db.close()
    if not job or not job.clips:
        update_job(job_id, status="failed", error="No clips provided")
        return
    try:
        input_path = job.input_path
        clips = job.clips
        ratios = job.ratios or ["9:16"]
        # need transcript for captions if available
        transcript = job.transcript or {"segments":[]}
        segments = transcript.get("segments", [])

        outputs = []
        for idx, clip in enumerate(clips):
            clip_start = float(clip["start"])
            clip_end = float(clip["end"])
            clip_segments = [s for s in segments if s["end"] >= clip_start and s["start"] <= clip_end] if segments else []
            ass_path = f"outputs/{job_id}_clip{idx}.ass"
            os.makedirs("outputs", exist_ok=True)
            if clip_segments:
                try: segments_to_ass(clip_segments, ass_path)
                except: ass_path=None
            else:
                ass_path=None
            for ratio in ratios:
                out_path = f"outputs/{job_id}_clip{idx}_{ratio.replace(':','x')}.mp4"
                render_clip(input_path, out_path, clip_start, clip_end, ratio=ratio, ass_path=ass_path)
                outputs.append({"clip_index": idx, "ratio": ratio, "path": out_path, "start": clip_start, "end": clip_end})
        update_job(job_id, status="done", progress=100, outputs=outputs)
    except Exception as e:
        traceback.print_exc()
        update_job(job_id, status="failed", error=str(e)[:2000])
        raise
