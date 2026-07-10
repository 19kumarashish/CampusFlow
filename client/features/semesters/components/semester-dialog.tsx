"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCoursesQuery } from "@/features/courses";
import { useCreateSemesterMutation, useUpdateSemesterMutation } from "../hooks/semester.hooks";
import type { Semester } from "../types/semester.types";

interface SemesterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  semester?: Semester | null;
}

export default function SemesterDialog({
  isOpen,
  onClose,
  semester,
}: SemesterDialogProps) {
  const isEdit = !!semester;

  // Fetch active courses
  const { data: coursesData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = useMemo(() => coursesData?.courses || [], [coursesData?.courses]);

  const { mutate: createSem, isPending: isCreating } = useCreateSemesterMutation();
  const { mutate: updateSem, isPending: isUpdating } = useUpdateSemesterMutation();

  const isPending = isCreating || isUpdating;

  // Form Zod validation schema
  const schema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    semesterNumber: z.coerce.number().min(1).max(12),
    type: z.enum(["ODD", "EVEN"]),
    academicYear: z.string().trim().min(4, "Academic year description is required"),
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a valid course"),
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
    registrationStart: z.string().min(1, "Registration Start Date is required"),
    registrationEnd: z.string().min(1, "Registration End Date is required"),
    examStart: z.string().min(1, "Exam Start Date is required"),
    examEnd: z.string().min(1, "Exam End Date is required"),
    resultDate: z.string().min(1, "Result Release Date is required"),
    isCurrent: z.boolean().default(false),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Load defaults
  useEffect(() => {
    if (isOpen) {
      const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toISOString().split("T")[0];
      };

      reset({
        name: semester?.name || "",
        semesterNumber: semester?.semesterNumber || 1,
        type: semester?.type || "ODD",
        academicYear: semester?.academicYear || "2025-2026",
        course: typeof semester?.course === "object" ? (semester.course as any)._id : semester?.course || "",
        startDate: formatDate(semester?.startDate),
        endDate: formatDate(semester?.endDate),
        registrationStart: formatDate(semester?.registrationStart),
        registrationEnd: formatDate(semester?.registrationEnd),
        examStart: formatDate(semester?.examStart),
        examEnd: formatDate(semester?.examEnd),
        resultDate: formatDate(semester?.resultDate),
        isCurrent: semester?.isCurrent || false,
        status: semester?.status || "ACTIVE",
      });
    }
  }, [isOpen, semester, reset]);

  const onSubmit = (values: any) => {
    const payload = {
      ...values,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      registrationStart: new Date(values.registrationStart).toISOString(),
      registrationEnd: new Date(values.registrationEnd).toISOString(),
      examStart: new Date(values.examStart).toISOString(),
      examEnd: new Date(values.examEnd).toISOString(),
      resultDate: new Date(values.resultDate).toISOString(),
    };

    if (isEdit && semester) {
      updateSem(
        { id: semester._id, data: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createSem(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="relative w-full max-w-2xl border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-md max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEdit ? "Update Academic Semester" : "Add Academic Semester"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set starting timelines, registration limits, and exam windows
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Semester Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Spring 2026"
                className="h-9 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary"
                {...register("name")}
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Academic Year */}
            <div className="space-y-1.5">
              <Label htmlFor="academicYear" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Academic Year
              </Label>
              <Input
                id="academicYear"
                placeholder="e.g. 2025-2026"
                className="h-9 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary"
                {...register("academicYear")}
                disabled={isPending}
              />
              {errors.academicYear && (
                <p className="text-[11px] text-destructive">{errors.academicYear.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Semester Number */}
            <div className="space-y-1.5">
              <Label htmlFor="semesterNumber" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Semester No.
              </Label>
              <Input
                id="semesterNumber"
                type="number"
                min={1}
                max={12}
                className="h-9 border-border bg-background/50 text-foreground text-xs focus-visible:ring-primary/20 focus-visible:border-primary"
                {...register("semesterNumber")}
                disabled={isPending}
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Type
              </Label>
              <select
                id="type"
                className="h-9 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1"
                {...register("type")}
                disabled={isPending}
              >
                <option value="ODD" className="bg-slate-950">ODD</option>
                <option value="EVEN" className="bg-slate-955">EVEN</option>
              </select>
            </div>

            {/* Course Select */}
            <div className="space-y-1.5">
              <Label htmlFor="course" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Course Degree
              </Label>
              <select
                id="course"
                className="h-9 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1"
                {...register("course")}
                disabled={isPending}
              >
                <option value="">Select Degree Course</option>
                {activeCourses.map((c) => (
                  <option key={c._id} value={c._id} className="bg-slate-950">
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="text-[11px] text-destructive">{errors.course.message}</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 mt-4 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Boundaries & Timelines Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Semester Start
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  className="h-9 border-border bg-background/50 text-foreground text-xs"
                  {...register("startDate")}
                  disabled={isPending}
                />
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <Label htmlFor="endDate" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Semester End
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  className="h-9 border-border bg-background/50 text-foreground text-xs"
                  {...register("endDate")}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Registration Start */}
              <div className="space-y-1.5">
                <Label htmlFor="registrationStart" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Registration Start
                </Label>
                <Input
                  id="registrationStart"
                  type="date"
                  className="h-9 border-border bg-background/50 text-foreground text-xs"
                  {...register("registrationStart")}
                  disabled={isPending}
                />
              </div>

              {/* Registration End */}
              <div className="space-y-1.5">
                <Label htmlFor="registrationEnd" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Registration End
                </Label>
                <Input
                  id="registrationEnd"
                  type="date"
                  className="h-9 border-border bg-background/50 text-foreground text-xs"
                  {...register("registrationEnd")}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Exam Start */}
              <div className="space-y-1.5">
                <Label htmlFor="examStart" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Exam Start
                </Label>
                <Input
                  id="examStart"
                  type="date"
                  className="h-9 border-border bg-background/50 text-foreground text-xs"
                  {...register("examStart")}
                  disabled={isPending}
                />
              </div>

              {/* Exam End */}
              <div className="space-y-1.5">
                <Label htmlFor="examEnd" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Exam End
                </Label>
                <Input
                  id="examEnd"
                  type="date"
                  className="h-9 border-border bg-background/50 text-foreground text-xs"
                  {...register("examEnd")}
                  disabled={isPending}
                />
              </div>

              {/* Result Date */}
              <div className="space-y-1.5">
                <Label htmlFor="resultDate" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Result Release
                </Label>
                <Input
                  id="resultDate"
                  type="date"
                  className="h-9 border-border bg-background/50 text-foreground text-xs"
                  {...register("resultDate")}
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-4">
            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Active Status
              </Label>
              <select
                id="status"
                className="h-9 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1"
                {...register("status")}
                disabled={isPending}
              >
                <option value="ACTIVE" className="bg-slate-950">ACTIVE</option>
                <option value="INACTIVE" className="bg-slate-955">INACTIVE</option>
              </select>
            </div>

            {/* isCurrent */}
            <div className="flex items-center gap-2.5 pt-6 pl-4">
              <input
                id="isCurrent"
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4.5 w-4.5"
                {...register("isCurrent")}
                disabled={isPending}
              />
              <Label htmlFor="isCurrent" className="text-xs font-semibold text-slate-350 cursor-pointer">
                Set as Active Current Semester
              </Label>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-900/60 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-9 border-slate-850 bg-slate-950 text-slate-300 text-xs hover:bg-slate-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-5"
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                </span>
              ) : (
                "Save Semester"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
