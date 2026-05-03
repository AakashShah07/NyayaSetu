from pydantic import BaseModel
from typing import Optional


# --- Page-level results ---

class PageResult(BaseModel):
    page_number: int
    text: str
    confidence: float
    method: str  # "digital" or "ocr"


class TextExtractionResponse(BaseModel):
    text: str
    pages: int
    method: str  # "digital", "ocr", or "mixed"
    pages_data: list[PageResult] = []
    avg_confidence: float = 1.0


# --- Entity results ---

class EntityResult(BaseModel):
    text: str
    label: str
    start: int
    end: int


class EntitiesResponse(BaseModel):
    entities: list[EntityResult]
    total: int


# --- Legal metadata ---

class ConfidenceValue(BaseModel):
    value: Optional[str] = None
    confidence: float = 0.0


class PartyInfo(BaseModel):
    petitioner: ConfidenceValue = ConfidenceValue()
    respondent: ConfidenceValue = ConfidenceValue()


class LegalMetadata(BaseModel):
    court_name: ConfidenceValue = ConfidenceValue()
    case_number: ConfidenceValue = ConfidenceValue()
    judgment_date: ConfidenceValue = ConfidenceValue()
    filing_date: ConfidenceValue = ConfidenceValue()
    judges: list[ConfidenceValue] = []
    parties: PartyInfo = PartyInfo()
    monetary_amounts: list[ConfidenceValue] = []


# --- Directive results ---

class DirectiveResult(BaseModel):
    directive_text: str
    main_action: Optional[str] = None
    conditions: list[str] = []
    deadline: Optional[str] = None  # ISO date string
    deadline_text: Optional[str] = None
    responsible_department: Optional[str] = None
    responsible_entity: Optional[str] = None
    source_page: Optional[int] = None
    source_text: Optional[str] = None
    confidence: float = 0.0
    review_status: str = "needs_review"  # "auto_accepted" or "needs_review"


class ExtractionInfo(BaseModel):
    total_pages: int
    method: str
    avg_confidence: float
    order_section_page_range: Optional[list[int]] = None


class FullExtractionResponse(BaseModel):
    metadata: LegalMetadata
    extraction_info: ExtractionInfo
    directives: list[DirectiveResult]
    full_text: str


# --- Health ---

class HealthResponse(BaseModel):
    status: str
    tesseract: bool
    spacy_model: Optional[str] = None
