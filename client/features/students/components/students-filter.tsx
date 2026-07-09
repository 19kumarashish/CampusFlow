"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDepartmentsQuery } from "@/features/departments";
import { useCoursesQuery } from "@/features/courses";

interface StudentsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  course: string;
  onCourseChange: (value: string) => void;
  semester: string;
  onSemesterChange: (value: string) => void;
  admissionYear: string;
  onAdmissionYearChange: (value: string) => void;
  admissionType: string;
  onAdmissionTypeChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  onReset: () => void;
}

export default function StudentsFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  department,
  onDepartmentChange,
  course,
  onCourseChange,
  semester,
  onSemesterChange,
  admissionYear,
  onAdmissionYearChange,
  admissionType,
  onAdmissionTypeChange,
  gender,
  onGenderChange,
  onReset,
}: StudentsFilterProps) {
  // Fetch active departments
  const { data: deptData } = useDepartmentsQuery({ limit: 100, status: "ACTIVE" });
  const activeDepartments = deptData?.departments || [];

  // Fetch active courses
  const { data: courseData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = courseData?.courses || [];

  const currentYear = new Date().getFullYear();
  const admissionYears = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i).reverse();

  return (
    <div className="flex flex-col xl:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl">
      {/* Search Input */}
      <div className="relative w-full xl:flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <Input
          placeholder="Search by ID, roll number, registration, or guardian..."
          className="pl-10 border-slate-800 bg-slate-900/40 text-xs text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters Options row */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
        {/* Department Select */}
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

        {/* Course Select */}
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

        {/* Semester Select */}
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

        {/* Admission Year select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[100px]"
          value={admissionYear}
          onChange={(e) => onAdmissionYearChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">Year</option>
          {admissionYears.map((y) => (
            <option key={y} value={String(y)} className="bg-slate-950 text-slate-300">
              {y}
            </option>
          ))}
        </select>

        {/* Admission Type Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[110px]"
          value={admissionType}
          onChange={(e) => onAdmissionTypeChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Entry</option>
          <option value="REGULAR" className="bg-slate-950 text-slate-300">Regular</option>
          <option value="LATERAL_ENTRY" className="bg-slate-950 text-slate-300">Lateral</option>
          <option value="TRANSFER" className="bg-slate-950 text-slate-300">Transfer</option>
        </select>

        {/* Gender Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[100px]"
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">Gender</option>
          <option value="MALE" className="bg-slate-950 text-slate-300">Male</option>
          <option value="FEMALE" className="bg-slate-950 text-slate-300">Female</option>
          <option value="OTHER" className="bg-slate-950 text-slate-300">Other</option>
        </select>

        {/* Status select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[110px]"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Statuses</option>
          <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
          <option value="GRADUATED" className="bg-slate-950 text-slate-300">Graduated</option>
          <option value="DROPPED" className="bg-slate-950 text-slate-300">Dropped</option>
          <option value="SUSPENDED" className="bg-slate-950 text-slate-300">Suspended</option>
          <option value="ALUMNI" className="bg-slate-950 text-slate-300">Alumni</option>
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
