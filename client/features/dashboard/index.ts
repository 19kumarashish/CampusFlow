// Export dashboard components
export { default as AdminDashboard } from "./components/admin-dashboard";
export { default as FacultyDashboard } from "./components/faculty-dashboard";
export { default as StudentDashboard } from "./components/student-dashboard";
export { default as DashboardSkeleton } from "./components/dashboard-skeleton";

// Export TanStack Query hooks
export { useDashboardQuery } from "./hooks/dashboard.hooks";

// Export dashboard API endpoints
export * from "./api/dashboard.api";

// Export types
export * from "./types/dashboard.types";
