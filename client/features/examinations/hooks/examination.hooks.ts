import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getExaminations,
  getExaminationById,
  createExamination,
  updateExamination,
  deleteExamination,
  createExamResult,
  getExamResults,
  updateExamResult,
} from "../api/examination.api";
import type {
  GetExaminationsParams,
  GetExaminationsResponse,
  Examination,
  CreateExaminationInput,
  UpdateExaminationInput,
  CreateExamResultInput,
  GetExamResultsParams,
  GetExamResultsResponse,
  ExamResult,
  UpdateExamResultInput,
} from "../types/examination.types";

export const useExaminationsQuery = (params?: GetExaminationsParams) => {
  return useQuery<GetExaminationsResponse, Error>({
    queryKey: ["examinations", params],
    queryFn: () => getExaminations(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000,
  });
};

export const useExaminationQuery = (id: string, enabled = true) => {
  return useQuery<Examination, Error>({
    queryKey: ["examinations", id],
    queryFn: () => getExaminationById(id),
    enabled: enabled && !!id,
  });
};

export const useExamResultsQuery = (params?: GetExamResultsParams) => {
  return useQuery<GetExamResultsResponse, Error>({
    queryKey: ["examResults", params],
    queryFn: () => getExamResults(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
};

export const useCreateExaminationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Examination, Error, CreateExaminationInput>({
    mutationFn: createExamination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Examination schedule created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create examination schedule.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateExaminationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Examination, Error, { id: string; data: UpdateExaminationInput }>({
    mutationFn: ({ id, data }) => updateExamination(id, data),
    onSuccess: (updatedExam, variables) => {
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
      queryClient.invalidateQueries({ queryKey: ["examinations", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Examination schedule updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update examination schedule.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteExaminationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteExamination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Examination schedule deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete examination schedule.";
      toast.error(errorMessage);
    },
  });
};

export const useCreateExamResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ExamResult, Error, CreateExamResultInput>({
    mutationFn: createExamResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examResults"] });
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
      toast.success("Exam mark posted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to post exam mark.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateExamResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ExamResult, Error, { id: string; data: UpdateExamResultInput }>({
    mutationFn: ({ id, data }) => updateExamResult(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examResults"] });
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
      toast.success("Exam mark updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update exam mark.";
      toast.error(errorMessage);
    },
  });
};
