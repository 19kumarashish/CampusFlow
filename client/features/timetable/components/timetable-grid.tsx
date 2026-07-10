"use client";

import { Edit, Trash2, MapPin, Clock, UserCheck, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTimetableMutation } from "../hooks/timetable.hooks";
import type { Timetable, Day } from "../types/timetable.types";

interface TimetableGridProps {
  timetableSlots: Timetable[];
  isAdmin: boolean;
  onEdit: (slot: Timetable) => void;
}

export default function TimetableGrid({
  timetableSlots,
  isAdmin,
  onEdit,
}: TimetableGridProps) {
  const { mutate: removeSlot, isPending } = useDeleteTimetableMutation();

  const handleDeactivate = (slot: Timetable) => {
    if (slot.status === "INACTIVE") {
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to remove the scheduled class for ${slot.subject?.name} (${slot.startTime} - ${slot.endTime})?`
    );
    if (confirmDelete) {
      removeSlot(slot._id);
    }
  };

  const weekdays: { label: string; value: Day }[] = [
    { label: "Monday", value: "MONDAY" },
    { label: "Tuesday", value: "TUESDAY" },
    { label: "Wednesday", value: "WEDNESDAY" },
    { label: "Thursday", value: "THURSDAY" },
    { label: "Friday", value: "FRIDAY" },
    { label: "Saturday", value: "SATURDAY" },
  ];

  // Group slots by Day and sort them by start time
  const getSlotsForDay = (day: Day) => {
    return timetableSlots
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getStatusBorder = (status: string) => {
    return status === "ACTIVE" ? "border-slate-900 bg-slate-950/30" : "border-slate-950 bg-slate-950/10 opacity-50";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in duration-300">
      {weekdays.map((dayObj) => {
        const slots = getSlotsForDay(dayObj.value);

        return (
          <div
            key={dayObj.value}
            className="flex flex-col rounded-xl border border-slate-900/60 bg-slate-950/20 p-4 space-y-4 backdrop-blur-xl"
          >
            {/* Weekday title card */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <h3 className="font-extrabold text-sm text-indigo-400 uppercase tracking-wider">
                {dayObj.label}
              </h3>
              <span className="text-[10px] text-slate-500 font-bold bg-slate-900 px-2 py-0.5 rounded">
                {slots.length} {slots.length === 1 ? "Class" : "Classes"}
              </span>
            </div>

            {/* Timetable slots */}
            <div className="flex-1 space-y-3 min-h-[120px]">
              {slots.length ? (
                slots.map((slot) => {
                  const subjectName = slot.subject?.name || "No Subject";
                  const subjectCode = slot.subject?.code || "SUB";
                  const sectionName = slot.section?.name || "No Section";
                  const teacherName = slot.faculty?.user
                    ? `${slot.faculty.user.firstName} ${slot.faculty.user.lastName}`
                    : "No Teacher";

                  return (
                    <div
                      key={slot._id}
                      className={`relative p-3.5 rounded-lg border flex flex-col space-y-2 hover:border-slate-800 transition-all ${getStatusBorder(
                        slot.status
                      )}`}
                    >
                      {/* Time and Subject details */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-bold text-white text-sm line-clamp-1">
                            {subjectName}
                          </p>
                          <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                            {subjectCode}
                          </span>
                        </div>
                        
                        {/* Time badges */}
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-850 bg-slate-900 text-[10px] text-indigo-400 font-extrabold shrink-0">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                      </div>

                      {/* Classroom & Section */}
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-900/60 pt-2 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                          <span className="truncate">{slot.classroom}</span>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          <Layers className="h-3 w-3 text-slate-500 shrink-0" />
                          <span className="truncate font-semibold">{sectionName}</span>
                        </div>
                      </div>

                      {/* Instructor details */}
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-3.5 w-3.5 text-slate-550 shrink-0" />
                          <span className="truncate">{teacherName}</span>
                        </div>

                        {/* Admin Action Menu */}
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                              onClick={() => onEdit(slot)}
                              disabled={isPending}
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-455 hover:text-red-400 transition-colors"
                              onClick={() => handleDeactivate(slot)}
                              disabled={slot.status === "INACTIVE" || isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-slate-900/60 rounded-lg p-6 text-center text-slate-600 text-[10px]">
                  No scheduled classes.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
