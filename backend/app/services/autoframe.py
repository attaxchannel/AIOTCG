"""YOLOv8 face/person tracking -> smoothed crop offset for 9:16."""
import cv2

_detector = None

def get_detector():
    global _detector
    if _detector is None:
        try:
            from ultralytics import YOLO
            _detector = YOLO("yolov8n.pt") # persons
            # Optional: use face model: yolov8n-face.pt (download if needed)
        except Exception as e:
            print(f"[autoframe] YOLO not available: {e}")
            _detector = False
    return _detector if _detector is not False else None

def compute_offsets(video_path, fps_sample=2):
    """
    Sample frames at fps_sample fps, detect person/face center, return {time: x_offset}
    x_offset is pixels to shift crop window so subject stays centered.
    """
    det = get_detector()
    if det is None:
        return {} # fallback center

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {}
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    step = max(1, int(fps // fps_sample))

    offsets = {}
    idx = 0
    raw = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if idx % step == 0:
            t = idx / fps
            # detect
            results = det(frame, verbose=False, conf=0.4, classes=[0]) # 0=person
            best = None
            best_area = 0
            for r in results:
                for box in r.boxes:
                    x1,y1,x2,y2 = box.xyxy[0].tolist()
                    area = (x2-x1)*(y2-y1)
                    if area > best_area:
                        best_area = area
                        best = (x1,y1,x2,y2)
            if best:
                cx = (best[0]+best[2])/2
                # for 9:16, crop_w = h*9/16. On original frame, desired center = cx. Offset = cx - w/2
                offset = int(cx - w/2)
                # clamp so crop doesn't go out of bounds (crop_w approx h*0.5625)
                # approximate clamp: -w/4 .. w/4
                offset = max(-w//4, min(w//4, offset))
                raw.append((t, offset))
                offsets[t] = offset
        idx += 1
        if idx > total:
            break
    cap.release()

    # Smooth with moving average (window 3)
    if len(raw) >= 3:
        smoothed = {}
        for i, (t, off) in enumerate(raw):
            window = raw[max(0,i-1):min(len(raw),i+2)]
            avg = sum(o for _,o in window)//len(window)
            smoothed[t] = avg
        return smoothed
    return offsets

def offset_for_time(offsets: dict, t: float, default=0):
    if not offsets:
        return default
    # nearest time <= t
    best = default
    best_dt = float("inf")
    for ot, off in offsets.items():
        dt = abs(ot - t)
        if dt < best_dt and ot <= t+0.5:
            best_dt = dt
            best = off
    return best
