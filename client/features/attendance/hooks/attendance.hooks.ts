import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary,
} from "../api/attendance.api";
import type {
  GetAttendanceParams,
  GetAttendanceResponse,
  Attendance,
  CreateAttendanceInput,
  UpdateAttendanceInput,
  AttendanceSummary,
} from "../types/attendance.types";

export const useAttendanceListQuery = (params?: GetAttendanceParams) => {
  return useQuery<GetAttendanceResponse, Error>({
    queryKey: ["attendance", params],
    queryFn: () => getAttendance(params),
    placeholderData: (prev) => prev,
    staleTime: 20 * 1000, // 20 seconds stale
  });
};

export const useAttendanceQuery = (id: string, enabled = true) => {
  return useQuery<Attendance, Error>({
    queryKey: ["attendance", id],
    queryFn: () => getAttendanceById(id),
    enabled: enabled && !!id,
  });
};

export const useAttendanceSummaryQuery = (enrollmentId: string, enabled = true) => {
  return useQuery<AttendanceSummary, Error>({
    queryKey: ["attendance", "summary", enrollmentId],
    queryFn: () => getAttendanceSummary(enrollmentId),
    enabled: enabled && !!enrollmentId,
    staleTime: 30 * 1000,
  });
};

export const useCreateAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Attendance, Error, CreateAttendanceInput>({
    mutationFn: createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to submit attendance.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Attendance, Error, { id: string; data: UpdateAttendanceInput }>({
    mutationFn: ({ id, data }) => updateAttendance(id, data),
    onSuccess: (updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Attendance entry updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update attendance entry.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Attendance log record deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete attendance log.";
      toast.error(errorMessage);
    },
  });
};
