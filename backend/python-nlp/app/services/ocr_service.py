import pytesseract
from PyPDF2 import PdfReader
from PIL import Image
import io
import subprocess
from app.config import TESSERACT_CMD

pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def is_tesseract_available():
    try:
        version = pytesseract.get_tesseract_version()
        return True, str(version)
    except Exception:
        return False, None


def extract_text_from_pdf(file_bytes: bytes) -> dict:
    """Extract text from PDF. Try digital extraction first, fall back to OCR."""
    reader = PdfReader(io.BytesIO(file_bytes))
    pages = len(reader.pages)

    # Try digital text extraction first
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        text_parts.append(page_text)

    full_text = "\n".join(text_parts).strip()

    # If digital extraction got enough text, use it
    if len(full_text) > 100:
        return {"text": full_text, "pages": pages, "method": "digital"}

    # Fall back to OCR (for scanned PDFs)
    # This is a basic stub - full OCR with image conversion will be enhanced in Phase 2
    try:
        ocr_text = pytesseract.image_to_string(Image.open(io.BytesIO(file_bytes)))
        return {"text": ocr_text or full_text, "pages": pages, "method": "ocr"}
    except Exception:
        # Return whatever we got from digital extraction
        return {"text": full_text, "pages": pages, "method": "digital"}
