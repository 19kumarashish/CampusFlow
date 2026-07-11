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
import { useCreateCourseMutation, useUpdateCourseMutation } from "../hooks/course.hooks";
import { useDepartmentsQuery } from "@/features/departments";
import type { Course, CourseStatus, DegreeType } from "../types/course.types";

interface CourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null; // Null means CREATE mode, populated means EDIT mode
}

export default function CourseDialog({
  isOpen,
  onClose,
  course,
}: CourseDialogProps) {
  const isEditMode = !!course;

  // Fetch departments list
  const { data: deptData } = useDepartmentsQuery({ limit: 100, status: "ACTIVE" });
  const activeDepartments = useMemo(() => deptData?.departments || [], [deptData?.departments]);

  // Validation Schema
  const courseSchema = z.object({
    name: z
      .string()
      .min(2, "Course name must be at least 2 characters")
      .max(100, "Course name cannot exceed 100 characters")
      .trim(),
    code: z
      .string()
      .min(2, "Course code must be at least 2 characters")
      .max(20, "Course code cannot exceed 20 characters")
      .trim()
      .transform((val) => val.toUpperCase()),
    department: z.string().min(1, "Please select an academic department"),
    degree: z.string().min(1, "Please select a degree type"),
    duration: z
      .number()
      .int()
      .min(1, "Duration must be at least 1 year")
      .max(10, "Duration cannot exceed 10 years"),
    totalSemesters: z
      .number()
      .int()
      .min(1, "Course must have at least 1 semester")
      .max(20, "Course cannot exceed 20 semesters"),
    status: z.string().optional(),
  });

  type CourseFormValues = z.infer<typeof courseSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
  });

  // Populate data when opening
  useEffect(() => {
    if (isOpen) {
      if (course) {
        reset({
          name: course.name,
          code: course.code,
          department: course.department._id,
          degree: course.degree,
          duration: course.duration,
          totalSemesters: course.totalSemesters,
          status: course.status,
        });
      } else {
        reset({
          name: "",
          code: "",
          department: activeDepartments[0]?._id || "",
          degree: "BTECH",
          duration: 4,
          totalSemesters: 8,
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, course, reset, activeDepartments]);

  const { mutate: createCourse, isPending: isCreating } = useCreateCourseMutation();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourseMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: CourseFormValues) => {
    if (isEditMode && course) {
      updateCourse(
        {
          id: course._id,
          data: {
            name: values.name,
            code: values.code,
            department: values.department,
            degree: values.degree as DegreeType,
            duration: values.duration,
            totalSemesters: values.totalSemesters,
            status: values.status as CourseStatus,
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createCourse(
        {
          name: values.name,
          code: values.code,
          department: values.department,
          degree: values.degree as DegreeType,
          duration: values.duration,
          totalSemesters: values.totalSemesters,
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
              {isEditMode ? "Edit Course Details" : "Create New Course"}
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
          {/* Course Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-slate-400 text-xs">
              Course Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Bachelor of Technology in CSE"
              className="border-border/50 bg-slate-900/40 text-xs text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[10px] text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Course Code */}
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-slate-400 text-xs">
                Code
              </Label>
              <Input
                id="code"
                placeholder="e.g. CSE-BTECH"
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
            {/* Degree select */}
            <div className="space-y-1.5">
              <Label htmlFor="degree" className="text-slate-400 text-xs">
                Degree Type
              </Label>
              <select
                id="degree"
                className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-350 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("degree")}
              >
                <option value="BTECH" className="bg-slate-950 text-slate-300">B.Tech</option>
                <option value="MTECH" className="bg-slate-950 text-slate-300">M.Tech</option>
                <option value="BCA" className="bg-slate-950 text-slate-300">BCA</option>
                <option value="MCA" className="bg-slate-950 text-slate-300">MCA</option>
                <option value="BSC" className="bg-slate-950 text-slate-300">B.Sc</option>
                <option value="MSC" className="bg-slate-950 text-slate-300">M.Sc</option>
                <option value="BCOM" className="bg-slate-950 text-slate-300">B.Com</option>
                <option value="MCOM" className="bg-slate-950 text-slate-300">M.Com</option>
                <option value="BA" className="bg-slate-950 text-slate-300">B.A.</option>
                <option value="MA" className="bg-slate-950 text-slate-300">M.A.</option>
                <option value="MBA" className="bg-slate-950 text-slate-300">MBA</option>
                <option value="PHD" className="bg-slate-950 text-slate-300">Ph.D.</option>
              </select>
              {errors.degree && (
                <p className="text-[10px] text-red-400">{errors.degree.message}</p>
              )}
            </div>

            {/* Status (Only in Edit mode) */}
            {isEditMode ? (
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-400 text-xs">
                  Course Status
                </Label>
                <select
                  id="status"
                  className="h-9 w-full rounded-md border border-border/50 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-350 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                  disabled={isPending}
                  {...register("status")}
                >
                  <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
                  <option value="INACTIVE" className="bg-slate-950 text-slate-300">Inactive</option>
                </select>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-1.5">
              <Label htmlFor="duration" className="text-slate-400 text-xs">
                Duration (in Years)
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="4"
                className="border-border/50 bg-slate-900/40 text-xs text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("duration", { valueAsNumber: true })}
              />
              {errors.duration && (
                <p className="text-[10px] text-red-400">{errors.duration.message}</p>
              )}
            </div>

            {/* Semesters */}
            <div className="space-y-1.5">
              <Label htmlFor="totalSemesters" className="text-slate-400 text-xs">
                Total Semesters
              </Label>
              <Input
                id="totalSemesters"
                type="number"
                placeholder="8"
                className="border-border/50 bg-slate-900/40 text-xs text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                disabled={isPending}
                {...register("totalSemesters", { valueAsNumber: true })}
              />
              {errors.totalSemesters && (
                <p className="text-[10px] text-red-400">{errors.totalSemesters.message}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-end gap-3 border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-border/50 bg-slate-950 text-slate-450 hover:bg-slate-900 text-xs h-9"
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
                "Update Course"
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
