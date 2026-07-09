"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, GraduationCap } from "lucide-react";

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

  return (
    <div className="w-full max-w-md px-4">
      {/* Brand logo & header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] mb-4">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Access the CampusFlow management workspace
        </p>
      </div>

      <Card className="relative overflow-hidden border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px]" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-[60px]" />

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
              Email Address
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="admin@campusflow.com"
                className="pl-10 border-slate-800 bg-slate-900/60 text-white placeholder-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-colors"
                {...register("email")}
                disabled={isPending}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Password
              </Label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 border-slate-800 bg-slate-900/60 text-white placeholder-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-colors"
                {...register("password")}
                disabled={isPending}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Card>
      
      {/* Help text */}
      <div className="mt-8 text-center text-xs text-slate-500">
        <p>Default credentials: admin@campusflow.com / Admin@123</p>
      </div>
    </div>
  );
}
