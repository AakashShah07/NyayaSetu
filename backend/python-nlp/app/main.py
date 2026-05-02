from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.routers import health
from app.services.ocr_service import extract_text_from_pdf
from app.services.nlp_service import load_model, extract_entities
from app.config import PORT

app = FastAPI(title="NyayaSetu NLP Service", version="0.1.0")

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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
