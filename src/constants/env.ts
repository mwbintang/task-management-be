import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || "0"),
  JWT_SECRET: process.env.JWT_SECRET || ""
};
