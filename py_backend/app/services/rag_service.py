from __future__ import annotations

from typing import List, Optional

from langchain.schema import HumanMessage
from langchain_core.documents import Document

from ..config import get_settings
from ..llm import convert_history, get_llm, system_message
from ..models import GenerateRequest, GenerateResponse, SearchResponse
from ..vector_store import get_retriever


def _format_docs(docs: List[Document]) -> str:
    formatted = []
    for doc in docs:
        snippet = doc.page_content.strip()
        source = doc.metadata.get("source", "knowledge_base")
        formatted.append(f"Source: {source}\n{snippet}")
    return "\n\n".join(formatted)


async def generate_response(payload: GenerateRequest) -> GenerateResponse:
    settings = get_settings()
    retriever = get_retriever()
    llm = get_llm()

    docs = retriever.get_relevant_documents(payload.message)
    context = _format_docs(docs)

    history_messages = convert_history(payload.history[-settings.max_history_messages :])
    system_msg = system_message(context, payload.category)

    messages = [system_msg, *history_messages, HumanMessage(content=payload.message)]
    response = llm.invoke(messages)

    specialty_url: Optional[str] = None
    sources = [doc.metadata.get("path") for doc in docs if doc.metadata.get("path")]

    if payload.searchContext and payload.searchContext.primaryUrl:
        specialty_url = payload.searchContext.primaryUrl

    return GenerateResponse(
        content=response.content,
        specialtyUrl=specialty_url,
        sources=sources,
    )


def semantic_search(query: str) -> SearchResponse:
    retriever = get_retriever()
    docs = retriever.get_relevant_documents(query)
    if not docs:
        raise ValueError("No knowledge base snippets matched the query.")

    primary_url = docs[0].metadata.get("url")
    additional_urls = [doc.metadata.get("url") for doc in docs[1:] if doc.metadata.get("url")]
    content = _format_docs(docs[:2])

    return SearchResponse(
        primaryUrl=primary_url,
        additionalUrls=[url for url in additional_urls if url],
        content=content,
    )

