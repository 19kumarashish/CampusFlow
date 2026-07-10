"use client";

import { Edit, Trash2, Calendar, FileText, UserCheck, Layers, Clipboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteAttendanceMutation } from "../hooks/attendance.hooks";
import { useEnrollmentsQuery } from "@/features/enrollments";
import type { Attendance } from "../types/attendance.types";

interface AttendanceLogTableProps {
  attendanceLogs: Attendance[];
  canEdit: boolean;
  onEdit: (record: Attendance) => void;
}

export default function AttendanceLogTable({
  attendanceLogs,
  canEdit,
  onEdit,
}: AttendanceLogTableProps) {
  const { mutate: deleteLog, isPending } = useDeleteAttendanceMutation();

  // Fetch all enrollments to resolve student user details client-side if needed
  const { data: enrollmentsData } = useEnrollmentsQuery({ limit: 100 });
  const allEnrollments = enrollmentsData?.enrollments || [];

  const handleDelete = (log: Attendance) => {
    const enrollmentId = typeof log.enrollment === "string"
      ? (log.enrollment as string)
      : log.enrollment?._id;
    const enrollObj = allEnrollments.find((e) => e._id === enrollmentId);
    const studentName = log.enrollment?.student?.user?.firstName
      ? `${log.enrollment.student.user.firstName} ${log.enrollment.student.user.lastName}`
      : enrollObj?.student?.user
      ? `${enrollObj.student.user.firstName} ${enrollObj.student.user.lastName}`
      : `ID: ${log.enrollment?.student?.studentId || "Student"}`;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the attendance log record for ${studentName} on ${new Date(
        log.date
      ).toLocaleDateString()} (Lecture ${log.lectureNumber})?`
    );
    if (confirmDelete) {
      deleteLog(log._id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "ABSENT":
        return "bg-rose-500/10 text-rose-455 border-rose-500/20";
      case "LATE":
        return "bg-amber-500/10 text-amber-450 border-amber-500/20";
      case "EXCUSED":
        return "bg-indigo-500/10 text-indigo-455 border-indigo-500/20";
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
              <th className="p-4">Subject</th>
              <th className="p-4">Section</th>
              <th className="p-4">Session Date</th>
              <th className="p-4">Lecture No.</th>
              <th className="p-4">Status</th>
              <th className="p-4">Remarks / Notes</th>
              {canEdit ? <th className="p-4 text-center">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {attendanceLogs.length ? (
              attendanceLogs.map((log) => {
                const enrollment = log.enrollment;
                
                // Lookup full name client-side if enrollment.student.user is not populated
                const matchedEnroll = allEnrollments.find(
                  (e) => e._id === enrollment?._id || e._id === (enrollment as any)
                );
                
                const studentObj = enrollment?.student?.studentId ? enrollment.student : matchedEnroll?.student;
                const userObj = studentObj?.user;

                const studentName = userObj ? `${userObj.firstName} ${userObj.lastName}` : "Deactivated Student";
                const studentEmail = userObj?.email || "No Email";
                const initials = userObj ? `${userObj.firstName.charAt(0)}${userObj.lastName.charAt(0)}`.toUpperCase() : "ST";

                const sectionName = enrollment?.section?.name || matchedEnroll?.section?.name || "No Section";
                const subjectName = log.subject?.name || "No Subject";
                const subjectCode = log.subject?.code || "SUB";

                return (
                  <tr
                    key={log._id}
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
                      <p className="text-slate-200 font-semibold">{studentObj?.studentId || "No Student ID"}</p>
                      <p className="text-slate-500 text-[10px]">
                        Roll: {studentObj?.rollNumber || "No Roll"}
                      </p>
                    </td>

                    {/* Subject */}
                    <td className="p-4">
                      <p className="text-slate-200 font-medium">{subjectName}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">{subjectCode}</p>
                    </td>

                    {/* Section */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded border border-slate-850 bg-slate-900 text-[10px] font-bold text-slate-205">
                        {sectionName}
                      </span>
                    </td>

                    {/* Session Date */}
                    <td className="p-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>
                          {log.date
                            ? new Date(log.date).toLocaleDateString()
                            : "No Date"}
                        </span>
                      </div>
                    </td>

                    {/* Lecture Number */}
                    <td className="p-4 text-slate-200 font-bold text-center">
                      Lec {log.lectureNumber}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </td>

                    {/* Remarks */}
                    <td className="p-4 text-slate-400 max-w-[150px] truncate">
                      {log.remarks || "-"}
                    </td>

                    {/* Actions */}
                    {canEdit ? (
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                            onClick={() => onEdit(log)}
                            disabled={isPending}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-855 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                            disabled={isPending}
                            onClick={() => handleDelete(log)}
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
                  colSpan={canEdit ? 9 : 8}
                  className="p-8 text-center text-slate-500"
                >
                  No attendance log records found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
