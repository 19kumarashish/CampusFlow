import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  promoteStudents,
  getPromotionHistory,
  getBacklogs,
  createBacklog,
  clearBacklog,
  getRevaluations,
  createRevaluation,
  approveRevaluation,
  getAcademicEvents,
  createAcademicEvent,
  updateAcademicEvent,
  deleteAcademicEvent,
} from "../api/academic.api";

export const usePromotionHistoryQuery = () => {
  return useQuery<any[], Error>({
    queryKey: ["academic", "promotions"],
    queryFn: getPromotionHistory,
  });
};

export const usePromoteStudentsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: promoteStudents,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["academic", "promotions"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Roster of students promoted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to execute student promotion cycle");
    },
  });
};

export const useBacklogsQuery = (params?: { studentId?: string; status?: string }) => {
  return useQuery<any[], Error>({
    queryKey: ["academic", "backlogs", params],
    queryFn: () => getBacklogs(params),
  });
};

export const useCreateBacklogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: createBacklog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "backlogs"] });
      toast.success("Backlog registry record created");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log backlog entry");
    },
  });
};

export const useClearBacklogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: clearBacklog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "backlogs"] });
      toast.success("Backlog marked as cleared");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to clear backlog");
    },
  });
};

export const useRevaluationsQuery = (params?: { studentId?: string; status?: string }) => {
  return useQuery<any[], Error>({
    queryKey: ["academic", "revaluations", params],
    queryFn: () => getRevaluations(params),
  });
};

export const useCreateRevaluationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: createRevaluation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "revaluations"] });
      toast.success("Revaluation grade review logged successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create revaluation request");
    },
  });
};

export const useApproveRevaluationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string; data: any }>({
    mutationFn: ({ id, data }) => approveRevaluation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "revaluations"] });
      queryClient.invalidateQueries({ queryKey: ["results"] });
      toast.success("Revaluation request updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update revaluation status");
    },
  });
};

export const useAcademicEventsQuery = () => {
  return useQuery<any[], Error>({
    queryKey: ["academic", "calendar"],
    queryFn: getAcademicEvents,
  });
};

export const useCreateAcademicEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: createAcademicEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "calendar"] });
      toast.success("Calendar academic event logged successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create calendar event");
    },
  });
};

export const useUpdateAcademicEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string; data: any }>({
    mutationFn: ({ id, data }) => updateAcademicEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "calendar"] });
      toast.success("Calendar schedule updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save calendar revisions");
    },
  });
};

export const useDeleteAcademicEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteAcademicEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "calendar"] });
      toast.success("Calendar event deleted");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete event");
    },
  });
};
