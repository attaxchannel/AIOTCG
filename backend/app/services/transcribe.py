"""faster-whisper + word timestamps. Auto-detects Bahasa Indonesia vs English."""
import os
from faster_whisper import WhisperModel

_model = None

def get_model():
    global _model
    if _model is None:
        from app.core.config import get_settings
        s = get_settings()
        device = "cuda" if s.whisper_device == "auto" and _has_cuda() else "cpu"
        compute = s.whisper_compute_type if device=="cuda" else "int8"
        print(f"[transcribe] loading {s.whisper_model} on {device}/{compute}")
        _model = WhisperModel(s.whisper_model, device=device, compute_type=compute)
    return _model

def _has_cuda():
    try:
        import torch
        return torch.cuda.is_available()
    except:
        return False

def transcribe_file(path: str, language=None):
    """
    Returns: {"segments": [{"start": float, "end": float, "text": str, "words": [{"word":str,"start":float,"end":float}]}], "language": str}
    """
    model = get_model()
    # initial_prompt helps Indonesian slang
    initial_prompt = "Halo guys, welcome back. Gue lu nggak ya udah gitu aja sih. This is mix Bahasa Indonesia and English."
    segments, info = model.transcribe(
        path,
        language=language, # None = auto
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500),
        word_timestamps=True,
        initial_prompt=initial_prompt,
        beam_size=5,
    )
    out = []
    for seg in segments:
        words = []
        if seg.words:
            for w in seg.words:
                words.append({"word": w.word.strip(), "start": w.start, "end": w.end})
        out.append({"start": seg.start, "end": seg.end, "text": seg.text.strip(), "words": words})
    return {"segments": out, "language": info.language, "duration": info.duration}

# Optional: WhisperX alignment for even tighter word sync (call if needed)
def align_with_whisperx(audio_path, segments, language):
    try:
        import whisperx
        import torch
        device = "cuda" if torch.cuda.is_available() else "cpu"
        align_model, meta = whisperx.load_align_model(language_code=language, device=device)
        result = whisperx.align(segments, align_model, meta, audio_path, device)
        return result["segments"]
    except Exception as e:
        print(f"[whisperx] fallback: {e}")
        return segments
