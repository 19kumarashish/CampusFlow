import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
} from "../api/assignment.api";
import type {
  GetAssignmentsParams,
  GetAssignmentsResponse,
  Assignment,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  CreateSubmissionInput,
  Submission,
  GetSubmissionsParams,
  GetSubmissionsResponse,
  GradeSubmissionInput,
} from "../types/assignment.types";

export const useAssignmentsQuery = (params?: GetAssignmentsParams) => {
  return useQuery<GetAssignmentsResponse, Error>({
    queryKey: ["assignments", params],
    queryFn: () => getAssignments(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000,
  });
};

export const useAssignmentQuery = (id: string, enabled = true) => {
  return useQuery<Assignment, Error>({
    queryKey: ["assignments", id],
    queryFn: () => getAssignmentById(id),
    enabled: enabled && !!id,
  });
};

export const useSubmissionsQuery = (params?: GetSubmissionsParams) => {
  return useQuery<GetSubmissionsResponse, Error>({
    queryKey: ["submissions", params],
    queryFn: () => getSubmissions(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000,
  });
};

export const useCreateAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Assignment, Error, CreateAssignmentInput>({
    mutationFn: createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Assignment created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create assignment.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Assignment, Error, { id: string; data: UpdateAssignmentInput }>({
    mutationFn: ({ id, data }) => updateAssignment(id, data),
    onSuccess: (updatedAssignment, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["assignments", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Assignment updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update assignment.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Assignment deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete assignment.";
      toast.error(errorMessage);
    },
  });
};

export const useSubmitAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Submission, Error, CreateSubmissionInput>({
    mutationFn: submitAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment submitted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to submit assignment.";
      toast.error(errorMessage);
    },
  });
};

export const useGradeSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Submission, Error, { id: string; data: GradeSubmissionInput }>({
    mutationFn: ({ id, data }) => gradeSubmission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Submission graded successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to grade submission.";
      toast.error(errorMessage);
    },
  });
};
