import mongoose from "mongoose";

import { env } from "./env";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed", error);

    process.exit(1);
  }
};