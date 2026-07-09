import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/department.api";
import type {
  GetDepartmentsParams,
  GetDepartmentsResponse,
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "../types/department.types";

export const useDepartmentsQuery = (params?: GetDepartmentsParams) => {
  return useQuery<GetDepartmentsResponse, Error>({
    queryKey: ["departments", params],
    queryFn: () => getDepartments(params),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000, // 60 seconds stale time
  });
};

export const useDepartmentQuery = (id: string, enabled = true) => {
  return useQuery<Department, Error>({
    queryKey: ["departments", id],
    queryFn: () => getDepartmentById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Department, Error, CreateDepartmentInput>({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create department.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Department, Error, { id: string; data: UpdateDepartmentInput }>({
    mutationFn: ({ id, data }) => updateDepartment(id, data),
    onSuccess: (updatedDept, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", variables.id] });
      
      // Also invalidate dashboard since departments average CGPA might shift
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      toast.success("Department updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update department.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Department deactivated successfully (Soft Deleted)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to deactivate department.";
      toast.error(errorMessage);
    },
  });
};
