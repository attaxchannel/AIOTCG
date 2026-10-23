"""Vault-aware LiteLLM: reads API keys from UserSettings (in-web) first, then .env fallback."""
from app.core.db import SessionLocal
from app.models.settings import UserSettings
from app.core.config import get_settings
import base64

def dec(s):
    if not s: return None
    try: return base64.b64decode(s.encode()).decode()
    except: return s

def get_active_llm():
    try:
        db = SessionLocal()
        s = db.query(UserSettings).filter(UserSettings.user_id=="default").first()
        db.close()
        if s and s.active_llm_provider:
            # map provider to key/base/model
            provider = s.active_llm_provider
            key = None
            base = None
            if provider == "openai": key, base = dec(s.openai_api_key), s.openai_base_url
            elif provider == "anthropic": key, base = dec(s.anthropic_api_key), s.anthropic_base_url
            elif provider == "groq": key, base = dec(s.groq_api_key), s.groq_base_url
            elif provider == "deepseek": key, base = dec(s.deepseek_api_key), "https://api.deepseek.com"
            elif provider == "gemini": key, base = dec(s.gemini_api_key), "https://generativelanguage.googleapis.com"
            elif provider == "ollama": key, base = None, s.ollama_base_url
            elif provider in ["cline","antigravity"]:
                # OAuth tokens stored in oauth_tokens
                key = dec(s.cline_token) if provider=="cline" else dec(s.antigravity_token)
                base = (s.oauth_tokens or {}).get(provider, {}).get("base_url") if s.oauth_tokens else None
            model = s.active_llm_model or "gpt-4o-mini"
            if key or provider=="ollama":
                return {"provider": provider, "api_key": key, "base_url": base, "model": model}
    except Exception as e:
        print(f"[vault] fallback to env: {e}")
    # fallback to .env
    env = get_settings()
    return {"provider": "openai", "api_key": env.openai_api_key, "base_url": env.openai_base_url, "model": env.llm_model}
