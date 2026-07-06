import { SubmissionStatus } from "@/shared/enums/submission-status.enum";

export interface GradeSubmissionDto {
  marks: number;

  feedback?: string;

  status: SubmissionStatus;
}