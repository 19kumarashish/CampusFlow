import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  getBorrowRecords,
  borrowBook,
  returnBook,
  waiveFine,
} from "../api/library.api";

export const useBooksQuery = (params?: { search?: string; category?: string }) => {
  return useQuery<any[], Error>({
    queryKey: ["library", "books", params],
    queryFn: () => getBooks(params),
  });
};

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Book successfully logged in system catalog");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to catalog book");
    },
  });
};

export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string; data: any }>({
    mutationFn: ({ id, data }) => updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Book registry details updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update book registry details");
    },
  });
};

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Book entry deleted");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete book entry");
    },
  });
};

export const useBorrowRecordsQuery = (params?: { studentId?: string; status?: string }) => {
  return useQuery<any[], Error>({
    queryKey: ["library", "borrow-records", params],
    queryFn: () => getBorrowRecords(params),
  });
};

export const useBorrowBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: borrowBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "borrow-records"] });
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Book copy issued to student");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to issue book copy");
    },
  });
};

export const useReturnBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "borrow-records"] });
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Circulation return transaction recorded successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Return transaction record failed");
    },
  });
};

export const useWaiveFineMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: waiveFine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "borrow-records"] });
      toast.success("Library fine waived successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to waive library fine");
    },
  });
};
