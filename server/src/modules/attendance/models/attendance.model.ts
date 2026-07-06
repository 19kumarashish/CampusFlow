import { model,Schema } from "mongoose";

import { AttendanceStatus } from "@/shared/enums/attendance-status.enum";

import { IAttendance } from "./attendance.interface";

const attendanceSchema = new Schema<IAttendance>(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
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

    date: {
      type: Date,
      required: true,
    },

    lectureNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PRESENT,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/*                                   Indexes                                  */
/* -------------------------------------------------------------------------- */

// Single Field Indexes
attendanceSchema.index({ enrollment: 1 });
attendanceSchema.index({ subject: 1 });
attendanceSchema.index({ faculty: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

// Faculty daily attendance
attendanceSchema.index({
  faculty: 1,
  date: 1,
});

// Student attendance by subject
attendanceSchema.index({
  enrollment: 1,
  subject: 1,
});

// Monthly subject attendance
attendanceSchema.index({
  subject: 1,
  date: 1,
});

// Prevent duplicate attendance for the same lecture
attendanceSchema.index(
  {
    enrollment: 1,
    subject: 1,
    lectureNumber: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

export const Attendance = model<IAttendance>(
  "Attendance",
  attendanceSchema
);