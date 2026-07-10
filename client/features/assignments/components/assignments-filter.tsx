"use client";

import { useMemo } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubjectsQuery } from "@/features/subjects";
import { useSectionsQuery } from "@/features/sections";
import { useSemestersQuery } from "@/features/semesters";

interface AssignmentsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  subject: string;
  onSubjectChange: (value: string) => void;
  section: string;
  onSectionChange: (value: string) => void;
  semester: string;
  onSemesterChange: (value: string) => void;
  onReset: () => void;
}

export default function AssignmentsFilter({
  search,
  onSearchChange,
  status,
  onStatusChange,
  subject,
  onSubjectChange,
  section,
  onSectionChange,
  semester,
  onSemesterChange,
  onReset,
}: AssignmentsFilterProps) {
  // Fetch lists
  const { data: subjectData } = useSubjectsQuery({ limit: 100 });
  const activeSubjects = useMemo(() => subjectData?.subjects || [], [subjectData?.subjects]);

  const { data: sectionData } = useSectionsQuery({ limit: 100 });
  const activeSections = useMemo(() => sectionData?.sections || [], [sectionData?.sections]);

  const { data: semesterData } = useSemestersQuery({ limit: 100 });
  const activeSemesters = useMemo(() => semesterData?.semesters || [], [semesterData?.semesters]);

  return (
    <div className="flex flex-col xl:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl">
      {/* Search Input */}
      <div className="relative w-full xl:flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <Input
          placeholder="Search by assignment title or description..."
          className="pl-10 border-slate-800 bg-slate-900/40 text-xs text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters Options row */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
        {/* Subject Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[150px]"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Subjects</option>
          {activeSubjects.map((s) => (
            <option key={s._id} value={s._id} className="bg-slate-950 text-slate-300">
              {s.name} ({s.code})
            </option>
          ))}
        </select>

        {/* Section Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[120px]"
          value={section}
          onChange={(e) => onSectionChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Sections</option>
          {activeSections.map((sec) => (
            <option key={sec._id} value={sec._id} className="bg-slate-950 text-slate-300">
              Section {sec.name}
            </option>
          ))}
        </select>

        {/* Semester Select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[130px]"
          value={semester}
          onChange={(e) => onSemesterChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Terms</option>
          {activeSemesters.map((sem) => (
            <option key={sem._id} value={sem._id} className="bg-slate-950 text-slate-300">
              {sem.name}
            </option>
          ))}
        </select>

        {/* Status select */}
        <select
          className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[120px]"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="ALL" className="bg-slate-950 text-slate-300">All Statuses</option>
          <option value="DRAFT" className="bg-slate-950 text-slate-300">Draft</option>
          <option value="PUBLISHED" className="bg-slate-950 text-slate-300">Published</option>
          <option value="CLOSED" className="bg-slate-950 text-slate-300">Closed</option>
        </select>

        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full sm:w-auto border-slate-850 bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white"
          onClick={onReset}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
