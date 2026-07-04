import { AdmissionType } from "@/shared/enums/admission-type.enum";
import { Gender } from "@/shared/enums/gender.enum";
import { StudentStatus } from "@/shared/enums/student-status.enum";

export interface GetStudentsQueryDto {
  page?: number;

  limit?: number;

  search?: string;

  department?: string;

  course?: string;

  currentSemester?: number;

  admissionYear?: number;

  admissionType?: AdmissionType;

  gender?: Gender;

  status?: StudentStatus;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}