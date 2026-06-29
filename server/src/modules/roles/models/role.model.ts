import { model, Schema } from "mongoose";

import { IRole } from "./role.interface";

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    permissions: [
      {
        type: String,
      },
    ],

    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Role = model<IRole>("Role", roleSchema);