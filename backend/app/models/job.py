from sqlalchemy import Column, String, DateTime, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid, datetime
from app.core.db import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(String, default="queued") # queued, transcribing, analyzing, rendering, done, failed
    progress = Column(Float, default=0)
    input_path = Column(String)
    input_s3_key = Column(String)
    transcript = Column(JSON, nullable=True)
    clips = Column(JSON, nullable=True) # LLM result
    outputs = Column(JSON, nullable=True) # [{ratio, path, s3_key}]
    error = Column(Text, nullable=True)
    mode = Column(String, default="auto") # auto | manual
    ratios = Column(JSON, default=lambda: ["9:16"])
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
