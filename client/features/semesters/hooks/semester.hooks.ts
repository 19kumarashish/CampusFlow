import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../api/semester.api";
import type {
  GetSemestersParams,
  GetSemestersResponse,
  Semester,
  CreateSemesterInput,
  UpdateSemesterInput,
} from "../types/semester.types";

export const useSemestersQuery = (params?: GetSemestersParams) => {
  return useQuery<GetSemestersResponse, Error>({
    queryKey: ["semesters", params],
    queryFn: () => getSemesters(params),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });
};

export const useCreateSemesterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Semester, Error, CreateSemesterInput>({
    mutationFn: createSemester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      toast.success("Semester term created successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create semester.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateSemesterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Semester, Error, { id: string; data: UpdateSemesterInput }>({
    mutationFn: ({ id, data }) => updateSemester(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      toast.success(`Semester "${updated.name}" updated successfully`);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update semester details.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteSemesterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteSemester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      toast.success("Semester term deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete semester.";
      toast.error(errorMessage);
    },
  });
};
