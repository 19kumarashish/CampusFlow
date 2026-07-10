"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useEnrollmentsQuery } from "@/features/enrollments";
import { useSubjectsQuery } from "@/features/subjects";
import { useSemestersQuery } from "@/features/semesters";
import { useCreateResultMutation, useGenerateSemesterResultMutation } from "../hooks/result.hooks";

interface CompileResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompileResultDialog({
  isOpen,
  onClose,
}: CompileResultDialogProps) {
  const [compilationType, setCompilationType] = useState<"SUBJECT" | "SEMESTER">("SUBJECT");

  // Fetch lists
  const { data: enrollmentsData } = useEnrollmentsQuery({ limit: 100 });
  const activeEnrollments = useMemo(() => enrollmentsData?.enrollments || [], [enrollmentsData?.enrollments]);

  const { data: subjectsData } = useSubjectsQuery({ limit: 100, status: "ACTIVE" });
  const activeSubjects = useMemo(() => subjectsData?.subjects || [], [subjectsData?.subjects]);

  const { data: semestersData } = useSemestersQuery({ limit: 100, status: "ACTIVE" });
  const activeSemesters = useMemo(() => semestersData?.semesters || [], [semestersData?.semesters]);

  const { mutate: compileSubject, isPending: isCompilingSubject } = useCreateResultMutation();
  const { mutate: compileSemester, isPending: isCompilingSemester } = useGenerateSemesterResultMutation();

  const isPending = isCompilingSubject || isCompilingSemester;

  // Validation Schema
  const schema = z.object({
    enrollment: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a student enrollment profile"),
    subject: z.string().optional(),
    semester: z.string().optional(),
  }).refine((data) => {
    if (compilationType === "SUBJECT" && !data.subject) return false;
    if (compilationType === "SEMESTER" && !data.semester) return false;
    return true;
  }, {
    message: "Required selection is missing",
    path: [compilationType === "SUBJECT" ? "subject" : "semester"],
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        enrollment: activeEnrollments[0]?._id || "",
        subject: activeSubjects[0]?._id || "",
        semester: activeSemesters[0]?._id || "",
      });
    }
  }, [isOpen, reset, activeEnrollments, activeSubjects, activeSemesters]);

  const onSubmit = (values: FormValues) => {
    if (compilationType === "SUBJECT" && values.subject) {
      compileSubject(
        {
          enrollment: values.enrollment,
          subject: values.subject,
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else if (compilationType === "SEMESTER" && values.semester) {
      compileSemester(
        {
          enrollment: values.enrollment,
          semester: values.semester,
        },
        {
          onSuccess: () => onClose(),
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="relative w-full max-w-md border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-200">
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
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Grade Compiler Engine</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aggregate coursework and compute final score reports
            </p>
          </div>
        </div>

        {/* Type Toggle Tabs */}
        <div className="flex gap-2 p-1 bg-muted/40 border border-border/60 rounded-xl mb-5">
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
              ${compilationType === "SUBJECT" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"}
            `}
            onClick={() => setCompilationType("SUBJECT")}
          >
            Subject Grade Sheet
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
              ${compilationType === "SEMESTER" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-white"}
            `}
            onClick={() => setCompilationType("SEMESTER")}
          >
            Semester GPA (SGPA/CGPA)
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Enrollment Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="enrollment" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Student enrollment profile
            </Label>
            <select
              id="enrollment"
              className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              {...register("enrollment")}
              disabled={isPending}
            >
              <option value="">Select Student Profile</option>
              {activeEnrollments.map((e) => (
                <option key={e._id} value={e._id} className="bg-slate-950">
                  {e.student?.user?.firstName} {e.student?.user?.lastName} (Roll: {e.student?.rollNumber})
                </option>
              ))}
            </select>
            {errors.enrollment && (
              <p className="text-[11px] text-destructive">{errors.enrollment.message}</p>
            )}
          </div>

          {/* Conditional Subject Select */}
          {compilationType === "SUBJECT" && (
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
                <option value="">Select Subject</option>
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
          )}

          {/* Conditional Semester Select */}
          {compilationType === "SEMESTER" && (
            <div className="space-y-1.5">
              <Label htmlFor="semester" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Semester Term
              </Label>
              <select
                id="semester"
                className="h-10 w-full rounded-md border border-border bg-background/50 text-xs text-foreground px-3 py-1.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                {...register("semester")}
                disabled={isPending}
              >
                <option value="">Select Semester Term</option>
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Compiling...
                </span>
              ) : (
                "Compile Report"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
