import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";

export const createBook = async (data: {
  title: string;
  author: string;
  publisher?: string;
  isbn: string;
  category: string;
  totalCopies: number;
  rackLocation?: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/library/books", data);
  return response.data.data;
};

export const getBooks = async (params?: { search?: string; category?: string }): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/library/books", { params });
  return response.data.data;
};

export const updateBook = async (id: string, data: Partial<{
  title: string;
  author: string;
  publisher?: string;
  isbn: string;
  category: string;
  totalCopies: number;
  rackLocation?: string;
  status: string;
}>): Promise<any> => {
  const response = await api.patch<ApiResponse<any>>(`/library/books/${id}`, data);
  return response.data.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/library/books/${id}`);
};

export const getBorrowRecords = async (params?: { studentId?: string; status?: string }): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/library/borrow-records", { params });
  return response.data.data;
};

export const borrowBook = async (data: {
  studentId: string;
  bookId: string;
  dueDate: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/library/borrow", data);
  return response.data.data;
};

export const returnBook = async (data: {
  borrowRecordId: string;
  conditionOnReturn?: string;
  markAsLost?: boolean;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/library/return", data);
  return response.data.data;
};

export const waiveFine = async (id: string): Promise<any> => {
  const response = await api.patch<ApiResponse<any>>(`/library/borrow-records/${id}/waive`);
  return response.data.data;
};
