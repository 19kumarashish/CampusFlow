"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { Loader2, User as UserIcon, Lock, Phone, UserCheck, Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfileMutation, useChangePasswordMutation } from "../hooks/user.hooks";
import { RootState } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Personal Info Schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  avatar: z.string().url("Please enter a valid URL").or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password Change Schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfileSettings() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Mutations
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfileMutation();
  const { mutate: changeUserPassword, isPending: isChangingPassword } = useChangePasswordMutation();

  // Personal Info Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    },
  });

  // Password Change Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfile(values);
  };

  const onPasswordSubmit = (values: PasswordFormValues) => {
    changeUserPassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          resetPasswordForm();
        },
      }
    );
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      {/* Left Column - Avatar Summary Card */}
      <Card className="lg:col-span-1 border-slate-800 bg-slate-950/40 p-6 flex flex-col items-center text-center backdrop-blur-xl h-fit">
        <Avatar className="h-28 w-28 border-2 border-indigo-500/20 shadow-2xl relative">
          {user?.avatar ? (
            <AvatarImage src={user.avatar} alt={user.firstName} />
          ) : null}
          <AvatarFallback className="bg-indigo-600 text-white text-3xl font-bold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-xl font-bold mt-4 text-white">
          {user?.firstName} {user?.lastName}
        </h2>
        
        <p className="text-xs text-slate-400 mt-1">{user?.email}</p>

        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Shield className="h-3.5 w-3.5" />
          {user?.role?.name || "No Role"}
        </div>
        
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {user?.status}
        </div>
      </Card>

      {/* Right Column - Input Forms */}
      <div className="lg:col-span-2 space-y-8">
        {/* Personal Details Card */}
        <Card className="border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Personal Information</h3>
            <p className="text-xs text-slate-500 mt-1">
              Update your primary profile details and workspace contact phone numbers.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-slate-400 text-xs">First Name</Label>
                <Input
                  id="firstName"
                  className="border-slate-800 bg-slate-900/60 text-xs text-white"
                  disabled={isUpdatingProfile}
                  {...registerProfile("firstName")}
                />
                {profileErrors.firstName && (
                  <p className="text-[10px] text-red-400">{profileFormSchema.shape.firstName.description || profileErrors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-slate-400 text-xs">Last Name</Label>
                <Input
                  id="lastName"
                  className="border-slate-800 bg-slate-900/60 text-xs text-white"
                  disabled={isUpdatingProfile}
                  {...registerProfile("lastName")}
                />
                {profileErrors.lastName && (
                  <p className="text-[10px] text-red-400">{profileErrors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-slate-400 text-xs">Phone Number</Label>
                <Input
                  id="phone"
                  className="border-slate-800 bg-slate-900/60 text-xs text-white"
                  disabled={isUpdatingProfile}
                  {...registerProfile("phone")}
                />
                {profileErrors.phone && (
                  <p className="text-[10px] text-red-400">{profileErrors.phone.message}</p>
                )}
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <Label htmlFor="avatar" className="text-slate-400 text-xs">Avatar Photo URL</Label>
                <Input
                  id="avatar"
                  placeholder="https://example.com/avatar.jpg"
                  className="border-slate-800 bg-slate-900/60 text-xs text-white"
                  disabled={isUpdatingProfile}
                  {...registerProfile("avatar")}
                />
                {profileErrors.avatar && (
                  <p className="text-[10px] text-red-400">{profileErrors.avatar.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-900">
              <Button
                type="submit"
                className="bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/10 px-6 h-9"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Changes
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Change Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ensure your account is protected by updating your security password regularly.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-slate-400 text-xs">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="border-slate-800 bg-slate-900/60 text-xs text-white"
                disabled={isChangingPassword}
                {...registerPassword("currentPassword")}
              />
              {passwordErrors.currentPassword && (
                <p className="text-[10px] text-red-400">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-slate-400 text-xs">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="border-slate-800 bg-slate-900/60 text-xs text-white"
                  disabled={isChangingPassword}
                  {...registerPassword("newPassword")}
                />
                {passwordErrors.newPassword && (
                  <p className="text-[10px] text-red-400">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmNewPassword" className="text-slate-400 text-xs">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="••••••••"
                  className="border-slate-800 bg-slate-900/60 text-xs text-white"
                  disabled={isChangingPassword}
                  {...registerPassword("confirmNewPassword")}
                />
                {passwordErrors.confirmNewPassword && (
                  <p className="text-[10px] text-red-400">{passwordErrors.confirmNewPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-900">
              <Button
                type="submit"
                className="bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/10 px-6 h-9"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating Password
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
