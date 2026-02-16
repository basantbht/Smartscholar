import mongoose from "mongoose";
import reminderService from "../services/reminderService.js"

export const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI missing in env");

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  reminderService.startScheduler();
};