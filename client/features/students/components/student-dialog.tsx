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
import { useCreateStudentMutation, useUpdateStudentMutation, useStudentsQuery } from "../hooks/student.hooks";
import { useDepartmentsQuery } from "@/features/departments";
import { useCoursesQuery } from "@/features/courses";
import { useUsersQuery } from "@/features/users";
import type { Student, StudentStatus, AdmissionType, Gender, BloodGroup } from "../types/student.types";

interface StudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null; // Null means CREATE mode
}

export default function StudentDialog({
  isOpen,
  onClose,
  student,
}: StudentDialogProps) {
  const isEditMode = !!student;

  // Fetch departments list
  const { data: deptData } = useDepartmentsQuery({ limit: 100, status: "ACTIVE" });
  const activeDepartments = deptData?.departments || [];

  // Fetch courses list
  const { data: courseData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = courseData?.courses || [];

  // Fetch all user accounts to filter for students
  const { data: usersData } = useUsersQuery({ limit: 100 });
  const allUsers = usersData?.users || [];

  // Fetch all student profiles to filter out already assigned users
  const { data: studentsData } = useStudentsQuery({ limit: 100 });
  const existingStudents = studentsData?.students || [];

  // Filter for STUDENT accounts
  const studentsList = allUsers.filter((u) => u.role?.name === "STUDENT");

  // Filter out students who already have a profile, EXCEPT the current one in Edit mode
  const unassignedStudents = studentsList.filter((s) => {
    if (isEditMode && student && student.user?._id === s._id) {
      return true;
    }
    return !existingStudents.some((st) => st.user?._id === s._id);
  });

  const currentYear = new Date().getFullYear();

  // Validation Schema
  const studentSchema = z.object({
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select an user account"),
    studentId: z
      .string()
      .min(2, "Student ID must be at least 2 characters")
      .max(20, "Student ID cannot exceed 20 characters")
      .trim()
      .transform((val) => val.toUpperCase()),
    registrationNumber: z
      .string()
      .min(2, "Registration number must be at least 2 characters")
      .max(30, "Registration number cannot exceed 30 characters")
      .trim()
      .transform((val) => val.toUpperCase()),
    rollNumber: z
      .string()
      .min(1, "Roll number is required")
      .max(20, "Roll number cannot exceed 20 characters")
      .trim(),
    department: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a department"),
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a course"),
    currentSemester: z
      .number()
      .int()
      .min(1, "Semester must be at least 1")
      .max(12, "Semester cannot exceed 12"),
    admissionYear: z
      .number()
      .int()
      .min(2000, "Admission year must be at least 2000")
      .max(currentYear, `Admission year cannot exceed ${currentYear}`),
    admissionType: z.string().min(1, "Please select an admission entry type"),
    dateOfBirth: z.string().min(1, "Please choose date of birth"),
    gender: z.string().min(1, "Please select gender"),
    bloodGroup: z.string().min(1, "Please select blood group"),
    guardianName: z
      .string()
      .min(2, "Guardian name must be at least 2 characters")
      .max(100, "Guardian name cannot exceed 100 characters")
      .trim(),
    guardianPhone: z
      .string()
      .min(10, "Guardian phone number must be at least 10 characters")
      .max(15, "Guardian phone number cannot exceed 15 characters")
      .trim(),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address cannot exceed 500 characters")
      .trim(),
    status: z.string().optional(),
  });

  type StudentFormValues = z.infer<typeof studentSchema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
  });

  // Watch selected course to constrain semester select box options
  const watchedCourseId = watch("course");
  const selectedCourse = activeCourses.find((c) => c._id === watchedCourseId);
  const maxSemesters = selectedCourse?.totalSemesters || 8;

  // Make sure we clamp selected semester if course changes and maxSemesters is lower
  const watchedSemester = watch("currentSemester");
  useEffect(() => {
    if (watchedSemester > maxSemesters) {
      setValue("currentSemester", 1);
    }
  }, [watchedCourseId, maxSemesters, watchedSemester, setValue]);

  // Populate data when opening
  useEffect(() => {
    if (isOpen) {
      if (student) {
        const rawDob = student.dateOfBirth ? new Date(student.dateOfBirth) : new Date();
        const formattedDob = rawDob.toISOString().split("T")[0];

        reset({
          user: student.user?._id || "",
          studentId: student.studentId,
          registrationNumber: student.registrationNumber,
          rollNumber: student.rollNumber,
          department: student.department?._id || "",
          course: student.course?._id || "",
          currentSemester: student.currentSemester,
          admissionYear: student.admissionYear,
          admissionType: student.admissionType,
          dateOfBirth: formattedDob,
          gender: student.gender,
          bloodGroup: student.bloodGroup,
          guardianName: student.guardianName,
          guardianPhone: student.guardianPhone,
          address: student.address,
          status: student.status,
        });
      } else {
        reset({
          user: unassignedStudents[0]?._id || "",
          studentId: "",
          registrationNumber: "",
          rollNumber: "",
          department: activeDepartments[0]?._id || "",
          course: activeCourses[0]?._id || "",
          currentSemester: 1,
          admissionYear: currentYear,
          admissionType: "REGULAR",
          dateOfBirth: "2005-01-01",
          gender: "MALE",
          bloodGroup: "O_POSITIVE",
          guardianName: "",
          guardianPhone: "",
          address: "",
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, student, reset, activeDepartments, activeCourses, unassignedStudents, currentYear]);

  const { mutate: createStudentProfile, isPending: isCreating } = useCreateStudentMutation();
  const { mutate: updateStudentProfile, isPending: isUpdating } = useUpdateStudentMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: StudentFormValues) => {
    if (isEditMode && student) {
      updateStudentProfile(
        {
          id: student._id,
          data: {
            user: values.user,
            studentId: values.studentId,
            registrationNumber: values.registrationNumber,
            rollNumber: values.rollNumber,
            department: values.department,
            course: values.course,
            currentSemester: values.currentSemester,
            admissionYear: values.admissionYear,
            admissionType: values.admissionType as AdmissionType,
            dateOfBirth: values.dateOfBirth,
            gender: values.gender as Gender,
            bloodGroup: values.bloodGroup as BloodGroup,
            guardianName: values.guardianName,
            guardianPhone: values.guardianPhone,
            address: values.address,
            status: values.status as StudentStatus,
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createStudentProfile(
        {
          user: values.user,
          studentId: values.studentId,
          registrationNumber: values.registrationNumber,
          rollNumber: values.rollNumber,
          department: values.department,
          course: values.course,
          currentSemester: values.currentSemester,
          admissionYear: values.admissionYear,
          admissionType: values.admissionType as AdmissionType,
          dateOfBirth: values.dateOfBirth,
          gender: values.gender as Gender,
          bloodGroup: values.bloodGroup as BloodGroup,
          guardianName: values.guardianName,
          guardianPhone: values.guardianPhone,
          address: values.address,
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
      <Card className="relative w-full max-w-lg border-slate-800 bg-slate-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-5">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Edit className="h-5 w-5 text-indigo-400" />
            ) : (
              <PlusCircle className="h-5 w-5 text-indigo-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit Student Profile" : "Register Student Profile"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User Account */}
            <div className="space-y-1.5">
              <Label htmlFor="user" className="text-slate-400 text-[10px]">
                Select User Account
              </Label>
              {isEditMode ? (
                <div className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/30 px-3 py-1.5 text-slate-500 flex items-center">
                  {student?.user?.firstName} {student?.user?.lastName} ({student?.user?.email})
                </div>
              ) : (
                <select
                  id="user"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={isPending}
                  {...register("user")}
                >
                  {unassignedStudents.length ? (
                    unassignedStudents.map((s) => (
                      <option key={s._id} value={s._id} className="bg-slate-950 text-slate-300">
                        {s.firstName} {s.lastName} ({s.email})
                      </option>
                    ))
                  ) : (
                    <option value="" className="bg-slate-950 text-slate-500">No unassigned students</option>
                  )}
                </select>
              )}
              {errors.user && (
                <p className="text-[10px] text-red-400">{errors.user.message}</p>
              )}
            </div>

            {/* Student ID */}
            <div className="space-y-1.5">
              <Label htmlFor="studentId" className="text-slate-400 text-[10px]">
                Student ID
              </Label>
              <Input
                id="studentId"
                placeholder="e.g. STU-2026-001"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("studentId")}
              />
              {errors.studentId && (
                <p className="text-[10px] text-red-400">{errors.studentId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Registration Number */}
            <div className="space-y-1.5">
              <Label htmlFor="registrationNumber" className="text-slate-400 text-[10px]">
                Registration Number
              </Label>
              <Input
                id="registrationNumber"
                placeholder="e.g. REG-2026-987"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("registrationNumber")}
              />
              {errors.registrationNumber && (
                <p className="text-[10px] text-red-400">{errors.registrationNumber.message}</p>
              )}
            </div>

            {/* Roll Number */}
            <div className="space-y-1.5">
              <Label htmlFor="rollNumber" className="text-slate-400 text-[10px]">
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                placeholder="e.g. 26CSE-45"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("rollNumber")}
              />
              {errors.rollNumber && (
                <p className="text-[10px] text-red-400">{errors.rollNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-slate-400 text-[10px]">
                Department
              </Label>
              <select
                id="department"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

            {/* Course select */}
            <div className="space-y-1.5">
              <Label htmlFor="course" className="text-slate-400 text-[10px]">
                Course
              </Label>
              <select
                id="course"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Semester dropdown (Constrained by watched Course) */}
            <div className="space-y-1.5">
              <Label htmlFor="currentSemester" className="text-slate-400 text-[10px]">
                Semester
              </Label>
              <select
                id="currentSemester"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("currentSemester", { valueAsNumber: true })}
              >
                {Array.from({ length: maxSemesters }, (_, i) => i + 1).map((sem) => (
                  <option key={sem} value={sem} className="bg-slate-950 text-slate-300">
                    Semester {sem}
                  </option>
                ))}
              </select>
              {errors.currentSemester && (
                <p className="text-[10px] text-red-400">{errors.currentSemester.message}</p>
              )}
            </div>

            {/* Admission Year */}
            <div className="space-y-1.5">
              <Label htmlFor="admissionYear" className="text-slate-400 text-[10px]">
                Admission Year
              </Label>
              <Input
                id="admissionYear"
                type="number"
                placeholder="2026"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("admissionYear", { valueAsNumber: true })}
              />
              {errors.admissionYear && (
                <p className="text-[10px] text-red-400">{errors.admissionYear.message}</p>
              )}
            </div>

            {/* Admission Type */}
            <div className="space-y-1.5">
              <Label htmlFor="admissionType" className="text-slate-400 text-[10px]">
                Entry Type
              </Label>
              <select
                id="admissionType"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("admissionType")}
              >
                <option value="REGULAR" className="bg-slate-950 text-slate-300">Regular</option>
                <option value="LATERAL_ENTRY" className="bg-slate-950 text-slate-300">Lateral Entry</option>
                <option value="TRANSFER" className="bg-slate-950 text-slate-300">Transfer</option>
              </select>
              {errors.admissionType && (
                <p className="text-[10px] text-red-400">{errors.admissionType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Gender */}
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-slate-400 text-[10px]">
                Gender
              </Label>
              <select
                id="gender"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("gender")}
              >
                <option value="MALE" className="bg-slate-950 text-slate-300">Male</option>
                <option value="FEMALE" className="bg-slate-950 text-slate-300">Female</option>
                <option value="OTHER" className="bg-slate-950 text-slate-300">Other</option>
              </select>
              {errors.gender && (
                <p className="text-[10px] text-red-400">{errors.gender.message}</p>
              )}
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <Label htmlFor="bloodGroup" className="text-slate-400 text-[10px]">
                Blood Group
              </Label>
              <select
                id="bloodGroup"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("bloodGroup")}
              >
                <option value="A_POSITIVE" className="bg-slate-950 text-slate-300">A+</option>
                <option value="A_NEGATIVE" className="bg-slate-950 text-slate-300">A-</option>
                <option value="B_POSITIVE" className="bg-slate-950 text-slate-300">B+</option>
                <option value="B_NEGATIVE" className="bg-slate-950 text-slate-300">B-</option>
                <option value="AB_POSITIVE" className="bg-slate-950 text-slate-300">AB+</option>
                <option value="AB_NEGATIVE" className="bg-slate-950 text-slate-300">AB-</option>
                <option value="O_POSITIVE" className="bg-slate-950 text-slate-300">O+</option>
                <option value="O_NEGATIVE" className="bg-slate-950 text-slate-300">O-</option>
              </select>
              {errors.bloodGroup && (
                <p className="text-[10px] text-red-400">{errors.bloodGroup.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth" className="text-slate-400 text-[10px]">
                Date of Birth
              </Label>
              <input
                id="dateOfBirth"
                type="date"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-[10px] text-red-400">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guardian Name */}
            <div className="space-y-1.5">
              <Label htmlFor="guardianName" className="text-slate-400 text-[10px]">
                Guardian Name
              </Label>
              <Input
                id="guardianName"
                placeholder="Parent/Guardian Full Name"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("guardianName")}
              />
              {errors.guardianName && (
                <p className="text-[10px] text-red-400">{errors.guardianName.message}</p>
              )}
            </div>

            {/* Guardian Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="guardianPhone" className="text-slate-400 text-[10px]">
                Guardian Phone
              </Label>
              <Input
                id="guardianPhone"
                placeholder="e.g. 9876543210"
                className="border-slate-800 bg-slate-900/60 text-white"
                disabled={isPending}
                {...register("guardianPhone")}
              />
              {errors.guardianPhone && (
                <p className="text-[10px] text-red-400">{errors.guardianPhone.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-slate-400 text-[10px]">
              Residential Address
            </Label>
            <textarea
              id="address"
              placeholder="Enter current residential address..."
              className="w-full h-16 rounded-md border border-slate-800 bg-slate-900/60 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
              disabled={isPending}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-[10px] text-red-400">{errors.address.message}</p>
            )}
          </div>

          {/* Status (Only in Edit mode) */}
          {isEditMode ? (
            <div className="space-y-1.5 col-span-2 animate-in">
              <Label htmlFor="status" className="text-slate-400 text-[10px]">
                Profile Status
              </Label>
              <select
                id="status"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("status")}
              >
                <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
                <option value="GRADUATED" className="bg-slate-950 text-slate-300">Graduated</option>
                <option value="DROPPED" className="bg-slate-950 text-slate-300">Dropped</option>
                <option value="SUSPENDED" className="bg-slate-950 text-slate-300">Suspended</option>
                <option value="ALUMNI" className="bg-slate-950 text-slate-300">Alumni</option>
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
              disabled={isPending || (!isEditMode && unassignedStudents.length === 0)}
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Profile"
              ) : (
                "Register Student"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
