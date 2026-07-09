"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCoursesQuery } from "@/features/courses";
import { useSemestersQuery } from "@/features/semesters";
import { useSectionsQuery } from "@/features/sections";

interface EnrollmentsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  course: string;
  onCourseChange: (value: string) => void;
  semester: string;
  onSemesterChange: (value: string) => void;
  section: string;
  onSectionChange: (value: string) => void;
  onReset: () => void;
}

export default function EnrollmentsFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  course,
  onCourseChange,
  semester,
  onSemesterChange,
  section,
  onSectionChange,
  onReset,
}: EnrollmentsFilterProps) {
  // Fetch active courses
  const { data: courseData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = courseData?.courses || [];

  // Fetch active semesters
  const { data: semesterData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = semesterData?.semesters || [];

  // Fetch active sections
  const { data: sectionData } = useSectionsQuery({ limit: 100, status: "ACTIVE" });
  const activeSections = sectionData?.sections || [];

  return (
    <div className="flex flex-col xl:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl animate-in">
      {/* Search Input */}
      <div className="relative w-full xl:flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <Input
          placeholder="Search by Student ID..."
          className="pl-10 border-slate-800 bg-slate-900/40 text-xs text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto text-xs">
        {/* Course Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[140px]"
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

        {/* Semester Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[150px]"
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

        {/* Section Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[130px]"
          value={section}
          onChange={(e) => onSectionChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Sections</option>
          {activeSections.map((sec) => (
            <option key={sec._id} value={sec._id} className="bg-slate-950 text-slate-300">
              {sec.name}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[110px]"
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
          className="h-9 w-full sm:w-auto border-slate-855 bg-slate-950 text-slate-455 hover:bg-slate-900 hover:text-white"
          onClick={onReset}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
