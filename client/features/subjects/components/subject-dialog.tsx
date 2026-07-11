"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, PlusCircle, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCreateSubjectMutation, useUpdateSubjectMutation } from "../hooks/subject.hooks";
import { useDepartmentsQuery } from "@/features/departments";
import { useCoursesQuery } from "@/features/courses";
import type { Subject, SubjectStatus, SubjectType } from "../types/subject.types";

interface SubjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null; // Null means CREATE mode
}

export default function SubjectDialog({
  isOpen,
  onClose,
  subject,
}: SubjectDialogProps) {
  const isEditMode = !!subject;

  // Fetch departments & courses lists
  const { data: deptData } = useDepartmentsQuery({ limit: 100, status: "ACTIVE" });
  const activeDepartments = useMemo(() => deptData?.departments || [], [deptData?.departments]);

  const { data: courseData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = useMemo(() => courseData?.courses || [], [courseData?.courses]);

  // Validation Schema
  const subjectSchema = z.object({
    name: z
      .string()
      .min(2, "Subject name must be at least 2 characters")
      .max(100, "Subject name cannot exceed 100 characters")
      .trim(),
    code: z
      .string()
      .min(2, "Subject code must be at least 2 characters")
      .max(20, "Subject code cannot exceed 20 characters")
      .trim()
      .transform((val) => val.toUpperCase()),
    department: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a department"),
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a course"),
    semester: z
      .number()
      .int()
      .min(1, "Semester must be at least 1")
      .max(12, "Semester cannot exceed 12"),
    credits: z
      .number()
      .int()
      .min(1, "Credits must be at least 1")
      .max(10, "Credits cannot exceed 10"),
    type: z.string().min(1, "Please select a subject type"),
    status: z.string().optional(),
  });

  type SubjectFormValues = z.infer<typeof subjectSchema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
  });

  // Watch the selected course to constrain semester selections
  const watchedCourseId = watch("course");
  const selectedCourse = activeCourses.find((c) => c._id === watchedCourseId);
  const maxSemesters = selectedCourse?.totalSemesters || 8;

  // Make sure we clamp selected semester if course changes and maxSemesters is lower
  const watchedSemester = watch("semester");
  useEffect(() => {
    if (watchedSemester > maxSemesters) {
      setValue("semester", 1);
    }
  }, [watchedCourseId, maxSemesters, watchedSemester, setValue]);

  // Populate data when opening
  useEffect(() => {
    if (isOpen) {
      if (subject) {
        reset({
          name: subject.name,
          code: subject.code,
          department: subject.department._id,
          course: subject.course._id,
          semester: subject.semester,
          credits: subject.credits,
          type: subject.type,
          status: subject.status,
        });
      } else {
        reset({
          name: "",
          code: "",
          department: activeDepartments[0]?._id || "",
          course: activeCourses[0]?._id || "",
          semester: 1,
          credits: 4,
          type: "THEORY",
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, subject, reset, activeDepartments, activeCourses]);

  const { mutate: createSub, isPending: isCreating } = useCreateSubjectMutation();
  const { mutate: updateSub, isPending: isUpdating } = useUpdateSubjectMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: SubjectFormValues) => {
    if (isEditMode && subject) {
      updateSub(
        {
          id: subject._id,
          data: {
            name: values.name,
            code: values.code,
            department: values.department,
            course: values.course,
            semester: values.semester,
            credits: values.credits,
            type: values.type as SubjectType,
            status: values.status as SubjectStatus,
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createSub(
        {
          name: values.name,
          code: values.code,
          department: values.department,
          course: values.course,
          semester: values.semester,
          credits: values.credits,
          type: values.type as SubjectType,
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
      <Card className="relative w-full max-w-lg border border-border/40 bg-card/90 backdrop-blur-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border/40 pb-4 mb-5">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Edit className="h-5 w-5 text-indigo-400" />
            ) : (
              <PlusCircle className="h-5 w-5 text-indigo-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit Subject Details" : "Create New Subject"}
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Subject Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-slate-400 text-xs">
              Subject Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Advanced Operating Systems"
              className="border-border/50 bg-slate-900/40 text-xs text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[10px] text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Code */}
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-slate-400 text-xs">
                Code
              </Label>
              <Input
                id="code"
                placeholder="e.g. OS-302"
                className="border-border/50 bg-slate-900/40 text-xs text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("code")}
              />
              {errors.code && (
                <p className="text-[10px] text-red-400">{errors.code.message}</p>
              )}
            </div>

            {/* Department select */}
            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-slate-400 text-xs">
                Department
              </Label>
              <select
                id="department"
                className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-350 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("department")}
              >
                {activeDepartments.map((d) => (
                  <option key={d._id} value={d._id} className="bg-slate-950 text-slate-300">
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-[10px] text-red-400">{errors.department.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Course select */}
            <div className="space-y-1.5">
              <Label htmlFor="course" className="text-slate-400 text-xs">
                Course
              </Label>
              <select
                id="course"
                className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-355 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("course")}
              >
                {activeCourses.map((c) => (
                  <option key={c._id} value={c._id} className="bg-slate-950 text-slate-300">
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="text-[10px] text-red-400">{errors.course.message}</p>
              )}
            </div>

            {/* Semester dropdown (Constrained by watched Course) */}
            <div className="space-y-1.5">
              <Label htmlFor="semester" className="text-slate-400 text-xs">
                Semester
              </Label>
              <select
                id="semester"
                className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-355 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("semester", { valueAsNumber: true })}
              >
                {Array.from({ length: maxSemesters }, (_, i) => i + 1).map((sem) => (
                  <option key={sem} value={sem} className="bg-slate-950 text-slate-300">
                    Semester {sem}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <p className="text-[10px] text-red-400">{errors.semester.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Credits (1 to 10) */}
            <div className="space-y-1.5">
              <Label htmlFor="credits" className="text-slate-400 text-xs">
                Credits
              </Label>
              <select
                id="credits"
                className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-355 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("credits", { valueAsNumber: true })}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c} className="bg-slate-955 text-slate-300">
                    {c} {c === 1 ? "Credit" : "Credits"}
                  </option>
                ))}
              </select>
              {errors.credits && (
                <p className="text-[10px] text-red-400">{errors.credits.message}</p>
              )}
            </div>

            {/* Subject type select */}
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-slate-400 text-xs">
                Subject Type
              </Label>
              <select
                id="type"
                className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-355 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("type")}
              >
                <option value="THEORY" className="bg-slate-950 text-slate-300">Theory</option>
                <option value="LAB" className="bg-slate-950 text-slate-300">Lab</option>
                <option value="PROJECT" className="bg-slate-950 text-slate-300">Project</option>
                <option value="ELECTIVE" className="bg-slate-950 text-slate-300">Elective</option>
              </select>
              {errors.type && (
                <p className="text-[10px] text-red-400">{errors.type.message}</p>
              )}
            </div>
          </div>

          {/* Status (Only in Edit mode) */}
          {isEditMode ? (
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="status" className="text-slate-400 text-xs">
                Subject Status
              </Label>
              <select
                id="status"
                className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-355 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("status")}
              >
                <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
                <option value="INACTIVE" className="bg-slate-955 text-slate-300">Inactive</option>
              </select>
            </div>
          ) : null}

          {/* Action buttons */}
          <div className="mt-8 flex justify-end gap-3 border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-border/50 bg-slate-955 text-slate-450 hover:bg-slate-900 text-xs h-9"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 shadow-lg shadow-indigo-600/10 px-6"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Subject"
              ) : (
                "Create Subject"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
