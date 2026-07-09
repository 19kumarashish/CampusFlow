"use client";

import { Edit, Trash2, Calendar, FileText, Award, UserCheck, Briefcase, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteFacultyMutation } from "../hooks/faculty.hooks";
import type { Faculty } from "../types/faculty.types";

interface FacultyTableProps {
  faculties: Faculty[];
  isAdmin: boolean;
  onEdit: (faculty: Faculty) => void;
}

export default function FacultyTable({
  faculties,
  isAdmin,
  onEdit,
}: FacultyTableProps) {
  const { mutate: deactivateFaculty, isPending } = useDeleteFacultyMutation();

  const handleDeactivate = (fac: Faculty) => {
    if (fac.status === "INACTIVE") {
      return;
    }
    const name = fac.user ? `${fac.user.firstName} ${fac.user.lastName}` : "Faculty";
    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate the faculty profile for ${name} (${fac.employeeId})? This will perform a soft-delete (mark it INACTIVE).`
    );
    if (confirmDelete) {
      deactivateFaculty(fac._id);
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

  const getDesignationLabel = (desig: string) => {
    return desig.replace(/_/g, " ");
  };

  const getEmploymentLabel = (emp: string) => {
    return emp.replace(/_/g, " ");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Faculty Member</th>
              <th className="p-4">Employee ID</th>
              <th className="p-4">Department</th>
              <th className="p-4">Designation & Employment</th>
              <th className="p-4">Qualification & Focus</th>
              <th className="p-4">Experience</th>
              <th className="p-4">Status</th>
              {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {faculties.length ? (
              faculties.map((fac) => {
                const user = fac.user;
                const name = user ? `${user.firstName} ${user.lastName}` : "Deactivated User";
                const email = user?.email || "No Email";
                const phone = user?.phone || "No Phone";
                const initials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : "FA";
                const deptName = fac.department?.name || "No Department";

                return (
                  <tr
                    key={fac._id}
                    className="hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Faculty Profile */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-850">
                          {user?.avatar ? (
                            <AvatarImage src={user.avatar} alt={name} />
                          ) : null}
                          <AvatarFallback className="bg-indigo-600/80 text-white font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-xs font-bold text-slate-205">
                        {fac.employeeId}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="p-4 text-slate-200 font-medium">
                      {deptName}
                    </td>

                    {/* Designation & Employment */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-200 font-semibold flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        {getDesignationLabel(fac.designation)}
                      </p>
                      <p className="text-slate-500 text-[10px] flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-slate-600 shrink-0" />
                        {getEmploymentLabel(fac.employmentType)}
                      </p>
                    </td>

                    {/* Qualification & Focus */}
                    <td className="p-4 space-y-1 max-w-xs truncate">
                      <p className="text-slate-305 font-medium flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-505 shrink-0" />
                        {fac.qualification}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        Spec: {fac.specialization}
                      </p>
                    </td>

                    {/* Experience */}
                    <td className="p-4 text-slate-300">
                      {fac.experience} {fac.experience === 1 ? "Year" : "Years"}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          fac.status
                        )}`}
                      >
                        {fac.status}
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
                            onClick={() => onEdit(fac)}
                            disabled={isPending}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                            disabled={fac.status === "INACTIVE" || isPending}
                            onClick={() => handleDeactivate(fac)}
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
                  No faculty records found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
