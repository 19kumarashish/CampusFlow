"use client";

import { ProfileSettings } from "@/features/users";
import { UserCheck } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-indigo-400" /> Account Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update your profile details, contact settings, and security passwords.
          </p>
        </div>
      </div>

      {/* Main Forms Layout */}
      <ProfileSettings />
    </div>
  );
}
