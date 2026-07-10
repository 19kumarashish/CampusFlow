"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSectionsQuery } from "@/features/sections";
import { useFacultiesQuery } from "@/features/faculty";

interface TimetableFilterProps {
  section: string;
  onSectionChange: (value: string) => void;
  faculty: string;
  onFacultyChange: (value: string) => void;
  day: string;
  onDayChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function TimetableFilter({
  section,
  onSectionChange,
  faculty,
  onFacultyChange,
  day,
  onDayChange,
  status,
  onStatusChange,
  onReset,
}: TimetableFilterProps) {
  // Fetch active sections
  const { data: sectionData } = useSectionsQuery({ limit: 100, status: "ACTIVE" });
  const activeSections = sectionData?.sections || [];

  // Fetch active faculties
  const { data: facultyData } = useFacultiesQuery({ limit: 100, status: "ACTIVE" });
  const activeFaculties = facultyData?.faculties || [];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl animate-in text-xs">
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full sm:w-auto">
        {/* Section Select */}
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-slate-500 uppercase">View Section</label>
          <select
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[160px]"
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
        </div>

        {/* Faculty Select */}
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Filter Faculty</label>
          <select
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[180px]"
            value={faculty}
            onChange={(e) => onFacultyChange(e.target.value)}
          >
            <option value="ALL" className="bg-slate-950 text-slate-300">All Faculty</option>
            {activeFaculties.map((f) => {
              const name = f.user ? `${f.user.firstName} ${f.user.lastName}` : `ID: ${f.employeeId}`;
              return (
                <option key={f._id} value={f._id} className="bg-slate-950 text-slate-300">
                  {name} ({f.employeeId})
                </option>
              );
            })}
          </select>
        </div>

        {/* Day Select */}
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Weekday</label>
          <select
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[130px]"
            value={day}
            onChange={(e) => onDayChange(e.target.value)}
          >
            <option value="ALL" className="bg-slate-950 text-slate-300">All Days</option>
            <option value="MONDAY" className="bg-slate-950 text-slate-300">Monday</option>
            <option value="TUESDAY" className="bg-slate-950 text-slate-300">Tuesday</option>
            <option value="WEDNESDAY" className="bg-slate-950 text-slate-300">Wednesday</option>
            <option value="THURSDAY" className="bg-slate-950 text-slate-300">Thursday</option>
            <option value="FRIDAY" className="bg-slate-950 text-slate-300">Friday</option>
            <option value="SATURDAY" className="bg-slate-950 text-slate-300">Saturday</option>
            <option value="SUNDAY" className="bg-slate-950 text-slate-300">Sunday</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
          <select
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[110px]"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="ALL" className="bg-slate-950 text-slate-300">All Statuses</option>
            <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
            <option value="INACTIVE" className="bg-slate-950 text-slate-300">Inactive</option>
          </select>
        </div>

        {/* Reset */}
        <div className="pt-5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full sm:w-auto border-slate-855 bg-slate-955 text-slate-455 hover:bg-slate-900 hover:text-white"
            onClick={onReset}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
