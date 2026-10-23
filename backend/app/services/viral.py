"""LLM viral hook detection via LiteLLM (OpenAI-compatible)."""
import json
from app.core.config import get_settings

SYSTEM_PROMPT = """You are a Viral Shorts Producer for TikTok/Reels/YouTube Shorts.
Analyze the transcript with timestamps. Score each 5-60s segment on HOOK (first 3s curiosity), PAYOFF, EMOTION, SHAREABILITY 1-10.
Return JSON ONLY as array: [{"start": 12.5, "end": 38.2, "score": 9, "reason": "Strong hook...", "hook_text": "I lost $10k...", "title": "Viral Title", "hashtags": ["#story"]}]
RULES: Clips 25-58s, start/end on sentence boundary, no mid-word cut, 2-5 clips sorted by score desc. If transcript short (<60s) return 1 clip.
Language: keep hook_text and title in ORIGINAL transcript language (Bahasa Indonesia if transcript is Indonesian).
"""

def chunk_transcript(segments, window=30, overlap=5):
    # flatten words to text with timestamps for LLM context
    lines = []
    for s in segments:
        lines.append(f"[{s['start']:.1f}-{s['end']:.1f}] {s['text']}")
    text = "\n".join(lines)
    return text

def find_viral_clips(segments, max_clips=5):
    # Prefer vault (in-web API keys) then .env
    try:
        from app.services.viral_vault import get_active_llm
        v = get_active_llm()
        class VS: pass
        settings = VS()
        settings.openai_api_key = v['api_key']
        settings.openai_base_url = v['base_url']
        settings.llm_model = v['model']
    except Exception:
        settings = get_settings()
    transcript_text = chunk_transcript(segments)
    if not transcript_text.strip():
        return []

    # If no API key, fallback to heuristic: first, middle, last
    if not settings.openai_api_key:
        print("[viral] No OPENAI_API_KEY, using heuristic fallback")
        total = segments[-1]["end"] if segments else 60
        if total < 60:
            return [{"start": segments[0]["start"], "end": segments[-1]["end"], "score": 7, "reason": "fallback: whole video", "hook_text": segments[0]["text"][:60], "title": "Auto Clip", "hashtags": []}]
        step = total / 3
        return [
            {"start": s*step, "end": min((s+1)*step, total), "score": 8-s, "reason": "fallback: heuristic split", "hook_text": segments[0]["text"][:60], "title": f"Clip {s+1}", "hashtags": []}
            for s in range(3)
        ]

    try:
        from litellm import completion
        import os
        os.environ["OPENAI_API_KEY"] = settings.openai_api_key
        # LiteLLM uses base_url via env or param
        resp = completion(
            model=settings.llm_model if "/" in settings.llm_model else f"openai/{settings.llm_model}",
            api_base=settings.openai_base_url,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Transcript:\n{transcript_text}\n\nReturn JSON array only."}
            ],
            temperature=0.2,
            max_tokens=2000,
        )
        content = resp.choices[0].message.content.strip()
        # extract JSON array
        import re
        m = re.search(r"\[.*\]", content, re.DOTALL)
        if m:
            content = m.group(0)
        clips = json.loads(content)
        # validate & clamp
        valid = []
        for c in clips[:max_clips]:
            if "start" in c and "end" in c and c["end"] > c["start"] and 5 <= c["end"]-c["start"] <= 65:
                valid.append(c)
        return sorted(valid, key=lambda x: x.get("score",0), reverse=True)
    except Exception as e:
        print(f"[viral] LLM failed: {e}, fallback heuristic")
        total = segments[-1]["end"] if segments else 60
        return [{"start": segments[0]["start"], "end": segments[-1]["end"], "score": 6, "reason": f"LLM error fallback: {e}", "hook_text": segments[0]["text"][:60], "title": "Auto Clip", "hashtags": []}]
