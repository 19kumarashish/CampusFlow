"use client";

import { Edit, Trash2, Calendar, FileText, UserCheck, Briefcase, GraduationCap, Clock, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteEnrollmentMutation } from "../hooks/enrollment.hooks";
import { useStudentsQuery } from "@/features/students";
import type { Enrollment } from "../types/enrollment.types";

interface EnrollmentsTableProps {
  enrollments: Enrollment[];
  isAdmin: boolean;
  onEdit: (enrollment: Enrollment) => void;
}

export default function EnrollmentsTable({
  enrollments,
  isAdmin,
  onEdit,
}: EnrollmentsTableProps) {
  const { mutate: deactivateEnrollment, isPending } = useDeleteEnrollmentMutation();

  // Fetch all students to resolve user firstName/lastName details client-side if needed
  const { data: studentsData } = useStudentsQuery({ limit: 100 });
  const allStudents = studentsData?.students || [];

  const handleDeactivate = (enroll: Enrollment) => {
    if (enroll.status === "INACTIVE") {
      return;
    }
    const studentObj = allStudents.find((s) => s._id === enroll.student?._id || s._id === (enroll.student as any));
    const studentName = enroll.student?.user?.firstName
      ? `${enroll.student.user.firstName} ${enroll.student.user.lastName}`
      : studentObj?.user
      ? `${studentObj.user.firstName} ${studentObj.user.lastName}`
      : `ID: ${enroll.student?.studentId || "Student"}`;

    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate the enrollment record for ${studentName} in ${enroll.semester?.name}? This will perform a soft-delete (mark it INACTIVE).`
    );
    if (confirmDelete) {
      deactivateEnrollment(enroll._id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "INACTIVE":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-450 border-slate-805";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl animate-in">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Student</th>
              <th className="p-4">Student ID / Roll</th>
              <th className="p-4">Course</th>
              <th className="p-4">Semester Term</th>
              <th className="p-4">Section Name</th>
              <th className="p-4">Enrollment Date</th>
              <th className="p-4">Status</th>
              {isAdmin ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {enrollments.length ? (
              enrollments.map((enroll) => {
                const student = enroll.student;
                
                // Lookup full name client-side if student.user is not populated
                const matchedStudent = allStudents.find(
                  (s) => s._id === student?._id || s._id === (student as any)
                );
                
                const userObj = student?.user?.firstName ? student.user : matchedStudent?.user;
                const studentName = userObj ? `${userObj.firstName} ${userObj.lastName}` : "Deactivated Student";
                const studentEmail = userObj?.email || "No Email";
                const initials = userObj ? `${userObj.firstName.charAt(0)}${userObj.lastName.charAt(0)}`.toUpperCase() : "ST";

                const courseName = enroll.course?.name || "No Course";
                const semesterName = enroll.semester?.name || "No Semester";
                const sectionName = enroll.section?.name || "No Section";

                return (
                  <tr
                    key={enroll._id}
                    className="hover:bg-slate-900/10 transition-colors"
                  >
                    {/* Student Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-850">
                          {userObj?.avatar ? (
                            <AvatarImage src={userObj.avatar} alt={studentName} />
                          ) : null}
                          <AvatarFallback className="bg-indigo-600/80 text-white font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {studentName}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {studentEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Student ID & Roll */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-200 font-semibold">{student?.studentId || "No Student ID"}</p>
                      <p className="text-slate-500 text-[10px]">
                        Roll: {student?.rollNumber || "No Roll"}
                      </p>
                    </td>

                    {/* Course */}
                    <td className="p-4 text-slate-200 font-medium">
                      {courseName}
                    </td>

                    {/* Semester Term */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-200 font-semibold flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        {semesterName}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        Year: {enroll.semester?.academicYear} ({enroll.semester?.type})
                      </p>
                    </td>

                    {/* Section */}
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded border border-slate-850 bg-slate-900 text-xs font-bold text-slate-205">
                        {sectionName}
                      </span>
                    </td>

                    {/* Enrollment Date */}
                    <td className="p-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>
                          {enroll.enrollmentDate
                            ? new Date(enroll.enrollmentDate).toLocaleDateString()
                            : "No Date"}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          enroll.status
                        )}`}
                      >
                        {enroll.status}
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
                            onClick={() => onEdit(enroll)}
                            disabled={isPending}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-855 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                            disabled={enroll.status === "INACTIVE" || isPending}
                            onClick={() => handleDeactivate(enroll)}
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
                  No enrollment records found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
