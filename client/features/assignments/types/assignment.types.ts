import type { PaginationMeta } from "@/features/users/types/user.types";
import type { Subject } from "@/features/subjects/types/subject.types";
import type { Faculty } from "@/features/faculty/types/faculty.types";
import type { Section } from "@/features/sections/types/section.types";
import type { Semester } from "@/features/semesters/types/semester.types";
import type { Enrollment } from "@/features/enrollments/types/enrollment.types";

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type SubmissionStatus = "PENDING" | "SUBMITTED" | "LATE" | "GRADED";

export interface Attachment {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: Subject;
  faculty: Faculty;
  section: Section;
  semester: Semester;
  dueDate: string;
  maxMarks: number;
  attachments: Attachment[];
  status: AssignmentStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  _id: string;
  assignment: Assignment | string;
  enrollment: Enrollment;
  submissionDate: string;
  attachments: Attachment[];
  marks?: number;
  feedback?: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentInput {
  title: string;
  description: string;
  subject: string; // Subject ObjectId
  faculty: string; // Faculty ObjectId
  section: string; // Section ObjectId
  semester: string; // Semester ObjectId
  dueDate: string; // ISO String or YYYY-MM-DD
  maxMarks: number;
  attachments?: Attachment[];
  status?: AssignmentStatus;
}

export interface UpdateAssignmentInput {
  title?: string;
  description?: string;
  subject?: string;
  faculty?: string;
  section?: string;
  semester?: string;
  dueDate?: string;
  maxMarks?: number;
  attachments?: Attachment[];
  status?: AssignmentStatus;
}

export interface CreateSubmissionInput {
  assignment: string; // Assignment ObjectId
  enrollment: string; // Enrollment ObjectId
  attachments: Attachment[];
}

export interface GradeSubmissionInput {
  marks: number;
  feedback?: string;
  status: "GRADED";
}

export interface GetAssignmentsParams {
  page?: number;
  limit?: number;
  subject?: string;
  faculty?: string;
  section?: string;
  semester?: string;
  status?: AssignmentStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface GetAssignmentsResponse {
  assignments: Assignment[];
  pagination: PaginationMeta;
}

export interface GetSubmissionsParams {
  page?: number;
  limit?: number;
  assignment?: string;
  enrollment?: string;
  status?: SubmissionStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetSubmissionsResponse {
  submissions: Submission[];
  pagination: PaginationMeta;
}
