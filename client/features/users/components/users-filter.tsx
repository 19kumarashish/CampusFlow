"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Role, UserStatus } from "@/features/auth/types/auth.types";

interface UsersFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  discoveredRoles: Role[];
  onReset: () => void;
}

export default function UsersFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  role,
  onRoleChange,
  discoveredRoles,
  onReset,
}: UsersFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <Input
          placeholder="Search by name or email..."
          className="pl-10 border-slate-800 bg-slate-900/40 text-xs text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters Selects */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {/* Status Filter */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[150px] transition-colors"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Statuses</option>
          <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
          <option value="INACTIVE" className="bg-slate-950 text-slate-300">Inactive</option>
          <option value="PENDING" className="bg-slate-950 text-slate-300">Pending</option>
          <option value="SUSPENDED" className="bg-slate-950 text-slate-300">Suspended</option>
        </select>

        {/* Role Filter */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[150px] transition-colors"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Roles</option>
          {discoveredRoles.map((r) => (
            <option key={r._id} value={r._id} className="bg-slate-950 text-slate-300">
              {r.name}
            </option>
          ))}
        </select>

        {/* Reset Filters */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full sm:w-auto border-slate-850 bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          onClick={onReset}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
