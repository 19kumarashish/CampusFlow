"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useSelector } from "react-redux";

import {
  StudentsTable,
  StudentDialog,
  StudentsFilter,
  useStudentsQuery,
  type GetStudentsParams,
  type StudentStatus,
  type AdmissionType,
  type Gender
} from "@/features/students";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";

export default function StudentsPage() {
  // Check user role for authorization
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role?.name === "ADMIN";

  // Filter & Pagination state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [course, setCourse] = useState("ALL");
  const [semester, setSemester] = useState("ALL");
  const [admissionYear, setAdmissionYear] = useState("ALL");
  const [admissionType, setAdmissionType] = useState("ALL");
  const [gender, setGender] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modal Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, department, course, semester, admissionYear, admissionType, gender]);

  const queryParams: GetStudentsParams = {
    page,
    limit,
    search: search.trim() || undefined,
    status: status !== "ALL" ? (status as StudentStatus) : undefined,
    department: department !== "ALL" ? department : undefined,
    course: course !== "ALL" ? course : undefined,
    currentSemester: semester !== "ALL" ? Number(semester) : undefined,
    admissionYear: admissionYear !== "ALL" ? Number(admissionYear) : undefined,
    admissionType: admissionType !== "ALL" ? (admissionType as AdmissionType) : undefined,
    gender: gender !== "ALL" ? (gender as Gender) : undefined,
  };

  const { data, isLoading, isError, refetch } = useStudentsQuery(queryParams);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setDepartment("ALL");
    setCourse("ALL");
    setSemester("ALL");
    setAdmissionYear("ALL");
    setAdmissionType("ALL");
    setGender("ALL");
    setPage(1);
  };

  const handleEditClick = (st: any) => {
    setSelectedStudent(st);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedStudent(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-400" /> Student Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse through enrolled students, courses, registration numbers, semester checkpoints, and records.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Student
          </Button>
        )}
      </div>

      {/* Filter widgets */}
      <StudentsFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        department={department}
        onDepartmentChange={setDepartment}
        course={course}
        onCourseChange={setCourse}
        semester={semester}
        onSemesterChange={setSemester}
        admissionYear={admissionYear}
        onAdmissionYearChange={setAdmissionYear}
        admissionType={admissionType}
        onAdmissionTypeChange={setAdmissionType}
        gender={gender}
        onGenderChange={setGender}
        onReset={handleResetFilters}
      />

      {/* Table grid / loaders */}
      {isLoading && !data ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-400 mt-3 font-medium">Fetching student registry catalog...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl my-6">
          <p className="text-red-400 text-xs font-semibold">Failed to fetch students directory.</p>
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
          <StudentsTable
            students={data?.students || []}
            isAdmin={isAdmin}
            onEdit={handleEditClick}
          />

          {/* Pagination Controls */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center bg-slate-950/20 px-4 py-3 border border-slate-900 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">
                Showing page <strong className="text-slate-300">{data.pagination.page}</strong> of{" "}
                <strong className="text-slate-300">{data.pagination.totalPages}</strong> (
                {data.pagination.total} total student profiles)
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

      {/* Edit/Create Dialog (Admin Only) */}
      {isAdmin && (
        <StudentDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
        />
      )}
    </div>
  );
}
