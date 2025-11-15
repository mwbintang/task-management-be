import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import type { Application } from "express";
import routes from "./index.routes.js";
import { env } from "./constants/env"
import { connectMongo } from "./config/mongo.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to database
connectMongo();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Needed for ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", routes);
app.use(errorHandler);
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
