# Coding Guidelines 📐

This document outlines the coding standards, naming conventions, directory responsibilities, and formatting rules that must be followed when contributing to the CampusFlow codebase.

---

## 1. Naming Conventions

### 1.1. Case Style Conventions
* **Files & Directories**: `kebab-case` (e.g. `student.routes.ts`, `attendance-report.tsx`).
* **Variables, Functions & Properties**: `camelCase` (e.g. `studentId`, `getStudents()`).
* **Classes, Enums & Interfaces**: `PascalCase` (e.g. `StudentController`, `UserRole`).
* **Mongoose Interfaces**: Prefixed with `I` (e.g. `IStudent`, `IUser`).
* **Constants & Environment Variables**: `UPPERCASE` with underscores (e.g. `PORT`, `JWT_ACCESS_SECRET`).

---

## 2. Directory & Module Responsibilities

CampusFlow uses a highly structured, modular layout. Keep boundaries clean.

### 2.1. Backend Module Architecture
Each module under `server/src/modules/[module_name]` should strictly adhere to this layered structure:

```text
[module_name]/
├── controllers/   # Processes HTTP requests, handles status codes, and formats API responses.
├── services/      # Implements core business logic. Should be framework-agnostic.
├── repositories/  # Encapsulates database queries. Only repositories query Mongoose models.
├── models/        # Holds Mongoose Schema and TypeScript Interfaces.
├── validators/    # Defines request payload verification schemas (using Zod).
├── dto/           # Contains TypeScript interfaces representing request shapes.
└── routes/        # Maps endpoints to their respective controller actions.
```

### 2.2. Frontend Feature Architecture
Feature-specific UI elements should live under `client/features/[feature_name]`:
* **General UI Components**: Keep generic UI (e.g., loading skeletons, customized buttons) in the global `client/components/` folder.
* **Domain UI Components**: Domain-specific UI (e.g., `StudentGradeSummary.tsx`) must reside inside `client/features/[feature_name]/components/`.
* **State & Queries**: Hook configurations and Redux Toolkit slices should live inside `client/features/[feature_name]/store/` or `client/features/[feature_name]/hooks/`.

---

## 3. TypeScript Standards

* **Strict Mode**: Ensure `strict` is set to `true` in `tsconfig.json`. Explicit `any` is prohibited. Use `unknown` or specific type contracts.
* **Return Types**: Explicitly define return types on all functions and API controllers:
  ```typescript
  export const getStudents = async (
    req: Request,
    res: Response
  ): Promise<Response> => { ... }
  ```
* **Imports**: Always use clean absolute path aliases instead of relative path nesting (e.g., `@/shared/...` in server, `@/features/...` in client).

---

## 4. Linting, Formatting & Hook Controls

CampusFlow integrates ESLint and Prettier to automatically enforce styles.

### 4.1. Rules Configured
* **Automatic Import Sorting**: Enforced by the ESLint plugin `simple-import-sort`. Imports must be sorted alphabetically by scope (node modules, aliases, parent directories).
* **Unused Variables**: Generates warnings, except for variables explicitly prefixed with an underscore (e.g. `_next`).

### 4.2. Pre-Commit Verification
The repository runs **Husky** and **lint-staged** hooks before every git commit:
1. Compiles changed files.
2. Formats files using Prettier.
3. Checks code styles via ESLint.
Any error in this hook will block the commit.

You can verify code locally using:
```bash
# Run linting
npm run lint

# Run automatic formatting
npm run format

# Verify typescript compilation
npm run type-check
```
