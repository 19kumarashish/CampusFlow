"use client";

import { useSelector } from "react-redux";
import { LogOut, User as UserIcon, Shield, Mail, Phone, Calendar } from "lucide-react";

import { useLogoutMutation } from "@/features/auth";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate: logOutUser, isPending } = useLogoutMutation();

  const handleLogout = () => {
    logOutUser();
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Hello, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Welcome to the CampusFlow university portal
            </p>
          </div>
          <Button
            variant="destructive"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 font-semibold"
            disabled={isPending}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {isPending ? "Logging out..." : "Log Out"}
          </Button>
        </div>

        {/* User Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-slate-800 bg-slate-900/40 p-6 flex flex-col items-center text-center backdrop-blur-xl">
            <Avatar className="h-24 w-24 border border-slate-800 shadow-xl">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.firstName} />
              ) : null}
              <AvatarFallback className="bg-indigo-600 text-white text-2xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mt-4">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Shield className="h-3.5 w-3.5" />
              {user?.role?.name || "No Role"}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {user?.status}
            </div>
          </Card>

          <Card className="md:col-span-2 border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-900 pb-3 text-slate-200">
              Profile details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> EMAIL ADDRESS
                </span>
                <p className="text-sm font-semibold text-slate-300">{user?.email}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> PHONE NUMBER
                </span>
                <p className="text-sm font-semibold text-slate-300">{user?.phone || "N/A"}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" /> PERMISSIONS
                </span>
                <p className="text-sm font-semibold text-slate-300">
                  {user?.role?.permissions?.join(", ") || "None"}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> LAST LOGIN
                </span>
                <p className="text-sm font-semibold text-slate-300">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "First login"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
