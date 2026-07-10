"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "../hooks/auth.hooks";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";

export default function LoginForm() {
  const { mutate: loginUser, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginUser(data);
  };

  const handleAutofill = () => {
    setValue("email", "admin@campusflow.com", { shouldValidate: true });
    setValue("password", "Admin@123", { shouldValidate: true });
  };

  return (
    <div className="w-full">
      {/* Brand logo & header */}
      <div className="mb-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.15)] mb-4 animate-pulse">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-transparent glow-text-primary">
          CampusFlow
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-[280px]">
          University management workspace. Sign in to your administrative dashboard.
        </p>
      </div>

      <Card className="relative overflow-hidden glass-panel border-border/60 p-7 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        {/* Decorative corner highlights */}
        <div className="absolute top-0 right-0 h-[1px] w-24 bg-gradient-to-l from-primary/30 to-transparent" />
        <div className="absolute top-0 right-0 w-[1px] h-24 bg-gradient-to-b from-primary/30 to-transparent" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Email Address
            </Label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="admin@campusflow.com"
                className="pl-10 h-11 border-border/80 bg-background/50 text-foreground placeholder-muted-foreground/60 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("email")}
                disabled={isPending}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Password
              </Label>
            </div>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-11 border-border/80 bg-background/50 text-foreground placeholder-muted-foreground/60 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                {...register("password")}
                disabled={isPending}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-md shadow-primary/10"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </Card>
      
      {/* Demo credentials quick assistant widget */}
      <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
        <button
          onClick={handleAutofill}
          type="button"
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-200 group text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Demo Workspace Account
              </p>
              <p className="text-[11px] text-muted-foreground">
                Click to auto-populate administrative credentials.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
            Auto-fill
          </span>
        </button>
      </div>

      {/* Modern minimal footer info */}
      <div className="mt-10 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60 uppercase tracking-widest animate-in fade-in duration-700">
        <span>CampusFlow v1.4.0</span>
        <span className="h-3 w-[1px] bg-border/80" />
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
          <span>Server Active</span>
        </div>
      </div>
    </div>
  );
}
