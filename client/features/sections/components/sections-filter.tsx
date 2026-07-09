"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSemestersQuery } from "@/features/semesters";
import { useFacultiesQuery } from "@/features/faculty";

interface SectionsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  semester: string;
  onSemesterChange: (value: string) => void;
  facultyAdvisor: string;
  onFacultyAdvisorChange: (value: string) => void;
  onReset: () => void;
}

export default function SectionsFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  semester,
  onSemesterChange,
  facultyAdvisor,
  onFacultyAdvisorChange,
  onReset,
}: SectionsFilterProps) {
  // Fetch active semesters
  const { data: semesterData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = semesterData?.semesters || [];

  // Fetch active faculties
  const { data: facultyData } = useFacultiesQuery({ limit: 100, status: "ACTIVE" });
  const activeFaculties = facultyData?.faculties || [];

  return (
    <div className="flex flex-col xl:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl animate-in">
      {/* Search Input */}
      <div className="relative w-full xl:flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <Input
          placeholder="Search by Section Name or Classroom..."
          className="pl-10 border-slate-800 bg-slate-900/40 text-xs text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter options */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
        {/* Semester Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[160px]"
          value={semester}
          onChange={(e) => onSemesterChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Semesters</option>
          {activeSemesters.map((s) => (
            <option key={s._id} value={s._id} className="bg-slate-950 text-slate-300">
              {s.name} ({s.academicYear})
            </option>
          ))}
        </select>

        {/* Faculty Advisor select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[170px]"
          value={facultyAdvisor}
          onChange={(e) => onFacultyAdvisorChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Faculty Advisors</option>
          {activeFaculties.map((f) => {
            const name = f.user ? `${f.user.firstName} ${f.user.lastName}` : `ID: ${f.employeeId}`;
            return (
              <option key={f._id} value={f._id} className="bg-slate-950 text-slate-300">
                {name} ({f.employeeId})
              </option>
            );
          })}
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
          className="h-9 w-full sm:w-auto border-slate-850 bg-slate-950 text-slate-455 hover:bg-slate-900 hover:text-white"
          onClick={onReset}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
