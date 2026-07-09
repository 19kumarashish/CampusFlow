"use client";

import { Edit, Trash2, Calendar, FileText, UserCheck, Briefcase, GraduationCap, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteStudentMutation } from "../hooks/student.hooks";
import type { Student } from "../types/student.types";

interface StudentsTableProps {
  students: Student[];
  isAdmin: boolean;
  onEdit: (student: Student) => void;
}

export default function StudentsTable({
  students,
  isAdmin,
  onEdit,
}: StudentsTableProps) {
  const { mutate: dropStudent, isPending } = useDeleteStudentMutation();

  const handleDeactivate = (student: Student) => {
    if (student.status === "DROPPED") {
      return;
    }
    const name = student.user ? `${student.user.firstName} ${student.user.lastName}` : "Student";
    const confirmDelete = window.confirm(
      `Are you sure you want to drop student ${name} (${student.studentId})? This will perform a soft-delete (mark them DROPPED).`
    );
    if (confirmDelete) {
      dropStudent(student._id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "GRADUATED":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "DROPPED":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "SUSPENDED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "ALUMNI":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
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
              <th className="p-4">Student</th>
              <th className="p-4">Department & Course</th>
              <th className="p-4">Academic IDs</th>
              <th className="p-4">Admission</th>
              <th className="p-4">Guardian Contact</th>
              <th className="p-4">Bio / DOB</th>
              <th className="p-4">Status</th>
              {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {students.length ? (
              students.map((st) => {
                const user = st.user;
                const name = user ? `${user.firstName} ${user.lastName}` : "Deactivated User";
                const email = user?.email || "No Email";
                const initials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : "ST";
                const deptName = st.department?.name || "No Department";
                const courseName = st.course?.name || "No Course";
                
                return (
                  <tr
                    key={st._id}
                    className="hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Student Profile */}
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

                    {/* Department & Course */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-200 font-semibold">{deptName}</p>
                      <p className="text-slate-550 text-[10px]">
                        {courseName} (Sem {st.currentSemester})
                      </p>
                    </td>

                    {/* Academic IDs */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-300 font-medium">Roll: {st.rollNumber}</p>
                      <p className="text-slate-500 text-[10px]">
                        Reg: {st.registrationNumber}
                      </p>
                    </td>

                    {/* Admission Details */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-300 font-medium">{st.admissionType}</p>
                      <p className="text-slate-500 text-[10px]">
                        Year: {st.admissionYear}
                      </p>
                    </td>

                    {/* Guardian Contacts */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-300 font-medium">{st.guardianName}</p>
                      <p className="text-slate-500 text-[10px]">
                        Phone: {st.guardianPhone}
                      </p>
                    </td>

                    {/* Bio & DOB */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-300 font-medium">
                        {st.gender} ({st.bloodGroup?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")})
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        DOB: {st.dateOfBirth ? new Date(st.dateOfBirth).toLocaleDateString() : "No Date"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          st.status
                        )}`}
                      >
                        {st.status}
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
                            onClick={() => onEdit(st)}
                            disabled={isPending}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                            disabled={st.status === "DROPPED" || isPending}
                            onClick={() => handleDeactivate(st)}
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
                  No student profiles found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
