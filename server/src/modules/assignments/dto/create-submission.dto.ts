import { Types } from "mongoose";

export interface CreateSubmissionDto {
  assignment: Types.ObjectId;

  enrollment: Types.ObjectId;

  attachments: {
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
  }[];
}