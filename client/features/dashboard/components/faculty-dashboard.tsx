"use client";

import { FileText, ClipboardList, Calendar, MapPin, Plus, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FacultyDashboardData } from "../types/dashboard.types";

interface FacultyDashboardProps {
  data: FacultyDashboardData;
}

export default function FacultyDashboard({ data }: FacultyDashboardProps) {
  const { assignments, examinations } = data;

  const statItems = [
    {
      title: "Active Assignments",
      value: assignments.length,
      icon: FileText,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]",
      desc: "Assignments published by you"
    },
    {
      title: "Assigned Exams",
      value: examinations.length,
      icon: ClipboardList,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]",
      desc: "Upcoming exams assigned to you"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quick stats and Actions */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-stretch">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className={`border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:translate-y-[-2px] ${item.border}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Quick Action Card */}
        <Card className="w-full md:w-80 border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl flex flex-col justify-between shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-indigo-400" /> Workspace Actions
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Access utilities to publish new homework sets or schedules.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 shadow-lg shadow-indigo-600/10">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Assignment
            </Button>
          </div>
        </Card>
      </div>

      {/* Main lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Assignments */}
        <Card className="border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-900 pb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" /> Published Assignments
          </h4>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-900 bg-slate-950/50">
            <div className="divide-y divide-slate-900">
              {assignments.length ? (
                assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="p-4 flex justify-between items-center text-xs hover:bg-slate-900/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{assignment.title}</p>
                      <p className="text-slate-400 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-[10px] font-semibold text-slate-300 uppercase">
                          {assignment.subject?.code}
                        </span>
                        {assignment.subject?.name}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-indigo-400">
                        Due:{" "}
                        {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        })}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        Created: {new Date(assignment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 p-6 text-center">No assignments published yet</p>
              )}
            </div>
          </div>
        </Card>

        {/* Assigned Examinations */}
        <Card className="border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-900 pb-3 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-rose-400" /> Scheduled Examinations
          </h4>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-900 bg-slate-950/50">
            <div className="divide-y divide-slate-900">
              {examinations.length ? (
                examinations.map((exam) => (
                  <div
                    key={exam._id}
                    className="p-4 flex justify-between items-center text-xs hover:bg-slate-900/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{exam.name}</p>
                      <p className="text-slate-400 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-[10px] font-semibold text-slate-300 uppercase">
                          {exam.subject?.code}
                        </span>
                        {exam.subject?.name}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-indigo-400 flex items-center justify-end gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(exam.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-slate-500 text-[10px] flex items-center gap-1 justify-end uppercase">
                        <MapPin className="h-3 w-3" /> Section {exam.section?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 p-6 text-center">No proctoring exams scheduled</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
