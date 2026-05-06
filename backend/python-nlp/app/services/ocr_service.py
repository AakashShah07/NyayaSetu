import io
import logging

from PyPDF2 import PdfReader
from PIL import Image

from app.config import TESSERACT_CMD
from app.services.image_preprocessor import preprocess_for_ocr

try:
    import pytesseract
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

try:
    from pdf2image import convert_from_bytes
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False

logger = logging.getLogger(__name__)

MIN_DIGITAL_TEXT_PER_PAGE = 20


def is_tesseract_available():
    if not TESSERACT_AVAILABLE:
        return False, None
    try:
        version = pytesseract.get_tesseract_version()
        return True, str(version)
    except Exception:
        return False, None


def _extract_digital_text(reader: PdfReader) -> list[dict]:
    """Extract text digitally from each page."""
    results = []
    for i, page in enumerate(reader.pages):
        text = (page.extract_text() or "").strip()
        results.append({
            "page_number": i + 1,
            "text": text,
            "confidence": 1.0 if len(text) > MIN_DIGITAL_TEXT_PER_PAGE else 0.0,
            "method": "digital",
        })
    return results


def _ocr_page_confidence(pil_image: Image.Image) -> tuple[str, float]:
    """Run OCR on a single image and return (text, avg_confidence)."""
    preprocessed = preprocess_for_ocr(pil_image)
    data = pytesseract.image_to_data(preprocessed, output_type=pytesseract.Output.DICT)

    words = []
    confidences = []
    for i, conf in enumerate(data["conf"]):
        if int(conf) > 0:
            words.append(data["text"][i])
            confidences.append(int(conf))

    text = " ".join(w for w in words if w.strip())
    avg_conf = (sum(confidences) / len(confidences) / 100.0) if confidences else 0.0
    return text, avg_conf


def extract_text_from_pdf(file_bytes: bytes) -> dict:
    """Extract text from PDF page-by-page. Uses digital extraction first,
    falls back to OCR with image preprocessing for pages with insufficient text."""
    reader = PdfReader(io.BytesIO(file_bytes))
    total_pages = len(reader.pages)

    # Phase 1: digital extraction
    pages_data = _extract_digital_text(reader)

    # Check if digital extraction is sufficient overall
    digital_text = "\n".join(p["text"] for p in pages_data).strip()
    needs_ocr = len(digital_text) < 100

    # Phase 2: OCR for pages that need it (only if dependencies available)
    if needs_ocr and TESSERACT_AVAILABLE and PDF2IMAGE_AVAILABLE:
        try:
            images = convert_from_bytes(file_bytes, dpi=300)
            for i, img in enumerate(images):
                if len(pages_data[i]["text"]) < MIN_DIGITAL_TEXT_PER_PAGE:
                    try:
                        ocr_text, ocr_conf = _ocr_page_confidence(img)
                        if ocr_text.strip():
                            pages_data[i]["text"] = ocr_text
                            pages_data[i]["confidence"] = ocr_conf
                            pages_data[i]["method"] = "ocr"
                    except Exception as e:
                        logger.warning(f"OCR failed for page {i + 1}: {e}")
        except Exception as e:
            logger.warning(f"pdf2image conversion failed: {e}")
    elif needs_ocr:
        logger.info("OCR skipped: tesseract or pdf2image not available")

    # Determine overall method
    methods = set(p["method"] for p in pages_data if p["text"].strip())
    if methods == {"ocr"}:
        overall_method = "ocr"
    elif methods == {"digital"}:
        overall_method = "digital"
    elif len(methods) > 1:
        overall_method = "mixed"
    else:
        overall_method = "digital"

    full_text = "\n\n".join(p["text"] for p in pages_data).strip()
    confidences = [p["confidence"] for p in pages_data if p["text"].strip()]
    avg_confidence = (sum(confidences) / len(confidences)) if confidences else 0.0

    return {
        "text": full_text,
        "pages": total_pages,
        "method": overall_method,
        "pages_data": pages_data,
        "avg_confidence": round(avg_confidence, 3),
    }
