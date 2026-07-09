import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetStudentsParams,
  GetStudentsResponse,
  Student,
  CreateStudentInput,
  UpdateStudentInput,
} from "../types/student.types";

export const getStudents = async (
  params?: GetStudentsParams
): Promise<GetStudentsResponse> => {
  const response = await api.get<ApiResponse<GetStudentsResponse>>("/students", {
    params,
  });
  return response.data.data;
};

export const getStudentById = async (id: string): Promise<Student> => {
  const response = await api.get<ApiResponse<Student>>(`/students/${id}`);
  return response.data.data;
};

export const createStudent = async (
  data: CreateStudentInput
): Promise<Student> => {
  const response = await api.post<ApiResponse<Student>>("/students", data);
  return response.data.data;
};

export const updateStudent = async (
  id: string,
  data: UpdateStudentInput
): Promise<Student> => {
  const response = await api.patch<ApiResponse<Student>>(
    `/students/${id}`,
    data
  );
  return response.data.data;
};

export const deleteStudent = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/students/${id}`);
};
