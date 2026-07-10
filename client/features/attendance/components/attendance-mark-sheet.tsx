"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Users, FileCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEnrollmentsQuery } from "@/features/enrollments";
import { useSubjectsQuery } from "@/features/subjects";
import { useSectionsQuery } from "@/features/sections";
import { useFacultiesQuery } from "@/features/faculty";
import { useCreateAttendanceMutation } from "../hooks/attendance.hooks";
import { RootState } from "@/store";
import type { AttendanceStatus } from "../types/attendance.types";

export default function AttendanceMarkSheet() {
  const { user } = useSelector((state: RootState) => state.auth);

  // States
  const [sectionId, setSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lectureNumber, setLectureNumber] = useState(1);

  // Student list to mark
  const [students, setStudents] = useState<
    {
      enrollmentId: string;
      studentId: string;
      rollNumber: string;
      name: string;
      status: AttendanceStatus;
      remarks: string;
    }[]
  >([]);
  const [isListLoaded, setIsListLoaded] = useState(false);

  // Queries
  const { data: sectionData } = useSectionsQuery({ limit: 100, status: "ACTIVE" });
  const activeSections = sectionData?.sections || [];

  const { data: subjectData } = useSubjectsQuery({ limit: 100, status: "ACTIVE" });
  const activeSubjects = subjectData?.subjects || [];

  const { data: facultyData } = useFacultiesQuery({ limit: 100 });
  const activeFaculties = facultyData?.faculties || [];

  const { data: enrollmentsData, refetch: refetchEnrollments, isFetching: isFetchingStudents } = useEnrollmentsQuery({
    limit: 100,
    status: "ACTIVE",
    section: sectionId || undefined,
  });

  const activeEnrollments = enrollmentsData?.enrollments || [];

  // Automatically select defaults
  useEffect(() => {
    if (activeSections.length && !sectionId) {
      setSectionId(activeSections[0]._id);
    }
  }, [activeSections, sectionId]);

  useEffect(() => {
    if (activeSubjects.length && !subjectId) {
      setSubjectId(activeSubjects[0]._id);
    }
  }, [activeSubjects, subjectId]);

  // Load student list
  const handleLoadStudents = async () => {
    if (!sectionId) {
      toast.error("Please select a section");
      return;
    }
    await refetchEnrollments();

    const mapped = activeEnrollments
      .filter((e) => e.section?._id === sectionId)
      .map((e) => {
        const fullName = e.student?.user
          ? `${e.student.user.firstName} ${e.student.user.lastName}`
          : `ID: ${e.student?.studentId || "Student"}`;
        return {
          enrollmentId: e._id,
          studentId: e.student?.studentId || "",
          rollNumber: e.student?.rollNumber || "",
          name: fullName,
          status: "PRESENT" as AttendanceStatus,
          remarks: "",
        };
      });

    setStudents(mapped);
    setIsListLoaded(true);
  };

  const handleStatusChange = (index: number, status: AttendanceStatus) => {
    const updated = [...students];
    updated[index].status = status;
    setStudents(updated);
  };

  const handleRemarksChange = (index: number, val: string) => {
    const updated = [...students];
    updated[index].remarks = val;
    setStudents(updated);
  };

  const { mutateAsync: markAttendance } = useCreateAttendanceMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAttendance = async () => {
    if (!students.length) {
      toast.error("No students to submit attendance for.");
      return;
    }

    const currentFaculty = activeFaculties.find((f) => f.user?._id === user?._id);
    const facultyId = currentFaculty?._id;

    if (!facultyId) {
      toast.error("We could not determine your faculty reference ID. Please contact support.");
      return;
    }

    setIsSubmitting(true);
    try {
      const promises = students.map((st) =>
        markAttendance({
          enrollment: st.enrollmentId,
          subject: subjectId,
          faculty: facultyId,
          date: new Date(date),
          lectureNumber: Number(lectureNumber),
          status: st.status,
          remarks: st.remarks.trim() || undefined,
        })
      );

      await Promise.all(promises);
      toast.success("Attendance sheet submitted successfully!");
      setStudents([]);
      setIsListLoaded(false);
    } catch (err: any) {
      // Errors handled by mutation hook toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in text-xs">
      {/* Parameter Selection panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-xl">
        <div className="space-y-1.5 w-full">
          <Label htmlFor="mark-section" className="text-slate-400 text-[10px]">Section</Label>
          <select
            id="mark-section"
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1"
            value={sectionId}
            onChange={(e) => {
              setSectionId(e.target.value);
              setIsListLoaded(false);
            }}
          >
            {activeSections.map((sec) => (
              <option key={sec._id} value={sec._id} className="bg-slate-955 text-slate-300">
                {sec.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 w-full">
          <Label htmlFor="mark-subject" className="text-slate-400 text-[10px]">Subject</Label>
          <select
            id="mark-subject"
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setIsListLoaded(false);
            }}
          >
            {activeSubjects.map((sub) => (
              <option key={sub._id} value={sub._id} className="bg-slate-955 text-slate-300">
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 w-full">
          <Label htmlFor="mark-date" className="text-slate-400 text-[10px]">Session Date</Label>
          <input
            id="mark-date"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setIsListLoaded(false);
            }}
          />
        </div>

        <div className="space-y-1.5 w-full">
          <Label htmlFor="mark-lecture" className="text-slate-400 text-[10px]">Lecture Number</Label>
          <Input
            id="mark-lecture"
            type="number"
            min={1}
            max={20}
            className="border-slate-800 bg-slate-900/40 text-slate-300 h-9"
            value={lectureNumber}
            onChange={(e) => {
              setLectureNumber(Number(e.target.value));
              setIsListLoaded(false);
            }}
          />
        </div>

        <div className="w-full">
          <Button
            onClick={handleLoadStudents}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9"
            disabled={isFetchingStudents || isSubmitting}
          >
            {isFetchingStudents ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Load Students
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Student List Checklist */}
      {isListLoaded && (
        <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-4 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-900">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-indigo-400" /> Student Attendance Sheet
            </h3>
            <span className="text-[10px] text-slate-500 font-bold bg-slate-900 px-2.5 py-0.5 rounded">
              {students.length} Enrolled Student{students.length === 1 ? "" : "s"}
            </span>
          </div>

          {students.length ? (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Roll Number</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40 text-slate-300">
                    {students.map((st, idx) => (
                      <tr key={st.enrollmentId} className="hover:bg-slate-900/10">
                        <td className="p-3 font-bold text-white">{st.name}</td>
                        <td className="p-3 text-slate-400">{st.studentId}</td>
                        <td className="p-3 text-slate-400">{st.rollNumber}</td>
                        
                        {/* Status Selection */}
                        <td className="p-3">
                          <div className="flex justify-center items-center gap-1.5">
                            {["PRESENT", "ABSENT", "LATE", "EXCUSED"].map((stat) => (
                              <button
                                key={stat}
                                type="button"
                                className={`px-2.5 py-1 rounded text-[9px] font-bold border transition-all ${
                                  st.status === stat
                                    ? stat === "PRESENT"
                                      ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
                                      : stat === "ABSENT"
                                      ? "bg-rose-500/10 text-rose-450 border-rose-500/20"
                                      : stat === "LATE"
                                      ? "bg-amber-500/10 text-amber-450 border-amber-500/20"
                                      : "bg-indigo-500/10 text-indigo-455 border-indigo-500/20"
                                    : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-350"
                                }`}
                                onClick={() => handleStatusChange(idx, stat as AttendanceStatus)}
                              >
                                {stat}
                              </button>
                            ))}
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="p-3">
                          <Input
                            placeholder="Add optional notes..."
                            className="h-8 border-slate-900 bg-slate-950/60 text-white placeholder-slate-600 focus-visible:ring-indigo-500"
                            value={st.remarks}
                            onChange={(e) => handleRemarksChange(idx, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-900 pt-4 mt-6">
                <Button
                  variant="outline"
                  className="border-slate-800 bg-slate-955 text-slate-455 hover:bg-slate-900 text-white"
                  onClick={() => {
                    setStudents([]);
                    setIsListLoaded(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitAttendance}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting Attendance...
                    </span>
                  ) : (
                    "Submit Attendance Sheet"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No students enrolled in the selected section.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
