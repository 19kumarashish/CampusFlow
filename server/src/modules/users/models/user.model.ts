import { model, Schema } from "mongoose";

import { UserStatus } from "@/shared/enums/user-status.enum";

import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    // =====================
    // Personal Information
    // =====================

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    // =====================
    // Authentication
    // =====================

    password: {
      type: String,
      required: true,
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },

    // =====================
    // Authorization
    // =====================

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
    },

    // =====================
    // Soft Delete
    // =====================

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);