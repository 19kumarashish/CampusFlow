"use client";

import { Edit, Trash2, Calendar, FileText, MapPin, Award, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteExaminationMutation } from "../hooks/examination.hooks";
import type { Examination, ExamResult } from "../types/examination.types";

interface ExaminationsTableProps {
  examinations: Examination[];
  role: string;
  enrollmentId?: string;
  studentResults?: ExamResult[];
  onEdit: (examination: Examination) => void;
  onViewResults: (examination: Examination) => void;
}

export default function ExaminationsTable({
  examinations,
  role,
  enrollmentId,
  studentResults = [],
  onEdit,
  onViewResults,
}: ExaminationsTableProps) {
  const { mutate: deleteExam, isPending } = useDeleteExaminationMutation();

  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  const handleDelete = (examination: Examination) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the examination schedule for "${examination.title}"? This cannot be undone.`
    );
    if (confirmDelete) {
      deleteExam(examination._id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "ONGOING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-455 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-450 border-slate-800";
    }
  };

  // Find if a student has an exam result recorded
  const getStudentResult = (examinationId: string) => {
    return studentResults.find(
      (res) =>
        (typeof res.examination === "string" ? res.examination : res.examination?._id) === examinationId
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Examination Info</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Section & Term</th>
              <th className="p-4">Schedule Details</th>
              <th className="p-4">Hall</th>
              <th className="p-4">Marks Limits</th>
              <th className="p-4">Status</th>
              {isStudent ? <th className="p-4">Your Score</th> : null}
              {isAdmin || isTeacher ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {examinations.length ? (
              examinations.map((examination) => {
                const result = getStudentResult(examination._id);

                return (
                  <tr
                    key={examination._id}
                    className="hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Title & Type */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400 font-bold shrink-0">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {examination.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Type: <strong className="text-slate-400">{examination.examType}</strong>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">
                          {examination.subject?.name}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400 mt-0.5">
                          {examination.subject?.code}
                        </span>
                      </div>
                    </td>

                    {/* Section & Semester */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900 text-[10px] text-slate-300 font-medium w-fit">
                          Sec {examination.section?.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {examination.semester?.name}
                        </span>
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-slate-350">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {new Date(examination.date).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {examination.startTime} - {examination.endTime}
                        </span>
                      </div>
                    </td>

                    {/* Hall */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-300 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{examination.hall}</span>
                      </div>
                    </td>

                    {/* Marks */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-slate-300 font-bold">
                          Max: {examination.maximumMarks}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Pass: {examination.passingMarks}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          examination.status
                        )}`}
                      >
                        {examination.status}
                      </span>
                    </td>

                    {/* Student Score */}
                    {isStudent ? (
                      <td className="p-4">
                        {result ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-white flex items-center gap-1 text-[11px]">
                              <Award className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              {result.obtainedMarks} / {examination.maximumMarks}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-400">
                              Grade: {result.grade}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium italic">
                            No marks posted
                          </span>
                        )}
                      </td>
                    ) : null}

                    {/* Actions */}
                    {(isAdmin || isTeacher) && (
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-semibold"
                            onClick={() => onViewResults(examination)}
                          >
                            Marks Sheet
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                            onClick={() => onEdit(examination)}
                            disabled={isPending}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                            disabled={isPending}
                            onClick={() => handleDelete(examination)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={isStudent ? 9 : 8}
                  className="p-8 text-center text-slate-500"
                >
                  No examinations found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
