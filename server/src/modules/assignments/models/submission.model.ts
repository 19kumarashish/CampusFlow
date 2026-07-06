import { model,Schema } from "mongoose";

import { SubmissionStatus } from "@/shared/enums/submission-status.enum";

import { ISubmission } from "./submission.interface";

/* -------------------------------------------------------------------------- */
/*                            Attachment Schema                               */
/* -------------------------------------------------------------------------- */

const attachmentSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

/* -------------------------------------------------------------------------- */
/*                            Submission Schema                               */
/* -------------------------------------------------------------------------- */

const submissionSchema = new Schema<ISubmission>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },

    submissionDate: {
      type: Date,
      default: Date.now,
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    marks: {
      type: Number,
      min: 0,
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------------------------------------------------- */
/*                                  Indexes                                   */
/* -------------------------------------------------------------------------- */

// Basic Indexes
submissionSchema.index({ assignment: 1 });
submissionSchema.index({ enrollment: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ submissionDate: 1 });

// Prevent duplicate submissions
// One student can submit only once per assignment.
submissionSchema.index(
  {
    assignment: 1,
    enrollment: 1,
  },
  {
    unique: true,
  },
);

// Faculty grading dashboard
// Submission.find({ assignment, status })
submissionSchema.index({
  assignment: 1,
  status: 1,
});

// Student submission history
// Submission.find({ enrollment }).sort({ submissionDate: -1 })
submissionSchema.index({
  enrollment: 1,
  submissionDate: -1,
});

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

export const Submission = model<ISubmission>(
  "Submission",
  submissionSchema,
);