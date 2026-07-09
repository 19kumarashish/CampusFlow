import { api } from "@/lib/api/axios";
import type { ApiResponse, User } from "@/features/auth/types/auth.types";
import type {
  GetUsersParams,
  GetUsersResponse,
  CreateUserInput,
  UpdateUserInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../types/user.types";

export const getUsers = async (
  params?: GetUsersParams
): Promise<GetUsersResponse> => {
  const response = await api.get<ApiResponse<GetUsersResponse>>("/users", {
    params,
  });
  return response.data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data.data;
};

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const response = await api.post<ApiResponse<User>>("/users", data);
  return response.data.data;
};

export const updateUser = async (
  id: string,
  data: UpdateUserInput
): Promise<User> => {
  const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<User> => {
  const response = await api.delete<ApiResponse<User>>(`/users/${id}`);
  return response.data.data;
};

export const updateProfile = async (
  data: UpdateProfileInput
): Promise<User> => {
  const response = await api.patch<ApiResponse<User>>("/users/profile", data);
  return response.data.data;
};

export const changePassword = async (
  data: ChangePasswordInput
): Promise<{ message: string }> => {
  const response = await api.patch<ApiResponse<{ message: string }>>(
    "/users/change-password",
    data
  );
  return response.data.data;
};
