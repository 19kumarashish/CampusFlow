"use client";

import { useMemo } from "react";
import { X, Loader2, FileCheck, ExternalLink, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSubmissionsQuery } from "../hooks/assignment.hooks";
import type { Assignment, Submission } from "../types/assignment.types";

interface SubmissionsListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onGradeClick: (submission: Submission) => void;
}

export default function SubmissionsListDialog({
  isOpen,
  onClose,
  assignment,
  onGradeClick,
}: SubmissionsListDialogProps) {
  // Query submissions for this assignment
  const {
    data: submissionsData,
    isLoading,
    isError,
    refetch,
  } = useSubmissionsQuery({
    assignment: assignment?._id || "",
    limit: 100,
  });

  const submissions = useMemo(
    () => submissionsData?.submissions || [],
    [submissionsData?.submissions]
  );

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="relative w-full max-w-2xl border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-md max-h-[85vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-border/80 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Student Submissions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review and grade submissions for "{assignment.title}" (Max: {assignment.maxMarks} Marks)
            </p>
          </div>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-3">Fetching submission records...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-destructive text-xs font-semibold">Failed to fetch student submissions.</p>
            <Button size="sm" variant="outline" className="mt-3 border-border" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-xs italic">
            No submissions recorded yet for this assignment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider text-[9px]">
                  <th className="pb-3 text-left">Student Info</th>
                  <th className="pb-3 text-left">Submitted Date</th>
                  <th className="pb-3 text-left">Files</th>
                  <th className="pb-3 text-left">Grade Details</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-slate-300">
                {submissions.map((sub) => {
                  const student = sub.enrollment?.student;
                  const userDetails = student?.user;
                  const attachment = sub.attachments[0];

                  return (
                    <tr key={sub._id} className="hover:bg-slate-900/10 transition-colors">
                      {/* Student name & ID */}
                      <td className="py-3 pr-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">
                            {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : "Unknown"}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            ID: {student?.studentId || sub.enrollment?._id}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 pr-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                          <span>{new Date(sub.submissionDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Attachment Link */}
                      <td className="py-3 pr-4 text-primary">
                        {attachment ? (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:underline font-medium text-[11px]"
                          >
                            {attachment.fileName}
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground/60 italic">No file link</span>
                        )}
                      </td>

                      {/* Grade */}
                      <td className="py-3 pr-4">
                        {sub.status === "GRADED" ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-white flex items-center gap-1 text-[11px]">
                              <Award className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              {sub.marks} / {assignment.maxMarks}
                            </span>
                            {sub.feedback && (
                              <span className="text-[10px] text-muted-foreground italic truncate max-w-[150px]" title={sub.feedback}>
                                "{sub.feedback}"
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                            PENDING
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-semibold"
                          onClick={() => onGradeClick(sub)}
                        >
                          Grade
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
