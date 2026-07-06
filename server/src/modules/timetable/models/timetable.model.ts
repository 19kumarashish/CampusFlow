import { model,Schema } from "mongoose";

import { Day } from "@/shared/enums/day.enum";
import { Status } from "@/shared/enums/status.enum";

import { ITimetable } from "./timetable.interface";

const timetableSchema = new Schema<ITimetable>(
  {
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
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

    classroom: {
      type: String,
      required: true,
      trim: true,
    },

    day: {
      type: String,
      enum: Object.values(Day),
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/*                                 Validators                                 */
/* -------------------------------------------------------------------------- */

timetableSchema.path("endTime").validate(function (
  this: ITimetable,
  value: string
) {
  return value > this.startTime;
}, "End time must be after start time");

/* -------------------------------------------------------------------------- */
/*                                   Indexes                                  */
/* -------------------------------------------------------------------------- */

// Single Field Indexes
timetableSchema.index({ section: 1 });
timetableSchema.index({ faculty: 1 });
timetableSchema.index({ subject: 1 });
timetableSchema.index({ day: 1 });
timetableSchema.index({ status: 1 });

// Faculty schedule lookup
timetableSchema.index({
  faculty: 1,
  day: 1,
});

// Section timetable lookup
timetableSchema.index({
  section: 1,
  day: 1,
});

// Classroom utilization
timetableSchema.index({
  classroom: 1,
  day: 1,
});

// Subject schedule lookup
timetableSchema.index({
  subject: 1,
  day: 1,
});

// Prevent duplicate timetable entries
timetableSchema.index(
  {
    section: 1,
    subject: 1,
    day: 1,
    startTime: 1,
  },
  {
    unique: true,
  }
);

export const Timetable = model<ITimetable>(
  "Timetable",
  timetableSchema
);