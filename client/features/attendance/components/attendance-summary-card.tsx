"use client";

import { Award, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { AttendanceSummary } from "../types/attendance.types";

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary | undefined;
}

export default function AttendanceSummaryCard({
  summary,
}: AttendanceSummaryCardProps) {
  const total = summary?.totalLectures ?? 0;
  const present = summary?.presentLectures ?? 0;
  const percentage = summary?.percentage ?? 0;
  const absent = total - present;

  // Calculate stroke properties for SVG progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isLowAttendance = percentage < 75;

  const getStatusColor = () => {
    if (total === 0) return "text-slate-500 stroke-slate-800";
    return isLowAttendance
      ? "text-rose-500 stroke-rose-500"
      : "text-emerald-500 stroke-emerald-500";
  };

  const getStatusBadge = () => {
    if (total === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-800 bg-slate-900 text-slate-400 font-bold">
          <HelpCircle className="h-4 w-4" /> No Records
        </span>
      );
    }
    return isLowAttendance ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 font-bold animate-pulse">
        <AlertTriangle className="h-4 w-4" /> Below 75% Threshold
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-bold">
        <CheckCircle className="h-4 w-4" /> Good Standing
      </span>
    );
  };

  return (
    <Card className="border border-slate-900 bg-slate-950/40 p-6 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl animate-in text-xs w-full">
      {/* Circle Ring Gauge */}
      <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="stroke-slate-900 fill-transparent"
            strokeWidth="8"
          />
          {total > 0 && (
            <circle
              cx="56"
              cy="56"
              r={radius}
              className={`fill-transparent transition-all duration-1000 ease-out ${getStatusColor()}`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-white">{percentage}%</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Presence</span>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="flex-1 space-y-4 w-full text-center md:text-left">
        <div>
          <h2 className="text-lg font-bold text-white">Attendance Summary</h2>
          <p className="text-[11px] text-slate-400 mt-1">
            Maintain a minimum of <strong className="text-indigo-400">75%</strong> attendance to remain in good academic standing.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900/60">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Total classes</p>
            <p className="text-xl font-bold text-slate-200 mt-1">{total}</p>
          </div>
          <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900/60">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Attended</p>
            <p className="text-xl font-bold text-emerald-450 mt-1">{present}</p>
          </div>
          <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900/60">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Missed</p>
            <p className="text-xl font-bold text-rose-450 mt-1">{absent}</p>
          </div>
        </div>

        <div className="flex justify-center md:justify-start pt-1">
          {getStatusBadge()}
        </div>
      </div>
    </Card>
  );
}
