"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Loader2, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { RootState } from "@/store";
import { getStudents } from "@/features/students";
import { getEnrollments } from "@/features/enrollments";
import { Button } from "@/components/ui/button";

import {
  ExaminationsTable,
  ExaminationsFilter,
  ExaminationDialog,
  ExamResultsListDialog,
  ExamGradingDialog,
  useExaminationsQuery,
  getExamResults,
  type Examination,
  type ExamResult,
  type ExamStatus,
  type ExamType,
} from "@/features/examinations";

export default function ExaminationsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [examType, setExamType] = useState("ALL");
  const [subject, setSubject] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [semester, setSemester] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, examType, subject, section, semester]);

  // Student specific profile & enrollment hooks
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

  // Fetch results history if student
  const { data: studentResultsData } = useQuery({
    queryKey: ["examResults", { enrollment: enrollmentId || "", limit: 100 }],
    queryFn: () => getExamResults({ enrollment: enrollmentId || "", limit: 100 }),
    enabled: !!enrollmentId,
  });
  const studentResults = useMemo(
    () => studentResultsData?.results || [],
    [studentResultsData?.results]
  );

  // Core list query params
  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      search: search.trim() || undefined,
      status: status !== "ALL" ? (status as ExamStatus) : undefined,
      examType: examType !== "ALL" ? (examType as ExamType) : undefined,
      subject: subject !== "ALL" ? subject : undefined,
      section: section !== "ALL" ? section : undefined,
      semester: semester !== "ALL" ? semester : undefined,
    };
  }, [page, limit, search, status, examType, subject, section, semester]);

  const { data, isLoading, isError, refetch } = useExaminationsQuery(queryParams);

  // Dialogue Open States
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isResultsListOpen, setIsResultsListOpen] = useState(false);
  const [isGradingOpen, setIsGradingOpen] = useState(false);

  // Selected states
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setExamType("ALL");
    setSubject("ALL");
    setSection("ALL");
    setSemester("ALL");
    setPage(1);
  };

  const handleAddClick = () => {
    setSelectedExam(null);
    setIsExamOpen(true);
  };

  const handleEditClick = (examination: Examination) => {
    setSelectedExam(examination);
    setIsExamOpen(true);
  };

  const handleViewResults = (examination: Examination) => {
    setSelectedExam(examination);
    setIsResultsListOpen(true);
  };

  const handleGradeClick = (enrollmentId: string, result: ExamResult | null) => {
    setSelectedEnrollmentId(enrollmentId);
    setSelectedResult(result);
    setIsGradingOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-400" /> Examination Schedules
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage exam terms, book hall room allocations, and grade student paper marks.
          </p>
        </div>
        {(isAdmin || isTeacher) && (
          <Button
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
          >
            <Plus className="mr-1 h-4 w-4" /> Schedule Exam
          </Button>
        )}
      </div>

      {/* Filtering */}
      <ExaminationsFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        examType={examType}
        onExamTypeChange={setExamType}
        subject={subject}
        onSubjectChange={setSubject}
        section={section}
        onSectionChange={setSection}
        semester={semester}
        onSemesterChange={setSemester}
        onReset={handleResetFilters}
      />

      {/* Grid Table */}
      {isLoading && !data ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-400 mt-3 font-medium">Fetching examination timetables...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl my-6">
          <p className="text-red-400 text-xs font-semibold">Failed to fetch examinations schedule.</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 border-slate-800 text-white text-xs"
            onClick={() => refetch()}
          >
            Retry Connection
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <ExaminationsTable
            examinations={data?.examinations || []}
            role={role}
            enrollmentId={enrollmentId}
            studentResults={studentResults}
            onEdit={handleEditClick}
            onViewResults={handleViewResults}
          />

          {/* Pagination Controls */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center bg-slate-950/20 px-4 py-3 border border-slate-900 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">
                Showing page <strong className="text-slate-300">{data.pagination.page}</strong> of{" "}
                <strong className="text-slate-300">{data.pagination.totalPages}</strong> (
                {data.pagination.total} total examinations)
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-slate-850 bg-slate-950 text-slate-300 text-xs hover:bg-slate-900"
                  disabled={!data.pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-0.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-slate-850 bg-slate-950 text-slate-300 text-xs hover:bg-slate-900"
                  disabled={!data.pagination.hasNextPage}
                  onClick={() => setPage((prev) => Math.min(prev + 1, data.pagination.totalPages))}
                >
                  Next <ChevronRight className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Dialog (Admin & Teacher Only) */}
      {(isAdmin || isTeacher) && (
        <ExaminationDialog
          isOpen={isExamOpen}
          onClose={() => {
            setIsExamOpen(false);
            setSelectedExam(null);
          }}
          examination={selectedExam}
        />
      )}

      {/* Results List Sheet Dialog */}
      {(isAdmin || isTeacher) && (
        <ExamResultsListDialog
          isOpen={isResultsListOpen}
          onClose={() => {
            setIsResultsListOpen(false);
            setSelectedExam(null);
          }}
          examination={selectedExam}
          onGradeClick={handleGradeClick}
        />
      )}

      {/* Grade Entry Dialog */}
      {(isAdmin || isTeacher) && (
        <ExamGradingDialog
          isOpen={isGradingOpen}
          onClose={() => {
            setIsGradingOpen(false);
            setSelectedEnrollmentId(null);
            setSelectedResult(null);
          }}
          examination={selectedExam}
          enrollmentId={selectedEnrollmentId}
          result={selectedResult}
        />
      )}
    </div>
  );
}
