from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    redis_url: str = "redis://redis:6379/0"
    database_url: str = "postgresql://aitcg:aitcg@postgres:5432/aitcg"
    s3_endpoint: str = "http://minio:9000"
    s3_access_key: str = "aitcg"
    s3_secret_key: str = "aitcg12345"
    s3_bucket: str = "aitcg-videos"
    s3_region: str = "us-east-1"
    jwt_secret: str = "change-me"
    openai_api_key: str = ""
    openai_base_url: str = "https://api.groq.com/openai/v1"
    llm_model: str = "llama3-70b-8192"
    whisper_model: str = "large-v3"
    whisper_device: str = "auto"
    whisper_compute_type: str = "float16"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache
def get_settings():
    return Settings()
