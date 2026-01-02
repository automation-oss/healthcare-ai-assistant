from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1)


class SearchContext(BaseModel):
    primaryUrl: Optional[str] = None
    additionalUrls: List[str] = Field(default_factory=list)
    content: Optional[str] = None


class GenerateRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    category: Optional[str] = None
    history: List[ChatMessage] = Field(default_factory=list)
    searchContext: Optional[SearchContext] = None


class GenerateResponse(BaseModel):
    content: str
    specialtyUrl: Optional[str] = None
    sources: List[str] = Field(default_factory=list)


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    userId: Optional[str] = None


class SearchResponse(BaseModel):
    primaryUrl: Optional[str] = None
    additionalUrls: List[str] = Field(default_factory=list)
    content: str

