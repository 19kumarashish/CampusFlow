"use client";

import { useState, useMemo } from "react";
import { GraduationCap, Users, Calendar, ArrowRight, Loader2, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSemestersQuery } from "@/features/semesters";
import { useCoursesQuery } from "@/features/courses";
import { useStudentsQuery } from "@/features/students";
import { usePromoteStudentsMutation, usePromotionHistoryQuery } from "@/features/academic";

export default function StudentPromotionPage() {
  const [courseId, setCourseId] = useState("");
  const [fromSemesterId, setFromSemesterId] = useState("");
  const [toSemesterId, setToSemesterId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");

  // Selected Student checkboxes
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Queries
  const { data: coursesData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = useMemo(() => coursesData?.courses || [], [coursesData?.courses]);

  const { data: semestersData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = useMemo(() => semestersData?.semesters || [], [semestersData?.semesters]);

  const { mutate: promoteStudents, isPending: isPromoting } = usePromoteStudentsMutation();
  const { data: historyLogs, isLoading: isHistoryLoading } = usePromotionHistoryQuery();

  // Resolve semester details of "From Semester" to filter students currentSemester
  const selectedFromSem = useMemo(() => {
    return activeSemesters.find((s) => s._id === fromSemesterId);
  }, [fromSemesterId, activeSemesters]);

  // Query active students matching selected course
  const studentQueryParams = useMemo(() => {
    return {
      limit: 100,
      course: courseId || undefined,
      status: "ACTIVE" as any,
    };
  }, [courseId]);

  const { data: studentsData, isLoading: isStudentsLoading } = useStudentsQuery(studentQueryParams);

  // Filter students whose currentSemester matches selectedFromSem.semesterNumber
  const filteredStudentsList = useMemo(() => {
    const list = studentsData?.students || [];
    if (!selectedFromSem) return list;
    return list.filter((st) => st.currentSemester === selectedFromSem.semesterNumber);
  }, [studentsData?.students, selectedFromSem]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(filteredStudentsList.map((st) => st._id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleSelectStudent = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds((prev) => [...prev, id]);
    } else {
      setSelectedStudentIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handlePromoteSubmit = () => {
    if (!selectedStudentIds.length) return;
    promoteStudents({
      studentIds: selectedStudentIds,
      fromSemesterId,
      toSemesterId,
      academicYear,
    }, {
      onSuccess: () => {
        setSelectedStudentIds([]);
      }
    });
  };

  const getSemesterName = (id: string) => {
    const match = activeSemesters.find((s) => s._id === id);
    return match ? match.name : id;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Title Header */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-indigo-400" /> Student Promotion Console
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Promote student batches across semesters, assign new academic terms, and log transition logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Promotion Form panel */}
        <Card className="lg:col-span-1 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-indigo-400" /> Step 1: Filters
          </h3>

          {/* Course select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Degree Program</label>
            <select
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setSelectedStudentIds([]);
              }}
            >
              <option value="" className="bg-slate-950">Select Course</option>
              {activeCourses.map((c) => (
                <option key={c._id} value={c._id} className="bg-slate-955">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* From Semester select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">From Current Semester</label>
            <select
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={fromSemesterId}
              onChange={(e) => {
                setFromSemesterId(e.target.value);
                setSelectedStudentIds([]);
              }}
            >
              <option value="" className="bg-slate-955">Select Semester Term</option>
              {activeSemesters.map((s) => (
                <option key={s._id} value={s._id} className="bg-slate-955">
                  {s.name} (Term {s.semesterNumber})
                </option>
              ))}
            </select>
          </div>

          {/* To Semester select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">To Next Semester</label>
            <select
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={toSemesterId}
              onChange={(e) => setToSemesterId(e.target.value)}
            >
              <option value="" className="bg-slate-955">Select Next Term</option>
              {activeSemesters.map((s) => (
                <option key={s._id} value={s._id} className="bg-slate-955">
                  {s.name} (Term {s.semesterNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Target Academic Year */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Target Academic Year</label>
            <input
              type="text"
              placeholder="e.g. 2026-2027"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>
        </Card>

        {/* Student Checklist Panel */}
        <Card className="lg:col-span-2 border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-900">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-indigo-400" /> Step 2: Student Roster
            </h3>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded">
              Selected: {selectedStudentIds.length} / {filteredStudentsList.length}
            </span>
          </div>

          {isStudentsLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-xs text-slate-500 mt-2">Loading course roster...</p>
            </div>
          ) : !courseId || !fromSemesterId ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              Please choose a degree program and current semester filter.
            </div>
          ) : filteredStudentsList.length ? (
            <div className="space-y-4">
              <div className="overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3 w-12 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-800 bg-slate-900 h-4 w-4"
                          checked={selectedStudentIds.length === filteredStudentsList.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Roll Number</th>
                      <th className="p-3 text-center">Current Term</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40 text-slate-350">
                    {filteredStudentsList.map((st) => {
                      const fullName = st.user
                        ? `${st.user.firstName} ${st.user.lastName}`
                        : "Deactivated Student";
                      const isChecked = selectedStudentIds.includes(st._id);

                      return (
                        <tr key={st._id} className="hover:bg-slate-900/10">
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              className="rounded border-slate-800 bg-slate-900 h-4 w-4"
                              checked={isChecked}
                              onChange={(e) => handleSelectStudent(st._id, e.target.checked)}
                            />
                          </td>
                          <td className="p-3 font-bold text-white">{fullName}</td>
                          <td className="p-3 text-slate-400">{st.studentId}</td>
                          <td className="p-3 text-slate-400">{st.rollNumber}</td>
                          <td className="p-3 text-center font-bold text-slate-205">
                            Lec {st.currentSemester}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Submit promotion Button */}
              <div className="flex justify-end pt-3 border-t border-slate-900">
                <Button
                  onClick={handlePromoteSubmit}
                  disabled={!selectedStudentIds.length || !toSemesterId || isPromoting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  {isPromoting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-4 w-4 animate-spin" /> Promoting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Promote Selected <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No students found matching this semester cycle term.
            </div>
          )}
        </Card>
      </div>

      {/* History panel */}
      <Card className="border-slate-900 bg-slate-950/40 p-5 space-y-4 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-indigo-400" /> Promotion Audit History Logs
        </h3>

        {isHistoryLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : historyLogs?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Student</th>
                  <th className="p-4">From Term</th>
                  <th className="p-4">To Term</th>
                  <th className="p-4">Academic Year</th>
                  <th className="p-4">Assigned Roll No.</th>
                  <th className="p-4">Log Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-350">
                {historyLogs.map((log: any) => {
                  const studentName = log.student?.user
                    ? `${log.student.user.firstName} ${log.student.user.lastName}`
                    : `ID: ${log.student?.studentId || "Student"}`;
                  return (
                    <tr key={log._id} className="hover:bg-slate-900/10">
                      <td className="p-4 font-bold text-white">{studentName}</td>
                      <td className="p-4">{getSemesterName(log.fromSemester?._id || log.fromSemester)}</td>
                      <td className="p-4 font-semibold text-slate-205">{getSemesterName(log.toSemester?._id || log.toSemester)}</td>
                      <td className="p-4">{log.academicYear}</td>
                      <td className="p-4 font-mono">{log.rollNumber}</td>
                      <td className="p-4 text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center p-6 text-slate-500 text-xs italic">
            No promotion logs recorded in system database.
          </p>
        )}
      </Card>
    </div>
  );
}
