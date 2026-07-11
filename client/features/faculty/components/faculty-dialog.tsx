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
import { useCreateFacultyMutation, useUpdateFacultyMutation, useFacultiesQuery } from "../hooks/faculty.hooks";
import { useDepartmentsQuery } from "@/features/departments";
import { useUsersQuery } from "@/features/users";
import type { Faculty, FacultyStatus, Designation, EmploymentType } from "../types/faculty.types";

interface FacultyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: Faculty | null; // Null means CREATE mode
}

export default function FacultyDialog({
  isOpen,
  onClose,
  faculty,
}: FacultyDialogProps) {
  const isEditMode = !!faculty;

  // Fetch departments list
  const { data: deptData } = useDepartmentsQuery({ limit: 100, status: "ACTIVE" });
  const activeDepartments = useMemo(() => deptData?.departments || [], [deptData?.departments]);

  // Fetch all user accounts to filter for teachers
  const { data: usersData } = useUsersQuery({ limit: 100 });
  const allUsers = useMemo(() => usersData?.users || [], [usersData?.users]);

  // Fetch all faculty profiles to filter out already assigned users
  const { data: facultiesData } = useFacultiesQuery({ limit: 100 });
  const existingFaculties = useMemo(() => facultiesData?.faculties || [], [facultiesData?.faculties]);

  // Filter for TEACHER accounts
  const teachers = useMemo(() => allUsers.filter((u) => u.role?.name === "TEACHER"), [allUsers]);

  // Filter out teachers who already have a profile, EXCEPT the current one in Edit mode
  const unassignedTeachers = useMemo(() => {
    return teachers.filter((t) => {
      if (isEditMode && faculty && faculty.user?._id === t._id) {
        return true;
      }
      return !existingFaculties.some((f) => f.user?._id === t._id);
    });
  }, [teachers, existingFaculties, isEditMode, faculty]);

  // Validation Schema
  const facultySchema = z.object({
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select an user account"),
    employeeId: z
      .string()
      .min(2, "Employee ID must be at least 2 characters")
      .max(20, "Employee ID cannot exceed 20 characters")
      .trim()
      .transform((val) => val.toUpperCase()),
    department: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a department"),
    designation: z.string().min(1, "Please select a designation"),
    qualification: z
      .string()
      .min(2, "Qualification must be at least 2 characters")
      .max(100, "Qualification cannot exceed 100 characters")
      .trim(),
    specialization: z
      .string()
      .min(2, "Specialization must be at least 2 characters")
      .max(100, "Specialization cannot exceed 100 characters")
      .trim(),
    experience: z
      .number()
      .min(0, "Experience cannot be negative")
      .max(60, "Experience cannot exceed 60 years"),
    joiningDate: z.string().min(1, "Please choose a joining date"),
    employmentType: z.string().min(1, "Please select an employment type"),
    status: z.string().optional(),
  });

  type FacultyFormValues = z.infer<typeof facultySchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
  });

  // Populate data when opening
  useEffect(() => {
    if (isOpen) {
      if (faculty) {
        // Format ISO Date to YYYY-MM-DD for standard html date picker input
        const rawDate = faculty.joiningDate ? new Date(faculty.joiningDate) : new Date();
        const formattedDate = rawDate.toISOString().split("T")[0];

        reset({
          user: faculty.user?._id || "",
          employeeId: faculty.employeeId,
          department: faculty.department?._id || "",
          designation: faculty.designation,
          qualification: faculty.qualification,
          specialization: faculty.specialization,
          experience: faculty.experience,
          joiningDate: formattedDate,
          employmentType: faculty.employmentType,
          status: faculty.status,
        });
      } else {
        reset({
          user: unassignedTeachers[0]?._id || "",
          employeeId: "",
          department: activeDepartments[0]?._id || "",
          designation: "ASSISTANT_PROFESSOR",
          qualification: "",
          specialization: "",
          experience: 2,
          joiningDate: new Date().toISOString().split("T")[0],
          employmentType: "FULL_TIME",
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, faculty, reset, activeDepartments, unassignedTeachers]);

  const { mutate: createFacultyProfile, isPending: isCreating } = useCreateFacultyMutation();
  const { mutate: updateFacultyProfile, isPending: isUpdating } = useUpdateFacultyMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: FacultyFormValues) => {
    if (isEditMode && faculty) {
      updateFacultyProfile(
        {
          id: faculty._id,
          data: {
            user: values.user,
            employeeId: values.employeeId,
            department: values.department,
            designation: values.designation as Designation,
            qualification: values.qualification,
            specialization: values.specialization,
            experience: values.experience,
            joiningDate: values.joiningDate,
            employmentType: values.employmentType as EmploymentType,
            status: values.status as FacultyStatus,
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createFacultyProfile(
        {
          user: values.user,
          employeeId: values.employeeId,
          department: values.department,
          designation: values.designation as Designation,
          qualification: values.qualification,
          specialization: values.specialization,
          experience: values.experience,
          joiningDate: values.joiningDate,
          employmentType: values.employmentType as EmploymentType,
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
              {isEditMode ? "Edit Faculty Profile" : "Register Faculty Profile"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User Account select */}
            <div className="space-y-1.5">
              <Label htmlFor="user" className="text-slate-400 text-xs">
                Select User Account
              </Label>
              {isEditMode ? (
                <div className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/30 px-3 py-1.5 text-xs text-slate-500 flex items-center">
                  {faculty?.user?.firstName} {faculty?.user?.lastName} ({faculty?.user?.email})
                </div>
              ) : (
                <select
                  id="user"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={isPending}
                  {...register("user")}
                >
                  {unassignedTeachers.length ? (
                    unassignedTeachers.map((u) => (
                      <option key={u._id} value={u._id} className="bg-slate-950 text-slate-300">
                        {u.firstName} {u.lastName} ({u.email})
                      </option>
                    ))
                  ) : (
                    <option value="" className="bg-slate-950 text-slate-500">No unassigned teachers</option>
                  )}
                </select>
              )}
              {errors.user && (
                <p className="text-[10px] text-red-400">{errors.user.message}</p>
              )}
            </div>

            {/* Employee ID */}
            <div className="space-y-1.5">
              <Label htmlFor="employeeId" className="text-slate-400 text-xs">
                Employee ID
              </Label>
              <Input
                id="employeeId"
                placeholder="e.g. EMP-240"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("employeeId")}
              />
              {errors.employeeId && (
                <p className="text-[10px] text-red-400">{errors.employeeId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-slate-400 text-xs">
                Department
              </Label>
              <select
                id="department"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

            {/* Designation */}
            <div className="space-y-1.5">
              <Label htmlFor="designation" className="text-slate-400 text-xs">
                Designation
              </Label>
              <select
                id="designation"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("designation")}
              >
                <option value="HOD" className="bg-slate-950 text-slate-300">HOD</option>
                <option value="PROFESSOR" className="bg-slate-950 text-slate-300">Professor</option>
                <option value="ASSOCIATE_PROFESSOR" className="bg-slate-950 text-slate-300">Associate Professor</option>
                <option value="ASSISTANT_PROFESSOR" className="bg-slate-950 text-slate-300">Assistant Professor</option>
                <option value="LECTURER" className="bg-slate-950 text-slate-300">Lecturer</option>
                <option value="VISITING_FACULTY" className="bg-slate-950 text-slate-300">Visiting Faculty</option>
              </select>
              {errors.designation && (
                <p className="text-[10px] text-red-400">{errors.designation.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Qualification */}
            <div className="space-y-1.5">
              <Label htmlFor="qualification" className="text-slate-400 text-xs">
                Qualification
              </Label>
              <Input
                id="qualification"
                placeholder="e.g. Ph.D. in Computer Science"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("qualification")}
              />
              {errors.qualification && (
                <p className="text-[10px] text-red-400">{errors.qualification.message}</p>
              )}
            </div>

            {/* Specialization */}
            <div className="space-y-1.5">
              <Label htmlFor="specialization" className="text-slate-400 text-xs">
                Specialization
              </Label>
              <Input
                id="specialization"
                placeholder="e.g. Machine Learning, Cloud Systems"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("specialization")}
              />
              {errors.specialization && (
                <p className="text-[10px] text-red-400">{errors.specialization.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Experience (Years) */}
            <div className="space-y-1.5">
              <Label htmlFor="experience" className="text-slate-400 text-xs">
                Experience (in Years)
              </Label>
              <Input
                id="experience"
                type="number"
                placeholder="5"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="text-[10px] text-red-400">{errors.experience.message}</p>
              )}
            </div>

            {/* Joining Date */}
            <div className="space-y-1.5">
              <Label htmlFor="joiningDate" className="text-slate-400 text-xs">
                Joining Date
              </Label>
              <input
                id="joiningDate"
                type="date"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-350 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("joiningDate")}
              />
              {errors.joiningDate && (
                <p className="text-[10px] text-red-400">{errors.joiningDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Employment Type */}
            <div className="space-y-1.5">
              <Label htmlFor="employmentType" className="text-slate-400 text-xs">
                Employment Type
              </Label>
              <select
                id="employmentType"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("employmentType")}
              >
                <option value="FULL_TIME" className="bg-slate-950 text-slate-300">Full Time</option>
                <option value="PART_TIME" className="bg-slate-950 text-slate-300">Part Time</option>
                <option value="CONTRACT" className="bg-slate-950 text-slate-300">Contract</option>
                <option value="VISITING" className="bg-slate-950 text-slate-300">Visiting</option>
              </select>
              {errors.employmentType && (
                <p className="text-[10px] text-red-400">{errors.employmentType.message}</p>
              )}
            </div>

            {/* Status (Only in Edit mode) */}
            {isEditMode ? (
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-400 text-xs">
                  Profile Status
                </Label>
                <select
                  id="status"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={isPending}
                  {...register("status")}
                >
                  <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
                  <option value="INACTIVE" className="bg-slate-950 text-slate-300">Inactive</option>
                </select>
              </div>
            ) : null}
          </div>

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
              disabled={isPending || (!isEditMode && unassignedTeachers.length === 0)}
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Profile"
              ) : (
                "Register Faculty"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
