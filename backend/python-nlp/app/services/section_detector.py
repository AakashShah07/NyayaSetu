import re

# Strong indicators of order/disposition section
STRONG_ANCHORS = [
    r"\bORDER\b",
    r"\bDISPOSITION\b",
    r"\bDIRECTIONS?\b",
    r"(?:the\s+)?petition\s+is\s+(?:disposed|allowed|dismissed)",
    r"(?:the\s+)?(?:writ\s+)?petition\s+(?:stands?\s+)?(?:disposed|allowed|dismissed)",
    r"for\s+the\s+reasons?\s+aforesaid",
    r"in\s+(?:the\s+)?(?:view|light)\s+of\s+the\s+above",
    r"we\s+(?:hereby\s+)?direct",
    r"it\s+is\s+hereby\s+ordered",
    r"in\s+the\s+result",
    r"(?:accordingly|therefore)[,.]?\s+(?:we|the\s+court|this\s+court)\s+(?:order|direct)",
]

# Medium indicators
MEDIUM_ANCHORS = [
    r"accordingly",
    r"in\s+light\s+of\s+the\s+above\s+discussion",
    r"we\s+are\s+of\s+the\s+(?:view|opinion)",
    r"(?:we|the\s+court)\s+(?:pass|make)\s+the\s+following\s+order",
    r"the\s+following\s+directions?\s+(?:are|is)\s+(?:issued|given|passed)",
]

STRONG_RE = re.compile("|".join(STRONG_ANCHORS), re.IGNORECASE)
MEDIUM_RE = re.compile("|".join(MEDIUM_ANCHORS), re.IGNORECASE)


def detect_order_section(text: str, pages_data: list[dict] = None) -> dict:
    """Detect the order/disposition section of a court judgment.

    Returns:
        {
            "order_section_text": str,
            "start_page": int or None,
            "end_page": int or None,
            "confidence": float,
        }
    """
    if not text.strip():
        return {
            "order_section_text": "",
            "start_page": None,
            "end_page": None,
            "confidence": 0.0,
        }

    # Search for strong anchors first
    best_pos = None
    confidence = 0.0

    for match in STRONG_RE.finditer(text):
        pos = match.start()
        # Prefer anchors in the latter half of the document
        relative_pos = pos / len(text)
        if relative_pos > 0.3:  # Must be past the first 30%
            if best_pos is None or pos < best_pos:
                best_pos = pos
                confidence = 0.90

    # Try medium anchors if no strong ones found in the latter portion
    if best_pos is None:
        for match in MEDIUM_RE.finditer(text):
            pos = match.start()
            relative_pos = pos / len(text)
            if relative_pos > 0.5:
                if best_pos is None or pos < best_pos:
                    best_pos = pos
                    confidence = 0.70

    # Fallback: last 25% of text
    if best_pos is None:
        best_pos = int(len(text) * 0.75)
        confidence = 0.40

    order_text = text[best_pos:].strip()

    # Determine page range
    start_page = None
    end_page = None
    if pages_data:
        char_count = 0
        for page in pages_data:
            page_len = len(page["text"]) + 2  # +2 for \n\n separator
            if char_count + page_len >= best_pos and start_page is None:
                start_page = page["page_number"]
            char_count += page_len
        end_page = pages_data[-1]["page_number"] if pages_data else None

    return {
        "order_section_text": order_text,
        "start_page": start_page,
        "end_page": end_page,
        "confidence": confidence,
    }
