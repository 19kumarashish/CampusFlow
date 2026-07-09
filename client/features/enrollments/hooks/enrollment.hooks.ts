import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../api/enrollment.api";
import type {
  GetEnrollmentsParams,
  GetEnrollmentsResponse,
  Enrollment,
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
} from "../types/enrollment.types";

export const useEnrollmentsQuery = (params?: GetEnrollmentsParams) => {
  return useQuery<GetEnrollmentsResponse, Error>({
    queryKey: ["enrollments", params],
    queryFn: () => getEnrollments(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000, // 30 seconds stale time
  });
};

export const useEnrollmentQuery = (id: string, enabled = true) => {
  return useQuery<Enrollment, Error>({
    queryKey: ["enrollments", id],
    queryFn: () => getEnrollmentById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateEnrollmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Enrollment, Error, CreateEnrollmentInput>({
    mutationFn: createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      // Invalidate dashboard to sync enrollment aggregations
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Student enrolled successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to enroll student.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateEnrollmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Enrollment,
    Error,
    { id: string; data: UpdateEnrollmentInput }
  >({
    mutationFn: ({ id, data }) => updateEnrollment(id, data),
    onSuccess: (updatedEnrollment, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Enrollment profile updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update enrollment profile.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteEnrollmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Enrollment soft-deleted successfully (Marked Inactive)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to soft-delete enrollment.";
      toast.error(errorMessage);
    },
  });
};
