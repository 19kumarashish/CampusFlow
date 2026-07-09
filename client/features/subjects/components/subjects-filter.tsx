"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDepartmentsQuery } from "@/features/departments";
import { useCoursesQuery } from "@/features/courses";

interface SubjectsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  course: string;
  onCourseChange: (value: string) => void;
  semester: string;
  onSemesterChange: (value: string) => void;
  onReset: () => void;
}

export default function SubjectsFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  department,
  onDepartmentChange,
  course,
  onCourseChange,
  semester,
  onSemesterChange,
  onReset,
}: SubjectsFilterProps) {
  // Fetch active departments list to populate dropdown
  const { data: deptData } = useDepartmentsQuery({ limit: 100, status: "ACTIVE" });
  const activeDepartments = deptData?.departments || [];

  // Fetch active courses list to populate dropdown
  const { data: courseData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = courseData?.courses || [];

  return (
    <div className="flex flex-col xl:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl">
      {/* Search Input */}
      <div className="relative w-full xl:flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <Input
          placeholder="Search by subject name or code..."
          className="pl-10 border-slate-800 bg-slate-900/40 text-xs text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Options */}
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

        {/* Course select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[140px]"
          value={course}
          onChange={(e) => onCourseChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Courses</option>
          {activeCourses.map((c) => (
            <option key={c._id} value={c._id} className="bg-slate-950 text-slate-300">
              {c.name}
            </option>
          ))}
        </select>

        {/* Semester select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[100px]"
          value={semester}
          onChange={(e) => onSemesterChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sem) => (
            <option key={sem} value={String(sem)} className="bg-slate-950 text-slate-300">
              Sem {sem}
            </option>
          ))}
        </select>

        {/* Type select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[110px]"
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Types</option>
          <option value="THEORY" className="bg-slate-950 text-slate-300">Theory</option>
          <option value="LAB" className="bg-slate-950 text-slate-300">Lab</option>
          <option value="PROJECT" className="bg-slate-950 text-slate-300">Project</option>
          <option value="ELECTIVE" className="bg-slate-950 text-slate-300">Elective</option>
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
