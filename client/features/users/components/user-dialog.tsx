"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, UserPlus, Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCreateUserMutation, useUpdateUserMutation } from "../hooks/user.hooks";
import type { Role, User, UserStatus } from "@/features/auth/types/auth.types";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null; // Null means CREATE mode, populated User means EDIT mode
  discoveredRoles: Role[];
}

export default function UserDialog({
  isOpen,
  onClose,
  user,
  discoveredRoles,
}: UserDialogProps) {
  const isEditMode = !!user;

  // Form Validation Schema
  const userFormSchema = z
    .object({
      firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50),
      lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50),
      email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .trim()
        .toLowerCase(),
      phone: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(15, "Phone number cannot exceed 15 characters"),
      roleId: z.string().min(1, "Please select an user role"),
      password: z.string().optional(),
      status: z.string().optional(),
    })
    .refine(
      (data) => {
        // Password is required only in Create mode
        if (!isEditMode && (!data.password || data.password.length < 8)) {
          return false;
        }
        return true;
      },
      {
        message: "Password must be at least 8 characters",
        path: ["password"],
      }
    );

  type UserFormValues = z.infer<typeof userFormSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });

  // Load user data into form on Edit mode
  useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          roleId: typeof user.role === "object" ? user.role._id : user.role,
          status: user.status,
          password: "",
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          roleId: discoveredRoles[0]?._id || "",
          status: "PENDING",
          password: "",
        });
      }
    }
  }, [isOpen, user, reset, discoveredRoles]);

  const { mutate: createUser, isPending: isCreating } = useCreateUserMutation();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: UserFormValues) => {
    if (isEditMode && user) {
      const updateData: any = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        roleId: values.roleId,
        status: values.status as UserStatus,
      };
      if (values.password) {
        updateData.password = values.password;
      }
      updateUser(
        { id: user._id, data: updateData },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createUser(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          roleId: values.roleId,
          password: values.password || "",
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
      <Card className="relative w-full max-w-lg border-slate-800 bg-slate-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-6">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Edit2 className="h-5 w-5 text-indigo-400" />
            ) : (
              <UserPlus className="h-5 w-5 text-indigo-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {isEditMode ? "Edit User Account" : "Create New User"}
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-slate-400 text-xs">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-[10px] text-red-400">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-slate-400 text-xs">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-[10px] text-red-400">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-400 text-xs">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@campusflow.com"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[10px] text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-slate-400 text-xs">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="9876543210"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isPending}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-[10px] text-red-400">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Select Role */}
            <div className="space-y-1.5">
              <Label htmlFor="roleId" className="text-slate-400 text-xs">
                User Role
              </Label>
              <select
                id="roleId"
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isPending}
                {...register("roleId")}
              >
                {discoveredRoles.map((r) => (
                  <option key={r._id} value={r._id} className="bg-slate-950 text-slate-300">
                    {r.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-[10px] text-red-400">{errors.roleId.message}</p>
              )}
            </div>

            {/* User Status (Only in Edit mode) */}
            {isEditMode ? (
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-400 text-xs">
                  Account Status
                </Label>
                <select
                  id="status"
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={isPending}
                  {...register("status")}
                >
                  <option value="ACTIVE" className="bg-slate-950 text-slate-300">Active</option>
                  <option value="INACTIVE" className="bg-slate-950 text-slate-300">Inactive</option>
                  <option value="PENDING" className="bg-slate-950 text-slate-300">Pending</option>
                  <option value="SUSPENDED" className="bg-slate-950 text-slate-300">Suspended</option>
                </select>
              </div>
            ) : null}
          </div>

          {/* Password (Required for create, optional for edit) */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-400 text-xs">
              Password {isEditMode ? "(Leave blank to keep current)" : ""}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEditMode ? "••••••••" : "Min 8 characters"}
              className="border-slate-800 bg-slate-900/60 text-xs text-white"
              disabled={isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[10px] text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-end gap-3 border-t border-slate-900 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-slate-800 bg-slate-950 text-slate-450 hover:bg-slate-900 text-white text-xs h-9"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 shadow-lg shadow-indigo-600/10 px-6"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
