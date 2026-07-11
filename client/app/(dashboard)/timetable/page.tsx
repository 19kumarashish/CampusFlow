"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Calendar } from "lucide-react";
import { useSelector } from "react-redux";

import {
  TimetableGrid,
  TimetableDialog,
  TimetableFilter,
  useTimetablesQuery,
  type GetTimetableParams,
  type Day
} from "@/features/timetable";
import { useEnrollmentsQuery } from "@/features/enrollments";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";

export default function TimetablePage() {
  // Check user role for authorization
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role?.name === "ADMIN";
  const isStudent = user?.role?.name === "STUDENT";

  // Filter & Pagination state
  const [section, setSection] = useState("ALL");
  const [faculty, setFaculty] = useState("ALL");
  const [day, setDay] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  // Fetch active enrollments to pre-filter for students
  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useEnrollmentsQuery(
    { limit: 100, status: "ACTIVE" }
  );

  // Automatically default student view to their enrolled section
  useEffect(() => {
    if (isStudent && enrollmentsData?.enrollments.length) {
      const activeEnroll = enrollmentsData.enrollments.find(
        (e) => e.student?.user?._id === user?._id
      );
      if (activeEnroll?.section?._id) {
        setSection(activeEnroll.section._id);
      }
    }
  }, [isStudent, enrollmentsData, user]);

  // Modal Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);

  const queryParams: GetTimetableParams = {
    limit: 100, // Fetch all slots to render full weekly schedule
    section: section !== "ALL" ? section : undefined,
    faculty: faculty !== "ALL" ? faculty : undefined,
    day: day !== "ALL" ? (day as Day) : undefined,
    status: status !== "ALL" ? (status as "ACTIVE" | "INACTIVE") : undefined,
  };

  const { data, isLoading: isLoadingTimetable, isError, refetch } = useTimetablesQuery(queryParams);

  const handleResetFilters = () => {
    setSection("ALL");
    setFaculty("ALL");
    setDay("ALL");
    setStatus("ALL");
  };

  const handleEditClick = (slot: any) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedSlot(null);
    setIsDialogOpen(true);
  };

  const isLoading = isLoadingTimetable || (isStudent && isLoadingEnrollments);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-400" /> Weekly Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View course and section timetable schedules, classroom mappings, and times.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Class Slot
          </Button>
        )}
      </div>

      {/* Filter widgets */}
      <TimetableFilter
        section={section}
        onSectionChange={setSection}
        faculty={faculty}
        onFacultyChange={setFaculty}
        day={day}
        onDayChange={setDay}
        status={status}
        onStatusChange={setStatus}
        onReset={handleResetFilters}
      />

      {/* Table grid / loaders */}
      {isLoading && !data ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-400 mt-3 font-medium">Loading weekly class schedules...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 bg-slate-900/10 border border-border/40 rounded-xl my-6">
          <p className="text-red-400 text-xs font-semibold">Failed to fetch scheduled timetable slots.</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 border-border/50 text-white text-xs"
            onClick={() => refetch()}
          >
            Retry Connection
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <TimetableGrid
            timetableSlots={data?.timetable || []}
            isAdmin={isAdmin}
            onEdit={handleEditClick}
          />
        </div>
      )}

      {/* Edit/Create Dialog (Admin Only) */}
      {isAdmin && (
        <TimetableDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedSlot(null);
          }}
          timetable={selectedSlot}
        />
      )}
    </div>
  );
}
