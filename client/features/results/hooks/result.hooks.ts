import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getResults,
  createResult,
  getSemesterResults,
  generateSemesterResult,
  publishResult,
  generateTranscript,
} from "../api/result.api";
import type {
  GetResultsParams,
  GetResultsResponse,
  SubjectResult,
  CreateResultInput,
  GetSemesterResultsParams,
  GetSemesterResultsResponse,
  SemesterResult,
  CreateSemesterResultInput,
  TranscriptResponse,
} from "../types/result.types";

export const useResultsQuery = (params?: GetResultsParams) => {
  return useQuery<GetResultsResponse, Error>({
    queryKey: ["results", params],
    queryFn: () => getResults(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000,
  });
};

export const useSemesterResultsQuery = (params?: GetSemesterResultsParams) => {
  return useQuery<GetSemesterResultsResponse, Error>({
    queryKey: ["semesterResults", params],
    queryFn: () => getSemesterResults(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000,
  });
};

export const useTranscriptQuery = (enrollmentId: string, enabled = true) => {
  return useQuery<TranscriptResponse, Error>({
    queryKey: ["transcripts", enrollmentId],
    queryFn: () => generateTranscript(enrollmentId),
    enabled: enabled && !!enrollmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes stale
  });
};

export const useCreateResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SubjectResult, Error, CreateResultInput>({
    mutationFn: createResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      toast.success("Subject result compiled successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to compile subject result.";
      toast.error(errorMessage);
    },
  });
};

export const useGenerateSemesterResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SemesterResult, Error, CreateSemesterResultInput>({
    mutationFn: generateSemesterResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesterResults"] });
      toast.success("Semester result GPA generated successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to generate GPA.";
      toast.error(errorMessage);
    },
  });
};

export const usePublishResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SemesterResult, Error, string>({
    mutationFn: publishResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      queryClient.invalidateQueries({ queryKey: ["semesterResults"] });
      toast.success("Result published successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to publish result.";
      toast.error(errorMessage);
    },
  });
};
