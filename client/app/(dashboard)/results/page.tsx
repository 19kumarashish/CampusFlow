"use client";

import { useState, useEffect, useMemo } from "react";
import { Award, FileSpreadsheet, Plus, Loader2, ClipboardCheck, LayoutList, FileCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { RootState } from "@/store";
import { getStudents } from "@/features/students";
import { getEnrollments } from "@/features/enrollments";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  SubjectResultsTable,
  SemesterResultsTable,
  CompileResultDialog,
  StudentTranscriptView,
  useResultsQuery,
  useSemesterResultsQuery,
  type ResultStatus,
} from "@/features/results";

export default function ResultsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  const [activeTab, setActiveTab] = useState<"SUBJECT" | "SEMESTER">("SUBJECT");

  // Query student profile if student
  const { data: studentData } = useQuery({
    queryKey: ["students", { limit: 1, search: user?.email || "" }],
    queryFn: () => getStudents({ limit: 1, search: user?.email || "" }),
    enabled: isStudent && !!user?.email,
  });
  const studentProfile = useMemo(() => studentData?.students[0], [studentData?.students]);

  const { data: enrollmentData } = useQuery({
    queryKey: ["enrollments", { student: studentProfile?._id || "", limit: 1 }],
    queryFn: () => getEnrollments({ student: studentProfile?._id || "", limit: 1 }),
    enabled: !!studentProfile?._id,
  });
  const activeEnrollment = useMemo(() => enrollmentData?.enrollments[0], [enrollmentData?.enrollments]);
  const enrollmentId = activeEnrollment?._id;

  // Filter States
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [semesterFilter, setSemesterFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Reset pagination or tabs
  const subjectParams = useMemo(() => {
    return {
      limit: 100,
      enrollment: isStudent ? enrollmentId : undefined,
      subject: subjectFilter !== "ALL" ? subjectFilter : undefined,
      status: statusFilter !== "ALL" ? (statusFilter as ResultStatus) : undefined,
    };
  }, [isStudent, enrollmentId, subjectFilter, statusFilter]);

  const semesterParams = useMemo(() => {
    return {
      limit: 100,
      enrollment: isStudent ? enrollmentId : undefined,
      semester: semesterFilter !== "ALL" ? semesterFilter : undefined,
      status: statusFilter !== "ALL" ? (statusFilter as ResultStatus) : undefined,
    };
  }, [isStudent, enrollmentId, semesterFilter, statusFilter]);

  // Queries
  const {
    data: subjectResultsData,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
    refetch: refetchSubject,
  } = useResultsQuery(subjectParams);

  const {
    data: semesterResultsData,
    isLoading: isSemesterLoading,
    isError: isSemesterError,
    refetch: refetchSemester,
  } = useSemesterResultsQuery(semesterParams);

  const isLoading = isSubjectLoading || isSemesterLoading;
  const isError = isSubjectError || isSemesterError;

  // Dialog States
  const [isCompileOpen, setIsCompileOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);

  const handleOpenTranscript = (eId: string) => {
    setSelectedEnrollmentId(eId);
    setIsTranscriptOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-400" /> Grade Compiler & Transcripts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish finalized subject grade sheets, review semester GPAs, and generate official academic transcripts.
          </p>
        </div>
        <div className="flex gap-2.5">
          {isStudent && enrollmentId && (
            <Button
              onClick={() => handleOpenTranscript(enrollmentId)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
            >
              <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Academic Transcript
            </Button>
          )}

          {(isAdmin || isTeacher) && (
            <Button
              onClick={() => setIsCompileOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
            >
              <Plus className="mr-1 h-4 w-4" /> Compile Grade
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-900 gap-6">
        <button
          className={`pb-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer
            ${
              activeTab === "SUBJECT"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-white"
            }
          `}
          onClick={() => setActiveTab("SUBJECT")}
        >
          Subject Grades
        </button>
        <button
          className={`pb-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer
            ${
              activeTab === "SEMESTER"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-white"
            }
          `}
          onClick={() => setActiveTab("SEMESTER")}
        >
          Semester GPA Reports
        </button>
      </div>

      {/* Compiler lists */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-400 mt-3 font-medium">Resolving academic performance records...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl my-6">
          <p className="text-red-400 text-xs font-semibold">Failed to fetch result cards.</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 border-slate-880 text-white text-xs"
            onClick={() => {
              refetchSubject();
              refetchSemester();
            }}
          >
            Retry Connection
          </Button>
        </div>
      ) : activeTab === "SUBJECT" ? (
        <div className="space-y-4">
          <SubjectResultsTable
            results={subjectResultsData?.results || []}
            isAdmin={isAdmin}
          />

          {/* Quick instructions for teachers/admins */}
          {(isAdmin || isTeacher) && subjectResultsData?.results && subjectResultsData.results.length > 0 && (
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-3">
              <ClipboardCheck className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-white">Transcripts & GPAs Checklist</h4>
                <p className="text-slate-400">
                  Clicking the <strong className="text-indigo-400">"Compile Grade"</strong> action button compiles a student's marks by fetching their aggregated assignments + exams scores. When all subject results for a term are generated and set <strong className="text-emerald-400">"PUBLISHED"</strong>, click <strong className="text-indigo-400">"Compile Grade"</strong> &rarr; <strong className="text-slate-200">"Semester GPA"</strong> to calculate and log their CGPA.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <SemesterResultsTable
            results={semesterResultsData?.results || []}
            isAdmin={isAdmin}
          />

          {/* Teacher view helper list to inspect student transcripts */}
          {(isAdmin || isTeacher) && semesterResultsData?.results && semesterResultsData.results.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-900">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <LayoutList className="h-4.5 w-4.5 text-indigo-400" /> Academic Transcript Hub
              </h3>
              <p className="text-xs text-slate-400">
                View or print student records transcripts below:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {semesterResultsData.results.map((r) => (
                  <Card key={r._id} className="p-3 border-border/80 bg-card/60 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">
                        {r.enrollment?.student?.user?.firstName} {r.enrollment?.student?.user?.lastName}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Roll Number: {r.enrollment?.student?.rollNumber}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 border-indigo-500/25 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-[10px] font-bold"
                      onClick={() => handleOpenTranscript(r.enrollment?._id)}
                    >
                      Transcript
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compile dialog */}
      <CompileResultDialog
        isOpen={isCompileOpen}
        onClose={() => setIsCompileOpen(false)}
      />

      {/* Transcript visual sheet */}
      {isTranscriptOpen && selectedEnrollmentId && (
        <StudentTranscriptView
          isOpen={isTranscriptOpen}
          onClose={() => {
            setIsTranscriptOpen(false);
            setSelectedEnrollmentId(null);
          }}
          enrollmentId={selectedEnrollmentId}
        />
      )}
    </div>
  );
}
