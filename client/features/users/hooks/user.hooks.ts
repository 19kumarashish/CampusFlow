import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
} from "../api/user.api";
import { updateUser as updateReduxUser } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import type { User } from "@/features/auth/types/auth.types";
import type {
  GetUsersParams,
  GetUsersResponse,
  CreateUserInput,
  UpdateUserInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../types/user.types";

export const useUsersQuery = (params?: GetUsersParams) => {
  return useQuery<GetUsersResponse, Error>({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000, // 30 seconds stale time
  });
};

export const useUserQuery = (id: string, enabled = true) => {
  return useQuery<User, Error>({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserInput>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create user. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  return useMutation<User, Error, { id: string; data: UpdateUserInput }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });

      // If the admin is updating their own profile, sync Redux store
      if (currentUser && currentUser._id === variables.id) {
        dispatch(updateReduxUser(updatedUser));
      }

      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update user.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deactivated successfully (Soft Deleted)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to deactivate user.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<User, Error, UpdateProfileInput>({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      // Sync Redux store
      dispatch(updateReduxUser(updatedUser));
      
      // Invalidate users cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile details.";
      toast.error(errorMessage);
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<{ message: string }, Error, ChangePasswordInput>({
    mutationFn: changePassword,
    onSuccess: (res) => {
      toast.success(res.message || "Password changed successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to change password.";
      toast.error(errorMessage);
    },
  });
};
