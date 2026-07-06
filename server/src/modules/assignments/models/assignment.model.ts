import { model,Schema } from "mongoose";

import { AssignmentStatus } from "@/shared/enums/assignment-status.enum";

import { IAssignment } from "./assignment.interface";

/**
 * Reusable Attachment Schema
 */
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

/**
 * Assignment Schema
 */
const assignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    faculty: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    maxMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(AssignmentStatus),
      default: AssignmentStatus.DRAFT,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Indexes                                  */
/* -------------------------------------------------------------------------- */

// Basic indexes
assignmentSchema.index({ subject: 1 });
assignmentSchema.index({ faculty: 1 });
assignmentSchema.index({ section: 1 });
assignmentSchema.index({ semester: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ status: 1 });

// Faculty Dashboard
// Assignment.find({ faculty, status: "PUBLISHED" })
assignmentSchema.index({
  faculty: 1,
  status: 1,
});

// Student Dashboard
// Assignment.find({ section, semester })
assignmentSchema.index({
  section: 1,
  semester: 1,
});

// Upcoming Assignments
// Assignment.find({ dueDate: { $gte: today } })
// Covered by the dueDate index above.

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

export const Assignment = model<IAssignment>(
  "Assignment",
  assignmentSchema,
);