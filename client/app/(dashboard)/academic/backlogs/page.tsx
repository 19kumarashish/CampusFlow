"use client";

import { useState, useMemo } from "react";
import { BookMarked, Plus, CheckCircle, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStudentsQuery } from "@/features/students";
import { useSubjectsQuery } from "@/features/subjects";
import { useSemestersQuery } from "@/features/semesters";
import {
  useBacklogsQuery,
  useCreateBacklogMutation,
  useClearBacklogMutation,
} from "@/features/academic";
import { RootState } from "@/store";

export default function BacklogsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";

  const [studentFilter, setStudentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Form states
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [attempts, setAttempts] = useState(1);

  // Queries
  const { data: studentsData } = useStudentsQuery({ limit: 100, status: "ACTIVE" as any });
  const activeStudents = useMemo(() => studentsData?.students || [], [studentsData?.students]);

  const { data: subjectsData } = useSubjectsQuery({ limit: 100, status: "ACTIVE" });
  const activeSubjects = useMemo(() => subjectsData?.subjects || [], [subjectsData?.subjects]);

  const { data: semestersData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = useMemo(() => semestersData?.semesters || [], [semestersData?.semesters]);

  const queryParams = useMemo(() => {
    return {
      studentId: studentFilter !== "ALL" ? studentFilter : undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
    };
  }, [studentFilter, statusFilter]);

  const { data: backlogList, isLoading, refetch } = useBacklogsQuery(queryParams);

  const { mutate: createBacklog, isPending: isCreating } = useCreateBacklogMutation();
  const { mutate: clearBacklog, isPending: isClearing } = useClearBacklogMutation();

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !subjectId || !semesterId) return;

    createBacklog({
      student: studentId,
      subject: subjectId,
      originalSemester: semesterId,
      attempts,
    }, {
      onSuccess: () => {
        setStudentId("");
        setSubjectId("");
        setSemesterId("");
        setAttempts(1);
      }
    });
  };

  const handleClear = (id: string) => {
    if (window.confirm("Mark this backlog subject as cleared?")) {
      clearBacklog(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLEARED":
        return "bg-emerald-500/10 text-emerald-450 border-emerald-500/20";
      case "FAILED":
        return "bg-rose-500/10 text-rose-455 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-450 border-amber-500/20 animate-pulse";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title bar */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <BookMarked className="h-6 w-6 text-indigo-400" /> Backlog Subject Registrations
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Record student backlog classes, audit repeat attempts, and mark subject clearances.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Register panel */}
        {isAdmin && (
          <Card className="lg:col-span-1 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
              <Plus className="h-4.5 w-4.5 text-indigo-400" /> Log Backlog Entry
            </h3>
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {/* Student */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Student</label>
                <select
                  required
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  <option value="" className="bg-slate-950">Select Student</option>
                  {activeStudents.map((st) => (
                    <option key={st._id} value={st._id} className="bg-slate-950">
                      {st.user ? `${st.user.firstName} ${st.user.lastName}` : st.studentId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Backlog Subject</label>
                <select
                  required
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="" className="bg-slate-950">Select Subject</option>
                  {activeSubjects.map((sub) => (
                    <option key={sub._id} value={sub._id} className="bg-slate-950">
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* originalSemester */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Origin Semester</label>
                <select
                  required
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                  value={semesterId}
                  onChange={(e) => setSemesterId(e.target.value)}
                >
                  <option value="" className="bg-slate-950">Select Term</option>
                  {activeSemesters.map((s) => (
                    <option key={s._id} value={s._id} className="bg-slate-950">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attempts */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Attempt Count</label>
                <input
                  required
                  type="number"
                  min={1}
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                  value={attempts}
                  onChange={(e) => setAttempts(Number(e.target.value))}
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 mt-4"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Log Repeat Backlog"
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Dashboard Grid */}
        <Card className={`border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl ${isAdmin ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-900">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-400" /> Active Backlogs Logs
            </h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 text-xs">
              <select
                className="h-8 rounded border border-slate-850 bg-slate-900/40 px-2 text-slate-300 text-[10px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="REGISTERED">Registered</option>
                <option value="CLEARED">Cleared</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : backlogList?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Student</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Original Term</th>
                    <th className="p-4 text-center">Attempts</th>
                    <th className="p-4 text-center">Status</th>
                    {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-350">
                  {backlogList.map((log: any) => {
                    const studentName = log.student?.user
                      ? `${log.student.user.firstName} ${log.student.user.lastName}`
                      : `ID: ${log.student?.studentId || "Student"}`;

                    return (
                      <tr key={log._id} className="hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-white">{studentName}</td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-300">{log.subject?.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{log.subject?.code}</p>
                        </td>
                        <td className="p-4">{log.originalSemester?.name}</td>
                        <td className="p-4 text-center font-mono font-bold text-slate-205">
                          {log.attempts}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        {isAdmin ? (
                          <td className="p-4">
                            <div className="flex justify-center">
                              {log.status === "REGISTERED" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-emerald-500/20 bg-emerald-500/10 text-emerald-450 hover:bg-emerald-500 hover:text-white"
                                  onClick={() => handleClear(log._id)}
                                  disabled={isClearing}
                                >
                                  <CheckCircle className="mr-1 h-3.5 w-3.5" /> Clear
                                </Button>
                              ) : (
                                <span className="text-[10px] text-slate-600">-</span>
                              )}
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center p-8 text-slate-500 text-xs italic">
              No backlog records logged matching selected parameters.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
