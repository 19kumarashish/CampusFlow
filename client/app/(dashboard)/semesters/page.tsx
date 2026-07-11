"use client";

import { useState, useMemo } from "react";
import { Calendar, Plus, Trash2, Edit, Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  SemesterDialog,
  useSemestersQuery,
  useDeleteSemesterMutation,
  type Semester,
} from "@/features/semesters";

export default function SemestersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "INACTIVE" | "ALL">("ALL");

  const queryParams = useMemo(() => {
    return {
      limit: 100,
      search: search || undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
    };
  }, [search, statusFilter]);

  const { data, isLoading, isError, refetch } = useSemestersQuery(queryParams);
  const semestersList = data?.semesters || [];

  const { mutate: deleteSemester, isPending: isDeleting } = useDeleteSemesterMutation();

  // Modal Dialog states
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

  const handleCreate = () => {
    setSelectedSemester(null);
    setIsOpen(true);
  };

  const handleEdit = (semester: Semester) => {
    setSelectedSemester(semester);
    setIsOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the semester "${name}"?`)) {
      deleteSemester(id);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-400" /> Semesters Cycles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure semesters, define start/end dates, set registration cycles, and control exam windows.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Semester
        </Button>
      </div>

      {/* Parameter Selection panel */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-slate-950/30 p-4 border border-border/40 rounded-xl backdrop-blur-xl animate-in text-xs">
        {/* Search */}
        <div className="space-y-1 w-full sm:w-80 relative">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Search by Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Filter semesters..."
              className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 pl-9 pr-3 py-1.5 text-slate-350 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
          <select
            className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-slate-300 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200 sm:w-[130px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL" className="bg-slate-950 text-slate-300">All Statuses</option>
            <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
            <option value="INACTIVE" className="bg-slate-955 text-slate-300">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Logs Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 border border-border/40 rounded-xl bg-slate-950/20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-400 mt-3 font-semibold">Resolving semesters list...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 bg-slate-900/10 border border-border/40 rounded-xl">
          <p className="text-red-400 text-xs font-semibold">Failed to resolve semesters list.</p>
          <Button size="sm" variant="outline" className="mt-3 border-border/50 text-white text-xs" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/40 bg-slate-950/30 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Name / Academic Year</th>
                  <th className="p-4 text-center">Semester No.</th>
                  <th className="p-4 text-center">Type</th>
                  <th className="p-4">Semester Duration</th>
                  <th className="p-4">Registration Window</th>
                  <th className="p-4">Exam Window</th>
                  <th className="p-4 text-center">Current</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-slate-300">
                {semestersList.length ? (
                  semestersList.map((sem) => (
                    <tr key={sem._id} className="hover:bg-slate-900/10 transition-colors">
                      {/* Name / Year */}
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-white text-sm">{sem.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Year: {sem.academicYear}</p>
                        </div>
                      </td>

                      {/* Semester Number */}
                      <td className="p-4 text-center font-bold text-slate-205">
                        Term {sem.semesterNumber}
                      </td>

                      {/* Type */}
                      <td className="p-4 text-center font-bold text-slate-350">
                        {sem.type}
                      </td>

                      {/* Semester Duration */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-200">Start: {formatDate(sem.startDate)}</p>
                          <p className="text-[10px] text-slate-500">End: {formatDate(sem.endDate)}</p>
                        </div>
                      </td>

                      {/* Registration window */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-300">Open: {formatDate(sem.registrationStart)}</p>
                          <p className="text-[10px] text-slate-500">Close: {formatDate(sem.registrationEnd)}</p>
                        </div>
                      </td>

                      {/* Exam window */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-300">Start: {formatDate(sem.examStart)}</p>
                          <p className="text-[10px] text-slate-500">End: {formatDate(sem.examEnd)}</p>
                        </div>
                      </td>

                      {/* Current active */}
                      <td className="p-4 text-center">
                        {sem.isCurrent ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-450 text-[10px] animate-pulse">
                            Current
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[10px]">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border text-[10px]
                          ${sem.status === "ACTIVE"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : "bg-slate-900 text-slate-500 border-border/40"
                          }
                        `}>
                          {sem.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-border/50 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-all duration-200"
                            onClick={() => handleEdit(sem)}
                            disabled={isDeleting}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-border/50 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
                            disabled={isDeleting}
                            onClick={() => handleDelete(sem._id, sem.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      No semesters recorded matching selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      <SemesterDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        semester={selectedSemester}
      />
    </div>
  );
}
