import dotenv from "dotenv";
import path from "path";

// Load .env from the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Build the env object
export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  MONGO_URI: process.env.MONGO_URI || ""
};
