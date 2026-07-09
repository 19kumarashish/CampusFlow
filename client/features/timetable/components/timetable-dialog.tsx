"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, PlusCircle, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCreateTimetableMutation, useUpdateTimetableMutation } from "../hooks/timetable.hooks";
import { useSectionsQuery } from "@/features/sections";
import { useSubjectsQuery } from "@/features/subjects";
import { useFacultiesQuery } from "@/features/faculty";
import type { Timetable, Day } from "../types/timetable.types";

interface TimetableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: Timetable | null; // Null means CREATE mode
}

export default function TimetableDialog({
  isOpen,
  onClose,
  timetable,
}: TimetableDialogProps) {
  const isEditMode = !!timetable;

  // Fetch sections, subjects, and faculties list
  const { data: sectionData } = useSectionsQuery({ limit: 100, status: "ACTIVE" });
  const activeSections = sectionData?.sections || [];

  const { data: subjectData } = useSubjectsQuery({ limit: 100, status: "ACTIVE" });
  const activeSubjects = subjectData?.subjects || [];

  const { data: facultyData } = useFacultiesQuery({ limit: 100, status: "ACTIVE" });
  const activeFaculties = facultyData?.faculties || [];

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  // Validation Schema
  const timetableSchema = z
    .object({
      section: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a section"),
      subject: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a subject"),
      faculty: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a faculty advisor"),
      classroom: z
        .string()
        .min(2, "Classroom must be at least 2 characters")
        .max(50, "Classroom cannot exceed 50 characters")
        .trim(),
      day: z.string().min(1, "Please select a weekday"),
      startTime: z.string().regex(timeRegex, "Invalid format. Use HH:mm"),
      endTime: z.string().regex(timeRegex, "Invalid format. Use HH:mm"),
      status: z.string().optional(),
    })
    .refine((data) => data.endTime > data.startTime, {
      message: "End time must be after start time",
      path: ["endTime"],
    });

  type TimetableFormValues = z.infer<typeof timetableSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableSchema),
  });

  // Populate data when opening
  useEffect(() => {
    if (isOpen) {
      if (timetable) {
        reset({
          section: timetable.section?._id || "",
          subject: timetable.subject?._id || "",
          faculty: timetable.faculty?._id || "",
          classroom: timetable.classroom,
          day: timetable.day,
          startTime: timetable.startTime,
          endTime: timetable.endTime,
          status: timetable.status,
        });
      } else {
        reset({
          section: activeSections[0]?._id || "",
          subject: activeSubjects[0]?._id || "",
          faculty: activeFaculties[0]?._id || "",
          classroom: "",
          day: "MONDAY",
          startTime: "09:00",
          endTime: "10:30",
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, timetable, reset, activeSections, activeSubjects, activeFaculties]);

  const { mutate: createTimetableSlot, isPending: isCreating } = useCreateTimetableMutation();
  const { mutate: updateTimetableSlot, isPending: isUpdating } = useUpdateTimetableMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: TimetableFormValues) => {
    if (isEditMode && timetable) {
      updateTimetableSlot(
        {
          id: timetable._id,
          data: {
            section: values.section,
            subject: values.subject,
            faculty: values.faculty,
            classroom: values.classroom,
            day: values.day as Day,
            startTime: values.startTime,
            endTime: values.endTime,
            status: values.status as "ACTIVE" | "INACTIVE",
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createTimetableSlot(
        {
          section: values.section,
          subject: values.subject,
          faculty: values.faculty,
          classroom: values.classroom,
          day: values.day as Day,
          startTime: values.startTime,
          endTime: values.endTime,
        },
        {
          onSuccess: () => onClose(),
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <Card className="relative w-full max-w-md border-slate-800 bg-slate-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 text-xs">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-5">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Edit className="h-5 w-5 text-indigo-400" />
            ) : (
              <PlusCircle className="h-5 w-5 text-indigo-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit Scheduled Class" : "Schedule Class Session"}
            </h2>
          </div>
          <button
            className="text-slate-400 hover:text-white transition-colors"
            onClick={onClose}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          {/* Section Select */}
          <div className="space-y-1.5">
            <Label htmlFor="section" className="text-slate-400 text-[10px]">
              Select Section
            </Label>
            <select
              id="section"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending}
              {...register("section")}
            >
              {activeSections.map((sec) => (
                <option key={sec._id} value={sec._id} className="bg-slate-950 text-slate-300">
                  {sec.name}
                </option>
              ))}
            </select>
            {errors.section && (
              <p className="text-[10px] text-red-400">{errors.section.message}</p>
            )}
          </div>

          {/* Subject select */}
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-slate-400 text-[10px]">
              Academic Subject
            </Label>
            <select
              id="subject"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending}
              {...register("subject")}
            >
              {activeSubjects.map((sub) => (
                <option key={sub._id} value={sub._id} className="bg-slate-950 text-slate-300">
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-[10px] text-red-400">{errors.subject.message}</p>
            )}
          </div>

          {/* Faculty select */}
          <div className="space-y-1.5">
            <Label htmlFor="faculty" className="text-slate-400 text-[10px]">
              Faculty Teacher
            </Label>
            <select
              id="faculty"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending}
              {...register("faculty")}
            >
              {activeFaculties.map((f) => {
                const name = f.user ? `${f.user.firstName} ${f.user.lastName}` : `ID: ${f.employeeId}`;
                return (
                  <option key={f._id} value={f._id} className="bg-slate-950 text-slate-300">
                    {name} ({f.employeeId})
                  </option>
                );
              })}
            </select>
            {errors.faculty && (
              <p className="text-[10px] text-red-400">{errors.faculty.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Classroom */}
            <div className="space-y-1.5">
              <Label htmlFor="classroom" className="text-slate-400 text-[10px]">
                Classroom / Laboratory Location
              </Label>
              <Input
                id="classroom"
                placeholder="e.g. Room 402-A"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("classroom")}
              />
              {errors.classroom && (
                <p className="text-[10px] text-red-400">{errors.classroom.message}</p>
              )}
            </div>

            {/* Day of week */}
            <div className="space-y-1.5">
              <Label htmlFor="day" className="text-slate-400 text-[10px]">
                Day of Week
              </Label>
              <select
                id="day"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("day")}
              >
                <option value="MONDAY" className="bg-slate-950 text-slate-300">Monday</option>
                <option value="TUESDAY" className="bg-slate-950 text-slate-300">Tuesday</option>
                <option value="WEDNESDAY" className="bg-slate-950 text-slate-300">Wednesday</option>
                <option value="THURSDAY" className="bg-slate-950 text-slate-300">Thursday</option>
                <option value="FRIDAY" className="bg-slate-950 text-slate-300">Friday</option>
                <option value="SATURDAY" className="bg-slate-950 text-slate-300">Saturday</option>
                <option value="SUNDAY" className="bg-slate-950 text-slate-300">Sunday</option>
              </select>
              {errors.day && (
                <p className="text-[10px] text-red-400">{errors.day.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start time */}
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-slate-400 text-[10px]">
                Start Time (HH:mm)
              </Label>
              <Input
                id="startTime"
                type="text"
                placeholder="09:00"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("startTime")}
              />
              {errors.startTime && (
                <p className="text-[10px] text-red-400">{errors.startTime.message}</p>
              )}
            </div>

            {/* End time */}
            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-slate-400 text-[10px]">
                End Time (HH:mm)
              </Label>
              <Input
                id="endTime"
                type="text"
                placeholder="10:30"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("endTime")}
              />
              {errors.endTime && (
                <p className="text-[10px] text-red-400">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Status (Only in Edit mode) */}
          {isEditMode ? (
            <div className="space-y-1.5 animate-in">
              <Label htmlFor="status" className="text-slate-400 text-[10px]">
                Schedule Status
              </Label>
              <select
                id="status"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-350 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("status")}
              >
                <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
                <option value="INACTIVE" className="bg-slate-950 text-slate-300">Inactive</option>
              </select>
            </div>
          ) : null}

          {/* Action buttons */}
          <div className="mt-8 flex justify-end gap-3 border-t border-slate-900 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-slate-800 bg-slate-955 text-slate-455 hover:bg-slate-900 text-white text-[11px] h-9"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] h-9 shadow-lg shadow-indigo-600/10 px-6"
              disabled={
                isPending ||
                activeSections.length === 0 ||
                activeSubjects.length === 0 ||
                activeFaculties.length === 0
              }
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Schedule"
              ) : (
                "Schedule Class"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
