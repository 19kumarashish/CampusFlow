"use client";

import { Edit, Trash2, Calendar, FileText, UserCheck, Briefcase, GraduationCap, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteSectionMutation } from "../hooks/section.hooks";
import type { Section } from "../types/section.types";

interface SectionsTableProps {
  sections: Section[];
  isAdmin: boolean;
  onEdit: (section: Section) => void;
}

export default function SectionsTable({
  sections,
  isAdmin,
  onEdit,
}: SectionsTableProps) {
  const { mutate: deactivateSection, isPending } = useDeleteSectionMutation();

  const handleDeactivate = (sec: Section) => {
    if (sec.status === "INACTIVE") {
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate section ${sec.name}? This will perform a soft-delete (mark it INACTIVE).`
    );
    if (confirmDelete) {
      deactivateSection(sec._id);
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

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl animate-in">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Section Name</th>
              <th className="p-4">Classroom</th>
              <th className="p-4">Semester Term</th>
              <th className="p-4">Faculty Advisor</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Status</th>
              {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {sections.length ? (
              sections.map((sec) => {
                const semester = sec.semester;
                const advisor = sec.facultyAdvisor;
                const advisorUser = advisor?.user;
                const advisorName = advisorUser ? `${advisorUser.firstName} ${advisorUser.lastName}` : "No Advisor";
                const advisorEmail = advisorUser?.email || "No Email";
                const semesterName = semester?.name || "No Semester";

                return (
                  <tr
                    key={sec._id}
                    className="hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Section details */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400 font-bold shrink-0">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {sec.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Classroom */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-205">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{sec.classroom}</span>
                      </div>
                    </td>

                    {/* Semester Term */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-200 font-semibold">{semesterName}</p>
                      <p className="text-slate-500 text-[10px]">
                        Academic Year: {semester?.academicYear} ({semester?.type})
                      </p>
                    </td>

                    {/* Advisor details */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-200 font-semibold flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        {advisorName}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        {advisorEmail}
                      </p>
                    </td>

                    {/* Capacity */}
                    <td className="p-4">
                      <div className="space-y-1.5 w-24">
                        <div className="flex justify-between text-[10px] text-slate-450 font-bold">
                          <span>Capacity</span>
                          <span className="text-slate-300">{sec.capacity} seats</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 border border-slate-850 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min((sec.capacity / 120) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Created At */}
                    <td className="p-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{new Date(sec.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          sec.status
                        )}`}
                      >
                        {sec.status}
                      </span>
                    </td>

                    {/* Actions */}
                    {isAdmin ? (
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                            onClick={() => onEdit(sec)}
                            disabled={isPending}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                            disabled={sec.status === "INACTIVE" || isPending}
                            onClick={() => handleDeactivate(sec)}
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
                  No sections found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
