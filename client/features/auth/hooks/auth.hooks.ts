"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login, logout } from "../api/auth.api";
import { setCredentials, logout as logoutAction } from "@/store/slices/authSlice";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const useLoginMutation = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          user: data.user,
        })
      );
      toast.success("Welcome back! Login successful.");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useLogoutMutation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSettled: () => {
      // Dispatch logout in Redux (both on success or error to ensure user is logged out on UI)
      dispatch(logoutAction());
      
      // Clear TanStack query cache to avoid data leaks
      queryClient.clear();
      
      toast.success("Logged out successfully.");
      router.push("/login");
    },
  });
};
