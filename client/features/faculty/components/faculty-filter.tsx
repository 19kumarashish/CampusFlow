"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDepartmentsQuery } from "@/features/departments";

interface FacultyFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  designation: string;
  onDesignationChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  employmentType: string;
  onEmploymentTypeChange: (value: string) => void;
  onReset: () => void;
}

export default function FacultyFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  designation,
  onDesignationChange,
  department,
  onDepartmentChange,
  employmentType,
  onEmploymentTypeChange,
  onReset,
}: FacultyFilterProps) {
  // Fetch active departments
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
          placeholder="Search by Employee ID, qualification, or specialization..."
          className="pl-10 border-slate-800 bg-slate-900/40 text-xs text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter options */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
        {/* Department select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[150px]"
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

        {/* Designation select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[140px]"
          value={designation}
          onChange={(e) => onDesignationChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Designations</option>
          <option value="HOD" className="bg-slate-950 text-slate-300">HOD</option>
          <option value="PROFESSOR" className="bg-slate-950 text-slate-300">Professor</option>
          <option value="ASSOCIATE_PROFESSOR" className="bg-slate-950 text-slate-300">Associate Professor</option>
          <option value="ASSISTANT_PROFESSOR" className="bg-slate-950 text-slate-300">Assistant Professor</option>
          <option value="LECTURER" className="bg-slate-950 text-slate-300">Lecturer</option>
          <option value="VISITING_FACULTY" className="bg-slate-950 text-slate-300">Visiting Faculty</option>
        </select>

        {/* Employment Type select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[130px]"
          value={employmentType}
          onChange={(e) => onEmploymentTypeChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Employment</option>
          <option value="FULL_TIME" className="bg-slate-950 text-slate-300">Full Time</option>
          <option value="PART_TIME" className="bg-slate-950 text-slate-300">Part Time</option>
          <option value="CONTRACT" className="bg-slate-950 text-slate-300">Contract</option>
          <option value="VISITING" className="bg-slate-950 text-slate-300">Visiting</option>
        </select>

        {/* Status Dropdown */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[110px]"
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
