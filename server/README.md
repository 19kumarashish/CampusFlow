# CampusFlow Server

This repository contains the backend API for CampusFlow, a university management system built with Node.js, Express, TypeScript, and MongoDB. It powers authentication, user management, academic modules, attendance, examinations, finance, library operations, communication services, and more.

## Features

- JWT-based authentication and authorization
- Role-based access control
- User, role, department, course, subject, faculty, and student management
- Semester, section, and enrollment workflows
- Attendance tracking and reporting
- Assignment and examination modules
- Finance, library, and dashboard services
- Email-based communication support
- Socket.IO integration for real-time features

## Tech Stack

- TypeScript
- Express.js
- MongoDB + Mongoose
- JWT + cookie-based auth
- Zod validation
- Helmet, CORS, compression, morgan
- Nodemailer for mail delivery
- Socket.IO for real-time communication

## Project Structure

```text
src/
  app.ts
  server.ts
  config/
  controllers/
  middlewares/
  modules/
    academic/
    assignments/
    attendance/
    auth/
    communication/
    courses/
    dashboard/
    departments/
    enrollments/
    examinations/
    faculty/
    finance/
    library/
    results/
    roles/
    sections/
    semesters/
    students/
    subjects/
    timetable/
    users/
  routes/
  shared/
  utils/
```

## Prerequisites

- Node.js 20+
- MongoDB instance
- npm or pnpm

## Installation

```bash
git clone <repo-url>
cd server
npm install
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/campusflow
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password
MAIL_FROM=CampusFlow <noreply@campusflow.com>
```

## Available Scripts

```bash
npm run dev       # start development server with hot reload
npm run build     # compile TypeScript to dist
npm run start     # start production build
npm run test      # run test suite
npm run lint      # run ESLint
npm run type-check # run TypeScript validation
```

## Running Locally

```bash
npm run dev
```

The API will be available at:

- Health check: http://localhost:5000/api/health
- API base: http://localhost:5000/api/v1

## Deployment Notes

When deploying the backend on Render or similar services, set `CLIENT_URL` to include your frontend origin (for example Vercel) and localhost during development:

```env
CLIENT_URL=https://your-frontend.vercel.app,http://localhost:3000
```

This is necessary for CORS to work correctly when the frontend calls the backend from a deployed domain.

## Architecture Notes

The server follows a modular structure with clear separation between:

- routes
- controllers
- services
- repositories
- validators
- models
- shared utilities

This keeps business logic organized by domain module and makes the codebase easier to extend.

## Main API Modules

- Authentication & authorization
- User management
- Department management
- Course and subject management
- Faculty and student management
- Attendance tracking
- Enrollment and semester handling
- Examination and result management
- Library and finance modules
- Communication and dashboard APIs
