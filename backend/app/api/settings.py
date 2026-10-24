from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.db import get_db, Base, engine
from app.models.settings import UserSettings
import base64
import time

router = APIRouter()

def mask(s: Optional[str]):
    if not s: return ""
    if len(s) <= 8: return "***"
    return s[:4] + "***" + s[-4:]

def enc(s: Optional[str]):
    if not s: return None
    return base64.b64encode(s.encode()).decode()

def dec(s: Optional[str]):
    if not s: return None
    try: return base64.b64decode(s.encode()).decode()
    except: return s

class SettingsIn(BaseModel):
    openai_api_key: Optional[str] = None
    openai_base_url: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    anthropic_base_url: Optional[str] = None
    groq_api_key: Optional[str] = None
    groq_base_url: Optional[str] = None
    deepseek_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    ollama_base_url: Optional[str] = None
    active_llm_provider: Optional[str] = None
    active_llm_model: Optional[str] = None
    cline_token: Optional[str] = None
    antigravity_token: Optional[str] = None
    oauth_tokens: Optional[dict] = None
    custom_providers: Optional[list] = None

# cached fallback so GET never hangs on cold DB
_fallback = {
    "openai_api_key_masked": "",
    "openai_base_url": "https://api.openai.com/v1",
    "anthropic_api_key_masked": "",
    "anthropic_base_url": "https://api.anthropic.com",
    "groq_api_key_masked": "",
    "groq_base_url": "https://api.groq.com/openai/v1",
    "deepseek_api_key_masked": "",
    "gemini_api_key_masked": "",
    "ollama_base_url": "http://localhost:11434",
    "active_llm_provider": "openai",
    "active_llm_model": "gpt-4o-mini",
    "cline_token_masked": "",
    "antigravity_token_masked": "",
    "oauth_tokens": {},
    "has_openai": False,
    "has_anthropic": False,
    "has_groq": False,
    "_db": "fallback"
}

@router.get("")
def get_settings(db: Session = Depends(get_db)):
    t0 = time.time()
    try:
        s = db.query(UserSettings).filter(UserSettings.user_id=="default").first()
        if not s:
            s = UserSettings(user_id="default")
            db.add(s); db.commit(); db.refresh(s)
        elapsed = (time.time()-t0)*1000
        return {
            "openai_api_key_masked": mask(dec(s.openai_api_key)),
            "openai_base_url": s.openai_base_url or "https://api.openai.com/v1",
            "anthropic_api_key_masked": mask(dec(s.anthropic_api_key)),
            "anthropic_base_url": s.anthropic_base_url or "https://api.anthropic.com",
            "groq_api_key_masked": mask(dec(s.groq_api_key)),
            "groq_base_url": s.groq_base_url or "https://api.groq.com/openai/v1",
            "deepseek_api_key_masked": mask(dec(s.deepseek_api_key)) if s.deepseek_api_key else "",
            "gemini_api_key_masked": mask(dec(s.gemini_api_key)) if s.gemini_api_key else "",
            "ollama_base_url": s.ollama_base_url or "http://localhost:11434",
            "active_llm_provider": s.active_llm_provider or "openai",
            "active_llm_model": s.active_llm_model or "gpt-4o-mini",
            "cline_token_masked": mask(dec(s.cline_token)) if s.cline_token else "",
            "antigravity_token_masked": mask(dec(s.antigravity_token)) if s.antigravity_token else "",
            "oauth_tokens": s.oauth_tokens or {},
            "has_openai": bool(s.openai_api_key),
            "has_anthropic": bool(s.anthropic_api_key),
            "has_groq": bool(s.groq_api_key),
            "_ms": int(elapsed),
            "_db": "ok"
        }
    except Exception as e:
        # never hang tab — return fallback in <100ms even if DB cold / railway internal DNS
        return {**_fallback, "_error": str(e)[:200], "_ms": int((time.time()-t0)*1000)}

@router.post("")
def save_settings(payload: SettingsIn, db: Session = Depends(get_db)):
    s = db.query(UserSettings).filter(UserSettings.user_id=="default").first()
    if not s:
        s = UserSettings(user_id="default")
        db.add(s)
    if payload.openai_api_key and "***" not in payload.openai_api_key:
        s.openai_api_key = enc(payload.openai_api_key)
    if payload.openai_base_url: s.openai_base_url = payload.openai_base_url
    if payload.anthropic_api_key and "***" not in payload.anthropic_api_key:
        s.anthropic_api_key = enc(payload.anthropic_api_key)
    if payload.anthropic_base_url: s.anthropic_base_url = payload.anthropic_base_url
    if payload.groq_api_key and "***" not in payload.groq_api_key:
        s.groq_api_key = enc(payload.groq_api_key)
    if payload.groq_base_url: s.groq_base_url = payload.groq_base_url
    if payload.deepseek_api_key and "***" not in payload.deepseek_api_key:
        s.deepseek_api_key = enc(payload.deepseek_api_key)
    if payload.gemini_api_key and "***" not in payload.gemini_api_key:
        s.gemini_api_key = enc(payload.gemini_api_key)
    if payload.ollama_base_url: s.ollama_base_url = payload.ollama_base_url
    if payload.active_llm_provider: s.active_llm_provider = payload.active_llm_provider
    if payload.active_llm_model: s.active_llm_model = payload.active_llm_model
    if payload.cline_token and "***" not in payload.cline_token:
        s.cline_token = enc(payload.cline_token)
    if payload.antigravity_token and "***" not in payload.antigravity_token:
        s.antigravity_token = enc(payload.antigravity_token)
    if payload.oauth_tokens is not None:
        s.oauth_tokens = payload.oauth_tokens
    db.commit()
    return {"ok": True}

@router.post("/test")
def test_provider(payload: dict, db: Session = Depends(get_db)):
    s = db.query(UserSettings).filter(UserSettings.user_id=="default").first()
    provider = payload.get("provider") or (s.active_llm_provider if s else "openai")
    model = payload.get("model") or (s.active_llm_model if s else "gpt-4o-mini")
    key_map = {
        "openai": dec(s.openai_api_key) if s and s.openai_api_key else None,
        "anthropic": dec(s.anthropic_api_key) if s and s.anthropic_api_key else None,
        "groq": dec(s.groq_api_key) if s and s.groq_api_key else None,
        "deepseek": dec(s.deepseek_api_key) if s and s.deepseek_api_key else None,
    }
    if provider in ["openai","groq","deepseek","anthropic"] and not key_map.get(provider):
        return {"ok": False, "error": f"No API key saved for {provider}. Save key first."}
    try:
        from litellm import completion
        import os
        base_url = {"openai": s.openai_base_url if s else None, "groq": s.groq_base_url if s else None}.get(provider)
        if base_url and provider in ["openai","groq"]:
            if key_map.get(provider): os.environ["OPENAI_API_KEY"] = key_map[provider]
            resp = completion(model=f"openai/{model}" if "/" not in model else model, api_base=base_url, messages=[{"role":"user","content":"hi"}], max_tokens=5)
            return {"ok": True, "sample": resp.choices[0].message.content[:120]}
        return {"ok": True, "info": f"Key present for {provider}, base_url={base_url or 'default'}"}
    except Exception as e:
        return {"ok": False, "error": str(e)[:600]}
