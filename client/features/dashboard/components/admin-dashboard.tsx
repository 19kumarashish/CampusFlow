"use client";

import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  Calendar,
  FileText,
  Percent,
  TrendingUp,
  MapPin,
  ClipboardList
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { AdminDashboardData } from "../types/dashboard.types";

interface AdminDashboardProps {
  data: AdminDashboardData;
}

export default function AdminDashboard({ data }: AdminDashboardProps) {
  const {
    statistics,
    attendance,
    results,
    examinations,
    assignments,
    admissions,
    departments
  } = data;

  const statItems = [
    {
      title: "Total Students",
      value: statistics.students,
      icon: Users,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]",
      desc: `${statistics.enrollments} active course enrollments`
    },
    {
      title: "Faculty Members",
      value: statistics.faculty,
      icon: GraduationCap,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
      desc: `${statistics.sections} sections assigned`
    },
    {
      title: "Departments",
      value: statistics.departments,
      icon: Building2,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
      desc: "Core academic departments"
    },
    {
      title: "Active Courses",
      value: statistics.courses,
      icon: BookOpen,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]",
      desc: `${statistics.subjects} syllabus subjects`
    }
  ];

  // Helper to format month names
  const getMonthName = (monthNum: number) => {
    const dates = new Date(2026, monthNum - 1, 1);
    return dates.toLocaleString("en-US", { month: "short" });
  };

  // Find max admissions value for scaling CSS bar chart
  const maxAdmissions = admissions.length
    ? Math.max(...admissions.map((a) => a.students))
    : 10;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              className={`border-border/40 bg-slate-950/30 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/20 premium-grid-hover ${item.border}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.title}
                  </p>
                  <h3 className="text-3xl font-extrabold tracking-tight mt-2 text-white">
                    {item.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-450 mt-3 flex items-center gap-1.5 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                {item.desc}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Rate */}
        <Card className="border-border/40 bg-slate-950/30 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-primary/10 premium-grid-hover">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-350 border-b border-border/40 pb-3 flex items-center gap-2">
              <Percent className="h-4 w-4 text-indigo-400" /> Attendance Rate
            </h4>
            <div className="flex flex-col items-center py-6">
              {/* Circular Attendance Graphic */}
              <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-[10px] border-slate-900/60 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                {/* Visual percentage ring styled in CSS */}
                <div className="absolute inset-0 rounded-full border-[10px] border-indigo-500/20" />
                <span className="text-3xl font-extrabold text-white">
                  {attendance.attendanceRate}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">
                Overall student presence rate across all sections
              </p>
            </div>
          </div>
        </Card>

        {/* Academic Analytics */}
        <Card className="border-border/40 bg-slate-950/30 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-primary/10 premium-grid-hover">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-350 border-b border-border/40 pb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" /> Academic Performance
            </h4>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">AVERAGE CGPA</span>
                  <span className="text-emerald-400 font-bold">{results.averageCGPA} / 10.0</span>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2.5 overflow-hidden border border-border/40">
                  <div
                    className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: `${(results.averageCGPA / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">PASS RATE</span>
                  <span className="text-indigo-400 font-bold">{results.passRate}%</span>
                </div>
                <div className="w-full bg-slate-900/60 rounded-full h-2.5 overflow-hidden border border-border/40">
                  <div
                    className="bg-indigo-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                    style={{ width: `${results.passRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Performing Departments */}
        <Card className="border-border/40 bg-slate-950/30 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-primary/10 premium-grid-hover">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-350 border-b border-border/40 pb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-400" /> Top Departments
            </h4>
            <div className="divide-y divide-slate-900/60 mt-2">
              {departments.length ? (
                departments.map((dept, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-xs">
                    <span className="text-slate-350 font-medium flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-[10px] text-slate-500 font-bold border border-border/40">
                        {idx + 1}
                      </span>
                      {dept._id || "General"}
                    </span>
                    <span className="font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded border border-border/40">
                      {dept.averageCGPA} GPA
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No department metrics available</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Admissions Chart & Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admissions Trend */}
        <Card className="lg:col-span-1 border-border/40 bg-slate-950/30 p-6 backdrop-blur-xl hover:border-primary/10 premium-grid-hover">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-350 border-b border-border/40 pb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400" /> Monthly Admissions
          </h4>
          <div className="mt-6 flex h-48 items-end gap-3 px-2 border-b border-border/40 pb-2">
            {admissions.length ? (
              admissions.map((item, idx) => {
                const heightPercent = maxAdmissions
                  ? (item.students / maxAdmissions) * 100
                  : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 bg-slate-900 border border-border/40 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacityReady whitespace-nowrap text-white">
                      {item.students} Students
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full bg-indigo-600/60 group-hover:bg-indigo-500 rounded-t-sm transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.2)]"
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    />
                    <span className="text-[9px] text-slate-500 mt-2 font-bold">
                      {getMonthName(item._id.month)} '{String(item._id.year).slice(-2)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                No admissions data recorded
              </div>
            )}
          </div>
        </Card>

        {/* Recent Schedule Overview */}
        <Card className="lg:col-span-2 border-border/40 bg-slate-950/30 p-6 backdrop-blur-xl space-y-6 hover:border-primary/10 premium-grid-hover">
          {/* Upcoming Examinations */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-350 border-b border-border/40 pb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-rose-400" /> Upcoming Examinations
            </h4>
            <div className="mt-3 overflow-hidden rounded-lg border border-border/40 bg-slate-950/10">
              <div className="divide-y divide-border/40">
                {examinations.length ? (
                  examinations.map((exam) => (
                    <div key={exam._id} className="p-3.5 flex justify-between items-center text-xs hover:bg-slate-900/30 transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold text-white text-sm">{exam.name}</p>
                        <p className="text-slate-400 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-border/40 text-[10px] font-semibold text-slate-300 uppercase">
                            {exam.subject?.code}
                          </span>
                          {exam.subject?.name}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-indigo-400">
                          {new Date(exam.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-slate-500 text-[10px] flex items-center gap-1 justify-end uppercase font-bold">
                          <MapPin className="h-3 w-3" /> Section {exam.section?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 p-4 text-center">No exams scheduled currently</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Assignments */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-350 border-b border-border/40 pb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" /> Recently Published Assignments
            </h4>
            <div className="mt-3 overflow-hidden rounded-lg border border-border/40 bg-slate-950/10">
              <div className="divide-y divide-border/40">
                {assignments.length ? (
                  assignments.map((assignment) => (
                    <div key={assignment._id} className="p-3.5 flex justify-between items-center text-xs hover:bg-slate-900/30 transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold text-white text-sm">{assignment.title}</p>
                        <p className="text-slate-400 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-border/40 text-[10px] font-semibold text-slate-300 uppercase">
                            {assignment.subject?.code}
                          </span>
                          {assignment.subject?.name}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-amber-400">
                          Due:{" "}
                          {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })}
                        </p>
                        <p className="text-slate-550 text-[10px]">
                          Created: {new Date(assignment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 p-4 text-center">No assignments published recently</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
