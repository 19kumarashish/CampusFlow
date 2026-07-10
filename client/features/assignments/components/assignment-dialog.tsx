"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, PlusCircle, Edit } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RootState } from "@/store";

import { useCreateAssignmentMutation, useUpdateAssignmentMutation } from "../hooks/assignment.hooks";
import { useSubjectsQuery } from "@/features/subjects";
import { useSectionsQuery } from "@/features/sections";
import { useSemestersQuery } from "@/features/semesters";
import { useFacultiesQuery } from "@/features/faculty";
import type { Assignment, AssignmentStatus } from "../types/assignment.types";

interface AssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null; // Null means CREATE mode
}

export default function AssignmentDialog({
  isOpen,
  onClose,
  assignment,
}: AssignmentDialogProps) {
  const isEditMode = !!assignment;
  const { user } = useSelector((state: RootState) => state.auth);
  const isTeacher = user?.role?.name === "TEACHER";
  const isAdmin = user?.role?.name === "ADMIN";

  // Fetch subjects, sections, semesters, and faculties lists
  const { data: subjectData } = useSubjectsQuery({ limit: 100, status: "ACTIVE" });
  const activeSubjects = useMemo(() => subjectData?.subjects || [], [subjectData?.subjects]);

  const { data: sectionData } = useSectionsQuery({ limit: 100, status: "ACTIVE" });
  const activeSections = useMemo(() => sectionData?.sections || [], [sectionData?.sections]);

  const { data: semesterData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = useMemo(() => semesterData?.semesters || [], [semesterData?.semesters]);

  const { data: facultyData } = useFacultiesQuery({ limit: 100 });
  const allFaculties = useMemo(() => facultyData?.faculties || [], [facultyData?.faculties]);

  // Find current teacher profile if applicable
  const currentTeacherProfile = useMemo(() => {
    if (!isTeacher || !user) return null;
    return allFaculties.find((f) => f.user?._id === user._id || f.user?.email === user.email);
  }, [allFaculties, isTeacher, user]);

  const currentYear = new Date().getFullYear();

  // Validation Schema
  const assignmentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().min(10, "Description must be at least 10 characters"),
    subject: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a subject"),
    section: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a section"),
    semester: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a term"),
    faculty: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a faculty member"),
    dueDate: z.string().min(1, "Please choose a due date"),
    maxMarks: z.number().int().min(1, "Marks must be at least 1").max(1000),
    status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional(),
  });

  type AssignmentFormValues = z.infer<typeof assignmentSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
  });

  // Populate data when opening/editing
  useEffect(() => {
    if (isOpen) {
      if (assignment) {
        const rawDate = assignment.dueDate ? new Date(assignment.dueDate) : new Date();
        const formattedDate = rawDate.toISOString().split("T")[0];

        reset({
          title: assignment.title,
          description: assignment.description,
          subject: assignment.subject?._id || "",
          section: assignment.section?._id || "",
          semester: assignment.semester?._id || "",
          faculty: assignment.faculty?._id || "",
          dueDate: formattedDate,
          maxMarks: assignment.maxMarks,
          status: assignment.status,
        });
      } else {
        reset({
          title: "",
          description: "",
          subject: activeSubjects[0]?._id || "",
          section: activeSections[0]?._id || "",
          semester: activeSemesters[0]?._id || "",
          faculty: currentTeacherProfile?._id || allFaculties[0]?._id || "",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default 7 days from now
          maxMarks: 100,
          status: "DRAFT",
        });
      }
    }
  }, [
    isOpen,
    assignment,
    reset,
    activeSubjects,
    activeSections,
    activeSemesters,
    currentTeacherProfile,
    allFaculties,
  ]);

  const { mutate: createAssignment, isPending: isCreating } = useCreateAssignmentMutation();
  const { mutate: updateAssignment, isPending: isUpdating } = useUpdateAssignmentMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: AssignmentFormValues) => {
    const formattedValues = {
      ...values,
      dueDate: new Date(values.dueDate).toISOString(),
    };

    if (isEditMode && assignment) {
      updateAssignment(
        {
          id: assignment._id,
          data: formattedValues,
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createAssignment(formattedValues, {
        onSuccess: () => onClose(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="relative w-full max-w-lg border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-md max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            {isEditMode ? <Edit className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Modify Assignment" : "Publish New Assignment"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in syllabus parameters and submission thresholds
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Assignment Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Midterm Lab Report: OS Kernel Compiling"
              className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
              {...register("title")}
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Detailed Instructions
            </Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Explain problem statements, file criteria, code submission steps, or required formats..."
              className="w-full rounded-md border border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs p-3 focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              {...register("description")}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-[11px] text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Subject Select */}
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Subject
              </Label>
              <select
                id="subject"
                className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                {...register("subject")}
                disabled={isPending}
              >
                <option value="" className="bg-slate-950">Select Subject</option>
                {activeSubjects.map((s) => (
                  <option key={s._id} value={s._id} className="bg-slate-950">
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-[11px] text-destructive">{errors.subject.message}</p>
              )}
            </div>

            {/* Section Select */}
            <div className="space-y-1.5">
              <Label htmlFor="section" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Target Section
              </Label>
              <select
                id="section"
                className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                {...register("section")}
                disabled={isPending}
              >
                <option value="" className="bg-slate-950">Select Section</option>
                {activeSections.map((sec) => (
                  <option key={sec._id} value={sec._id} className="bg-slate-950">
                    Section {sec.name}
                  </option>
                ))}
              </select>
              {errors.section && (
                <p className="text-[11px] text-destructive">{errors.section.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Term Select */}
            <div className="space-y-1.5">
              <Label htmlFor="semester" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Academic Term
              </Label>
              <select
                id="semester"
                className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                {...register("semester")}
                disabled={isPending}
              >
                <option value="" className="bg-slate-950">Select Term</option>
                {activeSemesters.map((sem) => (
                  <option key={sem._id} value={sem._id} className="bg-slate-950">
                    {sem.name}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <p className="text-[11px] text-destructive">{errors.semester.message}</p>
              )}
            </div>

            {/* Max Marks */}
            <div className="space-y-1.5">
              <Label htmlFor="maxMarks" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Max Score (Marks)
              </Label>
              <Input
                id="maxMarks"
                type="number"
                placeholder="100"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("maxMarks", { valueAsNumber: true })}
                disabled={isPending}
              />
              {errors.maxMarks && (
                <p className="text-[11px] text-destructive">{errors.maxMarks.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("dueDate")}
                disabled={isPending}
              />
              {errors.dueDate && (
                <p className="text-[11px] text-destructive">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Publish State
              </Label>
              <select
                id="status"
                className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                {...register("status")}
                disabled={isPending}
              >
                <option value="DRAFT" className="bg-slate-950">Draft (Saves offline)</option>
                <option value="PUBLISHED" className="bg-slate-950">Published (Visible to students)</option>
                <option value="CLOSED" className="bg-slate-950">Closed (Submissions closed)</option>
              </select>
              {errors.status && (
                <p className="text-[11px] text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Faculty select - only visible to Admins. Auto-filled & hidden for Teachers. */}
          {isAdmin ? (
            <div className="space-y-1.5 pt-2">
              <Label htmlFor="faculty" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Assigning Faculty Advisor
              </Label>
              <select
                id="faculty"
                className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                {...register("faculty")}
                disabled={isPending}
              >
                <option value="" className="bg-slate-950">Select Faculty</option>
                {allFaculties.map((f) => (
                  <option key={f._id} value={f._id} className="bg-slate-950">
                    {f.user?.firstName} {f.user?.lastName} ({f.employeeId})
                  </option>
                ))}
              </select>
              {errors.faculty && (
                <p className="text-[11px] text-destructive">{errors.faculty.message}</p>
              )}
            </div>
          ) : (
            /* Hidden input to pass teacher profile */
            <input type="hidden" {...register("faculty")} />
          )}

          {/* Action Row */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-900/60 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-10 border-slate-850 bg-slate-950 text-slate-300 text-xs hover:bg-slate-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-5"
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                </span>
              ) : isEditMode ? (
                "Apply Updates"
              ) : (
                "Publish Assignment"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
