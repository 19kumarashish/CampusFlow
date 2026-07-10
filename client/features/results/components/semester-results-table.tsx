"use client";

import { Award, GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublishResultMutation } from "../hooks/result.hooks";
import type { SemesterResult } from "../types/result.types";

interface SemesterResultsTableProps {
  results: SemesterResult[];
  isAdmin: boolean;
}

export default function SemesterResultsTable({
  results,
  isAdmin,
}: SemesterResultsTableProps) {
  const { mutate: publishResult, isPending } = usePublishResultMutation();

  const handlePublish = (id: string) => {
    if (window.confirm("Are you sure you want to publish this Semester GPA record? It will update the student's cumulative transcript.")) {
      publishResult(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "DRAFT":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "REVISED":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-450 border-slate-800";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Student Name</th>
              <th className="p-4">Academic Semester</th>
              <th className="p-4">SGPA</th>
              <th className="p-4">CGPA</th>
              <th className="p-4">Credits Attempted / Earned</th>
              <th className="p-4">Subject Status</th>
              <th className="p-4">Status</th>
              {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {results.length ? (
              results.map((result) => {
                const studentUser = result.enrollment?.student?.user;
                return (
                  <tr key={result._id} className="hover:bg-slate-900/10 transition-colors">
                    {/* Student */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400 font-bold shrink-0">
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {studentUser ? `${studentUser.firstName} ${studentUser.lastName}` : "Unknown Student"}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Roll: {result.enrollment?.student?.rollNumber || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Semester */}
                    <td className="p-4">
                      <span className="font-bold text-slate-200">
                        {result.semester?.name}
                      </span>
                    </td>

                    {/* SGPA */}
                    <td className="p-4">
                      <span className="text-sm font-extrabold text-indigo-400">
                        {result.sgpa.toFixed(2)}
                      </span>
                    </td>

                    {/* CGPA */}
                    <td className="p-4">
                      <span className="text-sm font-extrabold text-emerald-450">
                        {result.cgpa.toFixed(2)}
                      </span>
                    </td>

                    {/* Credits */}
                    <td className="p-4">
                      <span className="text-slate-300">
                        {result.creditsEarned} / {result.creditsAttempted} Cr
                      </span>
                    </td>

                    {/* Passed / Failed Subjects */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-emerald-400 font-bold">{result.passedSubjects} Passed</span>
                        <span className="text-slate-600">|</span>
                        <span className={result.failedSubjects > 0 ? "text-rose-400 font-bold" : "text-slate-500"}>
                          {result.failedSubjects} Failed
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(result.status)}`}>
                        {result.status}
                      </span>
                    </td>

                    {/* Actions */}
                    {isAdmin ? (
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={result.status === "PUBLISHED" || isPending}
                            className="h-8 border-emerald-500/25 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-[11px] font-bold"
                            onClick={() => handlePublish(result._id)}
                          >
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Publish
                          </Button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="p-8 text-center text-slate-500">
                  No Semester GPA sheets found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
