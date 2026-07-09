import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetCoursesParams,
  GetCoursesResponse,
  Course,
  CreateCourseInput,
  UpdateCourseInput,
} from "../types/course.types";

export const getCourses = async (
  params?: GetCoursesParams
): Promise<GetCoursesResponse> => {
  const response = await api.get<ApiResponse<GetCoursesResponse>>("/courses", {
    params,
  });
  return response.data.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
  return response.data.data;
};

export const createCourse = async (
  data: CreateCourseInput
): Promise<Course> => {
  const response = await api.post<ApiResponse<Course>>("/courses", data);
  return response.data.data;
};

export const updateCourse = async (
  id: string,
  data: UpdateCourseInput
): Promise<Course> => {
  const response = await api.patch<ApiResponse<Course>>(`/courses/${id}`, data);
  return response.data.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/courses/${id}`);
};
