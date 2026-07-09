"use client";

import {
  BookOpen,
  Award,
  Calendar,
  FileText,
  Clock,
  UserCheck,
  TrendingUp,
  MapPin,
  ClipboardList
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { StudentDashboardData } from "../types/dashboard.types";

interface StudentDashboardProps {
  data: StudentDashboardData;
}

export default function StudentDashboard({ data }: StudentDashboardProps) {
  const { enrollment, assignments, examinations, results, gpa } = data;

  const currentCourseName =
    typeof enrollment.course === "object" ? enrollment.course.name : "Enrollment Course";
  const currentSectionName =
    typeof enrollment.section === "object" ? enrollment.section.name : enrollment.section;

  const statItems = [
    {
      title: "Active Course",
      value: currentCourseName,
      subValue: `Semester ${enrollment.semester}`,
      icon: BookOpen,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10"
    },
    {
      title: "Class Section",
      value: `Section ${currentSectionName}`,
      subValue: `Roll Number: ${enrollment.rollNumber}`,
      icon: UserCheck,
      color: "text-amber-400",
      bg: "bg-amber-500/10"
    },
    {
      title: "Semester SGPA",
      value: gpa ? `${gpa.sgpa.toFixed(2)}` : "N/A",
      subValue: `Credits: ${gpa?.creditsEarned || 0}`,
      icon: Award,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Cumulative CGPA",
      value: gpa ? `${gpa.cgpa.toFixed(2)}` : "N/A",
      subValue: gpa?.resultStatus || "No Status",
      icon: TrendingUp,
      color: "text-rose-400",
      bg: "bg-rose-500/10"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* GPA & Enrollment Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              className="border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 shadow-md"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1 overflow-hidden">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
                    {item.title}
                  </p>
                  <h3 className="text-xl font-bold tracking-tight text-white mt-2 truncate">
                    {item.value}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{item.subValue}</p>
                </div>
                <div className={`p-2.5 rounded-xl shrink-0 ${item.bg} ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Results & Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Marks / Grades list */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-900 pb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" /> Subject Grades & Results
          </h4>
          <div className="overflow-x-auto rounded-lg border border-slate-900 bg-slate-950/50">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Subject</th>
                  <th className="p-4 text-center">Marks Obtained</th>
                  <th className="p-4 text-center">Grade</th>
                  <th className="p-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {results.length ? (
                  results.map((res) => (
                    <tr key={res._id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white text-sm">{res.subject?.name}</p>
                        <p className="text-slate-500 text-[10px] uppercase font-semibold mt-0.5">
                          {res.subject?.code}
                        </p>
                      </td>
                      <td className="p-4 text-center font-semibold text-white">
                        {res.marksObtained} <span className="text-slate-500">/ {res.totalMarks}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                          {res.grade}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">
                        {res.remarks || "No remarks"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      No subject grades released for this semester yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Timelines / Deliverables */}
        <Card className="lg:col-span-1 border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl space-y-6">
          {/* Homework due */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-400" /> Pending Assignments
            </h4>
            <div className="mt-3 divide-y divide-slate-900/60">
              {assignments.length ? (
                assignments.map((assignment) => (
                  <div key={assignment._id} className="py-3 flex justify-between items-start text-xs">
                    <div className="space-y-0.5 max-w-[70%]">
                      <p className="font-bold text-white truncate">{assignment.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight truncate">
                        {assignment.subject?.name}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500 py-4 text-center">No pending assignments</p>
              )}
            </div>
          </div>

          {/* Examinations scheduled */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3 flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-rose-400" /> Upcoming Exams
            </h4>
            <div className="mt-3 divide-y divide-slate-900/60">
              {examinations.length ? (
                examinations.map((exam) => (
                  <div key={exam._id} className="py-3 flex justify-between items-start text-xs">
                    <div className="space-y-0.5 max-w-[70%]">
                      <p className="font-bold text-white truncate">{exam.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight truncate">
                        {exam.subject?.name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(exam.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                      {exam.room && (
                        <p className="text-[9px] text-slate-500 flex items-center gap-0.5 mt-1 justify-end uppercase">
                          <MapPin className="h-2.5 w-2.5" /> Room {exam.room}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500 py-4 text-center">No exams scheduled currently</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
