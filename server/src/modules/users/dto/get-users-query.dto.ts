export interface GetUsersQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  role?: string;
  sort?: string;
}