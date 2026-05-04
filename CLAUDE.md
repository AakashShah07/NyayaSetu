# NyayaSetu - Claude Code Context

## Project Overview
AI-Powered Court Order Compliance Tracking Dashboard for Indian government departments. Extracts directives/deadlines from court judgment PDFs using NLP and provides a live compliance tracking dashboard.

## Architecture
- **Node.js API** (Express 5, port 5000) — REST API with JWT auth, CRUD, file upload, Swagger docs
- **Python NLP Service** (FastAPI, port 8001) — PDF text extraction (PyPDF2 + Tesseract OCR), NER (spaCy), directive extraction
- **MongoDB** — Database (Mongoose 9 ODM, 8 collections)
- **React + Tailwind v4** — Frontend dashboard (Vite, lazy-loaded routes)
- **Docker Compose** — One-command deployment (MongoDB + Node + Python + Nginx)

## Project Structure
```
NyayaSetu/
├── backend/
│   ├── node-api/              # Express 5 REST API
│   │   ├── src/
│   │   │   ├── server.js      # Entry point
│   │   │   ├── app.js         # Express app, middleware, routes, Swagger
│   │   │   ├── config/        # db.js, env.js, swagger.js
│   │   │   ├── middleware/    # auth, errorHandler, rateLimiter, validate, upload, auditLogger
│   │   │   ├── models/        # User, Judgment, Directive, Task, StatusUpdate, Notification, AuditLog, Comment
│   │   │   ├── routes/        # 12 route files (auth, judgment, directive, task, statusUpdate, user, nlp, notification, analytics, report, auditLog, comment)
│   │   │   ├── controllers/   # Business logic for each route
│   │   │   ├── services/      # alertScheduler, emailService, escalationService, extractionQueue, extraction.service
│   │   │   ├── validators/    # express-validator rules
│   │   │   └── utils/         # apiResponse.js, nlpBridge.js
│   │   ├── tests/             # Jest + supertest (28 tests)
│   │   ├── uploads/           # Stored PDF files
│   │   └── Dockerfile
│   └── python-nlp/            # FastAPI NLP microservice
│       ├── app/
│       │   ├── main.py        # FastAPI app
│       │   ├── services/      # ocr_service, nlp_service, directive_extractor, deadline_resolver, legal_ner, section_detector, image_preprocessor
│       │   ├── routers/       # health.py
│       │   └── schemas/       # Pydantic models
│       ├── tests/             # pytest (46 tests)
│       └── Dockerfile
├── frontend/                  # React 19 + Vite + Tailwind v4
│   ├── src/
│   │   ├── pages/             # 15 lazy-loaded page components
│   │   ├── components/        # layout/, dashboard/, judgments/, tasks/, notifications/, analytics/, reports/, calendar/, audit/, comments/, admin/, ui/
│   │   ├── api/               # Axios API clients (12 files)
│   │   ├── context/           # AuthContext, ThemeContext, SidebarContext
│   │   ├── hooks/             # useApi, useDebounce, usePagination
│   │   └── utils/             # constants, formatters, pdfExport, calendarHelpers
│   ├── Dockerfile + nginx.conf
│   └── vite.config.js         # Proxy /api → localhost:5000
├── scripts/
│   └── demo_extraction.py     # NLP pipeline demo
├── docker-compose.yml         # Full stack deployment
├── data/                      # Sample PDFs + extraction output
└── docs/                      # API_CURL_SAMPLES.md
```

## Key Technical Details

### Database (MongoDB — 8 collections)
- User, Judgment, Directive, Task, StatusUpdate, Notification, AuditLog, Comment
- Mongoose 9.x — async pre-save hooks do NOT use `next()` callback
- Indexed: status, dueDate, assignedTo, department, deadline, createdAt

### Authentication
- JWT-based with access token (7d) + refresh token (30d) rotation
- Roles: `admin`, `department_head`, `officer`
- Departments: `Social Welfare`, `Environment`, `Police`, `General`
- Password hashing: bcryptjs (10 salt rounds)
- Auth middleware: `protect` and `authorize(...roles)`

### API Response Format
All endpoints return: `{ "success": true/false, "message": "...", "data": {...}, "pagination": {...} }`

### Frontend API Client Pattern
- `api/client.js` — Axios instance, returns raw axios response
- Some API files (tasks, directives, judgments, users, notifications, nlp) unwrap: `.then(r => r.data)` → returns `{success, data, pagination}`
- Other API files (analytics, reports, auditLogs, comments) do NOT unwrap → use `res.data.data` to access data

### Swagger API Docs
- Available at `http://localhost:5000/api/docs`
- JSON spec at `http://localhost:5000/api/docs.json`

### Docker Deployment
```bash
docker-compose up --build
# Frontend: http://localhost (Nginx)
# API: http://localhost:5000
# NLP: http://localhost:8001
```

## Development

### Running locally
```bash
# Terminal 1 — Node API
cd backend/node-api && npm run dev

# Terminal 2 — Python NLP
cd backend/python-nlp && source .venv/bin/activate
uvicorn app.main:app --reload --port 8001

# Terminal 3 — Frontend
cd frontend && npm run dev
```

### Prerequisites
- Node.js 18+, Python 3.10+, MongoDB 7+ running
- Tesseract OCR: `sudo apt install tesseract-ocr`
- spaCy model: `pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl`

### Test credentials
- Admin: `admin@nyayasetu.gov.in` / `admin12345`
- Officer: `sharma@environment.gov.in` / `officer12345`

### Running tests
```bash
cd backend/node-api && npm test          # 28 tests (Jest)
cd backend/python-nlp && pytest tests/ -v # 46 tests (pytest)
```

### Demo NLP extraction
```bash
cd backend/python-nlp && source .venv/bin/activate
python ../../scripts/demo_extraction.py
# Outputs: 8 directives, 0.92 avg confidence from sample PDF
```

## Current Status
- **Phase 1-5**: Complete (API, NLP, Frontend, Integration, Alerts)
- **Phase 6**: Complete (Analytics, Reports, Calendar, Audit Trail, Comments)
- **Infrastructure**: Docker Compose, Swagger docs, lazy loading, 74 tests

## Git
- Remote: `https://github.com/AakashShah07/NyayaSetu.git`
- Branch: `master`

## Conventions
- Controllers use try/catch with `next(err)` for error propagation
- All list endpoints support `?page=1&limit=20&sort=-createdAt`
- Admin-only routes use `authorize('admin')` middleware
- File uploads: PDF only, 10MB max, stored in `backend/node-api/uploads/`
- Audit logging: auto-logged via middleware on task/directive CUD operations
- Frontend: Card, Badge (color prop not variant), Pagination (page/pages props)
