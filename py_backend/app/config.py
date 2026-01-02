from functools import lru_cache
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
    """Centralized application configuration."""

    app_name: str = "MediAssist AI Backend"
    environment: Literal["development", "production"] = os.getenv("ENV", "development")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", 8000))

    llm_provider: Literal["ollama", "openai"] = os.getenv("LLM_PROVIDER", "ollama")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "qwen:0.5b")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")

    embedding_model: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    knowledge_base_dir: Path = Path(os.getenv("KNOWLEDGE_BASE_DIR", Path(__file__).resolve().parent.parent / "data" / "knowledge_base"))
    vector_store_path: Path = Path(os.getenv("VECTOR_STORE_PATH", Path(__file__).resolve().parent.parent / "data" / "vector_store.faiss"))

    max_history_messages: int = int(os.getenv("MAX_HISTORY_MESSAGES", 10))
    retriever_k: int = int(os.getenv("RETRIEVER_K", 4))


_settings_instance: Settings | None = None

def get_settings() -> Settings:
    """Return settings instance (cached per process, but reloads on server restart)."""
    global _settings_instance
    if _settings_instance is None:
        _settings_instance = Settings()
    return _settings_instance

