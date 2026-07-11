import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createFeeStructure,
  getFeeStructures,
  getLedgers,
  assignFees,
  getInvoices,
  createScholarship,
  getScholarships,
  allocateScholarship,
  getScholarshipAllocations,
  executePayment,
  getPaymentHistory,
  refundPayment,
} from "../api/finance.api";

export const useFeeStructuresQuery = () => {
  return useQuery<any[], Error>({
    queryKey: ["finance", "fee-structures"],
    queryFn: getFeeStructures,
  });
};

export const useCreateFeeStructureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: createFeeStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "fee-structures"] });
      toast.success("Fee structure category template created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to define fee structure");
    },
  });
};

export const useAssignFeesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { feeStructureId: string }>({
    mutationFn: assignFees,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "ledgers"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "invoices"] });
      toast.success("Fee structures assigned to enrolled students");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to assign fee templates");
    },
  });
};

export const useLedgersQuery = (params?: { studentId?: string }) => {
  return useQuery<any[], Error>({
    queryKey: ["finance", "ledgers", params],
    queryFn: () => getLedgers(params),
  });
};

export const useInvoicesQuery = (params?: { studentId?: string }) => {
  return useQuery<any[], Error>({
    queryKey: ["finance", "invoices", params],
    queryFn: () => getInvoices(params),
  });
};

export const useScholarshipsQuery = () => {
  return useQuery<any[], Error>({
    queryKey: ["finance", "scholarships"],
    queryFn: getScholarships,
  });
};

export const useCreateScholarshipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: createScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "scholarships"] });
      toast.success("Scholarship scheme cataloged");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to define scholarship scheme");
    },
  });
};

export const useAllocateScholarshipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: allocateScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "scholarships", "allocations"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "ledgers"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "invoices"] });
      toast.success("Scholarship successfully granted and balance adjusted");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to allocate scholarship");
    },
  });
};

export const useScholarshipAllocationsQuery = () => {
  return useQuery<any[], Error>({
    queryKey: ["finance", "scholarships", "allocations"],
    queryFn: getScholarshipAllocations,
  });
};

export const useExecutePaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: executePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "ledgers"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "invoices"] });
      toast.success("Payment transaction charged successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Payment transaction charge failed");
    },
  });
};

export const usePaymentHistoryQuery = (params?: { studentId?: string }) => {
  return useQuery<any[], Error>({
    queryKey: ["finance", "payments", params],
    queryFn: () => getPaymentHistory(params),
  });
};

export const useRefundPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: refundPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "ledgers"] });
      queryClient.invalidateQueries({ queryKey: ["finance", "invoices"] });
      toast.success("Payment transaction marked as refunded");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to process payment refund");
    },
  });
};
