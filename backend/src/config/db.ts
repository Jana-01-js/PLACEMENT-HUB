import mongoose from "mongoose";
import { isMockMode } from "@utils/mockStore";

export const connectDB = async (): Promise<void> => {
  if (isMockMode()) {
    console.log("[DB] No MONGO_URI detected; using local mock data mode");
    return;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("[DB] Connection failed:", (error as Error).message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[DB] MongoDB disconnected");
  });
};
