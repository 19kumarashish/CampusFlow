"use client";

import { useMemo } from "react";
import { Edit, Trash2, Calendar, FileText, ClipboardList, Send, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteAssignmentMutation } from "../hooks/assignment.hooks";
import type { Assignment, Submission } from "../types/assignment.types";

interface AssignmentsTableProps {
  assignments: Assignment[];
  role: string;
  enrollmentId?: string; // Passed in for students to detect submission status
  studentSubmissions?: Submission[]; // Submissions history for the student
  onEdit: (assignment: Assignment) => void;
  onViewSubmissions: (assignment: Assignment) => void;
  onSubmitAssignment: (assignment: Assignment) => void;
}

export default function AssignmentsTable({
  assignments,
  role,
  enrollmentId,
  studentSubmissions = [],
  onEdit,
  onViewSubmissions,
  onSubmitAssignment,
}: AssignmentsTableProps) {
  const { mutate: deleteAssignment, isPending } = useDeleteAssignmentMutation();

  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  const handleDelete = (assignment: Assignment) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the assignment "${assignment.title}"? This cannot be undone.`
    );
    if (confirmDelete) {
      deleteAssignment(assignment._id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "DRAFT":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "CLOSED":
        return "bg-rose-500/10 text-rose-455 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-450 border-slate-800";
    }
  };

  // Find if a student has already submitted for this assignment
  const getStudentSubmission = (assignmentId: string) => {
    return studentSubmissions.find(
      (sub) =>
        (typeof sub.assignment === "string" ? sub.assignment : sub.assignment?._id) === assignmentId
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Assignment Info</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Section / Term</th>
              <th className="p-4">Max Marks</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              {isStudent ? <th className="p-4">Your Status</th> : null}
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {assignments.length ? (
              assignments.map((assignment) => {
                const submission = getStudentSubmission(assignment._id);

                return (
                  <tr
                    key={assignment._id}
                    className="hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Title & Desc */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400 font-bold shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {assignment.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 max-w-[200px] truncate">
                            {assignment.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">
                          {assignment.subject?.name}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400 mt-0.5">
                          {assignment.subject?.code}
                        </span>
                      </div>
                    </td>

                    {/* Section & Semester */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900 text-[10px] text-slate-300 font-medium w-fit">
                          Sec {assignment.section?.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {assignment.semester?.name}
                        </span>
                      </div>
                    </td>

                    {/* Max Marks */}
                    <td className="p-4">
                      <span className="font-bold text-slate-300">
                        {assignment.maxMarks}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          assignment.status
                        )}`}
                      >
                        {assignment.status}
                      </span>
                    </td>

                    {/* Student Status */}
                    {isStudent ? (
                      <td className="p-4">
                        {submission ? (
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold w-fit
                                ${
                                  submission.status === "GRADED"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }
                              `}
                            >
                              {submission.status}
                            </span>
                            {submission.status === "GRADED" && (
                              <span className="text-[10px] font-bold text-white">
                                {submission.marks} / {assignment.maxMarks}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium italic">
                            Unsubmitted
                          </span>
                        )}
                      </td>
                    ) : null}

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Student submit action */}
                        {isStudent && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={assignment.status === "CLOSED" || !!submission}
                            className="h-8 border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-semibold"
                            onClick={() => onSubmitAssignment(assignment)}
                          >
                            <Send className="mr-1.5 h-3.5 w-3.5" />
                            {submission ? "Submitted" : "Submit"}
                          </Button>
                        )}

                        {/* Teacher View submissions & Grade */}
                        {(isTeacher || isAdmin) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-semibold"
                            onClick={() => onViewSubmissions(assignment)}
                          >
                            <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
                            Submissions
                          </Button>
                        )}

                        {/* Edit / Delete */}
                        {(isTeacher || isAdmin) && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                              onClick={() => onEdit(assignment)}
                              disabled={isPending}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                              disabled={isPending}
                              onClick={() => handleDelete(assignment)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={isStudent ? 8 : 7}
                  className="p-8 text-center text-slate-500"
                >
                  No assignments found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
