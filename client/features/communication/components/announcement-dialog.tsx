"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCreateAnnouncementMutation } from "../hooks/communication.hooks";

interface AnnouncementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnnouncementDialog({
  isOpen,
  onClose,
}: AnnouncementDialogProps) {
  const { mutate: publishNotice, isPending } = useCreateAnnouncementMutation();

  const announcementSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    message: z.string().min(5, "Message details must be at least 5 characters"),
    targetRoles: z.array(z.string()).min(1, "Please select at least one target audience"),
    publishAt: z.string().optional().or(z.literal("")),
    expiresAt: z.string().optional().or(z.literal("")),
  });

  type AnnouncementFormValues = z.infer<typeof announcementSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
      targetRoles: ["STUDENT", "TEACHER"],
      publishAt: "",
      expiresAt: "",
    },
  });

  const selectedRoles = watch("targetRoles") || [];

  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        message: "",
        targetRoles: ["STUDENT", "TEACHER"],
        publishAt: new Date().toISOString().split("T")[0],
        expiresAt: "",
      });
    }
  }, [isOpen, reset]);

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setValue("targetRoles", selectedRoles.filter((r) => r !== role), { shouldValidate: true });
    } else {
      setValue("targetRoles", [...selectedRoles, role], { shouldValidate: true });
    }
  };

  const onSubmit = (values: AnnouncementFormValues) => {
    const payload = {
      title: values.title,
      message: values.message,
      targetRoles: values.targetRoles,
      publishAt: values.publishAt ? new Date(values.publishAt).toISOString() : undefined,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
    };

    publishNotice(payload, {
      onSuccess: () => onClose(),
    });
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
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Compose Announcement</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Broadcast notice to campus students or faculty members
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Notice Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Schedule Update: Winter Semester Break Holidays"
              className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
              {...register("title")}
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Broadcast Message Details
            </Label>
            <textarea
              id="message"
              rows={4}
              placeholder="Type message content here..."
              className="w-full rounded-md border border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs p-3 focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              {...register("message")}
              disabled={isPending}
            />
            {errors.message && (
              <p className="text-[11px] text-destructive">{errors.message.message}</p>
            )}
          </div>

          {/* Target Audience Roles */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Target Audience
            </Label>
            <div className="flex gap-4 pt-1">
              {["STUDENT", "TEACHER", "ADMIN"].map((role) => (
                <label key={role} className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="rounded border-border text-primary focus:ring-primary/20 bg-background/50 h-4 w-4 shrink-0"
                    disabled={isPending}
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
            {errors.targetRoles && (
              <p className="text-[11px] text-destructive">{errors.targetRoles.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Publish Date */}
            <div className="space-y-1.5">
              <Label htmlFor="publishAt" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Publish Date
              </Label>
              <Input
                id="publishAt"
                type="date"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("publishAt")}
                disabled={isPending}
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <Label htmlFor="expiresAt" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Expiry Date
              </Label>
              <Input
                id="expiresAt"
                type="date"
                className="h-10 border-border bg-background/50 text-foreground placeholder-muted-foreground/60 text-xs focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("expiresAt")}
                disabled={isPending}
              />
            </div>
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing...
                </span>
              ) : (
                "Publish Notice"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
