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

import { useCreateExaminationMutation, useUpdateExaminationMutation } from "../hooks/examination.hooks";
import { useSubjectsQuery } from "@/features/subjects";
import { useSectionsQuery } from "@/features/sections";
import { useSemestersQuery } from "@/features/semesters";
import { useFacultiesQuery } from "@/features/faculty";
import type { Examination } from "../types/examination.types";

interface ExaminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  examination: Examination | null;
}

export default function ExaminationDialog({
  isOpen,
  onClose,
  examination,
}: ExaminationDialogProps) {
  const isEditMode = !!examination;
  const { user } = useSelector((state: RootState) => state.auth);
  const isTeacher = user?.role?.name === "TEACHER";
  const isAdmin = user?.role?.name === "ADMIN";

  // Fetch dependency datasets
  const { data: subjectData } = useSubjectsQuery({ limit: 100, status: "ACTIVE" });
  const activeSubjects = useMemo(() => subjectData?.subjects || [], [subjectData?.subjects]);

  const { data: sectionData } = useSectionsQuery({ limit: 100, status: "ACTIVE" });
  const activeSections = useMemo(() => sectionData?.sections || [], [sectionData?.sections]);

  const { data: semesterData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = useMemo(() => semesterData?.semesters || [], [semesterData?.semesters]);

  const { data: facultyData } = useFacultiesQuery({ limit: 100 });
  const allFaculties = useMemo(() => facultyData?.faculties || [], [facultyData?.faculties]);

  // Resolve current teacher profile
  const currentTeacherProfile = useMemo(() => {
    if (!isTeacher || !user) return null;
    return allFaculties.find((f) => f.user?._id === user._id || f.user?.email === user.email);
  }, [allFaculties, isTeacher, user]);

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  // Validation Schema
  const examSchema = z
    .object({
      title: z.string().min(3, "Title must be at least 3 characters").max(200),
      subject: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a subject"),
      section: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a section"),
      semester: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a term"),
      faculty: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a faculty member"),
      examType: z.enum(["MIDTERM", "FINAL", "PRACTICAL", "VIVA", "QUIZ", "ASSIGNMENT"]),
      date: z.string().min(1, "Please choose a date"),
      startTime: z.string().regex(timeRegex, "Start time must be in HH:mm format"),
      endTime: z.string().regex(timeRegex, "End time must be in HH:mm format"),
      hall: z.string().min(2, "Hall allocation must be at least 2 characters").max(100),
      maximumMarks: z.number().int().min(1, "Marks must be at least 1").max(1000),
      passingMarks: z.number().int().min(0, "Marks cannot be negative").max(1000),
      status: z.enum(["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
    })
    .refine((data) => data.endTime > data.startTime, {
      message: "End time must be after start time",
      path: ["endTime"],
    })
    .refine((data) => data.passingMarks <= data.maximumMarks, {
      message: "Passing marks cannot exceed maximum marks",
      path: ["passingMarks"],
    });

  type ExamFormValues = z.infer<typeof examSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (examination) {
        const rawDate = examination.date ? new Date(examination.date) : new Date();
        const formattedDate = rawDate.toISOString().split("T")[0];

        reset({
          title: examination.title,
          subject: examination.subject?._id || "",
          section: examination.section?._id || "",
          semester: examination.semester?._id || "",
          faculty: examination.faculty?._id || "",
          examType: examination.examType,
          date: formattedDate,
          startTime: examination.startTime,
          endTime: examination.endTime,
          hall: examination.hall,
          maximumMarks: examination.maximumMarks,
          passingMarks: examination.passingMarks,
          status: examination.status,
        });
      } else {
        reset({
          title: "",
          subject: activeSubjects[0]?._id || "",
          section: activeSections[0]?._id || "",
          semester: activeSemesters[0]?._id || "",
          faculty: currentTeacherProfile?._id || allFaculties[0]?._id || "",
          examType: "MIDTERM",
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default 14 days from now
          startTime: "09:00",
          endTime: "12:00",
          hall: "Examination Hall A",
          maximumMarks: 100,
          passingMarks: 40,
          status: "SCHEDULED",
        });
      }
    }
  }, [
    isOpen,
    examination,
    reset,
    activeSubjects,
    activeSections,
    activeSemesters,
    currentTeacherProfile,
    allFaculties,
  ]);

  const { mutate: createExam, isPending: isCreating } = useCreateExaminationMutation();
  const { mutate: updateExam, isPending: isUpdating } = useUpdateExaminationMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: ExamFormValues) => {
    const formattedValues = {
      ...values,
      date: new Date(values.date).toISOString(),
    };

    if (isEditMode && examination) {
      updateExam(
        {
          id: examination._id,
          data: formattedValues,
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createExam(formattedValues, {
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

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            {isEditMode ? <Edit className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Modify Exam Schedule" : "Schedule New Examination"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set schedules, locations, and passing criteria
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Examination Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Midterm Written Examination: Linear Algebra"
              className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
              {...register("title")}
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title.message}</p>
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

            {/* Exam Type Select */}
            <div className="space-y-1.5">
              <Label htmlFor="examType" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Exam Format Type
              </Label>
              <select
                id="examType"
                className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                {...register("examType")}
                disabled={isPending}
              >
                <option value="MIDTERM" className="bg-slate-950">Midterm Exam</option>
                <option value="FINAL" className="bg-slate-950">Final Exam</option>
                <option value="PRACTICAL" className="bg-slate-950">Practical Lab</option>
                <option value="VIVA" className="bg-slate-950">Viva-Voce</option>
                <option value="QUIZ" className="bg-slate-950">Classroom Quiz</option>
                <option value="ASSIGNMENT" className="bg-slate-950">Assignment</option>
              </select>
              {errors.examType && (
                <p className="text-[11px] text-destructive">{errors.examType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Exam Date */}
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Exam Date
              </Label>
              <Input
                id="date"
                type="date"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("date")}
                disabled={isPending}
              />
              {errors.date && (
                <p className="text-[11px] text-destructive">{errors.date.message}</p>
              )}
            </div>

            {/* Hall allocation */}
            <div className="space-y-1.5">
              <Label htmlFor="hall" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Hall Room Location
              </Label>
              <Input
                id="hall"
                placeholder="e.g. Block B, Hall 302"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("hall")}
                disabled={isPending}
              />
              {errors.hall && (
                <p className="text-[11px] text-destructive">{errors.hall.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Start Time
              </Label>
              <Input
                id="startTime"
                placeholder="e.g. 09:00"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("startTime")}
                disabled={isPending}
              />
              {errors.startTime && (
                <p className="text-[11px] text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                End Time
              </Label>
              <Input
                id="endTime"
                placeholder="e.g. 12:00"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("endTime")}
                disabled={isPending}
              />
              {errors.endTime && (
                <p className="text-[11px] text-destructive">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Maximum Marks */}
            <div className="space-y-1.5">
              <Label htmlFor="maximumMarks" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Maximum Score (Marks)
              </Label>
              <Input
                id="maximumMarks"
                type="number"
                placeholder="100"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("maximumMarks", { valueAsNumber: true })}
                disabled={isPending}
              />
              {errors.maximumMarks && (
                <p className="text-[11px] text-destructive">{errors.maximumMarks.message}</p>
              )}
            </div>

            {/* Passing Marks */}
            <div className="space-y-1.5">
              <Label htmlFor="passingMarks" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Passing Cutoff Score
              </Label>
              <Input
                id="passingMarks"
                type="number"
                placeholder="40"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("passingMarks", { valueAsNumber: true })}
                disabled={isPending}
              />
              {errors.passingMarks && (
                <p className="text-[11px] text-destructive">{errors.passingMarks.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status Select */}
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Execution State
              </Label>
              <select
                id="status"
                className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                {...register("status")}
                disabled={isPending}
              >
                <option value="SCHEDULED" className="bg-slate-950">Scheduled</option>
                <option value="ONGOING" className="bg-slate-950">Ongoing</option>
                <option value="COMPLETED" className="bg-slate-950">Completed</option>
                <option value="CANCELLED" className="bg-slate-950">Cancelled</option>
              </select>
              {errors.status && (
                <p className="text-[11px] text-destructive">{errors.status.message}</p>
              )}
            </div>

            {/* Faculty Advisor select (visible to Admin only, hidden for Teacher) */}
            {isAdmin ? (
              <div className="space-y-1.5">
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
          </div>

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
                "Schedule Exam"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
