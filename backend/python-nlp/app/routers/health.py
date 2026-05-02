from fastapi import APIRouter
from app.services.ocr_service import is_tesseract_available
from app.services.nlp_service import is_model_loaded
from app.config import SPACY_MODEL

router = APIRouter()


@router.get("/health")
async def health_check():
    tesseract_ok, tesseract_version = is_tesseract_available()
    return {
        "status": "ok",
        "tesseract": tesseract_ok,
        "tesseract_version": tesseract_version,
        "spacy_model": SPACY_MODEL if is_model_loaded() else None,
    }
