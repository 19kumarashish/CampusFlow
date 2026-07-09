"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, PlusCircle, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCreateEnrollmentMutation, useUpdateEnrollmentMutation } from "../hooks/enrollment.hooks";
import { useStudentsQuery } from "@/features/students";
import { useCoursesQuery } from "@/features/courses";
import { useSemestersQuery } from "@/features/semesters";
import { useSectionsQuery } from "@/features/sections";
import type { Enrollment } from "../types/enrollment.types";

interface EnrollmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null; // Null means CREATE mode
}

export default function EnrollmentDialog({
  isOpen,
  onClose,
  enrollment,
}: EnrollmentDialogProps) {
  const isEditMode = !!enrollment;

  // Fetch active students
  const { data: studentsData } = useStudentsQuery({ limit: 100, status: "ACTIVE" });
  const activeStudents = studentsData?.students || [];

  // Fetch active courses
  const { data: coursesData } = useCoursesQuery({ limit: 100, status: "ACTIVE" });
  const activeCourses = coursesData?.courses || [];

  // Fetch active semesters
  const { data: semestersData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = semestersData?.semesters || [];

  // Fetch active sections
  const { data: sectionsData } = useSectionsQuery({ limit: 100, status: "ACTIVE" });
  const activeSections = sectionsData?.sections || [];

  // Validation Schema
  const enrollmentSchema = z.object({
    student: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a student"),
    course: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a course"),
    semester: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a semester"),
    section: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a section"),
    enrollmentDate: z.string().optional(),
    status: z.string().optional(),
  });

  type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
  });

  // Cascading logic selectors
  const watchedStudentId = watch("student");
  const selectedStudent = activeStudents.find((s) => s._id === watchedStudentId);
  const studentCourseId = selectedStudent
    ? typeof selectedStudent.course === "string"
      ? selectedStudent.course
      : selectedStudent.course?._id
    : "";

  // Auto-populate course matching the student
  useEffect(() => {
    if (studentCourseId) {
      setValue("course", studentCourseId);
    }
  }, [studentCourseId, setValue]);

  const watchedCourseId = watch("course");

  // Filter semesters by Course ID
  const filteredSemesters = activeSemesters.filter((s) => {
    const courseId = typeof s.course === "string" ? s.course : (s.course as any)?._id;
    return courseId === watchedCourseId;
  });

  // Auto-populate semester if semesters list updates
  useEffect(() => {
    if (filteredSemesters.length && !isEditMode) {
      setValue("semester", filteredSemesters[0]._id);
    }
  }, [watchedCourseId, filteredSemesters, setValue, isEditMode]);

  const watchedSemesterId = watch("semester");

  // Filter sections by Semester ID
  const filteredSections = activeSections.filter((sec) => {
    const semId = typeof sec.semester === "string" ? sec.semester : sec.semester?._id;
    return semId === watchedSemesterId;
  });

  // Auto-populate section if sections list updates
  useEffect(() => {
    if (filteredSections.length && !isEditMode) {
      setValue("section", filteredSections[0]._id);
    }
  }, [watchedSemesterId, filteredSections, setValue, isEditMode]);

  // Populate data when opening
  useEffect(() => {
    if (isOpen) {
      if (enrollment) {
        const rawDate = enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate) : new Date();
        const formattedDate = rawDate.toISOString().split("T")[0];

        reset({
          student: enrollment.student?._id || "",
          course: enrollment.course?._id || "",
          semester: enrollment.semester?._id || "",
          section: enrollment.section?._id || "",
          enrollmentDate: formattedDate,
          status: enrollment.status,
        });
      } else {
        reset({
          student: activeStudents[0]?._id || "",
          course: "",
          semester: "",
          section: "",
          enrollmentDate: new Date().toISOString().split("T")[0],
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, enrollment, reset, activeStudents]);

  const { mutate: createEnrollment, isPending: isCreating } = useCreateEnrollmentMutation();
  const { mutate: updateEnrollmentMutation, isPending: isUpdating } = useUpdateEnrollmentMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: EnrollmentFormValues) => {
    if (isEditMode && enrollment) {
      updateEnrollmentMutation(
        {
          id: enrollment._id,
          data: {
            student: values.student,
            course: values.course,
            semester: values.semester,
            section: values.section,
            enrollmentDate: values.enrollmentDate,
            status: values.status as "ACTIVE" | "INACTIVE",
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createEnrollment(
        {
          student: values.student,
          course: values.course,
          semester: values.semester,
          section: values.section,
          enrollmentDate: values.enrollmentDate,
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
              {isEditMode ? "Edit Enrollment Details" : "Enroll Student"}
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
          {/* Student selection */}
          <div className="space-y-1.5">
            <Label htmlFor="student" className="text-slate-400 text-[10px]">
              Select Enrolling Student
            </Label>
            {isEditMode ? (
              <div className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/30 px-3 py-1.5 text-slate-500 flex items-center">
                {enrollment?.student?.studentId || "Student"} - {enrollment?.student?.rollNumber}
              </div>
            ) : (
              <select
                id="student"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("student")}
              >
                {activeStudents.length ? (
                  activeStudents.map((s) => {
                    const fullName = s.user ? `${s.user.firstName} ${s.user.lastName}` : `Student ID: ${s.studentId}`;
                    return (
                      <option key={s._id} value={s._id} className="bg-slate-950 text-slate-300">
                        {fullName} ({s.studentId} - Roll: {s.rollNumber})
                      </option>
                    );
                  })
                ) : (
                  <option value="" className="bg-slate-950 text-slate-500">No active students found</option>
                )}
              </select>
            )}
            {errors.student && (
              <p className="text-[10px] text-red-400">{errors.student.message}</p>
            )}
          </div>

          {/* Locked Course */}
          <div className="space-y-1.5">
            <Label htmlFor="course" className="text-slate-400 text-[10px]">
              Associated Course (locked to student program)
            </Label>
            <select
              id="course"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/30 px-3 py-1.5 text-slate-500 focus:outline-none cursor-not-allowed"
              disabled={true}
              value={watchedCourseId}
              onChange={() => {}}
            >
              <option value="">No Course Associated</option>
              {activeCourses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input type="hidden" {...register("course")} value={studentCourseId} />
            {errors.course && (
              <p className="text-[10px] text-red-400">{errors.course.message}</p>
            )}
          </div>

          {/* Semester select */}
          <div className="space-y-1.5">
            <Label htmlFor="semester" className="text-slate-400 text-[10px]">
              Enrollment Semester
            </Label>
            <select
              id="semester"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending || !watchedCourseId}
              {...register("semester")}
            >
              {filteredSemesters.length ? (
                filteredSemesters.map((s) => (
                  <option key={s._id} value={s._id} className="bg-slate-950 text-slate-300">
                    {s.name} ({s.academicYear} - {s.type} Semester)
                  </option>
                ))
              ) : (
                <option value="" className="bg-slate-950 text-slate-500">No semesters found for this course</option>
              )}
            </select>
            {errors.semester && (
              <p className="text-[10px] text-red-400">{errors.semester.message}</p>
            )}
          </div>

          {/* Section select */}
          <div className="space-y-1.5">
            <Label htmlFor="section" className="text-slate-400 text-[10px]">
              Assigned Section
            </Label>
            <select
              id="section"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending || !watchedSemesterId}
              {...register("section")}
            >
              {filteredSections.length ? (
                filteredSections.map((sec) => (
                  <option key={sec._id} value={sec._id} className="bg-slate-950 text-slate-300">
                    {sec.name} (Classroom: {sec.classroom})
                  </option>
                ))
              ) : (
                <option value="" className="bg-slate-950 text-slate-500">No sections found for this semester</option>
              )}
            </select>
            {errors.section && (
              <p className="text-[10px] text-red-400">{errors.section.message}</p>
            )}
          </div>

          {/* Enrollment Date */}
          <div className="space-y-1.5">
            <Label htmlFor="enrollmentDate" className="text-slate-400 text-[10px]">
              Enrollment Date
            </Label>
            <input
              id="enrollmentDate"
              type="date"
              className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-slate-350 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending}
              {...register("enrollmentDate")}
            />
            {errors.enrollmentDate && (
              <p className="text-[10px] text-red-400">{errors.enrollmentDate.message}</p>
            )}
          </div>

          {/* Status (Only in Edit mode) */}
          {isEditMode ? (
            <div className="space-y-1.5 animate-in">
              <Label htmlFor="status" className="text-slate-400 text-[10px]">
                Enrollment Status
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
                activeStudents.length === 0 ||
                filteredSemesters.length === 0 ||
                filteredSections.length === 0
              }
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Enrollment"
              ) : (
                "Enroll Student"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
