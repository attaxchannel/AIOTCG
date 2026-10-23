"""FFmpeg rendering: crop to ratio, scale, burn ASS, audio normalize."""
import subprocess, json, os, shlex

PROFILES = {
    "9:16": {"w":1080, "h":1920, "crop": "ih*9/16:ih"},
    "16:9": {"w":1920, "h":1080, "crop": "iw:iw*9/16"},
    "1:1":  {"w":1080, "h":1080, "crop": "min(iw\\,ih):min(iw\\,ih)"},
    "4:5":  {"w":1080, "h":1350, "crop": "ih*4/5:ih"},
}

def probe(path):
    r = subprocess.run(["ffprobe","-v","error","-print_format","json","-show_streams","-show_format", path], capture_output=True, text=True)
    return json.loads(r.stdout)

def render_clip(input_path: str, output_path: str, start: float, end: float, ratio: str="9:16", ass_path: str=None, use_nvenc=False, y_center_offset=0):
    """
    Crop center (with optional yolo offset), scale, burn ass, trim.
    y_center_offset: pixel offset from center for auto-frame (smoothed)
    """
    prof = PROFILES.get(ratio, PROFILES["9:16"])
    w, h = prof["w"], prof["h"]

    # Build crop filter: crop=w:h:x:y -> x = (in_w - crop_w)/2 + offset
    # For 9:16: crop_w = ih*9/16, crop_h = ih, x = (iw - ow)/2 + offset, y=0
    # We use ff eq
    crop_expr = prof["crop"] # e.g. ih*9/16:ih
    # crop filter syntax: crop=w:h:x:y
    # For generic: we compute w and h as expressions
    crop_w, crop_h = crop_expr.split(":")
    # x offset: center + yolo offset (clamped later)
    x_expr = f"(in_w-({crop_w}))/2+{int(y_center_offset)}" if ratio=="9:16" else f"(in_w-({crop_w}))/2"

    vf_parts = []
    vf_parts.append(f"crop={crop_w}:{crop_h}:{x_expr}:0")
    vf_parts.append(f"scale={w}:{h}:flags=bicubic")
    if ass_path and os.path.exists(ass_path):
        # escape path for ffmpeg
        safe = ass_path.replace(":", "\\:").replace("'", "")
        vf_parts.append(f"ass={safe}")

    vf = ",".join(vf_parts)

    # audio normalize + trim
    duration = end - start
    af = "loudnorm=I=-14:TP=-1:LRA=11, afftdn=nf=-20"

    # encoder
    vcodec = "h264_nvenc" if use_nvenc else "libx264"
    preset = "p4" if use_nvenc else "veryfast"

    cmd = [
        "ffmpeg","-y",
        "-ss", str(start),
        "-to", str(end),
        "-i", input_path,
        "-vf", vf,
        "-af", af,
        "-c:v", vcodec, "-preset", preset, "-b:v", "6M", "-maxrate", "8M",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        output_path
    ]
    print("[ffmpeg]", " ".join(shlex.quote(c) for c in cmd))
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr[-2000:])
        raise RuntimeError(f"FFmpeg failed: {result.stderr[-1000:]}")
    return output_path

def generate_thumbnail(input_path, time, out_path):
    cmd = ["ffmpeg","-y","-ss", str(time), "-i", input_path, "-vframes","1","-q:v","2", out_path]
    subprocess.run(cmd, capture_output=True)
    return out_path
