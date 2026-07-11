"use client";

import { useState, useMemo } from "react";
import { Award, Plus, CheckCircle, RefreshCcw, Loader2, ListFilter, Clipboard } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStudents } from "@/features/students";
import { getResults } from "@/features/results";
import { getEnrollments } from "@/features/enrollments";
import {
  useRevaluationsQuery,
  useCreateRevaluationMutation,
  useApproveRevaluationMutation,
} from "@/features/academic";
import { RootState } from "@/store";

export default function RevaluationPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";
  const isStudent = role === "STUDENT";

  const [revaluedMarksMap, setRevaluedMarksMap] = useState<Record<string, string>>({});
  const [selectedResultId, setSelectedResultId] = useState("");

  // Zod simulation form inputs
  const [studentProfileId, setStudentProfileId] = useState("");

  // Query student details if logged-in user is a student
  const { data: studentData } = useQuery({
    queryKey: ["students", { limit: 1, search: user?.email || "" }],
    queryFn: () => getStudents({ limit: 1, search: user?.email || "" }),
    enabled: isStudent && !!user?.email,
  });
  const studentProfile = useMemo(() => studentData?.students[0], [studentData?.students]);
  const activeStudentId = isStudent ? studentProfile?._id : studentProfileId;

  // Query student's active enrollment
  const { data: enrollmentData } = useQuery({
    queryKey: ["enrollments", { student: activeStudentId || "", limit: 1 }],
    queryFn: () => getEnrollments({ student: activeStudentId || "", limit: 1 }),
    enabled: !!activeStudentId,
  });
  const activeEnrollment = useMemo(() => enrollmentData?.enrollments[0], [enrollmentData?.enrollments]);

  // Query student's exam results to apply revaluation
  const { data: resultsData } = useQuery({
    queryKey: ["results", { enrollment: activeEnrollment?._id || "", limit: 100 }],
    queryFn: () => getResults({ enrollment: activeEnrollment?._id || undefined, limit: 100 }),
    enabled: !!activeEnrollment?._id,
  });
  const resultsList = resultsData?.results || [];

  const selectedResult = useMemo(() => {
    return resultsList.find((r) => r._id === selectedResultId);
  }, [selectedResultId, resultsList]);

  // Queries for revaluation items
  const queryParams = useMemo(() => {
    return {
      studentId: isStudent ? studentProfile?._id : undefined,
    };
  }, [isStudent, studentProfile?._id]);

  const { data: revaluationsList, isLoading } = useRevaluationsQuery(queryParams);

  const { mutate: createRequest, isPending: isCreating } = useCreateRevaluationMutation();
  const { mutate: approveRequest, isPending: isApproving } = useApproveRevaluationMutation();

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudentId || !selectedResult) return;

    createRequest({
      student: activeStudentId,
      result: selectedResult._id,
      subject: selectedResult.subject?._id || selectedResult.subject,
      originalMarks: selectedResult.totalMarks,
    }, {
      onSuccess: () => {
        setSelectedResultId("");
      }
    });
  };

  const handleApproveAction = (id: string, status: "APPROVED" | "REJECTED") => {
    const marks = revaluedMarksMap[id];
    if (status === "APPROVED" && (!marks || isNaN(Number(marks)))) {
      alert("Please provide a valid revalued marks score.");
      return;
    }

    approveRequest({
      id,
      data: {
        status,
        revaluedMarks: status === "APPROVED" ? Number(marks) : undefined,
      },
    }, {
      onSuccess: () => {
        // Clear input value
        setRevaluedMarksMap((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-450 border-emerald-500/20";
      case "REJECTED":
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
          <Award className="h-6 w-6 text-indigo-400" /> Revaluation Reviews Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Apply for exam grade audits, submit paper recalculations, and evaluate requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apply panel (Students / Admins) */}
        {!isAdmin && (
          <Card className="lg:col-span-1 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
              <Plus className="h-4.5 w-4.5 text-indigo-400" /> Apply for Revaluation
            </h3>
            {isStudent && !studentProfile ? (
              <div className="p-4 text-center text-xs text-slate-500">
                Fetching student reference...
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                {/* Select Exam Grade Result */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Target Coursework/Exam</label>
                  <select
                    required
                    className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1"
                    value={selectedResultId}
                    onChange={(e) => setSelectedResultId(e.target.value)}
                  >
                    <option value="" className="bg-slate-950">Choose Result Sheet</option>
                    {resultsList.map((res: any) => (
                      <option key={res._id} value={res._id} className="bg-slate-950">
                        {res.subject?.name || "Subject"} - Score: {res.totalMarks}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedResult && (
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-3.5 space-y-2 text-slate-400 text-[11px] leading-relaxed">
                    <p className="font-bold text-white uppercase tracking-wider text-[9px] text-slate-500">Record Preview</p>
                    <p>Subject Code: <span className="font-semibold text-white">{selectedResult.subject?.code}</span></p>
                    <p>Exam Score Obtained: <span className="font-semibold text-white">{selectedResult.totalMarks}</span></p>
                    <p>Calculated Percentage: <span className="font-semibold text-white">{selectedResult.percentage}%</span></p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedResultId || isCreating}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-9 mt-4"
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Submit Review Application ($50 fee simulated)"
                  )}
                </Button>
              </form>
            )}
          </Card>
        )}

        {/* List Grid */}
        <Card className={`border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl ${!isAdmin ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="pb-3 border-b border-slate-900">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clipboard className="h-4.5 w-4.5 text-indigo-400" /> Revaluation Applications
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : revaluationsList?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Student</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4 text-center">Original Marks</th>
                    <th className="p-4 text-center">Revalued Score</th>
                    <th className="p-4 text-center">Status</th>
                    {isAdmin ? <th className="p-4 text-center">Re-marks Input & Actions</th> : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-350">
                  {revaluationsList.map((log: any) => {
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
                        <td className="p-4 text-center font-mono font-semibold">{log.originalMarks}</td>
                        <td className="p-4 text-center font-mono font-bold text-slate-205">
                          {log.revaluedMarks !== undefined ? log.revaluedMarks : "-"}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        {isAdmin ? (
                          <td className="p-4">
                            {log.status === "PENDING" ? (
                              <div className="flex items-center justify-center gap-2">
                                <input
                                  type="number"
                                  placeholder="New marks"
                                  className="h-8 w-20 rounded border border-slate-805 bg-slate-900/60 px-2 text-[10px] text-white focus:outline-none focus:border-indigo-500"
                                  value={revaluedMarksMap[log._id] || ""}
                                  onChange={(e) =>
                                    setRevaluedMarksMap((prev) => ({
                                      ...prev,
                                      [log._id]: e.target.value,
                                    }))
                                  }
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-emerald-500/20 bg-emerald-500/10 text-emerald-450 hover:bg-emerald-500 hover:text-white"
                                  onClick={() => handleApproveAction(log._id, "APPROVED")}
                                  disabled={isApproving}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-red-500 hover:text-white"
                                  onClick={() => handleApproveAction(log._id, "REJECTED")}
                                  disabled={isApproving}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-600 text-center block">-</span>
                            )}
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
              No revaluation applications logged.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
