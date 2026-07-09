"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDepartmentsQuery } from "@/features/departments";

interface CoursesFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  degree: string;
  onDegreeChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  onReset: () => void;
}

export default function CoursesFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  degree,
  onDegreeChange,
  department,
  onDepartmentChange,
  onReset,
}: CoursesFilterProps) {
  // Fetch active departments list to populate dropdown
  const { data: deptData } = useDepartmentsQuery({ limit: 100, status: "ACTIVE" });
  const activeDepartments = deptData?.departments || [];

  return (
    <div className="flex flex-col xl:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl">
      {/* Search Input */}
      <div className="relative w-full xl:flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <Input
          placeholder="Search by course name or code..."
          className="pl-10 border-slate-800 bg-slate-900/40 text-xs text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
        {/* Department select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[160px]"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Departments</option>
          {activeDepartments.map((d) => (
            <option key={d._id} value={d._id} className="bg-slate-950 text-slate-300">
              {d.name}
            </option>
          ))}
        </select>

        {/* Degree select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[130px]"
          value={degree}
          onChange={(e) => onDegreeChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Degrees</option>
          <option value="BTECH" className="bg-slate-950 text-slate-300">B.Tech</option>
          <option value="MTECH" className="bg-slate-950 text-slate-300">M.Tech</option>
          <option value="BCA" className="bg-slate-950 text-slate-300">BCA</option>
          <option value="MCA" className="bg-slate-950 text-slate-300">MCA</option>
          <option value="BSC" className="bg-slate-950 text-slate-300">B.Sc</option>
          <option value="MSC" className="bg-slate-950 text-slate-300">M.Sc</option>
          <option value="BCOM" className="bg-slate-950 text-slate-300">B.Com</option>
          <option value="MCOM" className="bg-slate-950 text-slate-300">M.Com</option>
          <option value="BA" className="bg-slate-950 text-slate-300">B.A.</option>
          <option value="MA" className="bg-slate-950 text-slate-300">M.A.</option>
          <option value="MBA" className="bg-slate-950 text-slate-300">MBA</option>
          <option value="PHD" className="bg-slate-950 text-slate-300">Ph.D.</option>
        </select>

        {/* Status Dropdown */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[130px]"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Statuses</option>
          <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
          <option value="INACTIVE" className="bg-slate-950 text-slate-300">Inactive</option>
        </select>

        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full sm:w-auto border-slate-850 bg-slate-950 text-slate-450 hover:bg-slate-900 hover:text-white"
          onClick={onReset}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
