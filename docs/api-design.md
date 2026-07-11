# API Design 🔌

This document outlines the API guidelines, response standards, validation constraints, and endpoint definitions for the CampusFlow REST API.

---

## 1. Global Standards

### 1.1. Base URL
All API requests are prefixed with:
```text
http://<host>:<port>/api/v1
```
For example, a local development environment will access endpoints at:
```text
http://localhost:5000/api/v1
```

### 1.2. Headers
* **Content-Type**: `application/json` (required for POST, PUT, PATCH requests)
* **Authorization**: `Bearer <Access-Token>` (required for all protected routes)

### 1.3. Query Parameters (Pagination, Filter, Sort)
Standard GET endpoints supporting list actions utilize the following parameters:
* `page`: The page index, defaults to `1`.
* `limit`: Items per page, defaults to `10`.
* `sort`: Property sorting string (e.g. `createdAt` or `-createdAt` for descending).
* `search`: String matching index properties (e.g. name, ID).

---

## 2. Standard Responses

CampusFlow uses consistent JSON wrappers for all response payloads.

### 2.1. Success Response
Returns a HTTP `2xx` status code.

```json
{
  "success": true,
  "message": "Student record updated successfully.",
  "data": {
    "studentId": "STU2026001",
    "rollNumber": "CSE-A-01",
    "currentSemester": 3
  }
}
```

### 2.2. Error Responses

#### Generic API Error (HTTP 4xx/5xx)
```json
{
  "success": false,
  "message": "Resource not found."
}
```

#### Validation Error (HTTP 400)
Returned when payload validation fails via Zod or Mongoose schemas.
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "guardianPhone",
      "message": "Phone number must be a valid 10-digit format"
    }
  ]
}
```

---

## 3. API Endpoints Reference

### 3.1. Authentication (`/auth`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | None | Guest | Logs user in, sets Refresh cookie, returns Access Token |
| `POST` | `/auth/logout` | Protect | Any | Clears cookies and terminates session |
| `POST` | `/auth/refresh` | None | Guest | Refreshes the Access Token using HttpOnly Refresh Cookie |
| `POST` | `/auth/forgot-password`| None| Guest | Sends a password-reset link to the user's email |
| `POST` | `/auth/reset-password` | None | Guest | Updates password using validation token |
| `GET` | `/auth/me` | Protect | Any | Returns profile details of the current logged-in user |

---

### 3.2. Students (`/students`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/students` | Protect | Any | Lists students (supports pagination, filtering, search) |
| `GET` | `/students/:id` | Protect | Any | Fetches a single student profile |
| `POST` | `/students` | Protect | Admin | Registers a new student and creates their auth profile |
| `PATCH` | `/students/:id` | Protect | Admin | Updates details of a student |
| `DELETE` | `/students/:id` | Protect | Admin | Soft-deletes a student profile |

---

### 3.3. Academics, Enrollment & Logistics

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/departments` | Protect | Any | Lists all active departments |
| `POST` | `/departments` | Protect | Admin | Creates a new department |
| `GET` | `/courses` | Protect | Any | Lists courses |
| `POST` | `/courses` | Protect | Admin | Creates a new course program |
| `GET` | `/subjects` | Protect | Any | Lists subjects (syllabus database) |
| `GET` | `/semesters` | Protect | Any | Lists active and historical semesters |
| `POST` | `/enrollments` | Protect | Admin | Enrolls students in specific semesters / courses |
| `GET` | `/sections` | Protect | Any | Lists class divisions (e.g. Section A, Section B) |

---

### 3.4. Attendance, Assignments & Examinations

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/attendance` | Protect | Faculty | Marks attendance for a specific class section |
| `GET` | `/attendance/report` | Protect | Any | Generates attendance percentage summaries |
| `POST` | `/assignments` | Protect | Faculty | Publishes a new assignment with due dates |
| `POST` | `/assignments/submit`| Protect | Student | Submits an assignment upload |
| `POST` | `/examinations` | Protect | Faculty | Schedules examinations (Mid-term, End-term) |
| `GET` | `/results` | Protect | Any | Fetches exam performance/grades |

---

### 3.5. Dashboard & Communication

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/admin` | Protect | Admin | Returns student headcount, department ratios, and stats |
| `GET` | `/dashboard/faculty`| Protect | Faculty | Returns class lists, pending grading, and schedules |
| `GET` | `/dashboard/student`| Protect | Student | Returns CGPA ring, attendance logs, and alerts |
| `GET` | `/communication/announcements` | Protect | Any | Returns administrative announcements |
