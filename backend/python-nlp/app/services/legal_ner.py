import re
from typing import Optional
from app.services.nlp_service import nlp


# --- Indian court name patterns ---

KNOWN_COURTS = [
    "Supreme Court of India",
    "High Court of Karnataka",
    "High Court of Bombay",
    "High Court of Delhi",
    "High Court of Madras",
    "High Court of Calcutta",
    "High Court of Allahabad",
    "High Court of Kerala",
    "High Court of Gujarat",
    "High Court of Andhra Pradesh",
    "High Court of Telangana",
    "High Court of Rajasthan",
    "High Court of Punjab and Haryana",
    "High Court of Madhya Pradesh",
    "High Court of Patna",
    "High Court of Orissa",
    "High Court of Jharkhand",
    "High Court of Chhattisgarh",
    "High Court of Uttarakhand",
    "High Court of Himachal Pradesh",
    "High Court of Jammu and Kashmir",
    "High Court of Gauhati",
    "High Court of Tripura",
    "High Court of Meghalaya",
    "High Court of Manipur",
    "High Court of Sikkim",
    "National Green Tribunal",
    "Central Administrative Tribunal",
]

COURT_PATTERN = re.compile(
    r"(?:(?:Hon['']?ble\s+)?(?:the\s+)?"
    r"(?:Supreme\s+Court\s+of\s+India|"
    r"High\s+Court\s+of\s+[\w\s]+?(?=\s+at|\s+bench|\s*,|\s*\n)|"
    r"(?:District|Sessions?|Family|Labour|Consumer)\s+Court[\w\s,]*?(?=\s+at|\s*,|\s*\n)|"
    r"National\s+Green\s+Tribunal|"
    r"Central\s+Administrative\s+Tribunal))",
    re.IGNORECASE,
)

# --- Case number patterns ---

CASE_NUMBER_PATTERN = re.compile(
    r"(?:W\.?P\.?|Crl\.?(?:\s*A)?\.?|SLP|PIL|C\.?A\.?|O\.?A\.?|M\.?A\.?|"
    r"R\.?P\.?|Civ\.?\s*App|Crim\.?\s*App|W\.?A\.?|C\.?C\.?|M\.?C\.?)"
    r"\s*(?:\([A-Za-z]+\)\s*)?"
    r"No\.?\s*[\d/\-]+"
    r"(?:\s*of\s*\d{4})?",
    re.IGNORECASE,
)

# --- Judge name patterns ---

JUDGE_PATTERN = re.compile(
    r"(?:Hon['\u2019]?ble\s+)?(?:(?:Mr|Mrs|Ms|Smt)\.?\s+)?"
    r"Justice\s+([A-Za-z][A-Za-z.]+(?:[ \t]+(?!AND\b|THE\b|HON\b|IN\b|AT\b|OF\b|W\.P)[A-Za-z][A-Za-z.]+){0,4})",
    re.IGNORECASE,
)

# --- Date patterns ---

DATE_CONTEXT_PATTERN = re.compile(
    r"(?:(?:dated|filed\s+on|pronounced\s+on|delivered\s+on|judgment\s+(?:date|dated|delivered)|"
    r"order\s+dated|decided\s+on|disposed\s+(?:of\s+)?on|reserved\s+on)\s*[:.]?\s*)"
    r"(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s+\w+[,]?\s*\d{4})",
    re.IGNORECASE,
)

INDIAN_DATE_FORMATS = [
    r"\d{1,2}[./-]\d{1,2}[./-]\d{2,4}",
    r"\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)[,]?\s*\d{4}",
]

# --- Party patterns ---

PARTY_PATTERN = re.compile(
    r"(?:^|\n)\s*(.+?)\s*\.{3,}\s*(?:Petitioner|Appellant|Complainant|Plaintiff)",
    re.IGNORECASE | re.MULTILINE,
)

RESPONDENT_PATTERN = re.compile(
    r"(?:^|\n)\s*(.+?)\s*\.{3,}\s*(?:Respondent|Defendant|Opposite\s+Party)",
    re.IGNORECASE | re.MULTILINE,
)

VERSUS_PATTERN = re.compile(
    r"(.+?)\s+(?:v/s|vs\.?|versus|v\.)\s+(.+?)(?:\n|$)",
    re.IGNORECASE,
)

# --- Monetary patterns ---

MONEY_PATTERN = re.compile(
    r"(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{1,2})?"
    r"(?:\s*(?:lakh|lakhs|crore|crores))?",
    re.IGNORECASE,
)

# --- Department mapping ---

DEPARTMENT_KEYWORDS = {
    "Social Welfare": [
        "social welfare", "women and child", "child development",
        "disability", "tribal welfare", "scheduled caste", "scheduled tribe",
    ],
    "Environment": [
        "environment", "forest", "pollution", "ecology", "wildlife",
        "green tribunal", "mining", "waste management",
    ],
    "Police": [
        "police", "law and order", "crime", "criminal", "investigation",
        "home department", "dgp", "igp", "superintendent of police",
    ],
}


def extract_legal_metadata(text: str, first_pages_text: Optional[str] = None) -> dict:
    """Extract structured legal metadata from court judgment text.
    first_pages_text: text from the first 2-3 pages (for party/header extraction).
    """
    header_text = first_pages_text or text[:5000]

    return {
        "court_name": _extract_court_name(header_text),
        "case_number": _extract_case_number(header_text),
        "judgment_date": _extract_judgment_date(header_text),
        "filing_date": _extract_filing_date(header_text),
        "judges": _extract_judges(header_text),
        "parties": _extract_parties(header_text),
        "monetary_amounts": _extract_monetary_amounts(text),
    }


def _extract_court_name(text: str) -> dict:
    # Check against known courts first
    text_lower = text.lower()
    for court in KNOWN_COURTS:
        if court.lower() in text_lower:
            return {"value": court, "confidence": 0.95}

    # Try regex pattern
    match = COURT_PATTERN.search(text)
    if match:
        return {"value": match.group(0).strip(), "confidence": 0.80}

    # Try spaCy ORG entities
    if nlp:
        doc = nlp(text[:10000])
        for ent in doc.ents:
            if ent.label_ == "ORG" and "court" in ent.text.lower():
                return {"value": ent.text, "confidence": 0.60}

    return {"value": None, "confidence": 0.0}


def _extract_case_number(text: str) -> dict:
    match = CASE_NUMBER_PATTERN.search(text)
    if match:
        return {"value": match.group(0).strip(), "confidence": 0.95}
    return {"value": None, "confidence": 0.0}


def _extract_judgment_date(text: str) -> dict:
    # Look for dates with judgment-specific context
    matches = DATE_CONTEXT_PATTERN.findall(text)
    for m in matches:
        date_str = _normalize_date_string(m)
        if date_str:
            return {"value": date_str, "confidence": 0.90}

    # Look for "pronounced on" or "delivered on"
    pronounced = re.search(
        r"(?:pronounced|delivered|decided)\s+(?:on\s+)?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})",
        text, re.IGNORECASE,
    )
    if pronounced:
        date_str = _normalize_date_string(pronounced.group(1))
        if date_str:
            return {"value": date_str, "confidence": 0.85}

    # Fallback: spaCy DATE entities
    if nlp:
        doc = nlp(text[:10000])
        for ent in doc.ents:
            if ent.label_ == "DATE":
                date_str = _normalize_date_string(ent.text)
                if date_str:
                    return {"value": date_str, "confidence": 0.50}

    return {"value": None, "confidence": 0.0}


def _extract_filing_date(text: str) -> dict:
    match = re.search(
        r"(?:filed\s+on|date\s+of\s+filing|filing\s+date)\s*[:.]?\s*"
        r"(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s+\w+[,]?\s*\d{4})",
        text, re.IGNORECASE,
    )
    if match:
        date_str = _normalize_date_string(match.group(1))
        if date_str:
            return {"value": date_str, "confidence": 0.85}
    return {"value": None, "confidence": 0.0}


def _extract_judges(text: str) -> list[dict]:
    judges = []
    seen = set()
    for match in JUDGE_PATTERN.finditer(text):
        name = match.group(1).strip().rstrip(".,")
        name_key = name.lower()
        if name_key not in seen and len(name) > 3:
            seen.add(name_key)
            judges.append({"value": f"Justice {name}", "confidence": 0.90})
    return judges


def _extract_parties(text: str) -> dict:
    result = {
        "petitioner": {"value": None, "confidence": 0.0},
        "respondent": {"value": None, "confidence": 0.0},
    }

    # Try petitioner/respondent format
    pet_match = PARTY_PATTERN.search(text)
    if pet_match:
        result["petitioner"] = {"value": pet_match.group(1).strip(), "confidence": 0.85}

    resp_match = RESPONDENT_PATTERN.search(text)
    if resp_match:
        result["respondent"] = {"value": resp_match.group(1).strip(), "confidence": 0.85}

    # Try versus format if not found
    if not result["petitioner"]["value"]:
        vs_match = VERSUS_PATTERN.search(text)
        if vs_match:
            result["petitioner"] = {"value": vs_match.group(1).strip(), "confidence": 0.70}
            result["respondent"] = {"value": vs_match.group(2).strip(), "confidence": 0.70}

    return result


def _extract_monetary_amounts(text: str) -> list[dict]:
    amounts = []
    seen = set()
    for match in MONEY_PATTERN.finditer(text):
        val = match.group(0).strip()
        if val not in seen:
            seen.add(val)
            amounts.append({"value": val, "confidence": 0.90})
    return amounts


def map_to_department(entity_text: str) -> str:
    """Map a responsible entity string to a known department."""
    if not entity_text:
        return "General"
    text_lower = entity_text.lower()
    for dept, keywords in DEPARTMENT_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return dept
    return "General"


def _normalize_date_string(date_str: str) -> Optional[str]:
    """Try to parse an Indian-format date string into ISO format (YYYY-MM-DD)."""
    from dateutil import parser as dateutil_parser

    if not date_str or len(date_str.strip()) < 4:
        return None

    try:
        parsed = dateutil_parser.parse(date_str.strip(), dayfirst=True)
        return parsed.strftime("%Y-%m-%d")
    except (ValueError, OverflowError):
        return None
