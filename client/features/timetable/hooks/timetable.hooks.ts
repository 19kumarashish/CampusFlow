import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getTimetables,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from "../api/timetable.api";
import type {
  GetTimetableParams,
  GetTimetableResponse,
  Timetable,
  CreateTimetableInput,
  UpdateTimetableInput,
} from "../types/timetable.types";

export const useTimetablesQuery = (params?: GetTimetableParams) => {
  return useQuery<GetTimetableResponse, Error>({
    queryKey: ["timetable", params],
    queryFn: () => getTimetables(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000, // 30 seconds stale time
  });
};

export const useTimetableQuery = (id: string, enabled = true) => {
  return useQuery<Timetable, Error>({
    queryKey: ["timetable", id],
    queryFn: () => getTimetableById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateTimetableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Timetable, Error, CreateTimetableInput>({
    mutationFn: createTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      // Invalidate dashboard to sync classes feed
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Timetable slot scheduled successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to schedule slot conflict detected.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateTimetableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Timetable, Error, { id: string; data: UpdateTimetableInput }>({
    mutationFn: ({ id, data }) => updateTimetable(id, data),
    onSuccess: (updatedSlot, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      queryClient.invalidateQueries({ queryKey: ["timetable", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Timetable slot updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update timetable slot.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteTimetableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Timetable slot removed successfully (Soft Deleted)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to remove timetable slot.";
      toast.error(errorMessage);
    },
  });
};
