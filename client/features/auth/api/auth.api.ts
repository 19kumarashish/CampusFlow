import { api } from "@/lib/api/axios";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  User,
} from "../types/auth.types";

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post<ApiResponse<null>>("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
};

export const refreshToken = async (): Promise<RefreshResponse> => {
  const response = await api.post<ApiResponse<RefreshResponse>>("/auth/refresh-token");
  return response.data.data;
};