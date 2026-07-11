import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";

export const createFeeStructure = async (data: {
  name: string;
  category: "TUITION" | "EXAM" | "HOSTEL" | "OTHER";
  amount: number;
  dueDate: string;
  finePerDay: number;
  course: string;
  academicYear: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/finance/fee-structures", data);
  return response.data.data;
};

export const getFeeStructures = async (): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/finance/fee-structures");
  return response.data.data;
};

export const getLedgers = async (params?: { studentId?: string }): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/finance/ledger", { params });
  return response.data.data;
};

export const assignFees = async (data: { feeStructureId: string }): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/finance/assign-fees", data);
  return response.data.data;
};

export const getInvoices = async (params?: { studentId?: string }): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/finance/invoices", { params });
  return response.data.data;
};

export const createScholarship = async (data: {
  name: string;
  type: "MERIT" | "NEED" | "SPECIAL";
  description?: string;
  discountPercentage: number;
  criteria: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/finance/scholarships", data);
  return response.data.data;
};

export const getScholarships = async (): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/finance/scholarships");
  return response.data.data;
};

export const allocateScholarship = async (data: {
  studentId: string;
  scholarshipId: string;
  academicYear: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/finance/scholarships/allocate", data);
  return response.data.data;
};

export const getScholarshipAllocations = async (): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/finance/scholarships/allocations");
  return response.data.data;
};

export const executePayment = async (data: {
  studentId: string;
  ledgerId: string;
  amount: number;
  paymentMethod: "ONLINE" | "CASH" | "CHEQUE";
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/finance/payments/charge", data);
  return response.data.data;
};

export const getPaymentHistory = async (params?: { studentId?: string }): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/finance/payments/history", { params });
  return response.data.data;
};

export const refundPayment = async (id: string): Promise<any> => {
  const response = await api.post<ApiResponse<any>>(`/finance/payments/${id}/refund`);
  return response.data.data;
};
