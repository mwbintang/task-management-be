import mongoose from "mongoose";
import { env } from "../constants/env";

export const connectMongo = async () => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};