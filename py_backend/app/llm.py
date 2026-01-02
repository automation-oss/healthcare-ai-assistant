from typing import List

from langchain.schema import AIMessage, HumanMessage, SystemMessage, BaseMessage
from langchain_community.chat_models import ChatOllama
from langchain_openai import ChatOpenAI
from langchain_core.language_models import BaseChatModel

from .config import get_settings


def get_llm() -> BaseChatModel:
    """Instantiate the configured chat model."""
    settings = get_settings()

    if settings.llm_provider == "openai" and settings.openai_api_key:
        return ChatOpenAI(
            model=settings.openai_model,
            temperature=0.2,
            streaming=False,
            max_tokens=800,
        )

    return ChatOllama(
        model=settings.ollama_model,
        temperature=0.2,
        num_ctx=4096,
    )


def convert_history(messages: List[dict]) -> List[BaseMessage]:
    """Convert frontend history into LangChain message objects."""
    converted: List[BaseMessage] = []
    for entry in messages:
        role = entry.get("role")
        content = entry.get("content", "")
        if not content:
            continue
        if role == "assistant":
            converted.append(AIMessage(content=content))
        else:
            converted.append(HumanMessage(content=content))
    return converted


def system_message(context: str, category: str | None) -> SystemMessage:
    cat = category or "General Healthcare Knowledge"
    instructions = f"""You are MediAssist AI, a healthcare operations expert specialized in {cat}.
Use the provided context to craft concise, accurate answers.
Always cite insights that originate from billingparadise.com sources.
After the main answer, add a newline, then the delimiter '###', then ask one proactive follow-up question."""
    if context:
        instructions += f"\n\nContext snippets:\n{context}"
    return SystemMessage(content=instructions.strip())

