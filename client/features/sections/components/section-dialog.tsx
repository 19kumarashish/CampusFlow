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
import { useCreateSectionMutation, useUpdateSectionMutation } from "../hooks/section.hooks";
import { useSemestersQuery } from "@/features/semesters";
import { useFacultiesQuery } from "@/features/faculty";
import type { Section } from "../types/section.types";

interface SectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section | null; // Null means CREATE mode
}

export default function SectionDialog({
  isOpen,
  onClose,
  section,
}: SectionDialogProps) {
  const isEditMode = !!section;

  // Fetch active semesters
  const { data: semesterData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = semesterData?.semesters || [];

  // Fetch active faculties
  const { data: facultyData } = useFacultiesQuery({ limit: 100, status: "ACTIVE" });
  const activeFaculties = facultyData?.faculties || [];

  // Validation Schema
  const sectionSchema = z.object({
    name: z
      .string()
      .min(1, "Section name is required")
      .max(10, "Section name cannot exceed 10 characters")
      .trim()
      .transform((val) => val.toUpperCase()),
    semester: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a semester term"),
    capacity: z
      .number()
      .int()
      .min(1, "Capacity must be at least 1")
      .max(300, "Capacity cannot exceed 300"),
    classroom: z
      .string()
      .min(2, "Classroom designation is required")
      .max(50, "Classroom name cannot exceed 50 characters")
      .trim(),
    facultyAdvisor: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a faculty advisor"),
    status: z.string().optional(),
  });

  type SectionFormValues = z.infer<typeof sectionSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
  });

  // Populate data when opening
  useEffect(() => {
    if (isOpen) {
      if (section) {
        reset({
          name: section.name,
          semester: section.semester?._id || "",
          capacity: section.capacity,
          classroom: section.classroom,
          facultyAdvisor: section.facultyAdvisor?._id || "",
          status: section.status,
        });
      } else {
        reset({
          name: "",
          semester: activeSemesters[0]?._id || "",
          capacity: 40,
          classroom: "",
          facultyAdvisor: activeFaculties[0]?._id || "",
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, section, reset, activeSemesters, activeFaculties]);

  const { mutate: createSectionMutation, isPending: isCreating } = useCreateSectionMutation();
  const { mutate: updateSectionMutation, isPending: isUpdating } = useUpdateSectionMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: SectionFormValues) => {
    if (isEditMode && section) {
      updateSectionMutation(
        {
          id: section._id,
          data: {
            name: values.name,
            semester: values.semester,
            capacity: values.capacity,
            classroom: values.classroom,
            facultyAdvisor: values.facultyAdvisor,
            status: values.status as "ACTIVE" | "INACTIVE",
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createSectionMutation(
        {
          name: values.name,
          semester: values.semester,
          capacity: values.capacity,
          classroom: values.classroom,
          facultyAdvisor: values.facultyAdvisor,
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
      <Card className="relative w-full max-w-md border-slate-800 bg-slate-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-5">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Edit className="h-5 w-5 text-indigo-400" />
            ) : (
              <PlusCircle className="h-5 w-5 text-indigo-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit Section Details" : "Create Section"}
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
          {/* Section Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-slate-400 text-[10px]">
              Section Name (automatically uppercased)
            </Label>
            <Input
              id="name"
              placeholder="e.g. BTECH-CSE-SEC-A"
              className="border-slate-800 bg-slate-900/60 text-white"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[10px] text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Semester selection */}
          <div className="space-y-1.5">
            <Label htmlFor="semester" className="text-slate-400 text-[10px]">
              Semester Term
            </Label>
            <select
              id="semester"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-350 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending}
              {...register("semester")}
            >
              {activeSemesters.length ? (
                activeSemesters.map((s) => (
                  <option key={s._id} value={s._id} className="bg-slate-950 text-slate-300">
                    {s.name} ({s.academicYear} - {s.type} Semester)
                  </option>
                ))
              ) : (
                <option value="" className="bg-slate-950 text-slate-500">No active semesters found</option>
              )}
            </select>
            {errors.semester && (
              <p className="text-[10px] text-red-400">{errors.semester.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Classroom */}
            <div className="space-y-1.5">
              <Label htmlFor="classroom" className="text-slate-400 text-[10px]">
                Classroom Designation
              </Label>
              <Input
                id="classroom"
                placeholder="e.g. Block C - Room 305"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("classroom")}
              />
              {errors.classroom && (
                <p className="text-[10px] text-red-400">{errors.classroom.message}</p>
              )}
            </div>

            {/* Capacity */}
            <div className="space-y-1.5">
              <Label htmlFor="capacity" className="text-slate-400 text-[10px]">
                Capacity (seats)
              </Label>
              <Input
                id="capacity"
                type="number"
                placeholder="60"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("capacity", { valueAsNumber: true })}
              />
              {errors.capacity && (
                <p className="text-[10px] text-red-400">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          {/* Faculty Advisor select */}
          <div className="space-y-1.5">
            <Label htmlFor="facultyAdvisor" className="text-slate-400 text-[10px]">
              Faculty Advisor
            </Label>
            <select
              id="facultyAdvisor"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-350 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending}
              {...register("facultyAdvisor")}
            >
              {activeFaculties.length ? (
                activeFaculties.map((f) => {
                  const name = f.user ? `${f.user.firstName} ${f.user.lastName}` : `ID: ${f.employeeId}`;
                  return (
                    <option key={f._id} value={f._id} className="bg-slate-950 text-slate-300">
                      {name} ({f.employeeId})
                    </option>
                  );
                })
              ) : (
                <option value="" className="bg-slate-950 text-slate-500">No active faculty found</option>
              )}
            </select>
            {errors.facultyAdvisor && (
              <p className="text-[10px] text-red-400">{errors.facultyAdvisor.message}</p>
            )}
          </div>

          {/* Status dropdown (Only in Edit mode) */}
          {isEditMode ? (
            <div className="space-y-1.5 animate-in">
              <Label htmlFor="status" className="text-slate-400 text-[10px]">
                Section Status
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
              className="border-slate-800 bg-slate-950 text-slate-455 hover:bg-slate-900 text-white text-[11px] h-9"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] h-9 shadow-lg shadow-indigo-600/10 px-6"
              disabled={isPending || activeSemesters.length === 0 || activeFaculties.length === 0}
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Section"
              ) : (
                "Create Section"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
