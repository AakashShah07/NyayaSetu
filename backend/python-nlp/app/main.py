from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from app.routers import health
from app.services.ocr_service import extract_text_from_pdf
from app.services.nlp_service import load_model, extract_entities
from app.services.legal_ner import extract_legal_metadata
from app.services.section_detector import detect_order_section
from app.services.directive_extractor import extract_directives
from app.config import PORT

app = FastAPI(title="NyayaSetu NLP Service", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)


@app.on_event("startup")
async def startup():
    print("Loading spaCy model...")
    if load_model():
        print("spaCy model loaded successfully")
    else:
        print("WARNING: Failed to load spaCy model. Run: python -m spacy download en_core_web_sm")


@app.post("/extract/text")
async def extract_text(file: UploadFile = File(...)):
    contents = await file.read()
    result = extract_text_from_pdf(contents)
    return result


class EntityRequest(BaseModel):
    text: str


@app.post("/extract/entities")
async def extract_entities_endpoint(request: EntityRequest):
    result = extract_entities(request.text)
    return result


@app.post("/extract/directives")
async def extract_directives_endpoint(
    file: UploadFile = File(...),
    judgment_date: Optional[str] = Query(None, description="ISO date of judgment (YYYY-MM-DD)"),
):
    """Full extraction pipeline: PDF -> text -> legal NER -> section detection -> directive extraction."""
    contents = await file.read()

    # Step 1: Extract text page-by-page
    text_result = extract_text_from_pdf(contents)
    full_text = text_result["text"]
    pages_data = text_result.get("pages_data", [])

    # Step 2: Extract legal metadata
    first_pages = "\n\n".join(
        p["text"] for p in pages_data[:3]
    ) if pages_data else full_text[:5000]
    metadata = extract_legal_metadata(full_text, first_pages_text=first_pages)

    # Use extracted judgment_date if not provided
    effective_date = judgment_date or metadata.get("judgment_date", {}).get("value")

    # Step 3: Detect order section
    section = detect_order_section(full_text, pages_data=pages_data)

    # Step 4: Extract directives from order section
    directives = extract_directives(
        order_section_text=section["order_section_text"],
        judgment_date=effective_date,
        pages_data=pages_data,
        section_confidence=section["confidence"],
    )

    # Build response
    order_page_range = None
    if section["start_page"] and section["end_page"]:
        order_page_range = [section["start_page"], section["end_page"]]

    return {
        "metadata": metadata,
        "extraction_info": {
            "total_pages": text_result["pages"],
            "method": text_result["method"],
            "avg_confidence": text_result.get("avg_confidence", 1.0),
            "order_section_page_range": order_page_range,
        },
        "directives": directives,
        "full_text": full_text,
    }


class DirectivesFromTextRequest(BaseModel):
    text: str
    judgment_date: Optional[str] = None


@app.post("/extract/directives-from-text")
async def extract_directives_from_text_endpoint(request: DirectivesFromTextRequest):
    """Extract directives from pre-extracted text (no PDF upload needed)."""
    metadata = extract_legal_metadata(request.text)
    effective_date = request.judgment_date or metadata.get("judgment_date", {}).get("value")

    section = detect_order_section(request.text)
    directives = extract_directives(
        order_section_text=section["order_section_text"],
        judgment_date=effective_date,
        pages_data=None,
        section_confidence=section["confidence"],
    )

    order_page_range = None
    if section["start_page"] and section["end_page"]:
        order_page_range = [section["start_page"], section["end_page"]]

    return {
        "metadata": metadata,
        "extraction_info": {
            "total_pages": 0,
            "method": "pre-extracted",
            "avg_confidence": 1.0,
            "order_section_page_range": order_page_range,
        },
        "directives": directives,
        "full_text": request.text,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
