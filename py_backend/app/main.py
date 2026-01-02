from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .models import GenerateRequest, GenerateResponse, SearchRequest, SearchResponse
from .services.rag_service import generate_response, semantic_search

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "provider": settings.llm_provider, "model": settings.ollama_model}


@app.post("/api/generate", response_model=GenerateResponse)
async def generate(payload: GenerateRequest):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message must not be empty")

    try:
        return await generate_response(payload)
    except Exception as exc:  # pylint: disable=broad-exexcept
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/search", response_model=SearchResponse)
async def search(payload: SearchRequest):
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query must not be empty")
    try:
        return semantic_search(payload.query)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=500, detail=str(exc)) from exc

