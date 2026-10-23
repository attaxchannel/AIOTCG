from celery import Celery
from app.core.config import get_settings

settings = get_settings()

celery = Celery(
    "aitcg",
    broker=settings.redis_url,
    backend=settings.redis_url,
)
celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    task_track_started=True,
    task_acks_late=True,
    worker_max_tasks_per_child=20,
    worker_max_memory_per_child=4000000, # 4GB
    task_routes={"app.workers.tasks.*": {"queue": "default"}},
)

# auto-discover
celery.autodiscover_tasks(["app.workers"])
