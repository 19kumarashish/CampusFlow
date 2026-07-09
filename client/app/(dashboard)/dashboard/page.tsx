"use client";

import { useSelector } from "react-redux";
import { LogOut, GraduationCap, RefreshCw } from "lucide-react";

import { useLogoutMutation } from "@/features/auth";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate: logOutUser, isPending: isLoggingOut } = useLogoutMutation();
  const { data, isLoading, error, refetch } = useDashboardQuery();

  const handleLogout = () => {
    logOutUser();
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CampusFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-slate-900">
            <Avatar className="h-8 w-8 border border-slate-800 shadow-md">
              <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-200">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">
                {user?.role?.name}
              </p>
            </div>
          </div>

          <Button
            variant="destructive"
            className="flex items-center gap-1.5 bg-red-650 hover:bg-red-600 font-semibold text-xs py-1.5 h-8 text-white active:scale-95 transition-transform"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
        {renderDashboardContent()}
      </main>
    </div>
  );
}
