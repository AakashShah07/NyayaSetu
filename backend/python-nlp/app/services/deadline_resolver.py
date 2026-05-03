import re
from datetime import datetime, timedelta
from typing import Optional
from dateutil import parser as dateutil_parser
from dateutil.relativedelta import relativedelta


# Relative deadline patterns
RELATIVE_PATTERN = re.compile(
    r"within\s+(?:a\s+period\s+of\s+)?(\d+)\s+(days?|weeks?|months?|years?)",
    re.IGNORECASE,
)

NOT_LATER_PATTERN = re.compile(
    r"not\s+later\s+than\s+(\d+)\s+(days?|weeks?|months?|years?)",
    re.IGNORECASE,
)

# Absolute deadline patterns
ABSOLUTE_DATE_PATTERN = re.compile(
    r"(?:(?:on\s+or\s+)?before\s+|by\s+)"
    r"(\d{1,2}(?:st|nd|rd|th)?\s+\w+[,]?\s*\d{4}|\d{1,2}[./-]\d{1,2}[./-]\d{2,4})",
    re.IGNORECASE,
)

# Immediate deadlines
IMMEDIATE_PATTERN = re.compile(
    r"\b(?:forthwith|immediately|without\s+(?:any\s+)?delay)\b",
    re.IGNORECASE,
)

EARLIEST_PATTERN = re.compile(
    r"\bat\s+the\s+earliest\b",
    re.IGNORECASE,
)


def resolve_deadline(
    deadline_text: str,
    judgment_date: Optional[str] = None,
) -> dict:
    """Resolve a deadline expression to an absolute ISO date.

    Args:
        deadline_text: Raw deadline text from the judgment.
        judgment_date: ISO date string of the judgment (anchor for relative dates).

    Returns:
        {"deadline": ISO date string or None, "deadline_text": str, "confidence": float}
    """
    if not deadline_text:
        return {"deadline": None, "deadline_text": None, "confidence": 0.0}

    anchor, anchor_confidence = _get_anchor_date(judgment_date)

    # Try relative deadlines
    match = RELATIVE_PATTERN.search(deadline_text) or NOT_LATER_PATTERN.search(deadline_text)
    if match:
        amount = int(match.group(1))
        unit = match.group(2).lower().rstrip("s")
        resolved = _add_duration(anchor, amount, unit)
        if resolved:
            return {
                "deadline": resolved.strftime("%Y-%m-%d"),
                "deadline_text": deadline_text,
                "confidence": 0.90 * anchor_confidence,
            }

    # Try absolute dates
    abs_match = ABSOLUTE_DATE_PATTERN.search(deadline_text)
    if abs_match:
        date_str = abs_match.group(1)
        resolved = _parse_date(date_str)
        if resolved:
            return {
                "deadline": resolved.strftime("%Y-%m-%d"),
                "deadline_text": deadline_text,
                "confidence": 0.95,
            }

    # Try immediate deadlines
    if IMMEDIATE_PATTERN.search(deadline_text):
        resolved = anchor + timedelta(days=7)
        return {
            "deadline": resolved.strftime("%Y-%m-%d"),
            "deadline_text": deadline_text,
            "confidence": 0.80 * anchor_confidence,
        }

    if EARLIEST_PATTERN.search(deadline_text):
        resolved = anchor + timedelta(days=30)
        return {
            "deadline": resolved.strftime("%Y-%m-%d"),
            "deadline_text": deadline_text,
            "confidence": 0.60 * anchor_confidence,
        }

    # Try parsing the whole text as a date
    resolved = _parse_date(deadline_text)
    if resolved:
        return {
            "deadline": resolved.strftime("%Y-%m-%d"),
            "deadline_text": deadline_text,
            "confidence": 0.70,
        }

    return {"deadline": None, "deadline_text": deadline_text, "confidence": 0.0}


def _get_anchor_date(judgment_date: Optional[str]) -> tuple[datetime, float]:
    """Get the anchor date for relative deadline calculation."""
    if judgment_date:
        try:
            anchor = dateutil_parser.parse(judgment_date, dayfirst=True)
            return anchor, 1.0
        except (ValueError, OverflowError):
            pass
    return datetime.now(), 0.5


def _add_duration(anchor: datetime, amount: int, unit: str) -> Optional[datetime]:
    """Add a time duration to an anchor date."""
    try:
        if unit == "day":
            return anchor + timedelta(days=amount)
        elif unit == "week":
            return anchor + timedelta(weeks=amount)
        elif unit == "month":
            return anchor + relativedelta(months=amount)
        elif unit == "year":
            return anchor + relativedelta(years=amount)
    except (ValueError, OverflowError):
        return None
    return None


def _parse_date(date_str: str) -> Optional[datetime]:
    """Parse a date string with Indian format preference (dayfirst)."""
    if not date_str or len(date_str.strip()) < 4:
        return None
    try:
        return dateutil_parser.parse(date_str.strip(), dayfirst=True)
    except (ValueError, OverflowError):
        return None
