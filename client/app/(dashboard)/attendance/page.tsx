"use client";

import { useState, useMemo } from "react";
import { CalendarDays, FileCheck, ClipboardList, Loader2, Sparkles, Award } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { RootState } from "@/store";
import { getStudents } from "@/features/students";
import { getEnrollments } from "@/features/enrollments";
import { Button } from "@/components/ui/button";

import {
  AttendanceMarkSheet,
  AttendanceLogTable,
  AttendanceFilter,
  AttendanceSummaryCard,
  useAttendanceListQuery,
  useAttendanceSummaryQuery,
  type AttendanceStatus,
} from "@/features/attendance";

export default function AttendancePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  const [activeTab, setActiveTab] = useState<"LOGS" | "MARK">("LOGS");

  // Query student details if logged-in user is a student
  const { data: studentData } = useQuery({
    queryKey: ["students", { limit: 1, search: user?.email || "" }],
    queryFn: () => getStudents({ limit: 1, search: user?.email || "" }),
    enabled: isStudent && !!user?.email,
  });
  const studentProfile = useMemo(() => studentData?.students[0], [studentData?.students]);

  const { data: enrollmentData } = useQuery({
    queryKey: ["enrollments", { student: studentProfile?._id || "", limit: 1 }],
    queryFn: () => getEnrollments({ student: studentProfile?._id || "", limit: 1 }),
    enabled: !!studentProfile?._id,
  });
  const activeEnrollment = useMemo(() => enrollmentData?.enrollments[0], [enrollmentData?.enrollments]);
  const enrollmentId = activeEnrollment?._id;

  // Search & Filter States
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");

  const attendanceParams = useMemo(() => {
    return {
      limit: 100,
      enrollment: isStudent ? enrollmentId : undefined,
      subject: subjectFilter !== "ALL" ? subjectFilter : undefined,
      status: statusFilter !== "ALL" ? (statusFilter as AttendanceStatus) : undefined,
      date: dateFilter || undefined,
    };
  }, [isStudent, enrollmentId, subjectFilter, statusFilter, dateFilter]);

  // Queries
  const {
    data: logsData,
    isLoading: isLogsLoading,
    isError: isLogsError,
    refetch: refetchLogs,
  } = useAttendanceListQuery(attendanceParams);

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useAttendanceSummaryQuery(enrollmentId || "", !!enrollmentId);

  const isLoading = isLogsLoading || (isStudent && isSummaryLoading);
  const isError = isLogsError || (isStudent && isSummaryError);

  const logs = logsData?.attendance || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-400" /> Attendance Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track daily presence records, manage sheets, or review cumulative academic attendance percentage indicators.
          </p>
        </div>
      </div>

      {/* Role-based workflows */}
      {isStudent ? (
        <div className="space-y-6">
          {/* Summary Indicator Card */}
          {summaryData && (
            <AttendanceSummaryCard summary={summaryData} />
          )}

          {/* Logs search filter */}
          <AttendanceFilter
            subject={subjectFilter}
            onSubjectChange={setSubjectFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            date={dateFilter}
            onDateChange={setDateFilter}
            onReset={() => {
              setSubjectFilter("ALL");
              setStatusFilter("ALL");
              setDateFilter("");
            }}
          />

          {/* List Table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 border border-slate-900 rounded-xl bg-slate-950/20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-xs text-slate-400 mt-3 font-semibold">Resolving attendance logs...</p>
            </div>
          ) : isError ? (
            <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl">
              <p className="text-red-400 text-xs font-semibold">Failed to resolve attendance logs.</p>
              <Button size="sm" variant="outline" className="mt-3 border-slate-800 text-white text-xs" onClick={() => refetchLogs()}>
                Retry
              </Button>
            </div>
          ) : (
            <AttendanceLogTable
              attendanceLogs={logs}
              canEdit={isAdmin || isTeacher}
              onEdit={() => {}}
            />
          )}
        </div>
      ) : (
        /* Teacher / Admin view */
        <div className="space-y-6">
          {/* Toggles */}
          <div className="flex border-b border-slate-900 gap-6">
            <button
              className={`pb-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer
                ${
                  activeTab === "LOGS"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-white"
                }
              `}
              onClick={() => setActiveTab("LOGS")}
            >
              Presence History logs
            </button>
            <button
              className={`pb-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer
                ${
                  activeTab === "MARK"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-white"
                }
              `}
              onClick={() => setActiveTab("MARK")}
            >
              Roll Call (Mark Sheet)
            </button>
          </div>

          {activeTab === "LOGS" ? (
            <div className="space-y-4">
              <AttendanceFilter
                subject={subjectFilter}
                onSubjectChange={setSubjectFilter}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                date={dateFilter}
                onDateChange={setDateFilter}
                onReset={() => {
                  setSubjectFilter("ALL");
                  setStatusFilter("ALL");
                  setDateFilter("");
                }}
              />

              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-20 border border-slate-900 rounded-xl bg-slate-950/20">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs text-slate-400 mt-3 font-semibold">Resolving presence logs...</p>
                </div>
              ) : isError ? (
                <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl">
                  <p className="text-red-400 text-xs font-semibold">Failed to resolve attendance logs.</p>
                  <Button size="sm" variant="outline" className="mt-3 border-slate-800 text-white text-xs" onClick={() => refetchLogs()}>
                    Retry
                  </Button>
                </div>
              ) : (
                <AttendanceLogTable
                  attendanceLogs={logs}
                  canEdit={isAdmin || isTeacher}
                  onEdit={() => {}}
                />
              )}
            </div>
          ) : (
            <div className="p-5 border border-slate-900 bg-slate-950/40 rounded-xl backdrop-blur-xl">
              <AttendanceMarkSheet />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
