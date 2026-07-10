"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useGradeSubmissionMutation } from "../hooks/assignment.hooks";
import type { Assignment, Submission } from "../types/assignment.types";

interface GradingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  submission: Submission | null;
}

export default function GradingDialog({
  isOpen,
  onClose,
  assignment,
  submission,
}: GradingDialogProps) {
  const { mutate: gradeWork, isPending } = useGradeSubmissionMutation();

  const maxMarksVal = assignment?.maxMarks || 100;

  const gradingSchema = z.object({
    marks: z
      .number()
      .min(0, "Marks cannot be negative")
      .max(maxMarksVal, `Marks cannot exceed maximum score of ${maxMarksVal}`),
    feedback: z.string().max(1000, "Feedback cannot exceed 1000 characters").optional().or(z.literal("")),
  });

  type GradingFormValues = z.infer<typeof gradingSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradingFormValues>({
    resolver: zodResolver(gradingSchema),
  });

  useEffect(() => {
    if (isOpen && submission) {
      reset({
        marks: submission.marks || 0,
        feedback: submission.feedback || "",
      });
    }
  }, [isOpen, submission, reset]);

  const onSubmit = (values: GradingFormValues) => {
    if (!submission) return;

    gradeWork(
      {
        id: submission._id,
        data: {
          marks: values.marks,
          feedback: values.feedback || undefined,
          status: "GRADED",
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  if (!isOpen || !submission || !assignment) return null;

  const student = submission.enrollment?.student;
  const userDetails = student?.user;

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
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Grade Submission</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter score and performance feedback
            </p>
          </div>
        </div>

        {/* Student Detail card */}
        <div className="mb-4 p-3 bg-muted/40 border border-border/60 rounded-xl text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Student:</span>
            <span className="font-bold text-white">
              {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : "Unknown"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Student ID:</span>
            <span className="font-mono text-slate-300">{student?.studentId}</span>
          </div>
          <div className="flex justify-between border-t border-border/40 pt-1.5 mt-1.5">
            <span className="text-muted-foreground">Attached Work link:</span>
            <a
              href={submission.attachments[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold truncate max-w-[200px]"
            >
              {submission.attachments[0]?.fileName || "View Document"}
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Marks Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="marks" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Score (Marks)
              </Label>
              <span className="text-[10px] text-muted-foreground font-semibold">
                Maximum Score: {maxMarksVal} Marks
              </span>
            </div>
            <Input
              id="marks"
              type="number"
              placeholder="e.g. 90"
              className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
              {...register("marks", { valueAsNumber: true })}
              disabled={isPending}
            />
            {errors.marks && (
              <p className="text-[11px] text-destructive">{errors.marks.message}</p>
            )}
          </div>

          {/* Feedback Area */}
          <div className="space-y-1.5">
            <Label htmlFor="feedback" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Descriptive Feedback
            </Label>
            <textarea
              id="feedback"
              rows={3}
              placeholder="Excellent formatting. Compile criteria met. Small indentation issues on page 3..."
              className="w-full rounded-md border border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs p-3 focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              {...register("feedback")}
              disabled={isPending}
            />
            {errors.feedback && (
              <p className="text-[11px] text-destructive">{errors.feedback.message}</p>
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                </span>
              ) : (
                "Post Grade"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
