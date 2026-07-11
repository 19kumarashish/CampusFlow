# CampusFlow Client 🎓

Welcome to the frontend workspace of **CampusFlow**, a production-grade, premium University ERP System designed and built with a high-fidelity visual experience on par with Stripe, Vercel, and Linear dashboards.

---

## 🎨 Design Philosophy & Visual Identity
CampusFlow moves away from traditional, crowded administrative database views to deliver an elegant, minimal, and modern workspace.
- **Obsidian-glass Palette:** Curated dark mode colors using fine borders (`border-border/40`) and soft backdrop blurs (`backdrop-blur-xl bg-card/90`).
- **Tactile Transitions:** Fluid cursor hover lifts, list indicators on active states, and custom glowing focus rings to create a high-quality interface.
- **Dynamic Dashboard Layouts:** Rich metrics cards, upcoming exam schedules, calendar logs, and visual CGPA performance rings.

---

## 🏗️ Technical Stack & Architecture

- **Core Framework:** Next.js (App Router, static compilation hooks)
- **Styling:** Tailwind CSS + Vanilla CSS enhancements (Obsidian-glass systems, premium scrollbars, and shimmer gradients in `globals.css`)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`) + React Hook Form
- **Form Verification:** Zod Schema validation (`zod` + `@hookform/resolvers/zod`)
- **API Engine:** Axios with dual-token JWT request interceptors (Access token automatic rotation on `401 Unauthorized`)

---

## 📁 Project Directory Structure
CampusFlow utilizes a **Domain-Driven Design (DDD)** directory structure to ensure modularity and scalability:

```text
client/
├── app/                  # Next.js App Router Page components
│   ├── (auth)/           # Authentication layout and route
│   └── (dashboard)/      # Protected administrative app screens
├── features/             # Domain modules
│   ├── auth/             # Login forms, hooks, token actions
│   ├── semesters/        # Terms listing tables, modals, hooks
│   ├── timetable/        # Class grids, slots schedules
│   ├── students/         # Profile edit dialogs, metrics cards
│   └── ...               # Additional feature domains
├── lib/                  # Library configurations (Axios clients, interceptors)
├── components/           # Reusable generic UI components (Buttons, Cards, Inputs)
└── store/                # Redux global store configurations
```

---

## 🚀 Local Installation & Setup

### 1. Prerequisites
Make sure you have Node.js (version 18 or above) installed.

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the client folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your local workspace.

---

## 🌐 Production Deployment to Vercel

During Vercel build stages, Next.js bakes environment variables into static components. Configure them in Vercel settings as follows:

1. Go to **Vercel Dashboard** -> **Settings** -> **Environment Variables**.
2. Add the variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://<your-render-backend-url>/api/v1`
3. Save the variable.
4. Go to **Deployments** and click **Redeploy** to compile the latest values.
