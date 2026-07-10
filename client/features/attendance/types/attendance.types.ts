import type { Enrollment } from "@/features/enrollments/types/enrollment.types";
import type { Subject } from "@/features/subjects/types/subject.types";
import type { Faculty } from "@/features/faculty/types/faculty.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface Attendance {
  _id: string;
  enrollment: Enrollment; // Populated Enrollment details
  subject: Subject; // Populated Subject details
  faculty: Faculty; // Populated Faculty details
  date: string;
  lectureNumber: number;
  status: AttendanceStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceInput {
  enrollment: string; // Enrollment ObjectId
  subject: string; // Subject ObjectId
  faculty: string; // Faculty ObjectId
  date: string | Date; // ISO string date
  lectureNumber: number;
  status: AttendanceStatus;
  remarks?: string;
}

export interface UpdateAttendanceInput {
  enrollment?: string;
  subject?: string;
  faculty?: string;
  date?: string | Date;
  lectureNumber?: number;
  status?: AttendanceStatus;
  remarks?: string;
}

export interface GetAttendanceParams {
  page?: number;
  limit?: number;
  sortBy?: "date" | "lectureNumber" | "createdAt";
  sortOrder?: "asc" | "desc";
  enrollment?: string; // Enrollment ObjectId filter
  subject?: string; // Subject ObjectId filter
  faculty?: string; // Faculty ObjectId filter
  date?: string; // Date string filter (YYYY-MM-DD)
  status?: AttendanceStatus;
}

export interface GetAttendanceResponse {
  attendance: Attendance[];
  pagination: PaginationMeta;
}

export interface AttendanceSummary {
  totalLectures: number;
  presentLectures: number;
  percentage: number;
}
