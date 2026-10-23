from sqlalchemy import Column, String, Text, DateTime, JSON
import datetime, uuid
from app.core.db import Base

class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, default="default") # single-tenant self-host; extend to multi-user later
    # LLM providers - stored encrypted (simple base64 for self-host; replace with Fernet in prod)
    openai_api_key = Column(Text, nullable=True)
    openai_base_url = Column(String, default="https://api.openai.com/v1")
    anthropic_api_key = Column(Text, nullable=True)
    anthropic_base_url = Column(String, default="https://api.anthropic.com")
    groq_api_key = Column(Text, nullable=True)
    groq_base_url = Column(String, default="https://api.groq.com/openai/v1")
    deepseek_api_key = Column(Text, nullable=True)
    gemini_api_key = Column(Text, nullable=True)
    ollama_base_url = Column(String, default="http://localhost:11434")
    # Which provider is active
    active_llm_provider = Column(String, default="openai") # openai|anthropic|groq|deepseek|gemini|ollama|cline|antigravity
    active_llm_model = Column(String, default="gpt-4o-mini")
    # OAuth placeholders for Cline / Antigravity / etc (store tokens)
    cline_token = Column(Text, nullable=True)
    antigravity_token = Column(Text, nullable=True)
    oauth_tokens = Column(JSON, nullable=True) # {cline:..., antigravity:..., custom: ...}
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
