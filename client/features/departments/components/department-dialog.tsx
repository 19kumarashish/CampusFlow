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
import { useCreateDepartmentMutation, useUpdateDepartmentMutation } from "../hooks/department.hooks";
import type { Department, DepartmentStatus } from "../types/department.types";

interface DepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null; // Null means CREATE mode, populated means EDIT mode
}

export default function DepartmentDialog({
  isOpen,
  onClose,
  department,
}: DepartmentDialogProps) {
  const isEditMode = !!department;

  // Validation Schema
  const departmentSchema = z.object({
    name: z
      .string()
      .min(2, "Department name must be at least 2 characters")
      .max(100, "Department name cannot exceed 100 characters")
      .trim(),
    code: z
      .string()
      .min(2, "Department code must be at least 2 characters")
      .max(10, "Department code cannot exceed 10 characters")
      .trim()
      .transform((val) => val.toUpperCase()),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .or(z.literal("")),
    status: z.string().optional(),
  });

  type DepartmentFormValues = z.infer<typeof departmentSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
  });

  // Populate data when opening
  useEffect(() => {
    if (isOpen) {
      if (department) {
        reset({
          name: department.name,
          code: department.code,
          description: department.description || "",
          status: department.status,
        });
      } else {
        reset({
          name: "",
          code: "",
          description: "",
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, department, reset]);

  const { mutate: createDept, isPending: isCreating } = useCreateDepartmentMutation();
  const { mutate: updateDept, isPending: isUpdating } = useUpdateDepartmentMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: DepartmentFormValues) => {
    if (isEditMode && department) {
      updateDept(
        {
          id: department._id,
          data: {
            name: values.name,
            code: values.code,
            description: values.description || undefined,
            status: values.status as DepartmentStatus,
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createDept(
        {
          name: values.name,
          code: values.code,
          description: values.description || undefined,
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
      <Card className="relative w-full max-w-md border-slate-800 bg-slate-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-5">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Edit className="h-5 w-5 text-indigo-400" />
            ) : (
              <PlusCircle className="h-5 w-5 text-indigo-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit Department" : "Create Department"}
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
          {/* Department Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-slate-400 text-xs">
              Department Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Computer Science & Engineering"
              className="border-slate-800 bg-slate-900/60 text-xs text-white"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[10px] text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department Code */}
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-slate-400 text-xs">
                Code
              </Label>
              <Input
                id="code"
                placeholder="e.g. CSE"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("code")}
              />
              {errors.code && (
                <p className="text-[10px] text-red-400">{errors.code.message}</p>
              )}
            </div>

            {/* Status (Only in Edit mode) */}
            {isEditMode ? (
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-400 text-xs">
                  Status
                </Label>
                <select
                  id="status"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 animate-in"
                  disabled={isPending}
                  {...register("status")}
                >
                  <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
                  <option value="INACTIVE" className="bg-slate-950 text-slate-300">Inactive</option>
                </select>
              </div>
            ) : null}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-slate-400 text-xs">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Provide a brief summary of the department..."
              className="w-full h-24 rounded-md border border-slate-800 bg-slate-900/60 p-3 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
              disabled={isPending}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-[10px] text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-end gap-3 border-t border-slate-900 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900 text-white text-xs h-9"
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
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
