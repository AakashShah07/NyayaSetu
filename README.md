# NyayaSetu - Court Order Compliance Tracker

AI-Powered Court Order Compliance Tracking Dashboard for government departments.

## Project Structure

```
NyayaSetu/
├── backend/
│   ├── node-api/        # Express.js REST API (port 5000)
│   └── python-nlp/      # FastAPI NLP service (port 8001)
├── frontend/            # React dashboard (coming soon)
├── data/                # Sample court judgments
└── docs/                # Documentation
```

## Quick Start

### Node API
```bash
cd backend/node-api
cp .env.example .env
npm install
npm run dev
```

### Python NLP Service
```bash
cd backend/python-nlp
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --port 8001
```

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB 7+
- Tesseract OCR (`sudo apt install tesseract-ocr`)

## Tech Stack
- **Backend**: Node.js + Express, Python + FastAPI
- **Database**: MongoDB + Mongoose
- **NLP**: spaCy, Tesseract OCR, PyPDF2
- **Frontend**: React + Tailwind CSS (Phase 3)
