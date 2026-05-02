import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", "8001"))
TESSERACT_CMD = os.getenv("TESSERACT_CMD", "/usr/bin/tesseract")
SPACY_MODEL = os.getenv("SPACY_MODEL", "en_core_web_sm")
LOG_LEVEL = os.getenv("LOG_LEVEL", "debug")
