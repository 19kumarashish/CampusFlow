"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useSubmitAssignmentMutation } from "../hooks/assignment.hooks";
import type { Assignment } from "../types/assignment.types";

interface SubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  enrollmentId: string; // Active student enrollment ID
}

export default function SubmissionDialog({
  isOpen,
  onClose,
  assignment,
  enrollmentId,
}: SubmissionDialogProps) {
  const { mutate: submitWork, isPending } = useSubmitAssignmentMutation();

  const submissionSchema = z.object({
    submissionUrl: z.string().url("Please enter a valid submission URL (e.g., GitHub repo, Google Drive file, or PDF URL)"),
    fileName: z.string().min(2, "Filename must be at least 2 characters").max(255),
  });

  type SubmissionFormValues = z.infer<typeof submissionSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      submissionUrl: "",
      fileName: "",
    },
  });

  useEffect(() => {
    if (isOpen && assignment) {
      reset({
        submissionUrl: "",
        fileName: `${assignment.title.toLowerCase().replace(/\s+/g, "_")}_submission.pdf`,
      });
    }
  }, [isOpen, assignment, reset]);

  const onSubmit = (values: SubmissionFormValues) => {
    if (!assignment || !enrollmentId) return;

    submitWork(
      {
        assignment: assignment._id,
        enrollment: enrollmentId,
        attachments: [
          {
            url: values.submissionUrl,
            fileName: values.fileName,
            mimeType: "application/pdf",
            size: 2048, // Mock size in KB
          },
        ],
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  if (!isOpen || !assignment) return null;

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
            <Send className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Submit Assignment</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submit your work for "{assignment.title}"
            </p>
          </div>
        </div>

        {/* Due Date Notice */}
        <div className="mb-4 p-3 bg-muted/40 border border-border/60 rounded-xl text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due Date:</span>
            <span className="font-semibold text-white">
              {new Date(assignment.dueDate).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Marks:</span>
            <span className="font-semibold text-indigo-400">{assignment.maxMarks} Marks</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Submission URL */}
          <div className="space-y-1.5">
            <Label htmlFor="submissionUrl" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Project Link / Submission URL
            </Label>
            <Input
              id="submissionUrl"
              placeholder="https://github.com/... or https://drive.google.com/..."
              className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
              {...register("submissionUrl")}
              disabled={isPending}
            />
            {errors.submissionUrl && (
              <p className="text-[11px] text-destructive">{errors.submissionUrl.message}</p>
            )}
          </div>

          {/* File Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fileName" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Display File Name
            </Label>
            <Input
              id="fileName"
              placeholder="e.g. lab1_submission.pdf"
              className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
              {...register("fileName")}
              disabled={isPending}
            />
            {errors.fileName && (
              <p className="text-[11px] text-destructive">{errors.fileName.message}</p>
            )}
          </div>

          {/* Action buttons */}
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
                "Submit Work"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
