"use client";

import { useMemo } from "react";
import { X, Loader2, Award, Calendar, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useExamResultsQuery } from "../hooks/examination.hooks";
import { useEnrollmentsQuery } from "@/features/enrollments";
import type { Examination, ExamResult } from "../types/examination.types";

interface ExamResultsListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  examination: Examination | null;
  onGradeClick: (enrollmentId: string, result: ExamResult | null) => void;
}

export default function ExamResultsListDialog({
  isOpen,
  onClose,
  examination,
  onGradeClick,
}: ExamResultsListDialogProps) {
  // Query all student enrollments in the section of this exam
  const {
    data: enrollmentsData,
    isLoading: isEnrollmentsLoading,
    isError: isEnrollmentsError,
  } = useEnrollmentsQuery({
    section: examination?.section?._id || "",
    limit: 100,
  });

  const students = useMemo(
    () => enrollmentsData?.enrollments || [],
    [enrollmentsData?.enrollments]
  );

  // Query all posted results for this examination
  const {
    data: resultsData,
    isLoading: isResultsLoading,
    isError: isResultsError,
    refetch: refetchResults,
  } = useExamResultsQuery({
    examination: examination?._id || "",
    limit: 100,
  });

  const results = useMemo(
    () => resultsData?.results || [],
    [resultsData?.results]
  );

  const isLoading = isEnrollmentsLoading || isResultsLoading;
  const isError = isEnrollmentsError || isResultsError;

  // Map students to their posted result if it exists
  const studentsWithResults = useMemo(() => {
    return students.map((enrollment) => {
      const match = results.find((r) => r.enrollment?._id === enrollment._id);
      return {
        enrollment,
        result: match || null,
      };
    });
  }, [students, results]);

  if (!isOpen || !examination) return null;

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
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Class Examination Marks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Subject: {examination.subject?.name} | Section: {examination.section?.name} | Maximum Score: {examination.maximumMarks} Marks
            </p>
          </div>
        </div>

        {/* Info panel */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between p-3 bg-muted/40 border border-border/60 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>Date: {new Date(examination.date).toLocaleDateString()}</span>
            <span className="text-slate-500">({examination.startTime} - {examination.endTime})</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-indigo-400 gap-1" onClick={() => refetchResults()}>
            <RefreshCcw className="h-3 w-3" /> Refresh
          </Button>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-3 font-semibold">Resolving marks sheet...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive text-xs font-semibold">
            Failed to fetch student marks sheet.
          </div>
        ) : studentsWithResults.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-xs italic">
            No students enrolled in Section {examination.section?.name} for this subject.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider text-[9px] pb-2">
                  <th className="pb-3 text-left">Student</th>
                  <th className="pb-3 text-left">Roll Number</th>
                  <th className="pb-3 text-left">Marks Secured</th>
                  <th className="pb-3 text-left">Grade</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-slate-350">
                {studentsWithResults.map(({ enrollment, result }) => {
                  const studentDetails = enrollment.student?.user;

                  return (
                    <tr key={enrollment._id} className="hover:bg-slate-900/10 transition-colors">
                      {/* Name */}
                      <td className="py-3 pr-4 font-bold text-white">
                        {studentDetails ? `${studentDetails.firstName} ${studentDetails.lastName}` : "Unknown Student"}
                      </td>

                      {/* Roll */}
                      <td className="py-3 pr-4 font-mono text-[10px] text-slate-400">
                        {enrollment.student?.rollNumber || "N/A"}
                      </td>

                      {/* Marks */}
                      <td className="py-3 pr-4 font-bold">
                        {result ? (
                          <span
                            className={
                              result.obtainedMarks >= examination.passingMarks
                                ? "text-emerald-400"
                                : "text-rose-455"
                            }
                          >
                            {result.obtainedMarks} / {examination.maximumMarks}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Not graded</span>
                        )}
                      </td>

                      {/* Grade */}
                      <td className="py-3 pr-4">
                        {result ? (
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border
                              ${
                                result.grade === "F"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              }
                            `}
                          >
                            {result.grade}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium">Pending</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-semibold"
                          onClick={() => onGradeClick(enrollment._id, result)}
                        >
                          {result ? "Edit Mark" : "Enter Mark"}
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
