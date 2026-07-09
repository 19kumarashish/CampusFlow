import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../api/subject.api";
import type {
  GetSubjectsParams,
  GetSubjectsResponse,
  Subject,
  CreateSubjectInput,
  UpdateSubjectInput,
} from "../types/subject.types";

export const useSubjectsQuery = (params?: GetSubjectsParams) => {
  return useQuery<GetSubjectsResponse, Error>({
    queryKey: ["subjects", params],
    queryFn: () => getSubjects(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000, // 45 seconds stale time
  });
};

export const useSubjectQuery = (id: string, enabled = true) => {
  return useQuery<Subject, Error>({
    queryKey: ["subjects", id],
    queryFn: () => getSubjectById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Subject, Error, CreateSubjectInput>({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Subject created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create subject.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateSubjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Subject, Error, { id: string; data: UpdateSubjectInput }>({
    mutationFn: ({ id, data }) => updateSubject(id, data),
    onSuccess: (updatedSubject, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subjects", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Subject updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update subject.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteSubjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Subject deactivated successfully (Soft Deleted)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to deactivate subject.";
      toast.error(errorMessage);
    },
  });
};
