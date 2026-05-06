import re
from typing import Optional
from app.services.nlp_service import nlp, ensure_model
from app.services.legal_ner import map_to_department
from app.services.deadline_resolver import resolve_deadline

# --- Directive verb patterns ---

STRONG_DIRECTIVE_VERBS = re.compile(
    r"\b(?:directed|ordered|shall|must|is\s+required\s+to|is\s+directed\s+to|"
    r"shall\s+ensure|shall\s+submit|shall\s+comply|shall\s+file|"
    r"is\s+hereby\s+directed|are\s+directed|is\s+ordered|"
    r"the\s+court\s+(?:hereby\s+)?(?:orders?|directs?)|"
    r"this\s+court\s+(?:hereby\s+)?(?:orders?|directs?)|"
    r"we\s+(?:hereby\s+)?direct|we\s+order)",
    re.IGNORECASE,
)

IMPERATIVE_VERBS = re.compile(
    r"\b(?:submit|ensure|comply|pay|release|transfer|appoint|"
    r"constitute|furnish|deposit|refund|reinstate|implement|"
    r"complete|file|report|take\s+steps?|take\s+action|"
    r"cease|desist|restrain|prohibit)\b",
    re.IGNORECASE,
)

# --- Condition patterns ---

CONDITION_PATTERN = re.compile(
    r"(?:provided\s+that|subject\s+to|unless|"
    r"on\s+(?:the\s+)?condition\s+that|in\s+the\s+event\s+(?:that\s+)?|"
    r"if\s+(?:the\s+)?(?:respondent|petitioner|department|state|government))"
    r"\s*[,:]?\s*(.+?)(?:[.;]|\Z|,\s*within)",
    re.IGNORECASE | re.DOTALL,
)

# --- Deadline text patterns ---

DEADLINE_PATTERN = re.compile(
    r"(?:within\s+(?:a\s+period\s+of\s+)?\d+\s+(?:days?|weeks?|months?|years?)|"
    r"not\s+later\s+than\s+\d+\s+(?:days?|weeks?|months?|years?)|"
    r"(?:on\s+or\s+)?before\s+\d{1,2}(?:st|nd|rd|th)?\s+\w+[,]?\s*\d{4}|"
    r"(?:on\s+or\s+)?before\s+\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|"
    r"by\s+\d{1,2}(?:st|nd|rd|th)?\s+\w+[,]?\s*\d{4}|"
    r"by\s+\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|"
    r"forthwith|immediately|without\s+(?:any\s+)?delay|"
    r"at\s+the\s+earliest|"
    r"within\s+\d+\s+(?:days?|weeks?|months?|years?)\s+(?:from|of)\s+(?:the\s+)?(?:date|today|this\s+order))",
    re.IGNORECASE,
)

# --- Responsible entity patterns ---

RESPONSIBLE_ENTITY_PATTERN = re.compile(
    r"(?:the\s+)?(?:respondent(?:\s+no\.?\s*\d+)?|"
    r"(?:state|government)\s+of\s+\w+|"
    r"(?:department|ministry|directorate|commissioner|secretary|collector|"
    r"chief\s+secretary|additional\s+(?:chief\s+)?secretary|"
    r"principal\s+secretary)\s+(?:of\s+)?[\w\s]+?)(?=\s+(?:shall|is|are|must|to)|\s*,)",
    re.IGNORECASE,
)

DIRECTIVE_SCORE_THRESHOLD = 2


def extract_directives(
    order_section_text: str,
    judgment_date: Optional[str] = None,
    pages_data: list[dict] = None,
    section_confidence: float = 1.0,
) -> list[dict]:
    """Extract directives from the order section of a court judgment.

    Args:
        order_section_text: Text of the order/disposition section.
        judgment_date: ISO date string of the judgment (for deadline resolution).
        pages_data: Page-level text data (for source_page mapping).
        section_confidence: Confidence of order section detection.

    Returns:
        List of directive dicts with all extracted fields.
    """
    ensure_model()

    if not order_section_text.strip():
        return []

    # Pass 1: Identify directive candidates
    candidates = _identify_candidates(order_section_text)

    # Pass 2 & 3: Extract fields and score each candidate
    directives = []
    for candidate in candidates:
        directive = _extract_fields(candidate, judgment_date, pages_data, section_confidence)
        if directive:
            directives.append(directive)

    return directives


NUMBERED_ITEM_PATTERN = re.compile(
    r'(?:^|\n)\s*(\d+)\s*[.)]\s*',
    re.MULTILINE,
)


def _split_numbered_items(text: str) -> list[str]:
    """Split text on numbered list items (1., 2., 3. etc.) that courts use."""
    parts = NUMBERED_ITEM_PATTERN.split(text)
    # parts = [preamble, "1", item1_text, "2", item2_text, ...]
    items = []
    i = 0
    while i < len(parts):
        if i + 1 < len(parts) and parts[i].strip().isdigit():
            # This is a number, next part is the item text
            item_text = parts[i + 1].strip() if i + 1 < len(parts) else ""
            if item_text:
                items.append(item_text)
            i += 2
        else:
            # Preamble or non-numbered text
            if parts[i].strip():
                items.append(parts[i].strip())
            i += 1
    return items


def _identify_candidates(text: str) -> list[dict]:
    """Pass 1: Segment text into sentences, score each for 'directive-ness',
    and group consecutive directive sentences into blocks.
    First splits on numbered items (1., 2., 3.) to handle court order format."""

    # Pre-split on numbered list items — courts typically number their directives
    numbered_items = _split_numbered_items(text)
    has_numbered = len(numbered_items) > 1

    if has_numbered:
        # Each numbered item is treated as a separate candidate
        sent_data = []
        pos = 0
        for item in numbered_items:
            sent_data.append({"text": item, "start": pos, "end": pos + len(item)})
            pos += len(item) + 1
    elif nlp:
        doc = nlp(text[:100000])
        sent_data = [
            {"text": sent.text.strip(), "start": sent.start_char, "end": sent.end_char}
            for sent in doc.sents
            if sent.text.strip()
        ]
    else:
        sentences = [s.strip() for s in re.split(r'[.;]\s+', text) if s.strip()]
        sent_data = [{"text": s, "start": 0, "end": len(s)} for s in sentences]

    # Score each sentence/item
    scored = []
    for sent in sent_data:
        score = 0
        if STRONG_DIRECTIVE_VERBS.search(sent["text"]):
            score += 2
        if IMPERATIVE_VERBS.search(sent["text"]):
            score += 1
        if DEADLINE_PATTERN.search(sent["text"]):
            score += 1
        scored.append({**sent, "score": score})

    # If we already split on numbered items, return each high-scoring item as its own candidate
    if has_numbered:
        candidates = [s for s in scored if s["score"] >= 1]
        if not candidates:
            candidates = [s for s in scored if s["score"] >= 0 and len(s["text"]) > 30]
        return candidates

    # Otherwise, group consecutive high-scoring sentences into directive blocks
    candidates = []
    current_block = None

    for sent in scored:
        if sent["score"] >= DIRECTIVE_SCORE_THRESHOLD:
            if current_block is None:
                current_block = {
                    "text": sent["text"],
                    "start": sent["start"],
                    "end": sent["end"],
                    "score": sent["score"],
                }
            else:
                current_block["text"] += " " + sent["text"]
                current_block["end"] = sent["end"]
                current_block["score"] = max(current_block["score"], sent["score"])
        else:
            # A non-directive sentence that immediately follows a directive block
            # might be a continuation (condition clause, etc.)
            if current_block is not None and sent["score"] >= 1:
                current_block["text"] += " " + sent["text"]
                current_block["end"] = sent["end"]
            else:
                if current_block is not None:
                    candidates.append(current_block)
                    current_block = None

    if current_block is not None:
        candidates.append(current_block)

    # If no candidates found, try lowering threshold
    if not candidates:
        for sent in scored:
            if sent["score"] >= 1:
                candidates.append(sent)

    return candidates


def _extract_fields(
    candidate: dict,
    judgment_date: Optional[str],
    pages_data: list[dict],
    section_confidence: float,
) -> Optional[dict]:
    """Pass 2 & 3: Extract structured fields and compute confidence."""
    text = candidate["text"]

    # Main action
    main_action = _extract_main_action(text)

    # Conditions
    conditions = _extract_conditions(text)

    # Deadline
    deadline_text = None
    deadline_match = DEADLINE_PATTERN.search(text)
    if deadline_match:
        deadline_text = deadline_match.group(0).strip()

    resolved_deadline = None
    deadline_confidence = 0.0
    if deadline_text:
        result = resolve_deadline(deadline_text, judgment_date)
        resolved_deadline = result.get("deadline")
        deadline_confidence = result.get("confidence", 0.0)

    # Responsible entity
    responsible_entity = _extract_responsible_entity(text)
    responsible_department = map_to_department(responsible_entity)

    # Source page
    source_page = _find_source_page(text, pages_data)

    # OCR confidence for source page
    page_confidence = 1.0
    if pages_data and source_page:
        for p in pages_data:
            if p["page_number"] == source_page:
                page_confidence = p.get("confidence", 1.0)
                break

    # Pass 3: Confidence scoring
    confidence = _compute_confidence(
        has_directive_verb=bool(STRONG_DIRECTIVE_VERBS.search(text)),
        has_deadline=deadline_text is not None,
        has_responsible_party=responsible_entity is not None,
        section_confidence=section_confidence,
        page_confidence=page_confidence,
    )

    review_status = "auto_accepted" if confidence >= 0.6 else "needs_review"

    return {
        "directive_text": text.strip(),
        "main_action": main_action,
        "conditions": conditions,
        "deadline": resolved_deadline,
        "deadline_text": deadline_text,
        "responsible_department": responsible_department,
        "responsible_entity": responsible_entity,
        "source_page": source_page,
        "source_text": text[:500],
        "confidence": round(confidence, 3),
        "review_status": review_status,
    }


def _extract_main_action(text: str) -> Optional[str]:
    """Extract the core action from a directive sentence using spaCy dep parsing."""
    if nlp:
        doc = nlp(text[:5000])
        for token in doc:
            if token.dep_ == "ROOT" and token.pos_ == "VERB":
                # Get the verb and its direct objects
                objects = [child.text for child in token.children if child.dep_ in ("dobj", "attr", "oprd")]
                if objects:
                    return f"{token.lemma_} {' '.join(objects)}"
                return token.lemma_

    # Fallback: regex for common patterns
    patterns = [
        r"(?:directed|ordered)\s+to\s+(.+?)(?:\.|;|,\s*(?:within|before|by))",
        r"shall\s+(.+?)(?:\.|;|,\s*(?:within|before|by))",
        r"must\s+(.+?)(?:\.|;|,\s*(?:within|before|by))",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            action = match.group(1).strip()
            if len(action) > 200:
                action = action[:200] + "..."
            return action

    return None


def _extract_conditions(text: str) -> list[str]:
    """Extract conditional clauses from directive text."""
    conditions = []
    for match in CONDITION_PATTERN.finditer(text):
        cond = match.group(1).strip()
        if len(cond) > 10:  # Skip very short fragments
            conditions.append(cond[:300])
    return conditions


def _extract_responsible_entity(text: str) -> Optional[str]:
    """Extract the entity responsible for carrying out the directive."""
    match = RESPONSIBLE_ENTITY_PATTERN.search(text)
    if match:
        entity = match.group(0).strip()
        # Clean up
        entity = re.sub(r'^the\s+', '', entity, flags=re.IGNORECASE)
        return entity

    # Fallback: look for ORG entities near directive verbs using spaCy
    if nlp:
        doc = nlp(text[:5000])
        for ent in doc.ents:
            if ent.label_ == "ORG":
                return ent.text

    return None


def _find_source_page(directive_text: str, pages_data: list[dict]) -> Optional[int]:
    """Determine which page a directive appears on."""
    if not pages_data:
        return None

    # Search for the first 50 chars of the directive in each page
    search_text = directive_text[:50].lower()
    for page in pages_data:
        if search_text in page["text"].lower():
            return page["page_number"]

    # Fallback: last page
    return pages_data[-1]["page_number"] if pages_data else None


def _compute_confidence(
    has_directive_verb: bool,
    has_deadline: bool,
    has_responsible_party: bool,
    section_confidence: float,
    page_confidence: float,
) -> float:
    """Composite confidence score (0.0 to 1.0)."""
    score = 0.0
    if has_directive_verb:
        score += 0.30
    if has_deadline:
        score += 0.20
    if has_responsible_party:
        score += 0.20
    score += 0.15 * min(section_confidence, 1.0)
    score += 0.15 * min(page_confidence, 1.0)
    return min(score, 1.0)
