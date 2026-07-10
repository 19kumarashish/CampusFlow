"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Loader2, ChevronLeft, ChevronRight, FolderCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { RootState } from "@/store";
import { getStudents } from "@/features/students";
import { getEnrollments } from "@/features/enrollments";
import { Button } from "@/components/ui/button";

import {
  AssignmentsTable,
  AssignmentDialog,
  AssignmentsFilter,
  SubmissionDialog,
  SubmissionsListDialog,
  GradingDialog,
  useAssignmentsQuery,
  getSubmissions,
  type Assignment,
  type Submission,
  type AssignmentStatus,
} from "@/features/assignments";

export default function AssignmentsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role?.name || "";
  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [subject, setSubject] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [semester, setSemester] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, subject, section, semester]);

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

  // Fetch submissions history if student
  const { data: studentSubmissionsData } = useQuery({
    queryKey: ["submissions", { enrollment: enrollmentId || "", limit: 100 }],
    queryFn: () => getSubmissions({ enrollment: enrollmentId || "", limit: 100 }),
    enabled: !!enrollmentId,
  });
  const studentSubmissions = useMemo(
    () => studentSubmissionsData?.submissions || [],
    [studentSubmissionsData?.submissions]
  );

  // Core list query params
  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      search: search.trim() || undefined,
      status: status !== "ALL" ? (status as AssignmentStatus) : undefined,
      subject: subject !== "ALL" ? subject : undefined,
      section: section !== "ALL" ? section : undefined,
      semester: semester !== "ALL" ? semester : undefined,
    };
  }, [page, limit, search, status, subject, section, semester]);

  const { data, isLoading, isError, refetch } = useAssignmentsQuery(queryParams);

  // Dialogue Open States
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isSubmissionsListOpen, setIsSubmissionsListOpen] = useState(false);
  const [isGradingOpen, setIsGradingOpen] = useState(false);

  // Selected object state
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setSubject("ALL");
    setSection("ALL");
    setSemester("ALL");
    setPage(1);
  };

  const handleAddClick = () => {
    setSelectedAssignment(null);
    setIsAssignmentOpen(true);
  };

  const handleEditClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsAssignmentOpen(true);
  };

  const handleViewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmissionsListOpen(true);
  };

  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmissionOpen(true);
  };

  const handleGradeClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsGradingOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <FolderCheck className="h-6 w-6 text-indigo-400" /> Course Assignments
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish assessment questions, submit project work, or grade student code files.
          </p>
        </div>
        {(isAdmin || isTeacher) && (
          <Button
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Assignment
          </Button>
        )}
      </div>

      {/* Filtering */}
      <AssignmentsFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
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
          <p className="text-xs text-slate-400 mt-3 font-medium">Fetching course assignment catalog...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl my-6">
          <p className="text-red-400 text-xs font-semibold">Failed to fetch assignments index.</p>
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
          <AssignmentsTable
            assignments={data?.assignments || []}
            role={role}
            enrollmentId={enrollmentId}
            studentSubmissions={studentSubmissions}
            onEdit={handleEditClick}
            onViewSubmissions={handleViewSubmissions}
            onSubmitAssignment={handleSubmitAssignment}
          />

          {/* Pagination Controls */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center bg-slate-950/20 px-4 py-3 border border-slate-900 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">
                Showing page <strong className="text-slate-300">{data.pagination.page}</strong> of{" "}
                <strong className="text-slate-300">{data.pagination.totalPages}</strong> (
                {data.pagination.total} total assignments)
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
        <AssignmentDialog
          isOpen={isAssignmentOpen}
          onClose={() => {
            setIsAssignmentOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
        />
      )}

      {/* Student submission Form Dialog */}
      {isStudent && enrollmentId && (
        <SubmissionDialog
          isOpen={isSubmissionOpen}
          onClose={() => {
            setIsSubmissionOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
          enrollmentId={enrollmentId}
        />
      )}

      {/* Submissions Viewer Dialog */}
      {(isAdmin || isTeacher) && (
        <SubmissionsListDialog
          isOpen={isSubmissionsListOpen}
          onClose={() => {
            setIsSubmissionsListOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
          onGradeClick={handleGradeClick}
        />
      )}

      {/* Submissions Grading Dialog */}
      {(isAdmin || isTeacher) && (
        <GradingDialog
          isOpen={isGradingOpen}
          onClose={() => {
            setIsGradingOpen(false);
            setSelectedSubmission(null);
          }}
          assignment={selectedAssignment}
          submission={selectedSubmission}
        />
      )}
    </div>
  );
}
