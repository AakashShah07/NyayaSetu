# NyayaSetu - Project Phase Tracker

## Current Phase: PHASE 1 - Project Setup & Foundation

---

## PHASE 1: Project Setup & Foundation
**Status**: [ ] Not Started
**Duration**: Week 1-2
**Hours**: ~40 hours

### Functionality:
- [ ] Initialize monorepo project structure
- [ ] Setup Node.js + Express backend server
- [ ] Setup Python NLP microservice (FastAPI)
- [ ] Configure MongoDB connection and schemas
- [ ] Design database collections (judgments, directives, tasks, users, status_updates)
- [ ] Implement JWT authentication (register, login, token refresh)
- [ ] Setup file upload handler (Multer for PDF storage)
- [ ] Create basic CRUD API endpoints for all collections
- [ ] Setup CORS, rate limiting, and security middleware
- [ ] Configure environment variables (.env setup)
- [ ] Setup Tesseract OCR installation and verification
- [ ] Install and configure spaCy / transformers in Python service
- [ ] Create HTTP bridge between Node API and Python NLP service
- [ ] Setup development scripts (dev, build, start)
- [ ] Add basic request validation and error response format

### Deliverable:
Server running on localhost, accepts PDF upload, basic CRUD endpoints working, Python NLP service responds to health checks.

---

## PHASE 2: NLP Extraction Engine
**Status**: [ ] Not Started
**Duration**: Week 3-4
**Hours**: ~50 hours

### Functionality:
- [ ] PDF text extraction from digital PDFs (PyPDF2)
- [ ] PDF text extraction from scanned PDFs (Tesseract OCR)
- [ ] Handle poor quality scanned documents with image preprocessing
- [ ] Preserve page structure and numbering during extraction
- [ ] Extract text with confidence scores per page
- [ ] Named Entity Recognition (NER) setup with spaCy
- [ ] Extract court name and case number
- [ ] Extract filing date and judgment date
- [ ] Extract parties (plaintiff, defendant, government agency)
- [ ] Extract judge names
- [ ] Extract monetary amounts (fines, compensation)
- [ ] Directive extraction - identify order section of judgment
- [ ] Parse main directives ("The court orders that...")
- [ ] Parse supporting conditions ("provided that...", "unless...")
- [ ] Extract deadlines ("within 30 days", "by 15th June", "forthwith")
- [ ] Extract responsible party ("Department of X shall...")
- [ ] Convert relative deadlines to absolute dates
- [ ] Confidence scoring (0-1.0) for each extracted field
- [ ] Flag low-confidence extractions (<0.90) for manual review
- [ ] Output structured JSON with all extracted data
- [ ] Train/test on 10-15 real Karnataka High Court judgments
- [ ] Build test suite for extraction accuracy measurement
- [ ] Handle multiple directives within a single judgment
- [ ] Handle multi-page judgments (50+ pages)

### Deliverable:
Python service reads PDF, outputs structured JSON with 90%+ accuracy on test dataset.

---

## PHASE 3: Frontend Dashboard - Core UI
**Status**: [ ] Not Started
**Duration**: Week 5-6
**Hours**: ~60 hours

### Functionality:
- [ ] React project setup with Tailwind CSS
- [ ] Routing setup (React Router)
- [ ] Login page (department login + officer login)
- [ ] Role-based access control (Admin, Department Head, Officer)
- [ ] Protected routes based on user role
- [ ] Sidebar navigation component
- [ ] Header with user info and notifications bell

#### Overview Dashboard Tab:
- [ ] Summary cards - On Schedule (green) / At Risk (yellow) / Overdue (red) / Completed (blue)
- [ ] Total orders count with breakdown
- [ ] Upcoming deadlines this week widget
- [ ] Recent activity feed
- [ ] Quick stats bar (compliance rate percentage)

#### All Orders View:
- [ ] Orders table with columns: Case ID, Directive, Department, Deadline, Status, Last Updated
- [ ] Filter by department
- [ ] Filter by status (Not Started, In Progress, Completed, Overdue)
- [ ] Filter by deadline range (Due This Week, This Month, Overdue)
- [ ] Sort by deadline, last updated, case ID
- [ ] Search by case ID or keyword
- [ ] Pagination

#### Order Details View:
- [ ] Full judgment text display with highlighted extracted sections
- [ ] Extracted directive summary card
- [ ] Deadline display with countdown (days remaining)
- [ ] Responsible officer info (name, email, department)
- [ ] Current status badge
- [ ] Status history timeline (Created -> Started -> Draft Ready -> Submitted)
- [ ] Upload evidence documents (PDF, images)
- [ ] Add notes/comments section
- [ ] Status update button (change status with note)

#### Upload Judgment Page:
- [ ] PDF file upload with drag-and-drop
- [ ] Upload progress indicator
- [ ] Extraction processing status
- [ ] Preview extracted directives before confirmation
- [ ] Edit extracted fields if AI got it wrong
- [ ] Confirm and create tasks

#### UI/UX:
- [ ] Dark blue/white government-style color scheme
- [ ] Clear typography hierarchy
- [ ] Mobile-responsive layout (officers check on phone)
- [ ] Loading states and skeleton screens
- [ ] Toast notifications for actions
- [ ] Empty states for no data

### Deliverable:
Fully functional React dashboard connected to backend API.

---

## PHASE 4: Integration & End-to-End Flow
**Status**: [ ] Not Started
**Duration**: Week 7-8
**Hours**: ~40 hours

### Functionality:

#### Full Pipeline:
- [ ] Upload PDF -> Backend receives -> Calls Python NLP -> Extracts directives -> Stores in MongoDB -> Dashboard updates
- [ ] Real-time dashboard updates (WebSocket or polling)
- [ ] Email notification to responsible officer on new task assignment
- [ ] Bulk upload (upload multiple judgments at once)
- [ ] Processing queue for multiple PDFs

#### Error Handling:
- [ ] Invalid/corrupt PDF error message
- [ ] Unsupported file format rejection
- [ ] OCR failure fallback (manual text entry)
- [ ] Low confidence extraction flag and manual review interface
- [ ] Missing deadline info escalation to admin
- [ ] Network error retry logic
- [ ] API timeout handling
- [ ] File size limit enforcement (10 MB max)

#### Admin Features:
- [ ] Admin dashboard with system-wide view
- [ ] Manual verification interface for low-confidence extractions
- [ ] Edit extracted directive fields
- [ ] Reassign task to different department/officer
- [ ] Delete or archive orders
- [ ] User management (create/edit/deactivate accounts)
- [ ] Department management (add/edit departments)
- [ ] System health monitoring (extraction queue, error rates)

#### Testing:
- [ ] Test with 20-30 real court judgments
- [ ] Measure extraction accuracy per field
- [ ] Test different judgment formats (old templates, new templates)
- [ ] Test dashboard responsiveness on mobile/tablet
- [ ] Load testing with 50+ concurrent orders
- [ ] API endpoint testing (unit + integration)
- [ ] Frontend component testing

### Deliverable:
End-to-end system working: upload -> extract -> dashboard shows task -> department tracks progress.

---

## PHASE 5: Smart Alerts & Escalation
**Status**: [ ] Not Started
**Duration**: Week 9 (first half)
**Hours**: ~15 hours

### Functionality:

#### Alert System:
- [ ] 30 days before deadline: Low priority email reminder
- [ ] 10 days before deadline: Medium priority dashboard notification
- [ ] 5 days before deadline: High priority email + SMS + dashboard alert
- [ ] At deadline: Critical - escalate to Commissioner
- [ ] After deadline: Mark overdue, notify Chief Secretary
- [ ] Custom alert rules per department
- [ ] Snooze/dismiss notification option
- [ ] Alert history log

#### Escalation Engine:
- [ ] Auto-escalation rules based on deadline proximity
- [ ] Escalation chain: Officer -> Department Head -> Commissioner -> Chief Secretary
- [ ] Manual escalation option
- [ ] Escalation audit trail
- [ ] De-escalation when task is completed

#### Notification Channels:
- [ ] In-app dashboard notifications
- [ ] Email notifications (SendGrid/Mailgun integration)
- [ ] SMS notifications (Twilio integration - optional)
- [ ] Daily digest email (summary of pending tasks)
- [ ] Weekly compliance summary to department heads

### Deliverable:
Automated alert system with multi-level escalation working end-to-end.

---

## PHASE 6: Compliance Reports & Certificates
**Status**: [ ] Not Started
**Duration**: Week 9-10 (second half)
**Hours**: ~20 hours

### Functionality:

#### Compliance Reports:
- [ ] Monthly compliance report by department
- [ ] Compliance percentage calculation (on schedule / at risk / overdue)
- [ ] Department-wise performance comparison
- [ ] Officer-level task completion report
- [ ] Overdue orders report with reasons
- [ ] Historical compliance trends (month over month)

#### Court-Ready Compliance Certificate:
- [ ] Auto-generate compliance certificate per case
- [ ] Include: case ID, directive, deadline, completion date, evidence links
- [ ] Include: full audit trail with timestamps
- [ ] Include: officer verification and digital signature placeholder
- [ ] Export as PDF for court submission
- [ ] Export as CSV for data analysis
- [ ] Batch export for multiple cases

#### Department-Specific Dashboard:
- [ ] Department-scoped view (see only own orders)
- [ ] Officer workload distribution
- [ ] Department compliance rate
- [ ] Time-to-completion tracking per officer
- [ ] Department head summary view

### Deliverable:
Court-ready compliance reports and department-specific dashboards.

---

## PHASE 7: Analytics & Insights
**Status**: [ ] Not Started
**Duration**: Week 10 (optional)
**Hours**: ~15 hours

### Functionality:
- [ ] Average completion time per department
- [ ] Average completion time per directive type
- [ ] Most common directive types (pie chart)
- [ ] Department performance ranking (leaderboard)
- [ ] Deadline miss rate trends (line chart over months)
- [ ] Order volume trends (bar chart)
- [ ] Officer productivity metrics
- [ ] Compliance rate over time
- [ ] Heatmap of overdue orders by department
- [ ] Predictive deadline risk scoring (based on historical data)
- [ ] Interactive charts (Chart.js / Recharts)
- [ ] Date range selector for all analytics
- [ ] Export analytics as PDF/image

### Deliverable:
Analytics dashboard with charts, trends, and department performance insights.

---

## PHASE 8: Deployment & Infrastructure
**Status**: [ ] Not Started
**Duration**: Week 11
**Hours**: ~15 hours

### Functionality:
- [ ] Deploy Node.js API (Heroku / Railway / AWS)
- [ ] Deploy Python NLP microservice (Render / AWS Lambda)
- [ ] Deploy React frontend (Vercel)
- [ ] Setup MongoDB Atlas (cloud database)
- [ ] Configure production environment variables
- [ ] Setup SSL/HTTPS
- [ ] Configure custom domain (if available)
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Database backup strategy (daily automated backups)
- [ ] Logging and monitoring setup (error tracking)
- [ ] Rate limiting and DDoS protection
- [ ] File storage for uploaded PDFs (AWS S3 / Cloudinary)
- [ ] Health check endpoints for all services
- [ ] Docker containerization (optional)

### Deliverable:
All services deployed, accessible via public URL, production-ready.

---

## PHASE 9: Documentation & Pilot Preparation
**Status**: [ ] Not Started
**Duration**: Week 12
**Hours**: ~15 hours

### Functionality:

#### Documentation:
- [ ] README with setup instructions (how to run locally)
- [ ] API documentation (all endpoints with examples)
- [ ] Database schema documentation
- [ ] Architecture diagram
- [ ] User manual for department officers
- [ ] Admin manual for compliance officers
- [ ] Troubleshooting guide

#### Pilot Setup:
- [ ] Create test accounts for 3 departments (Social Welfare, Environment, Police)
- [ ] Upload 20-30 sample Karnataka High Court judgments
- [ ] Verify all extractions are accurate
- [ ] Setup demo data with various statuses
- [ ] Configure alert schedules for pilot

#### Training Materials:
- [ ] 5-minute video walkthrough script
- [ ] Step-by-step PDF user guide with screenshots
- [ ] FAQ document
- [ ] Quick reference card (1-page cheat sheet)

#### Pilot Testing Plan:
- [ ] Define success criteria
- [ ] Feedback collection mechanism
- [ ] Bug reporting process
- [ ] Weekly check-in schedule with pilot departments
- [ ] Rollback plan if issues arise

### Deliverable:
Complete documentation, pilot accounts ready, training materials prepared.

---

## PHASE SUMMARY

| Phase | Name | Weeks | Hours | Status |
|-------|------|-------|-------|--------|
| 1 | Project Setup & Foundation | 1-2 | 40h | Not Started |
| 2 | NLP Extraction Engine | 3-4 | 50h | Not Started |
| 3 | Frontend Dashboard - Core UI | 5-6 | 60h | Not Started |
| 4 | Integration & End-to-End Flow | 7-8 | 40h | Not Started |
| 5 | Smart Alerts & Escalation | 9 | 15h | Not Started |
| 6 | Compliance Reports & Certificates | 9-10 | 20h | Not Started |
| 7 | Analytics & Insights | 10 | 15h | Not Started |
| 8 | Deployment & Infrastructure | 11 | 15h | Not Started |
| 9 | Documentation & Pilot Preparation | 12 | 15h | Not Started |
| **Total** | | **12 weeks** | **~270h** | |

---

## HOW TO UPDATE

When starting a phase, update:
1. `Current Phase` at the top of this file
2. Change `Status` of that phase to `[x] In Progress`
3. Check off individual tasks as they are completed
4. When all tasks are done, change `Status` to `[x] Completed`
5. Update the summary table at the bottom
