import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/course.api";
import type {
  GetCoursesParams,
  GetCoursesResponse,
  Course,
  CreateCourseInput,
  UpdateCourseInput,
} from "../types/course.types";

export const useCoursesQuery = (params?: GetCoursesParams) => {
  return useQuery<GetCoursesResponse, Error>({
    queryKey: ["courses", params],
    queryFn: () => getCourses(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000, // 45 seconds stale time
  });
};

export const useCourseQuery = (id: string, enabled = true) => {
  return useQuery<Course, Error>({
    queryKey: ["courses", id],
    queryFn: () => getCourseById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, CreateCourseInput>({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      // Also invalidate dashboard since total courses stat may change
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Course created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create course.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, { id: string; data: UpdateCourseInput }>({
    mutationFn: ({ id, data }) => updateCourse(id, data),
    onSuccess: (updatedCourse, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Course updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update course.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Course deactivated successfully (Soft Deleted)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to deactivate course.";
      toast.error(errorMessage);
    },
  });
};
