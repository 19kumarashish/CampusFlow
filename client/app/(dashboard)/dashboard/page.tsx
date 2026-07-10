"use client";

import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";

import {
  AdminDashboard,
  FacultyDashboard,
  StudentDashboard,
  DashboardSkeleton,
  useDashboardQuery,
  type AdminDashboardData,
  type FacultyDashboardData,
  type StudentDashboardData,
} from "@/features/dashboard";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, error, refetch } = useDashboardQuery();

  const renderDashboardContent = () => {
    if (isLoading) {
      return <DashboardSkeleton />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/20 border border-slate-800 rounded-2xl max-w-md mx-auto space-y-4 my-12 animate-in fade-in duration-300">
          <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Failed to load dashboard</h3>
          <p className="text-xs text-slate-400">
            There was a connection problem fetching database aggregation statistics. Please verify your connection and try again.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="border-slate-800 hover:bg-slate-800 text-white">
            Retry Loading
          </Button>
        </div>
      );
    }

    if (!data) return null;

    const roleName = user?.role?.name;

    switch (roleName) {
      case "ADMIN":
        return <AdminDashboard data={data as AdminDashboardData} />;
      case "TEACHER":
        return <FacultyDashboard data={data as FacultyDashboardData} />;
      case "STUDENT":
        return <StudentDashboard data={data as StudentDashboardData} />;
      default:
        return (
          <div className="text-center p-8 bg-slate-900/10 rounded-xl border border-slate-850 my-12">
            <p className="text-slate-400 text-sm">
              Your role "{roleName}" does not have an active dashboard workspace assigned.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="py-2 animate-in fade-in duration-500">
      {renderDashboardContent()}
    </div>
  );
}
