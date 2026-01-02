from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import List

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings

from .config import get_settings


def _load_documents(base_path: Path) -> List[Document]:
    docs: List[Document] = []
    if not base_path.exists():
        return docs

    for file_path in base_path.glob("*.md"):
        text = file_path.read_text(encoding="utf-8").strip()
        url = None
        if text.lower().startswith("url:"):
            first_line, _, remainder = text.partition("\n")
            url = first_line.split(":", 1)[1].strip()
            text = remainder.strip()

        metadata = {"source": file_path.name, "path": str(file_path)}
        if url:
            metadata["url"] = url
        docs.append(Document(page_content=text.strip(), metadata=metadata))
    return docs


@lru_cache()
def get_vector_store() -> FAISS:
    """Create (or load) a FAISS vector store from the knowledge base."""
    settings = get_settings()
    kb_docs = _load_documents(settings.knowledge_base_dir)

    if not kb_docs:
        raise RuntimeError(
            f"No documents found in knowledge base directory: {settings.knowledge_base_dir}"
        )

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
    chunks = splitter.split_documents(kb_docs)

    embeddings = HuggingFaceEmbeddings(model_name=settings.embedding_model)
    store = FAISS.from_documents(chunks, embeddings)

    return store


def get_retriever():
    """Return a retriever backed by FAISS."""
    settings = get_settings()
    return get_vector_store().as_retriever(search_kwargs={"k": settings.retriever_k})

