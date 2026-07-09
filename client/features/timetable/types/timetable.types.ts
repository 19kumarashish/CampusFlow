import type { Section } from "@/features/sections/types/section.types";
import type { Subject } from "@/features/subjects/types/subject.types";
import type { Faculty } from "@/features/faculty/types/faculty.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export type Day =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface Timetable {
  _id: string;
  section: Section; // Populated Section details
  subject: Subject; // Populated Subject details
  faculty: Faculty; // Populated Faculty details (with user nested)
  classroom: string;
  day: Day;
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
  status: "ACTIVE" | "INACTIVE";
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimetableInput {
  section: string; // Section ObjectId
  subject: string; // Subject ObjectId
  faculty: string; // Faculty ObjectId
  classroom: string;
  day: Day;
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
}

export interface UpdateTimetableInput {
  section?: string;
  subject?: string;
  faculty?: string;
  classroom?: string;
  day?: Day;
  startTime?: string;
  endTime?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetTimetableParams {
  page?: number;
  limit?: number;
  sortBy?: "day" | "startTime" | "createdAt";
  sortOrder?: "asc" | "desc";
  section?: string; // Section ObjectId filter
  faculty?: string; // Faculty ObjectId filter
  subject?: string; // Subject ObjectId filter
  classroom?: string;
  day?: Day;
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetTimetableResponse {
  timetable: Timetable[];
  pagination: PaginationMeta;
}
