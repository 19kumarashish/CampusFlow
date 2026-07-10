"use client";

import { Search, RotateCcw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubjectsQuery } from "@/features/subjects";

interface AttendanceFilterProps {
  subject: string;
  onSubjectChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  onReset: () => void;
}

export default function AttendanceFilter({
  subject,
  onSubjectChange,
  status,
  onStatusChange,
  date,
  onDateChange,
  onReset,
}: AttendanceFilterProps) {
  // Fetch active subjects
  const { data: subjectData } = useSubjectsQuery({ limit: 100, status: "ACTIVE" });
  const activeSubjects = subjectData?.subjects || [];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl animate-in text-xs">
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full sm:w-auto">
        {/* Subject Select */}
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Subject</label>
          <select
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[180px]"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
          >
            <option value="ALL" className="bg-slate-950 text-slate-300">All Subjects</option>
            {activeSubjects.map((sub) => (
              <option key={sub._id} value={sub._id} className="bg-slate-950 text-slate-300">
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Attendance Date</label>
          <input
            type="date"
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[150px]"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
          <select
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[130px]"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="ALL" className="bg-slate-950 text-slate-300">All Statuses</option>
            <option value="PRESENT" className="bg-slate-950 text-slate-300">Present</option>
            <option value="ABSENT" className="bg-slate-950 text-slate-300">Absent</option>
            <option value="LATE" className="bg-slate-950 text-slate-300">Late</option>
            <option value="EXCUSED" className="bg-slate-950 text-slate-300">Excused</option>
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
