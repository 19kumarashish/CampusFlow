import { Types } from "mongoose";

import { AssignmentStatus } from "@/shared/enums/assignment-status.enum";

export interface UpdateAssignmentDto {
  title?: string;

  description?: string;

  subject?: Types.ObjectId;

  faculty?: Types.ObjectId;

  section?: Types.ObjectId;

  semester?: Types.ObjectId;

  dueDate?: Date;

  maxMarks?: number;

  attachments?: {
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
  }[];

  status?: AssignmentStatus;
}