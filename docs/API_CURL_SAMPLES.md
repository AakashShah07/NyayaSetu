# NyayaSetu API - Sample Curl Commands & Responses

> Base URL: `http://localhost:5000`
> All protected endpoints require: `-H "Authorization: Bearer <TOKEN>"`

---

## 1. Health Check

```bash
curl -s http://localhost:5000/api/health
```

**Response (200):**
```json
{
    "success": true,
    "message": "NyayaSetu API is running"
}
```

---

## 2. Authentication

### 2.1 Register

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@nyayasetu.gov.in",
    "password": "admin12345",
    "role": "admin",
    "department": "General",
    "phone": "9876543210"
  }'
```

**Response (201):**
```json
{
    "success": true,
    "message": "Registration successful",
    "data": {
        "user": {
            "name": "Admin User",
            "email": "admin@nyayasetu.gov.in",
            "role": "admin",
            "department": "General",
            "phone": "9876543210",
            "isActive": true,
            "_id": "69f612a2f9a5131ec91665d8",
            "createdAt": "2026-05-02T15:05:06.206Z",
            "updatedAt": "2026-05-02T15:05:06.463Z"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

### 2.2 Register Officer

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sharma",
    "email": "sharma@environment.gov.in",
    "password": "officer12345",
    "role": "officer",
    "department": "Environment"
  }'
```

**Response (201):**
```json
{
    "success": true,
    "message": "Registration successful",
    "data": {
        "user": {
            "name": "Dr. Sharma",
            "email": "sharma@environment.gov.in",
            "role": "officer",
            "department": "Environment",
            "isActive": true,
            "_id": "69f612abf9a5131ec91665d9",
            "createdAt": "2026-05-02T15:05:15.488Z",
            "updatedAt": "2026-05-02T15:05:15.690Z"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

### 2.3 Login

```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nyayasetu.gov.in",
    "password": "admin12345"
  }'
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "_id": "69f612a2f9a5131ec91665d8",
            "name": "Admin User",
            "email": "admin@nyayasetu.gov.in",
            "role": "admin",
            "department": "General",
            "phone": "9876543210",
            "isActive": true,
            "createdAt": "2026-05-02T15:05:06.206Z",
            "updatedAt": "2026-05-02T15:05:26.812Z"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

### 2.4 Refresh Token

```bash
curl -s -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<REFRESH_TOKEN>"
  }'
```

**Response (200):**
```json
{
    "success": true,
    "message": "Token refreshed",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

### 2.5 Get Current User Profile

```bash
curl -s http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "_id": "69f612a2f9a5131ec91665d8",
        "name": "Admin User",
        "email": "admin@nyayasetu.gov.in",
        "role": "admin",
        "department": "General",
        "phone": "9876543210",
        "isActive": true,
        "createdAt": "2026-05-02T15:05:06.206Z",
        "updatedAt": "2026-05-02T15:05:38.653Z"
    }
}
```

---

## 3. Judgments

### 3.1 Upload Judgment PDF

```bash
curl -s -X POST http://localhost:5000/api/judgments/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/judgment.pdf" \
  -F "caseId=HC/KAR/2024/1827" \
  -F "courtName=Karnataka High Court"
```

**Response (201):**
```json
{
    "success": true,
    "message": "Judgment uploaded",
    "data": {
        "caseId": "HC/KAR/2024/1827",
        "courtName": "Karnataka High Court",
        "judges": [],
        "fileUrl": "/home/aakash/Videos/NyayaSetu/backend/node-api/uploads/1777734355408-sample_judgment.pdf",
        "originalFilename": "sample_judgment.pdf",
        "extractionStatus": "pending",
        "uploadedBy": "69f612a2f9a5131ec91665d8",
        "_id": "69f612d3f9a5131ec91665da",
        "createdAt": "2026-05-02T15:05:55.417Z",
        "updatedAt": "2026-05-02T15:05:55.417Z"
    }
}
```

### 3.2 List Judgments (with pagination)

```bash
curl -s "http://localhost:5000/api/judgments?page=1&limit=20" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Judgments retrieved",
    "data": [
        {
            "_id": "69f612d3f9a5131ec91665da",
            "caseId": "HC/KAR/2024/1827",
            "courtName": "Karnataka High Court",
            "judges": [],
            "fileUrl": "...",
            "originalFilename": "sample_judgment.pdf",
            "extractionStatus": "pending",
            "uploadedBy": {
                "_id": "69f612a2f9a5131ec91665d8",
                "name": "Admin User",
                "email": "admin@nyayasetu.gov.in"
            },
            "createdAt": "2026-05-02T15:05:55.417Z",
            "updatedAt": "2026-05-02T15:05:55.417Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "pages": 1
    }
}
```

### 3.3 Get Single Judgment

```bash
curl -s "http://localhost:5000/api/judgments/<JUDGMENT_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "_id": "69f612d3f9a5131ec91665da",
        "caseId": "HC/KAR/2024/1827",
        "courtName": "Karnataka High Court",
        "judges": [],
        "fileUrl": "...",
        "originalFilename": "sample_judgment.pdf",
        "extractionStatus": "pending",
        "uploadedBy": {
            "_id": "69f612a2f9a5131ec91665d8",
            "name": "Admin User",
            "email": "admin@nyayasetu.gov.in"
        },
        "createdAt": "2026-05-02T15:05:55.417Z",
        "updatedAt": "2026-05-02T15:05:55.417Z"
    }
}
```

### 3.4 Update Judgment

```bash
curl -s -X PUT "http://localhost:5000/api/judgments/<JUDGMENT_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "judgmentDate": "2024-03-15T00:00:00.000Z",
    "judges": ["Justice A.B. Kumar"]
  }'
```

**Response (200):**
```json
{
    "success": true,
    "message": "Judgment updated",
    "data": {
        "_id": "69f612d3f9a5131ec91665da",
        "caseId": "HC/KAR/2024/1827",
        "courtName": "Karnataka High Court",
        "judges": ["Justice A.B. Kumar"],
        "fileUrl": "...",
        "originalFilename": "sample_judgment.pdf",
        "extractionStatus": "pending",
        "uploadedBy": "69f612a2f9a5131ec91665d8",
        "judgmentDate": "2024-03-15T00:00:00.000Z",
        "createdAt": "2026-05-02T15:05:55.417Z",
        "updatedAt": "2026-05-02T15:06:06.287Z"
    }
}
```

### 3.5 Delete Judgment (Admin only)

```bash
curl -s -X DELETE "http://localhost:5000/api/judgments/<JUDGMENT_ID>" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Judgment deleted",
    "data": null
}
```

---

## 4. Directives

### 4.1 Create Directive

```bash
curl -s -X POST http://localhost:5000/api/directives \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "judgment": "<JUDGMENT_ID>",
    "directiveText": "Submit environmental remediation plan for contaminated areas",
    "mainAction": "submit_remediation_plan",
    "deadline": "2024-06-15T00:00:00.000Z",
    "deadlineText": "within 60 days",
    "responsibleDepartment": "Environment",
    "responsibleEntity": "Department of Environment",
    "sourcePage": 3,
    "confidence": 0.96
  }'
```

**Response (201):**
```json
{
    "success": true,
    "message": "Directive created",
    "data": {
        "judgment": "69f612d3f9a5131ec91665da",
        "directiveText": "Submit environmental remediation plan for contaminated areas",
        "mainAction": "submit_remediation_plan",
        "conditions": [],
        "deadline": "2024-06-15T00:00:00.000Z",
        "deadlineText": "within 60 days",
        "responsibleDepartment": "Environment",
        "responsibleEntity": "Department of Environment",
        "sourcePage": 3,
        "confidence": 0.96,
        "reviewStatus": "auto_accepted",
        "_id": "69f612f1f9a5131ec91665db",
        "createdAt": "2026-05-02T15:06:25.160Z",
        "updatedAt": "2026-05-02T15:06:25.160Z"
    }
}
```

### 4.2 List Directives (with filters)

```bash
# All directives
curl -s "http://localhost:5000/api/directives" \
  -H "Authorization: Bearer <TOKEN>"

# Filter by department
curl -s "http://localhost:5000/api/directives?department=Environment" \
  -H "Authorization: Bearer <TOKEN>"

# Filter by judgment
curl -s "http://localhost:5000/api/directives?judgment=<JUDGMENT_ID>" \
  -H "Authorization: Bearer <TOKEN>"

# Filter by review status
curl -s "http://localhost:5000/api/directives?reviewStatus=needs_review" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Directives retrieved",
    "data": [
        {
            "_id": "69f612f1f9a5131ec91665db",
            "judgment": {
                "_id": "69f612d3f9a5131ec91665da",
                "caseId": "HC/KAR/2024/1827",
                "courtName": "Karnataka High Court"
            },
            "directiveText": "Submit environmental remediation plan for contaminated areas",
            "mainAction": "submit_remediation_plan",
            "conditions": [],
            "deadline": "2024-06-15T00:00:00.000Z",
            "deadlineText": "within 60 days",
            "responsibleDepartment": "Environment",
            "responsibleEntity": "Department of Environment",
            "sourcePage": 3,
            "confidence": 0.96,
            "reviewStatus": "auto_accepted",
            "createdAt": "2026-05-02T15:06:25.160Z",
            "updatedAt": "2026-05-02T15:06:25.160Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "pages": 1
    }
}
```

### 4.3 Get Single Directive

```bash
curl -s "http://localhost:5000/api/directives/<DIRECTIVE_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "_id": "69f612f1f9a5131ec91665db",
        "judgment": {
            "_id": "69f612d3f9a5131ec91665da",
            "caseId": "HC/KAR/2024/1827",
            "courtName": "Karnataka High Court",
            "judges": ["Justice A.B. Kumar"],
            "fileUrl": "...",
            "originalFilename": "sample_judgment.pdf",
            "extractionStatus": "pending",
            "uploadedBy": "69f612a2f9a5131ec91665d8",
            "judgmentDate": "2024-03-15T00:00:00.000Z"
        },
        "directiveText": "Submit environmental remediation plan for contaminated areas",
        "mainAction": "submit_remediation_plan",
        "conditions": [],
        "deadline": "2024-06-15T00:00:00.000Z",
        "deadlineText": "within 60 days",
        "responsibleDepartment": "Environment",
        "responsibleEntity": "Department of Environment",
        "sourcePage": 3,
        "confidence": 0.96,
        "reviewStatus": "auto_accepted",
        "createdAt": "2026-05-02T15:06:25.160Z",
        "updatedAt": "2026-05-02T15:06:25.160Z"
    }
}
```

### 4.4 Update Directive

```bash
curl -s -X PUT "http://localhost:5000/api/directives/<DIRECTIVE_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewStatus": "manually_verified",
    "responsibleDepartment": "Environment"
  }'
```

### 4.5 Delete Directive (Admin only)

```bash
curl -s -X DELETE "http://localhost:5000/api/directives/<DIRECTIVE_ID>" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 5. Tasks

### 5.1 Create Task

```bash
curl -s -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "directive": "<DIRECTIVE_ID>",
    "judgment": "<JUDGMENT_ID>",
    "title": "Submit remediation plan to Karnataka HC",
    "description": "Prepare and submit environmental remediation plan as ordered by court",
    "assignedTo": "<OFFICER_ID>",
    "department": "Environment",
    "priority": "high",
    "dueDate": "2024-06-15T00:00:00.000Z"
  }'
```

**Response (201):**
```json
{
    "success": true,
    "message": "Task created",
    "data": {
        "directive": "69f612f1f9a5131ec91665db",
        "judgment": "69f612d3f9a5131ec91665da",
        "title": "Submit remediation plan to Karnataka HC",
        "description": "Prepare and submit environmental remediation plan as ordered by court",
        "assignedTo": "69f612abf9a5131ec91665d9",
        "department": "Environment",
        "status": "not_started",
        "priority": "high",
        "dueDate": "2024-06-15T00:00:00.000Z",
        "_id": "69f612f1f9a5131ec91665dc",
        "evidenceFiles": [],
        "createdAt": "2026-05-02T15:06:25.846Z",
        "updatedAt": "2026-05-02T15:06:25.846Z"
    }
}
```

### 5.2 List Tasks (with filters)

```bash
# All tasks
curl -s "http://localhost:5000/api/tasks" \
  -H "Authorization: Bearer <TOKEN>"

# Filter by status
curl -s "http://localhost:5000/api/tasks?status=completed" \
  -H "Authorization: Bearer <TOKEN>"

# Filter by department
curl -s "http://localhost:5000/api/tasks?department=Environment" \
  -H "Authorization: Bearer <TOKEN>"

# Filter by priority
curl -s "http://localhost:5000/api/tasks?priority=high" \
  -H "Authorization: Bearer <TOKEN>"

# Filter by assigned officer
curl -s "http://localhost:5000/api/tasks?assignedTo=<OFFICER_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Tasks retrieved",
    "data": [
        {
            "_id": "69f612f1f9a5131ec91665dc",
            "directive": {
                "_id": "69f612f1f9a5131ec91665db",
                "directiveText": "Submit environmental remediation plan for contaminated areas",
                "deadline": "2024-06-15T00:00:00.000Z"
            },
            "judgment": {
                "_id": "69f612d3f9a5131ec91665da",
                "caseId": "HC/KAR/2024/1827",
                "courtName": "Karnataka High Court"
            },
            "title": "Submit remediation plan to Karnataka HC",
            "description": "Prepare and submit environmental remediation plan as ordered by court",
            "assignedTo": {
                "_id": "69f612abf9a5131ec91665d9",
                "name": "Dr. Sharma",
                "email": "sharma@environment.gov.in"
            },
            "department": "Environment",
            "status": "completed",
            "priority": "high",
            "dueDate": "2024-06-15T00:00:00.000Z",
            "evidenceFiles": [],
            "completedAt": "2026-05-02T15:06:40.181Z",
            "createdAt": "2026-05-02T15:06:25.846Z",
            "updatedAt": "2026-05-02T15:06:40.181Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "pages": 1
    }
}
```

### 5.3 Get Single Task (with status history)

```bash
curl -s "http://localhost:5000/api/tasks/<TASK_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "task": {
            "_id": "69f612f1f9a5131ec91665dc",
            "directive": {
                "_id": "69f612f1f9a5131ec91665db",
                "directiveText": "Submit environmental remediation plan for contaminated areas",
                "mainAction": "submit_remediation_plan",
                "deadline": "2024-06-15T00:00:00.000Z",
                "deadlineText": "within 60 days",
                "responsibleDepartment": "Environment",
                "confidence": 0.96,
                "reviewStatus": "auto_accepted"
            },
            "judgment": {
                "_id": "69f612d3f9a5131ec91665da",
                "caseId": "HC/KAR/2024/1827",
                "courtName": "Karnataka High Court",
                "fileUrl": "..."
            },
            "title": "Submit remediation plan to Karnataka HC",
            "description": "Prepare and submit environmental remediation plan as ordered by court",
            "assignedTo": {
                "_id": "69f612abf9a5131ec91665d9",
                "name": "Dr. Sharma",
                "email": "sharma@environment.gov.in",
                "department": "Environment"
            },
            "department": "Environment",
            "status": "completed",
            "priority": "high",
            "dueDate": "2024-06-15T00:00:00.000Z",
            "completedAt": "2026-05-02T15:06:40.181Z",
            "evidenceFiles": [],
            "notes": "Survey team dispatched to contaminated site"
        },
        "statusHistory": [
            {
                "_id": "69f612fff9a5131ec91665dd",
                "task": "69f612f1f9a5131ec91665dc",
                "previousStatus": "not_started",
                "newStatus": "in_progress",
                "updatedBy": { "_id": "...", "name": "Admin User" },
                "notes": "Survey team dispatched to contaminated site",
                "createdAt": "2026-05-02T15:06:39.621Z"
            },
            {
                "_id": "69f61300f9a5131ec91665de",
                "task": "69f612f1f9a5131ec91665dc",
                "previousStatus": "in_progress",
                "newStatus": "completed",
                "updatedBy": { "_id": "...", "name": "Admin User" },
                "notes": "Remediation plan submitted to court registry",
                "createdAt": "2026-05-02T15:06:40.241Z"
            }
        ]
    }
}
```

### 5.4 Update Task Status

```bash
curl -s -X PUT "http://localhost:5000/api/tasks/<TASK_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "notes": "Survey team dispatched to contaminated site"
  }'
```

**Response (200):**
```json
{
    "success": true,
    "message": "Task updated",
    "data": {
        "_id": "69f612f1f9a5131ec91665dc",
        "title": "Submit remediation plan to Karnataka HC",
        "status": "in_progress",
        "notes": "Survey team dispatched to contaminated site",
        "updatedAt": "2026-05-02T15:06:39.550Z"
    }
}
```

### 5.5 Delete Task (Admin only)

```bash
curl -s -X DELETE "http://localhost:5000/api/tasks/<TASK_ID>" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 6. Status Updates

### 6.1 Create Status Update

```bash
curl -s -X POST http://localhost:5000/api/status-updates \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "<TASK_ID>",
    "newStatus": "completed",
    "notes": "Remediation plan submitted to court registry"
  }'
```

**Response (201):**
```json
{
    "success": true,
    "message": "Status updated",
    "data": {
        "task": "69f612f1f9a5131ec91665dc",
        "previousStatus": "in_progress",
        "newStatus": "completed",
        "updatedBy": "69f612a2f9a5131ec91665d8",
        "notes": "Remediation plan submitted to court registry",
        "_id": "69f61300f9a5131ec91665de",
        "attachments": [],
        "createdAt": "2026-05-02T15:06:40.241Z",
        "updatedAt": "2026-05-02T15:06:40.241Z"
    }
}
```

### 6.2 List Status Updates (filter by task)

```bash
curl -s "http://localhost:5000/api/status-updates?task=<TASK_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Status updates retrieved",
    "data": [
        {
            "_id": "69f61300f9a5131ec91665de",
            "task": {
                "_id": "69f612f1f9a5131ec91665dc",
                "title": "Submit remediation plan to Karnataka HC",
                "status": "completed"
            },
            "previousStatus": "in_progress",
            "newStatus": "completed",
            "updatedBy": {
                "_id": "69f612a2f9a5131ec91665d8",
                "name": "Admin User",
                "email": "admin@nyayasetu.gov.in"
            },
            "notes": "Remediation plan submitted to court registry",
            "attachments": [],
            "createdAt": "2026-05-02T15:06:40.241Z"
        },
        {
            "_id": "69f612fff9a5131ec91665dd",
            "task": {
                "_id": "69f612f1f9a5131ec91665dc",
                "title": "Submit remediation plan to Karnataka HC",
                "status": "completed"
            },
            "previousStatus": "not_started",
            "newStatus": "in_progress",
            "updatedBy": {
                "_id": "69f612a2f9a5131ec91665d8",
                "name": "Admin User",
                "email": "admin@nyayasetu.gov.in"
            },
            "notes": "Survey team dispatched to contaminated site",
            "attachments": [],
            "createdAt": "2026-05-02T15:06:39.621Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 2,
        "pages": 1
    }
}
```

---

## 7. Users (Admin Only)

### 7.1 List Users

```bash
curl -s "http://localhost:5000/api/users" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# Filter by department
curl -s "http://localhost:5000/api/users?department=Environment" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# Filter by role
curl -s "http://localhost:5000/api/users?role=officer" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Users retrieved",
    "data": [
        {
            "_id": "69f612abf9a5131ec91665d9",
            "name": "Dr. Sharma",
            "email": "sharma@environment.gov.in",
            "role": "officer",
            "department": "Environment",
            "isActive": true,
            "createdAt": "2026-05-02T15:05:15.488Z"
        },
        {
            "_id": "69f612a2f9a5131ec91665d8",
            "name": "Admin User",
            "email": "admin@nyayasetu.gov.in",
            "role": "admin",
            "department": "General",
            "phone": "9876543210",
            "isActive": true,
            "createdAt": "2026-05-02T15:05:06.206Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 2,
        "pages": 1
    }
}
```

### 7.2 Get Single User

```bash
curl -s "http://localhost:5000/api/users/<USER_ID>" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 7.3 Update User

```bash
curl -s -X PUT "http://localhost:5000/api/users/<USER_ID>" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"role": "department_head", "isActive": true}'
```

---

## 8. NLP Service

### 8.1 Check NLP Health

```bash
curl -s http://localhost:5000/api/nlp/health \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "NLP service is healthy",
    "data": {
        "status": "ok",
        "tesseract": false,
        "tesseract_version": null,
        "spacy_model": null
    }
}
```

> Note: `tesseract` and `spacy_model` will show `true`/model name once installed:
> `sudo apt install tesseract-ocr` and `python -m spacy download en_core_web_sm`

### 8.2 Trigger NLP Extraction

```bash
curl -s -X POST "http://localhost:5000/api/nlp/extract/<JUDGMENT_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
    "success": true,
    "message": "Extraction completed",
    "data": {
        "text": "Karnataka High Court\nCase No: HC/KAR/2024/1827\n...",
        "entities": {
            "entities": [
                {"text": "Karnataka High Court", "label": "ORG", "start": 0, "end": 20},
                {"text": "60 days", "label": "DATE", "start": 120, "end": 127}
            ],
            "total": 2
        }
    }
}
```

### 8.3 Python NLP Service Direct (port 8001)

```bash
# Health check
curl -s http://localhost:8001/health

# Extract text from PDF
curl -s -X POST http://localhost:8001/extract/text \
  -F "file=@/path/to/judgment.pdf"

# Extract entities from text
curl -s -X POST http://localhost:8001/extract/entities \
  -H "Content-Type: application/json" \
  -d '{"text": "The Karnataka High Court orders the Department of Environment to submit a remediation plan within 60 days."}'
```

---

## 9. Error Responses

### 9.1 Invalid Credentials

```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nyayasetu.gov.in","password":"wrongpass"}'
```

**Response (401):**
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

### 9.2 No Token Provided

```bash
curl -s http://localhost:5000/api/tasks
```

**Response (401):**
```json
{
    "success": false,
    "message": "No token provided"
}
```

### 9.3 Validation Error

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid","password":"short"}'
```

**Response (400):**
```json
{
    "success": false,
    "message": "Validation Error",
    "error": {
        "code": "VALIDATION_ERROR",
        "details": [
            {"type": "field", "value": "", "msg": "Name is required", "path": "name", "location": "body"},
            {"type": "field", "value": "invalid", "msg": "Valid email is required", "path": "email", "location": "body"},
            {"type": "field", "value": "short", "msg": "Password must be at least 8 characters", "path": "password", "location": "body"}
        ]
    }
}
```

### 9.4 Duplicate Email

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dup User","email":"admin@nyayasetu.gov.in","password":"password123"}'
```

**Response (409):**
```json
{
    "success": false,
    "message": "Email already registered"
}
```

### 9.5 NLP Service Unavailable

**Response (503):**
```json
{
    "success": false,
    "message": "NLP service is unavailable"
}
```

---

## Quick Test Script

Save the admin token and run all tests:

```bash
# Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nyayasetu.gov.in","password":"admin12345"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")

# Use in subsequent requests
curl -s http://localhost:5000/api/tasks -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```
