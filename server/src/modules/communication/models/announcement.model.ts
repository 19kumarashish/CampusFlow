import { Document, model, Schema, Types } from "mongoose";

// Interface
export interface IAnnouncement extends Document {
  title: string;
  message: string;
  createdBy: Types.ObjectId;
  targetRoles: string[];
  publishAt: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRoles: [
      {
        type: String,
        required: true,
      },
    ],

    publishAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
announcementSchema.index({ publishAt: -1 });
announcementSchema.index({ expiresAt: 1 });
announcementSchema.index({ targetRoles: 1 });

// Model
export const Announcement = model<IAnnouncement>(
  "Announcement",
  announcementSchema
);