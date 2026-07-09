"use client";

import { Edit, Trash2, Calendar, FileText, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteDepartmentMutation } from "../hooks/department.hooks";
import type { Department } from "../types/department.types";

interface DepartmentsTableProps {
  departments: Department[];
  isAdmin: boolean;
  onEdit: (department: Department) => void;
}

export default function DepartmentsTable({
  departments,
  isAdmin,
  onEdit,
}: DepartmentsTableProps) {
  const { mutate: deactivateDept, isPending } = useDeleteDepartmentMutation();

  const handleDeactivate = (dept: Department) => {
    if (dept.status === "INACTIVE") {
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate the department ${dept.name} (${dept.code})? This will perform a soft-delete (mark it INACTIVE).`
    );
    if (confirmDelete) {
      deactivateDept(dept._id);
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
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Department Name</th>
              <th className="p-4">Code</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
              {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {departments.length ? (
              departments.map((dept) => (
                <tr
                  key={dept._id}
                  className="hover:bg-slate-900/10 transition-colors"
                >
                  {/* Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400 font-bold shrink-0">
                        <Bookmark className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">
                          {dept.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          ID: {dept._id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Code */}
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-xs font-bold text-slate-200">
                      {dept.code}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="p-4 text-slate-400 max-w-xs truncate">
                    {dept.description ? (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {dept.description}
                      </span>
                    ) : (
                      <span className="text-slate-650 italic">No description</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                        dept.status
                      )}`}
                    >
                      {dept.status}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="p-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{new Date(dept.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>

                  {/* Actions (Admin Only) */}
                  {isAdmin ? (
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                          onClick={() => onEdit(dept)}
                          disabled={isPending}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                          disabled={dept.status === "INACTIVE" || isPending}
                          onClick={() => handleDeactivate(dept)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="p-8 text-center text-slate-500"
                >
                  No departments found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
