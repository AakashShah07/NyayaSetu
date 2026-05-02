import spacy
from app.config import SPACY_MODEL

nlp = None


def load_model():
    global nlp
    try:
        nlp = spacy.load(SPACY_MODEL)
        return True
    except OSError:
        return False


def is_model_loaded():
    return nlp is not None


def extract_entities(text: str) -> dict:
    """Extract named entities from text using spaCy."""
    if not nlp:
        return {"entities": [], "total": 0}

    # Limit text length for performance
    doc = nlp(text[:100000])

    entities = []
    for ent in doc.ents:
        entities.append({
            "text": ent.text,
            "label": ent.label_,
            "start": ent.start_char,
            "end": ent.end_char,
        })

    return {"entities": entities, "total": len(entities)}
