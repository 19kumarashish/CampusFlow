import { Document, Types } from "mongoose";

import { SubmissionStatus } from "@/shared/enums/submission-status.enum";

export interface ISubmissionAttachment {
  url: string;

  fileName: string;

  mimeType: string;

  size: number;
}

export interface ISubmission
  extends Document {
  assignment: Types.ObjectId;

  enrollment: Types.ObjectId;

  submissionDate: Date;

  attachments: ISubmissionAttachment[];

  marks?: number;

  feedback?: string;

  status: SubmissionStatus;

  createdAt: Date;

  updatedAt: Date;
}