# NyayaSetu - AI-Powered Court Order Compliance Tracker

An intelligent compliance tracking dashboard that extracts directives and deadlines from Indian court judgment PDFs using NLP, then provides a live dashboard for government departments to track and fulfill their obligations.

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React +    │────▶│   Node.js API    │────▶│  Python NLP     │
│   Tailwind   │     │   (Express 5)    │     │  (FastAPI)      │
│   Port 5173  │     │   Port 5000      │     │  Port 8001      │
└──────────────┘     └────────┬─────────┘     └─────────────────┘
                              │                        │
                              ▼                        ▼
                     ┌──────────────────┐     ┌─────────────────┐
                     │   MongoDB 7      │     │  Tesseract OCR  │
                     │   (8 collections)│     │  + spaCy NER    │
                     └──────────────────┘     └─────────────────┘
```

## Features

### Core
- **PDF Upload & NLP Extraction** — Upload court judgments, auto-extract directives using OCR + pattern matching
- **Directive Parsing** — Identifies orders, deadlines, responsible departments with confidence scores
- **Task Management** — Create tasks from directives, assign to officers, track status
- **Smart Alerts** — Hourly deadline checks, auto-escalation, email notifications
- **Role-Based Access** — Admin, Department Head, Officer with scoped permissions

### Dashboard
- **Analytics** — Compliance rate trends, department performance, task distribution charts (Recharts)
- **Calendar View** — Monthly/weekly calendar of all deadlines (react-big-calendar)
- **Reports & PDF Export** — Generate compliance reports, download as PDF (jsPDF)
- **Audit Trail** — Immutable log of all system actions (admin only)
- **Collaborative Comments** — Thread-based comments on tasks/judgments with @mentions

### Technical
- JWT auth with token rotation (access + refresh)
- Real-time notification bell with unread count
- Dark mode support
- Lazy-loaded routes (304KB initial bundle)
- Docker Compose for one-command deployment
- Swagger/OpenAPI docs at `/api/docs`
- 74 automated tests (28 Node.js + 46 Python)

## Quick Start

### Option 1: Docker (Recommended)
```bash
docker-compose up --build
# Frontend: http://localhost
# API: http://localhost:5000
# API Docs: http://localhost:5000/api/docs
```

### Option 2: Local Development

**Prerequisites:** Node.js 18+, Python 3.10+, MongoDB 7+, Tesseract OCR

```bash
# 1. Node API
cd backend/node-api
cp .env.example .env    # Configure MongoDB URI, JWT secret
npm install && npm run dev

# 2. Python NLP
cd backend/python-nlp
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl
uvicorn app.main:app --reload --port 8001

# 3. Frontend
cd frontend
npm install && npm run dev
```

### Demo: See NLP in Action
```bash
cd backend/python-nlp && source .venv/bin/activate
python ../../scripts/demo_extraction.py
# Extracts 8 directives from sample Karnataka HC judgment (0.92 confidence)
```

## Project Structure

```
NyayaSetu/
├── backend/
│   ├── node-api/              # Express 5 REST API
│   │   ├── src/
│   │   │   ├── controllers/   # 8 controllers (auth, task, judgment, etc.)
│   │   │   ├── models/        # 8 Mongoose models
│   │   │   ├── routes/        # 12 route files with Swagger annotations
│   │   │   ├── services/      # Alert scheduler, extraction queue, email
│   │   │   └── middleware/    # Auth, audit logger, rate limiter, upload
│   │   └── tests/             # Jest + supertest (28 tests)
│   └── python-nlp/            # FastAPI NLP microservice
│       ├── app/services/      # OCR, NER, directive extraction, deadline resolver
│       └── tests/             # pytest (46 tests)
├── frontend/                  # React 19 + Vite + Tailwind v4
│   └── src/
│       ├── pages/             # 15 page components (lazy-loaded)
│       ├── components/        # 30+ reusable components
│       ├── api/               # Axios API clients
│       └── context/           # Auth, Theme, Sidebar contexts
├── scripts/
│   └── demo_extraction.py     # NLP demo script
├── docker-compose.yml         # One-command deployment
└── data/                      # Sample judgments + extraction output
```

## API Endpoints

| Group | Endpoints | Description |
|-------|-----------|-------------|
| `/api/auth` | POST login, register, refresh | JWT authentication |
| `/api/judgments` | CRUD + upload, bulk-upload | Court judgment management |
| `/api/directives` | CRUD + date range filter | Extracted directives |
| `/api/tasks` | CRUD + reassign | Compliance tasks |
| `/api/analytics` | overview, compliance, departments | Dashboard analytics |
| `/api/reports` | department, case | Compliance reports |
| `/api/notifications` | list, unread-count, mark-read | Alert notifications |
| `/api/comments` | CRUD + mentions | Collaborative comments |
| `/api/audit-logs` | list, by-entity (admin) | Activity audit trail |
| `/api/nlp` | extract, queue-status | NLP extraction triggers |
| `/api/docs` | Swagger UI | Interactive API docs |

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@nyayasetu.gov.in` | `admin12345` |
| Officer | `sharma@environment.gov.in` | `officer12345` |

## Running Tests

```bash
# Node.js API tests (28 tests)
cd backend/node-api && npm test

# Python NLP tests (46 tests)
cd backend/python-nlp && source .venv/bin/activate && pytest tests/ -v
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Recharts, jsPDF |
| Backend | Node.js, Express 5, Mongoose 9, JWT, node-cron |
| NLP | Python 3.10, FastAPI, spaCy, Tesseract OCR, PyPDF2 |
| Database | MongoDB 7 (8 collections, indexed) |
| DevOps | Docker Compose, Nginx, multi-stage builds |
| Testing | Jest, supertest, pytest, mongodb-memory-server |

## License

MIT
