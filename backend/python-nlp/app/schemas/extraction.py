from pydantic import BaseModel
from typing import Optional


class TextExtractionResponse(BaseModel):
    text: str
    pages: int
    method: str  # "digital" or "ocr"


class EntityResult(BaseModel):
    text: str
    label: str
    start: int
    end: int


class EntitiesResponse(BaseModel):
    entities: list[EntityResult]
    total: int


class HealthResponse(BaseModel):
    status: str
    tesseract: bool
    spacy_model: Optional[str] = None
