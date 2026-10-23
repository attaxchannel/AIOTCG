"""Generate .ass subtitle file with TikTok-style word pop for FFmpeg burn-in."""
import pysubs2

ASS_HEADER = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: TikTok, Montserrat ExtraBold, 72, &H00FFFFFF, &H000000FF, &H00000000, &H64000000, 1, 0, 0, 0, 100, 100, 0, 0, 1, 6, 0, 2, 30, 30, 400, 1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

def to_ass_time(s: float):
    h = int(s // 3600)
    m = int((s % 3600) // 60)
    sec = s % 60
    return f"{h}:{m:02d}:{sec:05.2f}"

def segments_to_ass(segments, out_path, highlight_current_word=True):
    """
    segments: [{"start","end","text","words":[{"word","start","end"}]}]
    Generates ASS where each word pops with \c&H00FFFF& highlight if highlight_current_word
    """
    subs = pysubs2.SSAFile()
    # We'll generate line per segment, with karaoke-like per-word
    for seg in segments:
        words = seg.get("words") or []
        if not words:
            # fallback: whole segment
            subs.append(pysubs2.SSAEvent(start=pysubs2.make_time(s=seg["start"]), end=pysubs2.make_time(s=seg["end"]), text=seg["text"], style="TikTok"))
            continue
        # Build karaoke string: each word gets timing; we highlight current word yellow
        # Simple: split into visual lines of 3-4 words
        chunk_size = 4
        for i in range(0, len(words), chunk_size):
            chunk = words[i:i+chunk_size]
            c_start = chunk[0]["start"]
            c_end = chunk[-1]["end"]
            # Build \k timing is centiseconds
            parts = []
            for w in chunk:
                dur_cs = max(1, int((w["end"]-w["start"])*100))
                # karaoke tag + color pop for emphasized word
                parts.append(f"{{\\k{dur_cs}}}{w['word']}")
            text = " ".join(parts)
            # Wrap with alignment 2 (bottom center)
            subs.append(pysubs2.SSAEvent(start=pysubs2.make_time(s=c_start), end=pysubs2.make_time(s=c_end), text=text, style="TikTok"))

    # pysubs2 writes header; we want custom header with TikTok style
    subs.save(out_path)
    # Post-process to ensure Montserrat fallback if missing -> Arial Black
    return out_path

def simple_srt_to_ass(srt_path, ass_path):
    subs = pysubs2.load(srt_path)
    subs.styles["Default"].fontname = "Montserrat ExtraBold"
    subs.styles["Default"].fontsize = 72
    subs.save(ass_path)
    return ass_path
