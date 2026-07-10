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
import { useCreateExamResultMutation, useUpdateExamResultMutation } from "../hooks/examination.hooks";
import type { Examination, ExamResult } from "../types/examination.types";

interface ExamGradingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  examination: Examination | null;
  enrollmentId: string | null;
  result: ExamResult | null; // Null means CREATE result, populated means EDIT result
}

export default function ExamGradingDialog({
  isOpen,
  onClose,
  examination,
  enrollmentId,
  result,
}: ExamGradingDialogProps) {
  const isEditMode = !!result;

  const { mutate: createResult, isPending: isCreating } = useCreateExamResultMutation();
  const { mutate: updateResult, isPending: isUpdating } = useUpdateExamResultMutation();

  const isPending = isCreating || isUpdating;

  const maxMarksVal = examination?.maximumMarks || 100;

  const gradingSchema = z.object({
    obtainedMarks: z
      .number()
      .min(0, "Marks cannot be negative")
      .max(maxMarksVal, `Marks cannot exceed maximum score of ${maxMarksVal}`),
    remarks: z.string().max(1000, "Remarks cannot exceed 1000 characters").optional().or(z.literal("")),
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
    if (isOpen) {
      if (result) {
        reset({
          obtainedMarks: result.obtainedMarks,
          remarks: result.remarks || "",
        });
      } else {
        reset({
          obtainedMarks: 0,
          remarks: "",
        });
      }
    }
  }, [isOpen, result, reset]);

  const onSubmit = (values: GradingFormValues) => {
    if (!examination) return;

    if (isEditMode && result) {
      updateResult(
        {
          id: result._id,
          data: {
            obtainedMarks: values.obtainedMarks,
            remarks: values.remarks || undefined,
          },
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else if (enrollmentId) {
      createResult(
        {
          examination: examination._id,
          enrollment: enrollmentId,
          obtainedMarks: values.obtainedMarks,
          remarks: values.remarks || undefined,
        },
        {
          onSuccess: () => onClose(),
        }
      );
    }
  };

  if (!isOpen || !examination) return null;

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
            <h2 className="text-lg font-bold text-white">Grade Examination</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter student exam marks and feedback remarks
            </p>
          </div>
        </div>

        {/* Exam stats */}
        <div className="mb-4 p-3 bg-muted/40 border border-border/60 rounded-xl text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Exam Name:</span>
            <span className="font-bold text-white">{examination.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Passing Cutoff:</span>
            <span className="font-mono text-indigo-400 font-bold">{examination.passingMarks} / {examination.maximumMarks} Marks</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Obtained Marks */}
          <div className="space-y-1.5">
            <Label htmlFor="obtainedMarks" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Obtained Marks
            </Label>
            <Input
              id="obtainedMarks"
              type="number"
              placeholder="e.g. 85"
              className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
              {...register("obtainedMarks", { valueAsNumber: true })}
              disabled={isPending}
            />
            {errors.obtainedMarks && (
              <p className="text-[11px] text-destructive">{errors.obtainedMarks.message}</p>
            )}
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <Label htmlFor="remarks" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Performance Remarks
            </Label>
            <textarea
              id="remarks"
              rows={3}
              placeholder="Good understanding of mathematical models. Needs practice on proofs..."
              className="w-full rounded-md border border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs p-3 focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              {...register("remarks")}
              disabled={isPending}
            />
            {errors.remarks && (
              <p className="text-[11px] text-destructive">{errors.remarks.message}</p>
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
                "Submit Grade"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
