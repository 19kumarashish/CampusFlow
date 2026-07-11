# Features Roadmap 🗺️

This document outlines the product features, modules, implementation status, and future roadmap plans for **CampusFlow**.

---

## 1. Feature Map & Current Status

CampusFlow's features are categorized into distinct modules, grouped by their implementation status:

### Completed (Production Ready)
* **Auth & Access Control**: JWT authentication flow with dual tokens (refresh/access), password reset links, and role-based permissions (Admin, Faculty, Student).
* **Users Directory**: Profile listings, detail sheets, status modification, and soft deletes.
* **Student & Faculty Profiles**: Demographics, guardian contact info, academic details, qualification details, and compound indexing optimization.
* **Departments & Courses**: Administration forms for departments and course catalogs.
* **Timetable Scheduler**: Section calendars, grid slots, faculty assignments, and subject matching.

---

### In Progress (Active Development)
* **Attendance Ledger**: Real-time roll-calling widgets for faculty, absent thresholds, notification triggers, and student monthly logs.
* **Assignment Manager**: Assignments publishing, file uploads for student submissions, and grading tools for professors.
* **Examinations & Grading**: Mid-term/End-term scheduling, grading schemes (A-F, GPA rings), and score calculators.
* **Results Dashboard**: Semester performance tracking and transcript exports.

---

### Planned (Future Enhancements)

#### Phase 1: Institutional Core Extension (Q3 2026)
* **Library Manager**: Book lists, borrow logs, fine calculation rules, and availability alerts.
* **Finance Portal**: Tuition invoices, payment tracking (integration with stripe/razorpay), scholarship allocations, and transaction ledgers.
* **Announcements Feed**: Global campus news feed with category tags (academic, sports, events).

#### Phase 2: Communication & Integrations (Q4 2026)
* **Real-time Messaging**: Socket.IO-based chat channels for class sections and direct student-faculty conversations.
* **Automated Notifications**: Transaction emails via SMTP and push alerts for low attendance thresholds or newly published assignments.
* **Document Generator**: Automated PDF generation for study sheets, student transcripts, and hall tickets.

#### Phase 3: Intelligence & Analytics (Q1 2027)
* **CGPA Predictor**: Interactive tools for students to simulate future semester grades to check minimum goals for target CGPA.
* **Predictive Attendance Alerts**: Automated alerts warning teachers of students likely to fall below the mandatory 75% attendance threshold.
