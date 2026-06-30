import { api } from "@/lib/api/axios";
import type {
  LoginRequest,
  LoginResponse,
} from "../types/auth.types";

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");

  return response.data;
};