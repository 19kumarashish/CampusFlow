import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/student.api";
import type {
  GetStudentsParams,
  GetStudentsResponse,
  Student,
  CreateStudentInput,
  UpdateStudentInput,
} from "../types/student.types";

export const useStudentsQuery = (params?: GetStudentsParams) => {
  return useQuery<GetStudentsResponse, Error>({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000, // 45 seconds stale time
  });
};

export const useStudentQuery = (id: string, enabled = true) => {
  return useQuery<Student, Error>({
    queryKey: ["students", id],
    queryFn: () => getStudentById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, CreateStudentInput>({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      // Invalidate dashboard to sync student aggregations
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Student profile created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create student profile.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, { id: string; data: UpdateStudentInput }>({
    mutationFn: ({ id, data }) => updateStudent(id, data),
    onSuccess: (updatedStudent, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Student profile updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update student profile.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Student profile marked as DROPPED successfully (Soft Deleted)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to drop student profile.";
      toast.error(errorMessage);
    },
  });
};
