# CampusFlow 🎓

CampusFlow is a production-grade, premium University ERP & Management System built to deliver a modern, fluid workspace for students, faculty, and administrators. It features a Next.js frontend styled with an Obsidian-glass design and an Express/TypeScript REST API back-end.

---

## 🚀 Navigation & Documentation

We maintain detailed, separate documentation guides for each area of the system. You can explore them here:

* **[System Architecture](file:///c:/Developer/Project/CampusFlow/docs/architecture.md)**: Details the 3-Tier request lifecycle, modular package structures, and dual-token auth flow.
* **[Database Design](file:///c:/Developer/Project/CampusFlow/docs/database-design.md)**: Displays the ERD and detailed MongoDB collections, schemas, indexes, and soft-delete setups.
* **[API Design](file:///c:/Developer/Project/CampusFlow/docs/api-design.md)**: Summarizes the REST API routes under `/api/v1`, headers, standard response templates, and query modifiers.
* **[Coding Guidelines](file:///c:/Developer/Project/CampusFlow/docs/coding-guidelines.md)**: Explains linting, formatting rules, import sorting patterns, and git commit hooks.
* **[Deployment Guide](file:///c:/Developer/Project/CampusFlow/docs/deployment.md)**: Walkthrough of running the development servers locally and publishing to Vercel/Render.
* **[Features Roadmap](file:///c:/Developer/Project/CampusFlow/docs/features-roadmap.md)**: Tracks current features, active items, and upcoming phases.

---

## 🎨 Design Philosophy & Features

CampusFlow replaces traditional, crowded administrative tables with a dark, high-fidelity Obsidian-glass aesthetic similar to Linear and Vercel.

* **Dual-Token Session Flow**: Rotating access JWTs (in-memory) and secure HttpOnly cookie refresh keys.
* **Dynamic Student Portal**: CGPA rings, upcoming exams, class schedule grids, and attendance metrics.
* **Faculty Workspace**: Marking attendance, managing assignments, and grading rosters.
* **Administrative Console**: Roster logs, department management, and statistics.

---

## 📁 Repository Structure

```text
CampusFlow/
├── client/              # Next.js 15 Web Application
│   ├── app/             # App Router components & layouts
│   ├── components/      # UI components
│   └── features/        # Domain-driven frontend features
├── server/              # Express / TypeScript Server
│   └── src/             # Source code (modular structures)
└── docs/                # Technical documentation guides
```

---

## ⚡ Quick Start

### 1. Backend Server Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the client.
