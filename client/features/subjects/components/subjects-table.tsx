"use client";

import { Edit, Trash2, Calendar, FileText, Award, BookMarked, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteSubjectMutation } from "../hooks/subject.hooks";
import type { Subject } from "../types/subject.types";

interface SubjectsTableProps {
  subjects: Subject[];
  isAdmin: boolean;
  onEdit: (subject: Subject) => void;
}

export default function SubjectsTable({
  subjects,
  isAdmin,
  onEdit,
}: SubjectsTableProps) {
  const { mutate: deactivateSub, isPending } = useDeleteSubjectMutation();

  const handleDeactivate = (subject: Subject) => {
    if (subject.status === "INACTIVE") {
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate the subject ${subject.name} (${subject.code})? This will perform a soft-delete (mark it INACTIVE).`
    );
    if (confirmDelete) {
      deactivateSub(subject._id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "INACTIVE":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-450 border-slate-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "THEORY":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "LAB":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "PROJECT":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "ELECTIVE":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-350 border-slate-850";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Subject</th>
              <th className="p-4">Department</th>
              <th className="p-4">Course</th>
              <th className="p-4">Semester & Credits</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created At</th>
              {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {subjects.length ? (
              subjects.map((sub) => {
                const deptName = sub.department?.name || "No Department";
                const courseName = sub.course?.name || "No Course";
                
                return (
                  <tr
                    key={sub._id}
                    className="hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Subject info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400 font-bold shrink-0">
                          <BookMarked className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {sub.name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Code: {sub.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-4">
                      <span className="text-slate-200 font-medium">
                        {deptName}
                      </span>
                    </td>

                    {/* Course */}
                    <td className="p-4">
                      <span className="text-slate-200 font-medium">
                        {courseName}
                      </span>
                    </td>

                    {/* Semester & Credits */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-300 flex items-center gap-1.5 font-semibold">
                        <Layers className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        Semester {sub.semester}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        {sub.credits} {sub.credits === 1 ? "Credit" : "Credits"}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getTypeColor(
                          sub.type
                        )}`}
                      >
                        {sub.type}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          sub.status
                        )}`}
                      >
                        {sub.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    {isAdmin ? (
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                            onClick={() => onEdit(sub)}
                            disabled={isPending}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                            disabled={sub.status === "INACTIVE" || isPending}
                            onClick={() => handleDeactivate(sub)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 8 : 7}
                  className="p-8 text-center text-slate-500"
                >
                  No subjects found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
