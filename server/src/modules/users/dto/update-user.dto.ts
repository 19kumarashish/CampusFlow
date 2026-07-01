export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}