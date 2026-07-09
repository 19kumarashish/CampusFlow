"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useSelector } from "react-redux";

import {
  FacultyTable,
  FacultyDialog,
  FacultyFilter,
  useFacultiesQuery,
  type GetFacultiesParams,
  type Designation,
  type EmploymentType,
  type FacultyStatus
} from "@/features/faculty";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";

export default function FacultyPage() {
  // Check user role for authorization
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role?.name === "ADMIN";

  // Filter & Pagination state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [employmentType, setEmploymentType] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modal Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, designation, department, employmentType]);

  const queryParams: GetFacultiesParams = {
    page,
    limit,
    search: search.trim() || undefined,
    status: status !== "ALL" ? (status as FacultyStatus) : undefined,
    designation: designation !== "ALL" ? (designation as Designation) : undefined,
    department: department !== "ALL" ? department : undefined,
    employmentType: employmentType !== "ALL" ? (employmentType as EmploymentType) : undefined,
  };

  const { data, isLoading, isError, refetch } = useFacultiesQuery(queryParams);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setDesignation("ALL");
    setDepartment("ALL");
    setEmploymentType("ALL");
    setPage(1);
  };

  const handleEditClick = (fac: any) => {
    setSelectedFaculty(fac);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedFaculty(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-400" /> Faculty Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse through active academic staff, details, joining timelines, and qualifications.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Faculty
          </Button>
        )}
      </div>

      {/* Filter widgets */}
      <FacultyFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        designation={designation}
        onDesignationChange={setDesignation}
        department={department}
        onDepartmentChange={setDepartment}
        employmentType={employmentType}
        onEmploymentTypeChange={setEmploymentType}
        onReset={handleResetFilters}
      />

      {/* Table grid / loaders */}
      {isLoading && !data ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-400 mt-3 font-medium">Fetching university faculty listings...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 bg-slate-900/10 border border-slate-850 rounded-xl my-6">
          <p className="text-red-400 text-xs font-semibold">Failed to fetch faculty registry.</p>
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
          <FacultyTable
            faculties={data?.faculties || []}
            isAdmin={isAdmin}
            onEdit={handleEditClick}
          />

          {/* Pagination Controls */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center bg-slate-950/20 px-4 py-3 border border-slate-900 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">
                Showing page <strong className="text-slate-300">{data.pagination.page}</strong> of{" "}
                <strong className="text-slate-300">{data.pagination.totalPages}</strong> (
                {data.pagination.total} total faculty profiles)
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
        <FacultyDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedFaculty(null);
          }}
          faculty={selectedFaculty}
        />
      )}
    </div>
  );
}
