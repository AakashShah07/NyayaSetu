# NyayaSetu - Claude Code Context

## Project Overview
AI-Powered Court Order Compliance Tracking Dashboard for Indian government departments. Extracts directives/deadlines from court judgment PDFs using NLP and provides a live compliance tracking dashboard.

## Architecture
- **Node.js API** (Express, port 5000) — Main REST API with JWT auth, CRUD, file upload
- **Python NLP Service** (FastAPI, port 8001) — PDF text extraction (PyPDF2 + Tesseract OCR), NER (spaCy)
- **MongoDB** — Database (Mongoose ODM)
- **React + Tailwind** — Frontend dashboard (not yet built)

## Project Structure
```
NyayaSetu/
├── backend/
│   ├── node-api/              # Express REST API
│   │   ├── src/
│   │   │   ├── server.js      # Entry point
│   │   │   ├── app.js         # Express app, middleware, route mounting
│   │   │   ├── config/        # db.js, env.js
│   │   │   ├── middleware/    # auth, errorHandler, rateLimiter, validate, upload
│   │   │   ├── models/        # User, Judgment, Directive, Task, StatusUpdate
│   │   │   ├── routes/        # auth, judgment, directive, task, statusUpdate, user, nlp
│   │   │   ├── controllers/   # Business logic for each route
│   │   │   ├── validators/    # express-validator rules
│   │   │   └── utils/         # apiResponse.js, nlpBridge.js
│   │   └── uploads/           # Stored PDF files
│   └── python-nlp/            # FastAPI NLP microservice
│       └── app/
│           ├── main.py        # FastAPI app with /extract/text, /extract/entities, /health
│           ├── config.py      # Environment config
│           ├── services/      # ocr_service.py, nlp_service.py
│           ├── routers/       # health.py
│           └── schemas/       # Pydantic models
├── frontend/                  # React dashboard (Phase 3 — not started)
├── data/                      # Sample court judgment PDFs
├── docs/                      # API_CURL_SAMPLES.md
├── Solution.md                # Problem statement and solution design
├── Implement.md               # 12-week implementation plan
└── PROJECT_PHASES.md          # Phase tracker with checkboxes
```

## Key Technical Details

### Database (MongoDB)
- **5 collections**: User, Judgment, Directive, Task, StatusUpdate
- Mongoose 9.x — async pre-save hooks do NOT use `next()` callback
- Connection string in `.env` → `MONGODB_URI`

### Authentication
- JWT-based with access token (7d) + refresh token (30d) rotation
- Roles: `admin`, `department_head`, `officer`
- Departments: `Social Welfare`, `Environment`, `Police`, `General`
- Password hashing: bcryptjs (10 salt rounds)
- Auth middleware at `src/middleware/auth.js` — `protect` and `authorize(...roles)`

### API Response Format
All endpoints return:
```json
{ "success": true/false, "message": "...", "data": {...}, "pagination": {...} }
```
Errors include: `{ "error": { "code": "...", "details": [...] } }`

### Node-Python Bridge
- `src/utils/nlpBridge.js` — Axios client calling Python service
- PDF sent as multipart form data, 60s timeout
- Flow: Upload PDF → POST /api/nlp/extract/:judgmentId → Python extracts text → stores in Judgment.extractedText

### Express 5.x
- Installed version is Express 5 (not 4) — no `app.del()`, use `app.delete()`
- Error handling works the same way with `(err, req, res, next)` middleware

## Development

### Running locally
```bash
# Terminal 1 — Node API
cd backend/node-api && npm run dev

# Terminal 2 — Python NLP
cd backend/python-nlp && source .venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

### Prerequisites
- Node.js 18+, Python 3.10+, MongoDB running
- Tesseract OCR: `sudo apt install tesseract-ocr`
- spaCy model: `python -m spacy download en_core_web_sm`

### Test credentials
- Admin: `admin@nyayasetu.gov.in` / `admin12345`
- Officer: `sharma@environment.gov.in` / `officer12345`

## Current Status
- **Phase 1**: Complete (project setup, API, auth, CRUD, NLP service)
- **Phase 2**: Not started (NLP extraction engine — directive/deadline parsing)
- **Phase 3**: Not started (React frontend dashboard)

## Git
- Remote: `https://github.com/AakashShah07/NyayaSetu.git`
- Branch: `master`
- Push after each step/phase completion

## Conventions
- Controllers use try/catch with `next(err)` for error propagation
- All list endpoints support `?page=1&limit=20&sort=-createdAt`
- Admin-only routes use `authorize('admin')` middleware
- File uploads: PDF only, 10MB max, stored in `backend/node-api/uploads/`
